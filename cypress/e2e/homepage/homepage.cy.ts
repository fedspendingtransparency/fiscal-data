const pageLoadTimeout = 15000;

const visitHomepage = () => {
  cy.intercept('GET', '**/services/api/fiscal_service/**').as('fiscalData');
  cy.visit('/');
  cy.wait('@fiscalData', { timeout: pageLoadTimeout })
    .its('response.statusCode')
    .should('be.oneOf', [200, 304]);
};

describe('Homepage user flow validation', () => {
  beforeEach(() => {
    visitHomepage();
  });

  it('ensure no tiles page tiles contain NaN, null, or undefined values', () => {
    cy.findAllByText('null').should('not.exist');
    cy.findAllByText('NaN').should('not.exist');
    cy.findAllByText('undefined').should('not.exist');
  });

  it('ensure homepage dataset tiles are loading data and not displaying API errors', () => {
    const datasetCards = cy.findAllByTestId('highlight-card');
    datasetCards.each(datasetCard => {
      cy.wrap(datasetCard).should('not.contain.text', 'API Error');
    });
  });

  it('finds and navigates to dataset page from dataset card link', () => {
    const datasetCardLinks = cy.findAllByTestId('highlight-link');
    datasetCardLinks.each(link => {
      cy.visit(link.attr('href'));
      cy.url().should('include', link.attr('href'));
    });
  });

  // Cypress automatically waits for any element animation to finish after being triggered
  // Therefore, since there is no way to validate the animation directly due to the
  // nature of the transition, we can simply have Cypress cycle through the animation
  // successfully.
  it('validate gold sparkle animation on gold dataset card', () => {
    cy.findByAltText('Image of gold bars').trigger('mouseover', { force: true });
  });

  it('then finds and navigates to AFG home page', () => {
    cy.contains("Your Guide to America's Finances").click();
    cy.url().should('include', '/americas-finance-guide/');
  });

  it('then finds and navigates to debt explainer', () => {
    cy.contains('What is the national debt?').click();
    cy.url().should('include', '/national-debt/');
  });

  it('then finds and navigates to deficit explainer', () => {
    cy.contains('What is the national deficit?').click();
    cy.url().should('include', '/national-deficit/');
  });

  it('then finds and navigates to spending explainer', () => {
    cy.contains('How much has the U.S. government spent this year?').click();
    cy.url().should('include', '/federal-spending/');
  });

  it('finds and navigates to revenue explainer', () => {
    cy.contains('How much has the U.S. government collected this year?').click();
    cy.url().should('include', '/government-revenue/');
  });

  it('finds and navigates to savings bonds explainer', () => {
    cy.contains('Explore U.S. Treasury Savings Bonds').click();
    cy.url().should('include', '/treasury-savings-bonds/');
  });
});
