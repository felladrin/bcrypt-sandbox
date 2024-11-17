import React from "react";
import { Container, Menu } from "semantic-ui-react";

export function TopBar(): JSX.Element {
	return (
		<Menu fixed="top" inverted>
			<Container>
				<Menu.Item header>Bcrypt Sandbox</Menu.Item>
				<Menu.Item>
					A tool for encrypting and validating text with bcrypt
				</Menu.Item>
			</Container>
		</Menu>
	);
}
