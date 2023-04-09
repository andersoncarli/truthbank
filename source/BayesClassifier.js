const Vocabulary = require("./Vocabulary")

class BayesClassifier {
  constructor(op) {
    this.vocab = op.vocab || new Vocabulary()
    this.categories = op.categories || []
    this.catCount = new Map(categories.map(c => [c, 0]))
    this.catDocs = new Map(categories.map(c => [c, []]))
    this.docCount = 0
  }

  saveModel(fileName) {
    const data = JSON.stringify({
      vocab: this.vocab.fileName,
      catCount: this.catCount,
      docCount: this.docCount,
      tfidfVectors: this.tfidfVectors,
      catDocIndexes: this.catDocIndexes,
    })
    fs.writeFileSync(fileName, data)
  }

  loadModel(fileName) {
    // { vocab, catCount, docCount, tfidfVectors, catDocIndexes}
    Object.assign(this, JSON.parse(fs.readFileSync(fileName)))
  }

  train(text, category) {
    this.catCount.set(category, this.catCount.get(category) + 1)
    this.catDocs.get(category).push(text)
    this.docCount++
  }

  prob(text, category) {
    let prob = 1
    const words = this.vocab.split(text)
    for (const word of words) {
      prob *= this.vocab.tfidf(this.catDocs.get(category), word)
    }
    return prob
  }

  classify(text) {
    let bestProb = 0
    let bestCat = null
    for (const category of this.categories) {
      const prob = this.prob(text, category)
      if (prob > bestProb) {
        bestProb = prob
        bestCat = category
      }
    }
    return bestCat
  }

  fit(data) {
    let vocab = {};
    this.idx = 0;
    for (var i = 0; i < data.length; i++) {
      var words = data[i].split(" ");
      for (var j = 0; j < words.length; j++) {
        if (!vocab[words[j]]) {
          vocab[words[j]] = this.idx;
          this.idx++;
        }
      }
    }
  };
  
  // Predict method using matrix calculations
  predict(data) {
    var count = math.zeros(this.labels.length, this.vocab.idx);
    for (var i = 0; i < data.length; i++) {
      var words = data[i].split(" ");
      for (var j = 0; j < words.length; j++) {
        var idx = this.vocab.index(words[j]);
        if (idx) {
          count.set([this.labels[i], idx], count.get([this.labels[i], idx]) + 1);
        }
      }
    }
    var prob = math.divide(count, math.sum(count, 1));
    var prediction = math.argMax(prob, 0);
    return this.labels[prediction];
  };


  predictPrompt(prompt, word = null) {
    let promptWords = this.vocab.tokenize(prompt);
    let promptVocab = new Vocabulary(promptWords);
    let pGivenDoc = this.pWordGivenDoc(promptWords);

    if (word)
      return pGivenDoc.get(word) || 0;
    else {
      let probabilities = [];
      for (let [w, p] of pGivenDoc) {
        probabilities.push({ word: w, probability: p });
      }
      probabilities.sort((a, b) => b.probability - a.probability);
      return probabilities.slice(0, 3).map(p => p.word);
    }
  }

  pWordGivenDoc(word, doc) {
    // Use the formula for calculating the probability of a word given a document
    // P(word | doc) = P(doc | word) * P(word) / P(doc)
    // where P(doc) is a constant and can be ignored

    const wordInfo = this.vocab.map.get(word)
    if (!wordInfo) return 0

    const pDocGivenWord = this.pDocGivenWord(word, doc)
    const pWord = wordInfo.probability
    return pDocGivenWord * pWord
  }

  pDocGivenWord(word, doc) {
    // Use the formula for calculating the probability of a document given a word
    // P(doc | word) = count of word in doc / total number of words in doc
    const wordCount = doc.filter((w) => w === word).length
    const docLength = doc.length
    return wordCount / docLength
  }

  addDocument(document, label) {
    this.documents.push({ document, label })
    this.labels.add(label)

    // Update word counts for all words in the document
    const words = this.split(document)
    words.forEach((word) => {
      this.wordCounts.set(word, (this.wordCounts.get(word) || 0) + 1)

      // Update word counts for each label
      if (!this.labelWordCounts.has(label)) {
        this.labelWordCounts.set(label, new Map())
      }
      const labelWordCounts = this.labelWordCounts.get(label)
      labelWordCounts.set(word, (labelWordCounts.get(word) || 0) + 1)
    })
  }

  getWordProbabilityGivenLabel(word, label) {
    const labelWordCounts = this.labelWordCounts.get(label) || new Map()
    const labelWordCount = labelWordCounts.get(word) || 0
    const totalWordsForLabel = Array.from(labelWordCounts.values()).reduce((sum, count) => sum + count, 0)

    return labelWordCount / totalWordsForLabel
  }

  getLabelProbability(label) {
    const totalDocuments = this.documents.length
    const documentsWithLabel = this.documents.filter((doc) => doc.label === label).length

    return documentsWithLabel / totalDocuments
  }
}

function test() {
  const vocab = new Vocabulary()
  const categories = ['positive', 'negative']
  const classifier = new BayesClassifier(vocab, categories)

  const positiveTexts = ['I love this product', 'This is the best thing I have ever used', 'I highly recommend this',]
  const negativeTexts = ['I hate this product', 'This is the worst thing I have ever used', 'I would not recommend this',]

  // Train the classifier with positive and negative texts
  positiveTexts.forEach(text => classifier.train(text, 'positive'))
  negativeTexts.forEach(text => classifier.train(text, 'negative'))

  // Test if the classification of texts is correct
  positiveTexts.forEach(text =>
    check(classifier.classify(text), 'positive'))

  negativeTexts.forEach(text =>
    check(classifier.classify(text), 'negative'))

  // Test if the classifier works well with a new text
  check(classifier.classify('This product is okay'), 'positive')

} // test()

module.exports = { BayesClassifier, test }