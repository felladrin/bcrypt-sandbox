import React from "react";
import { Input, Button, Message, Icon } from "semantic-ui-react";
import { useStore } from "effector-react";
import type { BcryptVerifyOptions } from "hash-wasm";
import { bcryptVerify } from "hash-wasm";
import { restore, createEvent, createStore, createEffect, sample, combine } from "effector";

const verify = createEffect((options: BcryptVerifyOptions) => bcryptVerify(options));

const decryptButtonClicked = createEvent();

const decryptionResultMessageDismissed = createEvent();

const textToDecryptUpdated = createEvent<string>();

const hashToDecryptUpdated = createEvent<string>();

const textToDecryptStore = restore(textToDecryptUpdated, "");

const hashToDecryptStore = restore(hashToDecryptUpdated, "");

const decryptionMatchedStore = restore(verify.doneData, false);

const displayDecryptionResultStore = createStore(false)
  .on(decryptButtonClicked, () => true)
  .reset([decryptionResultMessageDismissed, textToDecryptStore.updates, hashToDecryptStore.updates]);

const isHashToDecryptValidStore = hashToDecryptStore.map((hashToDecrypt) => hashToDecrypt.startsWith("$"));

const decryptButtonDisabledStore = combine({
  textToDecrypt: textToDecryptStore,
  hashToDecrypt: hashToDecryptStore,
  isHashToDecryptValid: isHashToDecryptValidStore,
}).map(
  ({ textToDecrypt, hashToDecrypt, isHashToDecryptValid }) =>
    textToDecrypt.length === 0 || hashToDecrypt.length === 0 || !isHashToDecryptValid
);

sample({
  clock: decryptButtonClicked,
  source: combine({ password: textToDecryptStore, hash: hashToDecryptStore }),
  target: verify,
});

export function HashVerificationForm(): JSX.Element {
  const hashToDecrypt = useStore(hashToDecryptStore);
  const displayDecryptionResult = useStore(displayDecryptionResultStore);
  const isHashToDecryptValid = useStore(isHashToDecryptValidStore);
  const decryptButtonDisabled = useStore(decryptButtonDisabledStore);
  const decryptionMatched = useStore(decryptionMatchedStore);

  return (
    <>
      <h2 className="ui center aligned header">
        <Icon fitted name="retweet" /> Decryption
      </h2>
      <Input
        type="text"
        error={hashToDecrypt.length > 0 && !isHashToDecryptValid}
        placeholder="Enter the hash to check"
        onChange={(_, data) => hashToDecryptUpdated(data.value)}
        data-test-id="hash-to-decrypt"
        fluid
      />
      <Input
        type="text"
        placeholder="Enter the text to check against"
        onChange={(_, data) => textToDecryptUpdated(data.value)}
        data-test-id="text-to-decrypt"
        fluid
      />
      <Button
        color="blue"
        onClick={() => decryptButtonClicked()}
        disabled={decryptButtonDisabled}
        data-test-id="button-to-decrypt"
        fluid
      >
        Check if hash and text match
      </Button>
      {displayDecryptionResult && decryptionMatched && (
        <Message
          header="Result:"
          content="Hash and text match!"
          onDismiss={() => decryptionResultMessageDismissed()}
          data-test-id="decryption-result"
          success
        />
      )}
      {displayDecryptionResult && !decryptionMatched && (
        <Message
          header="Result:"
          content="Hash and text don't match."
          onDismiss={() => decryptionResultMessageDismissed()}
          negative
        />
      )}
    </>
  );
}
