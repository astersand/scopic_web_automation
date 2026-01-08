import loginPageSelectors from '../../support/PageObjectModel/loginPageSelectors';

context('Tests for login functionality', () => {
    before(('Visit the login page'), () => {
        cy.visit(Cypress.env('BASE_URL'));
    });

    beforeEach(('Clear username and password fields'), () => {
        cy.get(loginPageSelectors.username).clear();
        cy.get(loginPageSelectors.password).clear();
    });

    it('Should display error for locked out user', () => {
        cy.get(loginPageSelectors.username).type(Cypress.env('LOCKED_USER'));
        cy.get(loginPageSelectors.password).type(Cypress.env('VALID_PASSWORD'));
        cy.get(loginPageSelectors.loginButton).click();
        cy.get(loginPageSelectors.errorMessage).should('be.visible')
            .and('contain.text', 'Epic sadface: Sorry, this user has been locked out.');
    });

    it('Should display error for invalid password', () => {
        cy.get(loginPageSelectors.username).type(Cypress.env('STANDARD_USER'));
        cy.get(loginPageSelectors.password).type(Cypress.env('INVALID_PASSWORD'));
        cy.get(loginPageSelectors.loginButton).click();
        cy.get(loginPageSelectors.errorMessage).should('be.visible')
            .and('contain.text', 'Epic sadface: Username and password do not match any user in this service');
    });

    it('Should login successfully with valid credentials', () => {
        cy.get(loginPageSelectors.username).type(Cypress.env('STANDARD_USER'));
        cy.get(loginPageSelectors.password).type(Cypress.env('VALID_PASSWORD'));
        cy.get(loginPageSelectors.loginButton).click();
        cy.url().should('include', '/inventory.html');
    });
});