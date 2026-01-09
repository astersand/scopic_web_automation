context('Deck of Cards API Tests', () => {
    const apiUrl = Cypress.env('API_URL_DECKOFCARDS');
    let deckId = '';
    let drawnCards = '';

    const pileName1 = new Date().toISOString().replace(/[:.]/g, '-') + '-first';
    const pileName2 = new Date().toISOString().replace(/[:.]/g, '-') + '-second';

    it('Should create a new deck and verify the response', () => {
        cy.request(`${apiUrl}api/deck/new/`).then((response) => {
            deckId = response.body.deck_id;
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('deck_id');
            expect(response.body).to.have.property('shuffled', false);
            expect(response.body).to.have.property('remaining', 52);
        });
    });

    it('Should shuffle the created deck and verify the response', () => {
        cy.request(`${apiUrl}api/deck/${deckId}/shuffle/`).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('success', true);
            expect(response.body).to.have.property('shuffled', true);
            expect(response.body).to.have.property('remaining', 52);
        });
    });

    it('Should create a pile of 5 cards from the created deck and verify the response', () => {
        //draw 5 cards first
        cy.request(`${apiUrl}api/deck/${deckId}/draw/?count=5`).then((drawResponse) => {
            expect(drawResponse.status).to.eq(200);
            expect(drawResponse.body).to.have.property('success', true);
            expect(drawResponse.body).to.have.property('cards');
            expect(drawResponse.body.cards).to.have.length(5);
            drawnCards = drawResponse.body.cards.map(card => card.code).join(',');

            //add the drawn cards to the pile
            cy.request(`${apiUrl}api/deck/${deckId}/pile/${pileName1}/add/?cards=${drawnCards}`).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property('success', true);
                expect(response.body).to.have.property('remaining', 47);
                expect(response.body.piles[pileName1]).to.have.property('remaining', 5);
            });
        });
    });

    it('Should create another pile of 5 cards from the created deck and verify the response', () => {
        //draw 5 more cards first
        cy.request(`${apiUrl}api/deck/${deckId}/draw/?count=5`).then((drawResponse) => {
            expect(drawResponse.status).to.eq(200);
            expect(drawResponse.body).to.have.property('success', true);
            expect(drawResponse.body).to.have.property('cards');
            expect(drawResponse.body.cards).to.have.length(5);
            drawnCards = drawResponse.body.cards.map(card => card.code).join(',');

            //add the drawn cards to the second pile
            cy.request(`${apiUrl}api/deck/${deckId}/pile/${pileName2}/add/?cards=${drawnCards}`).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property('success', true);
                expect(response.body).to.have.property('remaining', 42);
                expect(response.body.piles[pileName2]).to.have.property('remaining', 5);
            });
        });
    });

    it('Should shuffle the first pile and verify the response', () => {
        cy.request(`${apiUrl}api/deck/${deckId}/pile/${pileName1}/shuffle/`).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('success', true);
            expect(response.body).to.have.property('remaining', 42);
            expect(response.body.piles[pileName1]).to.have.property('remaining', 5);
        });
    });

    it('Should draw 3 cards from the first pile and verify the response', () => {
        cy.request(`${apiUrl}api/deck/${deckId}/pile/${pileName1}/draw/?count=3`).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('success', true);
            expect(response.body.cards).to.have.length(3);
            expect(response.body.piles[pileName1]).to.have.property('remaining', 2);
        });
    });

    it('Should draw 2 cards from the second pile and verify the response', () => {
        cy.request(`${apiUrl}api/deck/${deckId}/pile/${pileName2}/draw/?count=2`).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('success', true);
            expect(response.body.cards).to.have.length(2);
            expect(response.body.piles[pileName2]).to.have.property('remaining', 3);
        });
    });
});