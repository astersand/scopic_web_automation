import inventoryPageSelectors from '../support/PageObjectModel/inventoryPageSelectors';
import checkoutInformationPageSelectors from '../support/PageObjectModel/checkoutInformationPageSelectors';
import checkoutOverviewPageSelectors from '../support/PageObjectModel/checkoutOverviewPageSelectors';
import checkoutCompletePageSelectors from '../support/PageObjectModel/checkoutCompletePageSelectors';
import cartPageSelectors from '../support/PageObjectModel/cartPageSelectors';

context(('Tests for add to cart and checkout functionality'), () => {
    let products = [];
    before(() => {
        cy.visit(Cypress.env('BASE_URL'));
        cy.login(Cypress.env('STANDARD_USER'), Cypress.env('VALID_PASSWORD'));
    });

    it('Should sort the products by Price (high to low)', () => {
        cy.get(inventoryPageSelectors.sortButton).select('Price (high to low)').then(() => {
            cy.get(inventoryPageSelectors.productPrice).each(($el) => {
                const priceText = $el.text().replace('$', '');
                products.push(parseFloat(priceText));
            });
        });
        cy.areProductsSortedDesc(products).should('be.true');
    });

    it('Should add the first two most expensive products to the cart', () => {
        cy.get(inventoryPageSelectors.product).contains(products[0].toString()).parent().within(() => {
            cy.get(inventoryPageSelectors.addToCartButton).click();
        });
        cy.get(inventoryPageSelectors.product).contains(products[1].toString()).parent().within(() => {
            cy.get(inventoryPageSelectors.addToCartButton).click();
        });
        cy.get(inventoryPageSelectors.cartBadge).should('have.text', '2');
    });

    it('Should go to the cart and verify the correct products are added', () => {
        cy.get(inventoryPageSelectors.cartButton).click();
        cy.get(cartPageSelectors.products).should('have.length', 2);
        cy.get(cartPageSelectors.productName).eq(0).should('have.text', 'Sauce Labs Fleece Jacket');
        cy.get(cartPageSelectors.productQuantity).eq(0).should('have.text', '1');
        cy.get(cartPageSelectors.productName).eq(1).should('have.text', 'Sauce Labs Backpack');
        cy.get(cartPageSelectors.productQuantity).eq(1).should('have.text', '1');
    });

    it('Should proceed to checkout and fill in the required information', () => {
        cy.get(cartPageSelectors.checkoutButton).click();
        cy.url().should('include', '/checkout-step-one.html');
        cy.get(checkoutInformationPageSelectors.firstName).type('John');
        cy.get(checkoutInformationPageSelectors.lastName).type('Doe');
        cy.get(checkoutInformationPageSelectors.postalCode).type('12345');
        cy.get(checkoutInformationPageSelectors.continueButton).click();
    });

    it('Should complete the purchase', () => {
        cy.url().should('include', '/checkout-step-two.html');
        cy.get(checkoutOverviewPageSelectors.productName).eq(0).should('have.text', 'Sauce Labs Fleece Jacket');
        cy.get(checkoutOverviewPageSelectors.productPrice).eq(0).should('have.text', '$49.99');
        cy.get(checkoutOverviewPageSelectors.productQuantity).eq(0).should('have.text', '1');
        cy.get(checkoutOverviewPageSelectors.productName).eq(1).should('have.text', 'Sauce Labs Backpack');
        cy.get(checkoutOverviewPageSelectors.productPrice).eq(1).should('have.text', '$29.99');
        cy.get(checkoutOverviewPageSelectors.productQuantity).eq(1).should('have.text', '1');
        cy.get(checkoutOverviewPageSelectors.paymentInformation).should('have.text', 'SauceCard #31337');
        cy.get(checkoutOverviewPageSelectors.shippingInformation).should('have.text', 'Free Pony Express Delivery!');
        cy.get(checkoutOverviewPageSelectors.subtotalLabel).should('have.text', 'Item total: $79.98');
        cy.get(checkoutOverviewPageSelectors.taxLabel).should('have.text', 'Tax: $6.40');
        cy.get(checkoutOverviewPageSelectors.total).should('have.text', 'Total: $86.38');
        cy.get(checkoutOverviewPageSelectors.finishButton).click();
        
    });

    it('Should verify the order confirmation', () => {
        cy.url().should('include', '/checkout-complete.html');
        cy.get(checkoutCompletePageSelectors.checkoutCompleteIcon).should('be.visible');
        cy.get(checkoutCompletePageSelectors.title).should('have.text', 'Thank you for your order!');
        cy.get(checkoutCompletePageSelectors.descriptionText).should('have.text', 'Your order has been dispatched, and will arrive just as fast as the pony can get there!');
        cy.get(checkoutCompletePageSelectors.backHomeButton).should('be.visible');
    });
});