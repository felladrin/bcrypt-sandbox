import { Container, Grid } from "semantic-ui-react";
import { EncryptionForm } from "./EncryptionForm";
import { HashVerificationForm } from "./HashVerificationForm";
import { TopBar } from "./TopBar";

export function App(): JSX.Element {
	return (
		<>
			<TopBar />
			<Container style={{ marginTop: "7em" }}>
				<Grid stackable columns={2} divided>
					<Grid.Column>
						<EncryptionForm />
					</Grid.Column>
					<Grid.Column>
						<HashVerificationForm />
					</Grid.Column>
				</Grid>
			</Container>
		</>
	);
}
