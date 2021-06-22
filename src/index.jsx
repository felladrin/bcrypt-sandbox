import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import { bcrypt, bcryptVerify } from "hash-wasm";
import { Container, Grid, Input, Button, Message, Menu } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

const BCRYPT_COST_FACTOR = 10;

function App() {
  const [textToEncrypt, setTextToEncrypt] = useState("");
  const [textToDecrypt, setTextToDecrypt] = useState("");
  const [hashToDecrypt, setHashToDecrypt] = useState("");
  const [encryptedText, setEncryptedText] = useState("");
  const [decryptionMatched, setDecryptionMatched] = useState(false);
  const [displayEncryptionResult, setDisplayEncryptionResult] = useState(false);
  const [displayDecryptionResult, setDisplayDecryptionResult] = useState(false);
  const [encryptButtonDisabled, setEncryptButtonDisabled] = useState(true);
  const [decryptButtonDisabled, setDecryptButtonDisabled] = useState(true);
  const [copyButtonClicked, setCopyButtonClicked] = useState(false);
  const copyInput = useRef();

  useEffect(() => {
    setDisplayEncryptionResult(encryptedText.length > 0);
    setCopyButtonClicked(false);
  }, [encryptedText]);

  useEffect(() => {
    setEncryptButtonDisabled(textToEncrypt.length === 0);
    setDisplayEncryptionResult(false);
  }, [textToEncrypt]);

  useEffect(() => {
    setDisplayDecryptionResult(false);
  }, [textToDecrypt]);

  useEffect(() => {
    setDisplayDecryptionResult(false);
  }, [hashToDecrypt]);

  useEffect(() => {
    setDecryptButtonDisabled(textToDecrypt.length === 0 || hashToDecrypt.length === 0);
  }, [textToDecrypt, hashToDecrypt]);

  const handleEncryptButtonClicked = async () => {
    const salt = new Uint8Array(16);
    window.crypto.getRandomValues(salt);
    setEncryptedText(
      await bcrypt({
        password: textToEncrypt,
        costFactor: BCRYPT_COST_FACTOR,
        salt,
        outputType: "encoded",
      })
    );
  };

  const handleDecryptButtonClicked = async () => {
    setDecryptionMatched(await bcryptVerify({ password: textToDecrypt, hash: hashToDecrypt }));
    setDisplayDecryptionResult(true);
  };

  const handleTextToEncryptChanged = (event) => {
    setTextToEncrypt(event.target.value);
  };

  const handleTextToDecryptChanged = (event) => {
    setTextToDecrypt(event.target.value);
  };

  const handleHashToDecryptChanged = (event) => {
    const { target } = event;

    if (!target.value.startsWith("$")) {
      target.value = "";
      return;
    }

    setHashToDecrypt(target.value);
  };

  const handleEncryptionResultMessageDismissed = () => {
    setDisplayEncryptionResult(false);
  };

  const handleDecryptionResultMessageDismissed = () => {
    setDisplayDecryptionResult(false);
  };

  const handleCopyButtonClicked = () => {
    var copyText = copyInput.current.inputRef.current;
    copyText.select();
    copyText.setSelectionRange?.(0, encryptedText.length);
    document.execCommand("copy");
    setCopyButtonClicked(true);
  };

  return (
    <>
      <Menu fixed="top" inverted>
        <Container>
          <Menu.Item header>Bcrypt Sandbox</Menu.Item>
          <Menu.Item>A tool for encrypting and decrypting text with bcrypt</Menu.Item>
        </Container>
      </Menu>
      <Container style={{ marginTop: "7em" }}>
        <Grid stackable columns={2} divided>
          <Grid.Column>
            <h2 className="ui center aligned header">
              <i className="random icon" /> Encryption
            </h2>
            <Input
              type="text"
              placeholder="Enter some text to encrypt"
              onChange={handleTextToEncryptChanged}
              data-cy="text-to-encrypt"
              fluid
              action
            >
              <input />
              <Button
                color="blue"
                onClick={handleEncryptButtonClicked}
                disabled={encryptButtonDisabled}
                data-cy="button-to-encrypt"
              >
                Encrypt
              </Button>
            </Input>
            {displayEncryptionResult && (
              <Message onDismiss={handleEncryptionResultMessageDismissed} info>
                <Message.Header>Result:</Message.Header>
                <Input
                  action={
                    <Button color="teal" icon labelPosition="right" onClick={handleCopyButtonClicked}>
                      {copyButtonClicked ? "Copied!" : "Copy"} <i className="copy icon" />
                    </Button>
                  }
                  value={encryptedText}
                  ref={copyInput}
                  data-cy="encrypted-text"
                  fluid
                />
              </Message>
            )}
          </Grid.Column>
          <Grid.Column>
            <h2 className="ui center aligned header">
              <i className="retweet icon" /> Decryption
            </h2>
            <Input
              type="text"
              placeholder="Enter the hash to check"
              onChange={handleHashToDecryptChanged}
              data-cy="hash-to-decrypt"
              fluid
            />
            <Input
              type="text"
              placeholder="Enter the text to check against"
              onChange={handleTextToDecryptChanged}
              data-cy="text-to-decrypt"
              fluid
            />
            <Button
              color="blue"
              onClick={handleDecryptButtonClicked}
              disabled={decryptButtonDisabled}
              data-cy="button-to-decrypt"
              fluid
            >
              Check if hash and text match
            </Button>
            {displayDecryptionResult && decryptionMatched && (
              <Message
                header="Result:"
                content="Hash and text match!"
                onDismiss={handleDecryptionResultMessageDismissed}
                data-cy="decryption-result"
                success
              />
            )}
            {displayDecryptionResult && !decryptionMatched && (
              <Message
                header="Result:"
                content="Hash and text don't match."
                onDismiss={handleDecryptionResultMessageDismissed}
                negative
              />
            )}
          </Grid.Column>
        </Grid>
      </Container>
    </>
  );
}

ReactDOM.render(<App />, document.body.appendChild(document.createElement("div")));
