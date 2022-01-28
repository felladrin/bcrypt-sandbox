context("Actions", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("successfully encrypts and validates a random text", () => {
    const randomText = Math.random().toString(36).substring(2);

    cy.get('[data-test-id="text-to-encrypt"]').type(randomText).find("input").should("have.value", randomText);

    cy.get('[data-test-id="button-to-encrypt"]').click();

    cy.get('[data-test-id="encrypted-text"]')
      .find("input")
      .invoke("val")
      .then((encryptedText) => {
        cy.get('[data-test-id="hash-to-validate"]').type(encryptedText as string);
      });

    cy.get('[data-test-id="text-to-validate"]').type(randomText);

    cy.get('[data-test-id="button-to-validate"]').click();

    cy.get('[data-test-id="validation-result"]').should("have.class", "success");
  });
});
