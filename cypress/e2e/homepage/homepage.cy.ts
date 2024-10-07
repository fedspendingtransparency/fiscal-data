describe('Homepage user flow validation', () => {
  it('ensure no tiles page tiles contain NaN, null, or undefined values', () => {
    cy.visit('/');
    const pageLinks = cy.findAllByTestId('tile-link');
    pageLinks.each(pageLink => {
      cy.wrap(pageLink).should('not.contain.text', 'null');
      cy.wrap(pageLink).should('not.contain.text', 'NaN');
      cy.wrap(pageLink).should('not.contain.text', 'undefined');
    });
  });

  it('then finds and navigates to AFG home page', () => {
    cy.visit('/');
    cy.findAllByTestId('tile-link');
    cy.contains("Your Guide to America's Finances").click();
    cy.url().should('include', '/americas-finance-guide/');
  });

  it('then finds and navigates to debt explainer', () => {
    cy.visit('/');
    cy.contains('What is the national debt?').click();
    cy.url().should('include', '/national-debt/');
  });

  it('then finds and navigates to deficit explainer', () => {
    cy.visit('/');
    cy.contains('What is the national deficit?').click();
    cy.url().should('include', '/national-deficit/');
  });

  it('then finds and navigates to spending explainer', () => {
    cy.visit('/');
    cy.contains('How much has the U.S. government spent this year?').click();
    cy.url().should('include', '/federal-spending/');
  });

  it('finds and navigates to revenue explainer', () => {
    cy.visit('/');
    cy.contains('How much has the U.S. government collected this year?').click();
    cy.url().should('include', '/government-revenue/');
  });

  it('finds and navigates to savings bonds explainer', () => {
    cy.visit('/');
    cy.contains('Explore U.S. Treasury Savings Bonds').click();
    cy.url().should('include', '/treasury-savings-bonds/');
  });
});
