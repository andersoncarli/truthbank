async function main() {
  const readline = require('readline');
  const { promisify } = require('util');

  rl = readline.createInterface({ terminal: true, input: process.stdin, output: process.stdout });

  // Promisify the qu51estion method
  const question = promisify(rl.question).bind(rl);

  const waitForKeypress = async () => {
    return new Promise(resolve => process.stdin.once('keypress', (str, key) =>
      resolve({ str, key })));
  }

  const age = await question('What is your age? ')
  console.log(`You are ${age} years old.`);
  rl.close()

  rl = readline.createInterface({ terminal: false, input: process.stdin, output: process.stdout });

  console.log('Press any key to continue...');
  process.stdin.setRawMode(true);
  let key = await waitForKeypress()
  // console.log(key)

  rl.close();

}; main()