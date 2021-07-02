/// <reference types="cypress" />

context("Actions", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("successfully encrypts and decrypts a random text", () => {
    const randomText = Math.random().toString(36).substr(2);

    cy.get('[data-cy="text-to-encrypt"]').type(randomText).find("input").should("have.value", randomText);

    cy.get('[data-cy="button-to-encrypt"]').click();

    cy.get('[data-cy="encrypted-text"]')
      .find("input")
      .invoke("val")
      .then((encryptedText) => {
        cy.get('[data-cy="hash-to-decrypt"]').type(encryptedText as string);

        cy.get('[data-cy="text-to-decrypt"]').type(randomText);

        cy.get('[data-cy="button-to-decrypt"]').click();

        cy.get('[data-cy="decryption-result"]').should("have.class", "success");
      });
  });
});
