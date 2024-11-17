import { bcryptVerify } from "hash-wasm";
import React, { useCallback, useEffect, useState } from "react";
import { Button, Icon, Input, Message } from "semantic-ui-react";

export function HashVerificationForm(): JSX.Element {
	const [hashToValidate, setHashToValidate] = useState("");
	const [textToValidate, setTextToValidate] = useState("");
	const [shouldDisplayValidationResult, setDisplayValidationResult] =
		useState(false);
	const [isHashToValidateValid, setIsHashToValidateValid] = useState(false);
	const [isValidateButtonDisabled, setValidateButtonDisabled] = useState(false);
	const [isValidationMatching, setValidationMatching] = useState(false);

	const handleValidationResultMessageDismissed = useCallback(
		() => setDisplayValidationResult(false),
		[],
	);

	const handleValidateButtonClicked = useCallback(() => {
		bcryptVerify({ password: textToValidate, hash: hashToValidate }).then(
			(isMatching) => {
				setValidationMatching(isMatching);
				setDisplayValidationResult(true);
			},
		);
	}, [textToValidate, hashToValidate]);

	const handleTextToValidateChange = useCallback((value: string) => {
		setTextToValidate(value);
		setDisplayValidationResult(false);
	}, []);

	useEffect(() => {
		setIsHashToValidateValid(hashToValidate.startsWith("$"));
		setDisplayValidationResult(false);
	}, [hashToValidate]);

	useEffect(() => {
		setValidateButtonDisabled(
			textToValidate.length === 0 ||
				hashToValidate.length === 0 ||
				!isHashToValidateValid,
		);
	}, [textToValidate, hashToValidate, isHashToValidateValid]);

	return (
		<>
			<h2 className="ui center aligned header">
				<Icon fitted name="retweet" /> Validation
			</h2>
			<Input
				type="text"
				error={hashToValidate.length > 0 && !isHashToValidateValid}
				placeholder="Enter the hash to check"
				onChange={(_, data) => setHashToValidate(data.value)}
				data-test-id="hash-to-validate"
				fluid
			/>
			<Input
				type="text"
				placeholder="Enter the text to check against"
				onChange={(_, data) => handleTextToValidateChange(data.value)}
				data-test-id="text-to-validate"
				fluid
			/>
			<Button
				color="blue"
				onClick={handleValidateButtonClicked}
				disabled={isValidateButtonDisabled}
				data-test-id="button-to-validate"
				fluid
			>
				Check if hash and text match
			</Button>
			{shouldDisplayValidationResult && isValidationMatching && (
				<Message
					header="Result:"
					content="Hash and text match!"
					onDismiss={handleValidationResultMessageDismissed}
					data-test-id="validation-result"
					success
				/>
			)}
			{shouldDisplayValidationResult && !isValidationMatching && (
				<Message
					header="Result:"
					content="Hash and text don't match."
					onDismiss={handleValidationResultMessageDismissed}
					negative
				/>
			)}
		</>
	);
}
