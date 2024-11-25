describe('Deficit Explainer Page', () => {
  beforeEach(() => {
    cy.visit('/americas-finance-guide/national-deficit/');
  });

  it('Navigate to the deficit explainer, ensure pageensure page does not contain NaN, null, or undefined values', () => {
    cy.findAllByText('null').should('not.exist');
    cy.findAllByText('NaN').should('not.exist');
    cy.findAllByText('undefined').should('not.exist');

    // also an option to get everything in the body
    // cy.get('body').then(body => {
    //   cy.contains('null').should('not.exist');
    //   cy.contains('NaN').should('not.exist');
    //   cy.contains('undefined').should('not.exist');
    // });
  });

  describe('Validate that the sub nav takes the user to the correct section on the page', () => {
    it('Validate that the sub nav takes the user Overview section', () => {
      cy.findByRole('link', { name: 'Overview' }).click();
      cy.url().should('include', 'americas-finance-guide/');
    });

    it('Validate that the sub nav takes the user Revenue section', () => {
      cy.findByRole('link', { name: 'Revenue' }).click();
      cy.url().should('include', 'americas-finance-guide/government-revenue');
    });

    it('Validate that the sub nav takes the user Spending section', () => {
      cy.findByRole('link', { name: 'Spending' }).click();
      cy.url().should('include', 'americas-finance-guide/federal-spending');
    });

    it('Validate that the sub nav takes the user Debt section', () => {
      cy.findByRole('link', { name: 'Debt' }).click();
      cy.url().should('include', 'americas-finance-guide/national-debt');
    });
  });

  it('Validate all links on the page navigate to the correct destinations', () => {});
  it('Validate all glossary terms on page', () => {});
  it('Validate that the related datasets section contains the correct datasets', () => {});

  describe('Validate charts', () => {});
});
