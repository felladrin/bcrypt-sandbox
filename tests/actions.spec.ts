import { expect, test } from "@playwright/test";

test("encryption and validation of a random text", async ({ page }) => {
	await page.goto("/");

	const randomText = Math.random().toString(36).substring(2);

	const textToEncryptElement = page
		.locator('[data-test-id="text-to-encrypt"]')
		.locator("input");

	await textToEncryptElement.fill(randomText);

	await expect(textToEncryptElement).toHaveValue(randomText);

	await page.locator('[data-test-id="button-to-encrypt"]').click();

	const encryptedText = await page
		.locator('[data-test-id="encrypted-text"]')
		.locator("input")
		.inputValue();

	await page
		.locator('[data-test-id="hash-to-validate"]')
		.locator("input")
		.fill(encryptedText);

	await page
		.locator('[data-test-id="text-to-validate"]')
		.locator("input")
		.fill(randomText);

	await page.locator('[data-test-id="button-to-validate"]').click();

	await expect(page.locator('[data-test-id="validation-result"]')).toHaveClass(
		/success/,
	);
});
