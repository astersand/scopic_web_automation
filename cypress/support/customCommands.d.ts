declare namespace Cypress {
    interface Chainable<Subject> {
        login(email: any, password: any): Chainable<any>
        areProductsSortedDesc(productArray: any): Chainable<any>
  }
}