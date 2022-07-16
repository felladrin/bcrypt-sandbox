import React, { useCallback, useEffect, useState } from "react";
import { Input, Button, Message, Icon } from "semantic-ui-react";
import { bcrypt } from "hash-wasm";

export function EncryptionForm(): JSX.Element {
  const [encryptedText, setEncryptedText] = useState("");
  const [textToEncrypt, setTextToEncrypt] = useState("");
  const [shouldDisplayEncryptionResult, setDisplayEncryptionResult] = useState(false);
  const [hasCopyButtonBeenClicked, setHasCopyButtonBeenClicked] = useState(false);
  const [isEncryptButtonDisabled, setEncryptButtonDisabled] = useState(true);
  const [encryptedTextInputElement, setEncryptedTextInputElement] = useState<Input | null>(null);

  const encryptionResultMessageDismissed = useCallback(() => setDisplayEncryptionResult(false), []);

  const handleEncryptButtonClicked = useCallback(() => {
    bcrypt({
      password: textToEncrypt,
      costFactor: 10,
      salt: window.crypto.getRandomValues(new Uint8Array(16)),
      outputType: "encoded",
    }).then(setEncryptedText);
  }, [textToEncrypt]);

  const handleCopyButtonClicked = useCallback(() => {
    if (encryptedTextInputElement === null) return;

    const inputElement = (encryptedTextInputElement as unknown as { inputRef: { current: HTMLInputElement } }).inputRef
      .current;

    inputElement.select();
    inputElement.setSelectionRange?.(0, inputElement.value.length);
    document.execCommand("copy");

    setHasCopyButtonBeenClicked(true);
  }, [encryptedTextInputElement]);

  useEffect(() => {
    setHasCopyButtonBeenClicked(false);
    setDisplayEncryptionResult(encryptedText.length > 0);
  }, [encryptedText]);

  useEffect(() => {
    setDisplayEncryptionResult(false);
    setEncryptButtonDisabled(textToEncrypt.length === 0);
  }, [textToEncrypt]);

  return (
    <>
      <h2 className="ui center aligned header">
        <Icon fitted name="random" /> Encryption
      </h2>
      <Input
        type="text"
        placeholder="Enter some text to encrypt"
        onChange={(_, data) => setTextToEncrypt(data.value)}
        data-test-id="text-to-encrypt"
        fluid
        action
      >
        <input />
        <Button
          color="blue"
          onClick={handleEncryptButtonClicked}
          disabled={isEncryptButtonDisabled}
          data-test-id="button-to-encrypt"
        >
          Encrypt
        </Button>
      </Input>
      {shouldDisplayEncryptionResult && (
        <Message onDismiss={encryptionResultMessageDismissed} info>
          <Message.Header>Result:</Message.Header>
          <Input
            action={
              <Button color="teal" icon labelPosition="right" onClick={() => handleCopyButtonClicked()}>
                {hasCopyButtonBeenClicked ? "Copied!" : "Copy"} <Icon fitted name="copy" />
              </Button>
            }
            value={encryptedText}
            ref={setEncryptedTextInputElement}
            data-test-id="encrypted-text"
            fluid
          />
        </Message>
      )}
    </>
  );
}
