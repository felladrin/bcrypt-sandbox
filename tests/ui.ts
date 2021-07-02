import { Selector } from "testcafe";

fixture("UI").page("http://localhost:3000/");

const textToEncryptElement = Selector('[data-test-id="text-to-encrypt"]');
const buttonToEncryptElement = Selector('[data-test-id="button-to-encrypt"]');
const encryptedTextElement = Selector('[data-test-id="encrypted-text"]');
const hashToDecryptElement = Selector('[data-test-id="hash-to-decrypt"]');
const textToDecryptElement = Selector('[data-test-id="text-to-decrypt"]');
const buttonToDecryptElement = Selector('[data-test-id="button-to-decrypt"]');
const decryptionResultElement = Selector('[data-test-id="decryption-result"]');

test("encryption and decryption of a random text", async (t) => {
  const randomText = Math.random().toString(36).substr(2);
  await t.typeText(textToEncryptElement, randomText);
  await t.expect(textToEncryptElement.find("input").value).eql(randomText);
  await t.click(buttonToEncryptElement);
  const encryptedText = (await encryptedTextElement.find("input").value) ?? "";
  await t.expect(encryptedText.length).gt(0);
  await t.typeText(hashToDecryptElement, encryptedText);
  await t.typeText(textToDecryptElement, randomText);
  await t.click(buttonToDecryptElement);
  await t.expect(decryptionResultElement.classNames).contains("success");
  if (t.browser.alias && t.browser.alias !== "remote") {
    await t.takeElementScreenshot("body");
  }
});
