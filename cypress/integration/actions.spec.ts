context("Actions", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("successfully encrypts and decrypts a random text", () => {
    const randomText = Math.random().toString(36).substr(2);

    cy.get('[data-test-id="text-to-encrypt"]').type(randomText).find("input").should("have.value", randomText);

    cy.get('[data-test-id="button-to-encrypt"]').click();

    cy.get('[data-test-id="encrypted-text"]')
      .find("input")
      .invoke("val")
      .then((encryptedText) => {
        cy.get('[data-test-id="hash-to-decrypt"]').type(encryptedText as string);
      });

    cy.get('[data-test-id="text-to-decrypt"]').type(randomText);

    cy.get('[data-test-id="button-to-decrypt"]').click();

    cy.get('[data-test-id="decryption-result"]').should("have.class", "success");
  });
});
