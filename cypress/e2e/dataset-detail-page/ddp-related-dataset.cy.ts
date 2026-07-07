const pageLoadTimeout = 15000;

const visitMtsRelatedDatasets = () => {
  cy.intercept('GET', '**/services/api/fiscal_service/**').as('fiscalData');
  cy.visit('/datasets/monthly-treasury-statement/summary-of-receipts-outlays-and-the-deficit-surplus-of-the-u-s-government');
  cy.wait('@fiscalData', { timeout: pageLoadTimeout })
    .its('response.statusCode')
    .should('be.oneOf', [200, 304]);
  cy.findAllByText('Summary of Receipts, Outlays, and the Deficit/Surplus of the U.S. Government', { timeout: pageLoadTimeout })
    .should('exist')
    .should('be.visible');
};

describe('DDP related dataset go to the correct datasets', () => {
  beforeEach(() => {
    visitMtsRelatedDatasets();
  });
  it('Validates the DDP page loads', () => {
    cy.findAllByText('Debt to the Penny')
      .eq(1)
      .click();
    cy.url().should('include', '/debt-to-the-penny');
    cy.findAllByText('Daily Treasury Statement (DTS)')
      .eq(1)
      .click();
    cy.url().should('include', '/daily-treasury-statement/operating-cash-balance');
    cy.findAllByText('Monthly Treasury Statement (MTS)')
      .eq(1)
      .click();
    cy.url().should('include', '/summary-of-receipts-outlays-and-the-deficit-surplus-of-the-u-s-government');
  });
});
