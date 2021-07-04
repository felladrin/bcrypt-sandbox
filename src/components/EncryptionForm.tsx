import React from "react";
import { Input, Button, Message, Icon } from "semantic-ui-react";
import { useStore } from "effector-react";
import { createEffect, createEvent, restore, createStore, sample, forward, guard } from "effector";
import { bcrypt } from "hash-wasm";

function getRandomUint8Array(length: number) {
  const salt = new Uint8Array(length);
  window.crypto.getRandomValues(salt);
  return salt;
}

const selectAndCopyValueFromInputElement = createEffect((inputElement: HTMLInputElement) => {
  inputElement.select();
  inputElement.setSelectionRange?.(0, inputElement.value.length);
  document.execCommand("copy");
});

const encrypt = createEffect((password: string) =>
  bcrypt({
    password,
    costFactor: 10,
    salt: getRandomUint8Array(16),
    outputType: "encoded",
  })
);

const encryptButtonClicked = createEvent();

const encryptionResultMessageDismissed = createEvent();

const copyButtonClicked = createEvent();

const textToEncryptUpdated = createEvent<string>();

const copyInputReferenceUpdated = createEvent<Input | null>();

const textToEncryptStore = restore(textToEncryptUpdated, "");

const encryptedTextStore = restore(encrypt.doneData, "");

const displayEncryptionResultStore = restore(
  encryptedTextStore.map((encryptedText) => encryptedText.length > 0).updates,
  false
).reset([encryptionResultMessageDismissed, textToEncryptStore.updates]);

const copyButtonClickedStore = createStore(false)
  .on(copyButtonClicked, () => true)
  .reset(encryptedTextStore.updates);

const encryptButtonDisabledStore = textToEncryptStore.map((textToEncrypt) => textToEncrypt.length === 0);

const copyInputStore = restore(copyInputReferenceUpdated, null);

sample({
  clock: encryptButtonClicked,
  source: textToEncryptStore,
  target: encrypt,
});

forward({
  from: guard({
    clock: copyButtonClicked,
    source: copyInputStore,
    filter: (copyInput): copyInput is Input => copyInput !== null,
  }).map((copyInput) => (copyInput as unknown as { inputRef: { current: HTMLInputElement } }).inputRef.current),
  to: selectAndCopyValueFromInputElement,
});

export function EncryptionForm(): JSX.Element {
  const encryptedText = useStore(encryptedTextStore);
  const displayEncryptionResult = useStore(displayEncryptionResultStore);
  const hasCopyButtonBeenClicked = useStore(copyButtonClickedStore);
  const encryptButtonDisabled = useStore(encryptButtonDisabledStore);

  return (
    <>
      <h2 className="ui center aligned header">
        <Icon fitted name="random" /> Encryption
      </h2>
      <Input
        type="text"
        placeholder="Enter some text to encrypt"
        onChange={(_, data) => textToEncryptUpdated(data.value)}
        data-test-id="text-to-encrypt"
        fluid
        action
      >
        <input />
        <Button
          color="blue"
          onClick={() => encryptButtonClicked()}
          disabled={encryptButtonDisabled}
          data-test-id="button-to-encrypt"
        >
          Encrypt
        </Button>
      </Input>
      {displayEncryptionResult && (
        <Message onDismiss={() => encryptionResultMessageDismissed()} info>
          <Message.Header>Result:</Message.Header>
          <Input
            action={
              <Button color="teal" icon labelPosition="right" onClick={() => copyButtonClicked()}>
                {hasCopyButtonBeenClicked ? "Copied!" : "Copy"} <Icon fitted name="copy" />
              </Button>
            }
            value={encryptedText}
            ref={copyInputReferenceUpdated}
            data-test-id="encrypted-text"
            fluid
          />
        </Message>
      )}
    </>
  );
}
