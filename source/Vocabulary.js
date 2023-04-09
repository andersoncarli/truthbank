const fs = require('fs')
const path = require('path')
const { BayesClassifier } = require('./BayesClassifier')

class Vocabulary {

  constructor(fileName) {
    this.words = []
    this.map = new Map()
    this.load(fileName)
    this.classifier = new BayesClassifier(this)
  }

  train(doc, label) {
    const tokens = this.split(doc);
    tokens.forEach((token) => {
      this.addWord(token, { flush: true });
    });
  
    this.classifier.train(tokens, label);
  }

  load(fileName) {
    if (fileName) this.fileName = fileName
    if (!fs.fileExistsSync(fileName)) return 0
    const content = fs.readFileSync(fileName, 'utf-8')
    content.split('\n').forEach((word) => {
      if (word) this.addWord(word)
    })
  }

  save(fileName) {
    if (fileName) this.fileName = fileName
    const data = this.words.map((o) => o.word).join('\n')
    fs.writeFileSync(this.fileName, data, 'utf-8')
  }

  addWord(word, { flush }) {
    let o = this.map.get(word)

    if (!o) o = this.words.push({ word, index: this.words.length, freq: 0 })

    o.freq++
    o.idf = this.idf(word, this.words.length)
    o.tfidf = this.tfidf(word)

    this.map.set(word, o)

    if (flush) fs.appendFileSync(this.fileName, word + '\n', 'utf-8')
  }

  addSynonym(word, synonym) {
    let w = this.words.get(word)
    if (!w) this.addWord(word)
    w.synonyms.push(synonym)
  }

  addLabel(word, label) {
    let w = this.words.get(word)
    if (!w) this.addWord(word)
    w.lables.push(label)
  }

  learnDocument(document) {
    const words = this.split(document)
    for (const word of words) {
      this.addWord(word)
    }
  }

  tf(term, doc) {
    if (!doc) return this.map.get(term).freq
    const docVocab = new Vocabulary({ doc })
    let res = {}
    return res
  }

  p(word, doc) {
    let r = !doc ? this.tf(word) / this.words.length : {

      // pTerm (probability of term) represents the frequency of a specific term in a document, or the frequency of a term in a collection of documents, depending on how you calculate it.
      // it is the number of occurrences of the word divided by the total number of words in the document.
      pTerm: this.classifier.pTerm(word),

      // pTermDoc (probability of term given document) represents the frequency of a term in a specific document, normalized by the total number of terms in the document. It gives an idea of how important a term is for a specific document.
      // pTermDoc represents the document frequency of a word, which is the number of documents in which the word appears divided by the total number of documents.
      pTermDoc = this.classifier.pTermDoc(word, doc),
      
      // pTermGivenDoc represents the conditional probability of a word given a document, 
      // pTermGivenDoc (probability of term given document) is the product of pTerm and pTermDoc. It gives the overall weight of a term in a document, considering both its frequency in the document and its frequency in the collection of documents.
      pTermGivenDoc = this.classifier.pTermGivenDoc(word, doc)
    }
    // In the tf-idf weighting scheme, pTermGivenDoc is used to measure the importance of a term in a document, 
    // with terms that occur frequently in a document, but not frequently in the collection of documents, receiving a higher weight. 
    // This helps to distinguish relevant information from common words that appear in many documents.    
    return r
  }

  idf(term, docCount) {
    if (!docCount) docCount = this.words.length
    const o = this.map.get(term)
    let res = o ? Math.log(docCount / o.freq) : 0
    return res
  }

  tfidf(term, doc) {
    const vocab = doc ? new Vocabulary({ doc }) : this
    let res = 0
    const w = this.map.get(term)
    if (w && vocab.map.has(term)) {
      res = w.tf * w.idf
      w.tfidf = res
    }
    return res
  }

  embedding_layer(docs, labels) {
    // i think it is bugged, 
    docs.forEach((doc) => this.tf(doc));
    this.idf(docs.length);
    this.tfidf(docs);
    docs.forEach((doc, i) => {
      classifier.learn(doc, labels[i]);
    });
    return this.classifier.categorize.bind(classifier);
  }

  split(token) {
    let start = 0
    let end = token.length
    let subwords = []
    while (start < end) {
      let substring = token.slice(start, end)
      if (this.map.has(substring)) {
        subwords.push(substring)
        start = end
        end = token.length
      } else {
        end--
      }
    }
    return subwords
  }

  bpeSplit(token) {
    let result = []
    let currentWord = ""
    let count = 0

    while (count < token.length) {
      let subWord = token.substring(0, count + 1)
      if (this.map.has(subWord)) {
        currentWord = subWord
        count++
      } else {
        result.push(currentWord)
        token = token.substring(currentWord.length)
        count = 0
        currentWord = ""
      }
    }

    if (currentWord.length > 0)
      result.push(currentWord)

    return result
  }

  word(index) { return this.words[index].word }

  index(word) { return this.words[index] }

  run(word) { return (typeof word == string) ? this.map.get(word) : this.words[word] }

  get length() { return this.words.length }
}

function test() {
  const vocab = new Vocabulary("vocabulary.txt")
  vocab.addWord("word1")
  vocab.addWord("word2")
  vocab.save("vocabulary.txt")
  vocab.load("vocabulary.txt")
  check(vocab.tf(["word1", "word2", "word3"]), [1, 0, 1])
  check(vocab.idf(10), 0)
  check(vocab.tfidf(["word1", "word2", "word3"]), [0, 0, 1])
  check(vocab.split("word1word2"), ["word1", "word2"])
  check(vocab.bpeSplit("word1word3"), ["word1", "word3"])
  check(vocab.word(1), "word2")
  check(vocab.index("word1"), 0)
  check(vocab("word3"), '{word:"word3",index:2,freq:0,idf:0,tfidf:0}')
  check(vocab.length, 3)
  fs.unlink("vocabulary.txt")

  vocab = new Vocabulary()
  let doc = 'this is a test document'
  check(vocab.tf(doc, 'test'), 0.125, 'calculates term frequency correctly')
  check(vocab.tf('', 'test'), 0, 'handles empty document correctly')
  check(vocab.tf(doc, 'missing', 0, 'handles missing term correctly')  

} test()

module.exports = Vocabulary