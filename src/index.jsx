import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import bcrypt from "bcryptjs";
import {
  Container,
  Grid,
  Input,
  Button,
  Message,
  Menu,
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

const SALT_ROUNDS = 10;

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

  useEffect(() => {
    setDisplayEncryptionResult(encryptedText.length > 0);
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
    setDecryptButtonDisabled(
      textToDecrypt.length === 0 || hashToDecrypt.length === 0
    );
  }, [textToDecrypt, hashToDecrypt]);

  const handleEncryptButtonClicked = () => {
    setEncryptedText(bcrypt.hashSync(textToEncrypt, SALT_ROUNDS));
  };

  const handleDecryptButtonClicked = () => {
    setDecryptionMatched(bcrypt.compareSync(textToDecrypt, hashToDecrypt));
    setDisplayDecryptionResult(true);
  };

  const handleTextToEncryptChanged = (event) => {
    setTextToEncrypt(event.target.value);
  };

  const handleTextToDecryptChanged = (event) => {
    setTextToDecrypt(event.target.value);
  };

  const handleHashToDecryptChanged = (event) => {
    if (!event.target.value.startsWith("$")) {
      event.target.value = "";
      return;
    }

    setHashToDecrypt(event.target.value);
  };

  const handleEncryptionResultMessageDismissed = () => {
    setDisplayEncryptionResult(false);
  };

  const handleDecryptionResultMessageDismissed = () => {
    setDisplayDecryptionResult(false);
  };

  return (
    <React.Fragment>
      <Menu fixed="top" inverted>
        <Container>
          <Menu.Item header>Bcrypt Sandbox</Menu.Item>
          <Menu.Item>
            A tool for encrypting and decrypting text with bcrypt
          </Menu.Item>
        </Container>
      </Menu>
      <Container style={{ marginTop: "7em" }}>
        <Grid columns={2} divided>
          <Grid.Row>
            <Grid.Column>
              <h2 className="ui center aligned header">
                <i className="random icon" />
                Encryption
              </h2>
              <Input
                id="text-to-encrypt"
                type="text"
                placeholder="Enter some text to encrypt"
                onChange={handleTextToEncryptChanged}
                fluid
                action
              >
                <input />
                <Button
                  id="encrypt-button"
                  color="blue"
                  onClick={handleEncryptButtonClicked}
                  disabled={encryptButtonDisabled}
                >
                  Encrypt
                </Button>
              </Input>
              {displayEncryptionResult && (
                <Message
                  id="encryption-result"
                  header="Result:"
                  content={encryptedText}
                  onDismiss={handleEncryptionResultMessageDismissed}
                  info
                />
              )}
            </Grid.Column>
            <Grid.Column>
              <h2 className="ui center aligned header">
                <i className="retweet icon" />
                Decryption
              </h2>
              <Input
                id="hash-to-decrypt"
                type="text"
                placeholder="Enter the hash to check"
                onChange={handleHashToDecryptChanged}
                fluid
              />
              <Input
                id="text-to-decrypt"
                type="text"
                placeholder="Enter the text to check against"
                onChange={handleTextToDecryptChanged}
                fluid
              />
              <Button
                id="decrypt-button"
                color="blue"
                onClick={handleDecryptButtonClicked}
                disabled={decryptButtonDisabled}
                fluid
              >
                Check if hash and text match
              </Button>
              {displayDecryptionResult && decryptionMatched && (
                <Message
                  header="Result:"
                  content="Hash and text match!"
                  onDismiss={handleDecryptionResultMessageDismissed}
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
          </Grid.Row>
        </Grid>
      </Container>
    </React.Fragment>
  );
}

ReactDOM.render(
  <App />,
  document.body.appendChild(document.createElement("div"))
);
