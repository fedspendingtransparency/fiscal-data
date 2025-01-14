describe('DDP related dataset go to the correct datasets', () => {
  beforeEach(() => {
    cy.visit('/datasets/monthly-treasury-statement/summary-of-receipts-outlays-and-the-deficit-surplus-of-the-u-s-government').wait(3000);
  });
  it('Validates the DDP page loads', () => {
    cy.findByTitle('Monthly Treasury Statement (MTS)').should('be.visible');
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
