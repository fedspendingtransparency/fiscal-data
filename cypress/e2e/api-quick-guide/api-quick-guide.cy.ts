describe('API Quick Guide',() => {
    beforeEach('navigates to a dataset', () => {
        cy.visit('/datasets/daily-treasury-statement/');
    });

    it('Validates API Quick Guide jumps to the API Quick Guide part of the page', () => {
        cy.contains('API Quick Guide')
          .scrollIntoView({duration: 2000})
          .click()
          .wait(2000);

        cy.url()
          .should('include', '#api-quick-guide');
    });

    it('Verifies that the rest of the API Quick Guide section is revealed', () => {
        cy.contains('button', 'Show More')
          .scrollIntoView({duration: 2000})
          .click()
          .wait(2000);

        cy.contains('Example Request & Response')
          .scrollIntoView({duration: 2000});

        cy.get('#api-quick-guide-expandable')
          .invoke('attr', 'aria-hidden')
          .should('eq', 'false');
    });

    it('Verifies that API Quick Guide section can revert back to its previous state', () => {
        cy.contains('button', 'Show More').then($button => {
            cy.wrap($button)
              .scrollIntoView({duration: 2000})
              .click()
              .wait(2000);
        })

      cy.contains('button','Show Less')
        .scrollIntoView({duration: 2000})
        .click()
        .wait(2000);

      cy.contains('h2','API Quick Guide')
        .scrollIntoView({duration: 2000});

      cy.get('#api-quick-guide-expandable')
        .invoke('attr', 'aria-hidden')
        .should('eq', 'true');
    });
})
