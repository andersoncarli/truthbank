class Corpus {
  constructor(dirPath) {
    this.dirPath = dirPath;
    this.vocabularies = {};
  }

  async processFile(fileName) {
    const filePath = path.join(this.dirPath, fileName);
    const content = await fs.promises.readFile(filePath, 'utf-8');
    const vocabulary = new Vocabulary(content);
    vocabulary.buildVocabulary();
    vocabulary.save(fileName);
    this.vocabularies[fileName] = vocabulary;
  }

  async processDirectory() {
    const fileNames = await fs.promises.readdir(this.dirPath);
    const processingPromises = fileNames.map(fileName => this.processFile(fileName));
    await Promise.all(processingPromises);
  }
}