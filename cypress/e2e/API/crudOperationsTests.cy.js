context('ReqRes API CRUD Operations Tests', () => {
    const baseUrl = 'https://reqres.in/';
    const apiKey = Cypress.env('REQRES_API_KEY'); 

    let createdUserId;

    it('Should create a new user record', () => {
        cy.request({
            method: 'POST',
            url: `${baseUrl}api/users`,
            headers: {
                'x-api-key': apiKey,
                'Content-Type': 'application/json'
            },
            body: {
                name: 'John Doe',
                job: 'Software Engineer'
            }
        }).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body).to.have.property('name', 'John Doe');
            expect(response.body).to.have.property('job', 'Software Engineer');
            expect(response.body).to.have.property('id');
            expect(response.body).to.have.property('createdAt');
            createdUserId = response.body.id;
        });
    });

    it('Should fetch a user record', () => {
        cy.request({
            method: 'GET',
            url: `${baseUrl}api/users/2`,
            headers: {
                'x-api-key': apiKey
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('data');
            expect(response.body.data).to.have.property('id', 2);
            expect(response.body.data).to.have.property('email');
            expect(response.body.data).to.have.property('first_name');
            expect(response.body.data).to.have.property('last_name');
        });
    });

    it('Should update a user record', () => {
        cy.request({
            method: 'PUT',
            url: `${baseUrl}api/users/2`,
            headers: {
                'x-api-key': apiKey,
                'Content-Type': 'application/json'
            },
            body: {
                name: 'Jane Doe',
                job: 'Senior Software Engineer'
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('name', 'Jane Doe');
            expect(response.body).to.have.property('job', 'Senior Software Engineer');
            expect(response.body).to.have.property('updatedAt');
        });
    });

    it('Should delete a user record', () => {
        cy.request({
            method: 'DELETE',
            url: `${baseUrl}api/users/2`,
            headers: {
                'x-api-key': apiKey
            }
        }).then((response) => {
            expect(response.status).to.eq(204);
        });
    });
});