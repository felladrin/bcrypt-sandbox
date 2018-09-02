const { Application } = require('spectron');
const assert = require('assert');
const path = require('path');

const electronPath = path.join(__dirname, '../node_modules/.bin/electron');
const appPath = path.join(__dirname, '../src/index.js');

const app = new Application({
  path: electronPath,
  env: { SPECTRON: true },
  args: [appPath],
});

const { info, error } = console;

// Generates a 8-characters random string to be encrypted.
const randomText = Math.random().toString(36).substr(2, 8);
let hash = '';

app.start()
  .then(() => app.client.waitForExist('body'))
  .then(() => app.client.setValue('#text-to-encrypt', randomText))
  .then(() => app.client.click('#encrypt-button'))
  .then(() => app.client.waitForExist('#encryption-result .content p'))
  .then(() => app.client.getText('#encryption-result .content p'))
  .then((encryptionResult) => { hash = encryptionResult; })
  .then(() => app.client.setValue('#hash-to-decrypt', hash))
  .then(() => app.client.setValue('#text-to-decrypt', randomText))
  .then(() => app.client.click('#decrypt-button'))
  .then(() => app.client.waitForExist('#decryption-result .content p'))
  .then(() => app.client.getText('#decryption-result .content p'))
  .then((decryptionResult) => { assert.equal(decryptionResult, 'Hash and text match!'); })
  .then(() => {
    info('Test succeeded!');
    if (app && app.isRunning()) app.stop();
  })
  .catch((err) => {
    error(`Test failed: ${err.message}`);
    if (app && app.isRunning()) app.stop();
  });
