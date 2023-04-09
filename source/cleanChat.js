// remove code snippets from a .md CHAT file, 

const fs = require('fs')
const path = require('path')

if (process.argv.length !== 3) {
  console.log('Usage: node index.js <filename>')
  process.exit(1)
}

const filename = path.resolve(__dirname, process.argv[2])

fs.readFile(filename, 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const dirName = path.basename(filename, path.extname(filename));
  const dirPath = path.join(path.dirname(filename), dirName);
  const lastSnippetIndex = getLastSnippetIndex(dirPath);

  let matchIndex = lastSnippetIndex + 1;
  let result = data.replace(/```javascript((\n|.)*?)```/g, (match, code) => {
    const snippetFilename = getSnippetFilename(code, matchIndex, dirName);
    if (!snippetFilename) {
      let r = "```javascript\n" + code + "```\n"
      console.log(r)
      return r
    }
    matchIndex++;
    fs.writeFileSync(snippetFilename, code.trim());
    let name = snippetFilename.split('/').pop().split('.').shift()
    return `[${name}](${snippetFilename})`
  });

  fs.writeFileSync(filename, result);
});

function getSnippetFilename(code, index, dirName) {
  const classNameMatch = code.match(/^(class|function)\s+(\w+)/m);
  const className = classNameMatch ? classNameMatch[2] : '';
  if (!className) return // small code snippet, should not be moved.

  const paddedIndex = index.toString().padStart(3, '0');
  const snippetDirPath = path.join(path.dirname(filename), dirName);
  if (!fs.existsSync(snippetDirPath)) fs.mkdirSync(snippetDirPath);
  let name = className + paddedIndex
  return `${snippetDirPath}/${name}.js`;
}

function getLastSnippetIndex(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return -1;
  }
  const snippetFiles = fs.readdirSync(dirPath)
    .filter(file => file.endsWith('.js') && file.match(/(\d+)\.js/))
    .sort((a, b) => {
      const indexA = parseInt(a.match(/(\d+)\.js/)[1]);
      const indexB = parseInt(b.match(/(\d+)\.js/)[1]);
      return indexA - indexB;
    });
  if (snippetFiles.length === 0) {
    return -1;
  }
  const lastSnippetFile = snippetFiles[snippetFiles.length - 1];
  return parseInt(lastSnippetFile.match(/(\d+)\.js/)[1]);
}