const natural = require('natural');
const fs = require('fs');
const path = require('path');

// Load the 20 Newsgroups dataset
const newsgroups = new natural.Corpus();
const categories = fs.readdirSync('./20news');
categories.forEach((category) => {
  const files = fs.readdirSync(`./20news/${category}`);
  files.forEach((file) => {
    const text = fs.readFileSync(path.join('./20news', category, file), 'utf-8');
    newsgroups.addDocument(text, category);
  });
});

// Load the Spectrum of Consciousness vocabulary
const soc = JSON.parse(fs.readFileSync('./SOC.json', 'utf-8'));
const vocabulary = [];
soc.forEach((hexagram) => {
  vocabulary.push(...hexagram.labels.split(' '));
});

// Train the Bayesian classifier
const classifier = new natural.BayesClassifier();
newsgroups.process((doc) => {
  const tokens = new natural.WordTokenizer().tokenize(doc);
  const counts = {};
  tokens.forEach((token) => {
    const stemmed = natural.PorterStemmer.stem(token);
    if (vocabulary.includes(stemmed)) {
      counts[stemmed] = (counts[stemmed] || 0) + 1;
    }
  });
  classifier.addDocument(counts, doc.category);
});
classifier.train();

// Test the classifier on some sample text
const sampleText = 'A bird in flight is a beautiful sight to see.';
const sampleCounts = {};
const sampleTokens = new natural.WordTokenizer().tokenize(sampleText);
sampleTokens.forEach((token) => {
  const stemmed = natural.PorterStemmer.stem(token);
  if (vocabulary.includes(stemmed)) {
    sampleCounts[stemmed] = (sampleCounts[stemmed] || 0) + 1;
  }
});
const guess = classifier.classify(sampleCounts);
console.log(`The text "${sampleText}" is classified as "${guess}"`);