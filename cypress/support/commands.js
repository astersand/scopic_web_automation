import loginPageSelectors from './PageObjectModel/loginPageSelectors';

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
Cypress.Commands.add('login', (email, password) => {
    cy.get(loginPageSelectors.username).clear().type(email);
    cy.get(loginPageSelectors.password).clear().type(password);
    cy.get(loginPageSelectors.loginButton).click();
});

Cypress.Commands.add('areProductsSortedDesc', (productArray) => {
    return productArray.slice(1).every((item, i) => productArray[i] >= item);
});

//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })