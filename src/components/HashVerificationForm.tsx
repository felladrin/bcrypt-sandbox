import React from "react";
import { Input, Button, Message, Icon } from "semantic-ui-react";
import { useStore } from "effector-react";
import type { BcryptVerifyOptions } from "hash-wasm";
import { bcryptVerify } from "hash-wasm";
import { restore, createEvent, createStore, createEffect, sample, combine } from "effector";

const verify = createEffect((options: BcryptVerifyOptions) => bcryptVerify(options));

const validateButtonClicked = createEvent();

const validationResultMessageDismissed = createEvent();

const textToValidateUpdated = createEvent<string>();

const hashToValidateUpdated = createEvent<string>();

const textToValidateStore = restore(textToValidateUpdated, "");

const hashToValidateStore = restore(hashToValidateUpdated, "");

const validationMatchedStore = restore(verify.doneData, false);

const displayValidationResultStore = createStore(false)
  .on(validateButtonClicked, () => true)
  .reset([validationResultMessageDismissed, textToValidateStore.updates, hashToValidateStore.updates]);

const isHashToValidateValidStore = hashToValidateStore.map((hashToValidate) => hashToValidate.startsWith("$"));

const validateButtonDisabledStore = combine({
  textToValidate: textToValidateStore,
  hashToValidate: hashToValidateStore,
  isHashToValidateValid: isHashToValidateValidStore,
}).map(
  ({ textToValidate, hashToValidate, isHashToValidateValid }) =>
    textToValidate.length === 0 || hashToValidate.length === 0 || !isHashToValidateValid
);

sample({
  clock: validateButtonClicked,
  source: combine({ password: textToValidateStore, hash: hashToValidateStore }),
  target: verify,
});

export function HashVerificationForm(): JSX.Element {
  const hashToValidate = useStore(hashToValidateStore);
  const displayValidationResult = useStore(displayValidationResultStore);
  const isHashToValidateValid = useStore(isHashToValidateValidStore);
  const validateButtonDisabled = useStore(validateButtonDisabledStore);
  const validationMatched = useStore(validationMatchedStore);

  return (
    <>
      <h2 className="ui center aligned header">
        <Icon fitted name="retweet" /> Validation
      </h2>
      <Input
        type="text"
        error={hashToValidate.length > 0 && !isHashToValidateValid}
        placeholder="Enter the hash to check"
        onChange={(_, data) => hashToValidateUpdated(data.value)}
        data-test-id="hash-to-validate"
        fluid
      />
      <Input
        type="text"
        placeholder="Enter the text to check against"
        onChange={(_, data) => textToValidateUpdated(data.value)}
        data-test-id="text-to-validate"
        fluid
      />
      <Button
        color="blue"
        onClick={() => validateButtonClicked()}
        disabled={validateButtonDisabled}
        data-test-id="button-to-validate"
        fluid
      >
        Check if hash and text match
      </Button>
      {displayValidationResult && validationMatched && (
        <Message
          header="Result:"
          content="Hash and text match!"
          onDismiss={() => validationResultMessageDismissed()}
          data-test-id="validation-result"
          success
        />
      )}
      {displayValidationResult && !validationMatched && (
        <Message
          header="Result:"
          content="Hash and text don't match."
          onDismiss={() => validationResultMessageDismissed()}
          negative
        />
      )}
    </>
  );
}
