describe('Homepage user flow validation', () => {
  it('Validates the DDP page loads', () => {
    cy.visit('/datasets/').wait(4500);

    cy.findByLabelText('Enter search terms')
      .should('be.visible')
      .type('MTS');
    cy.findByText('Monthly Treasury Statement (MTS)')
      .should('be.visible')
      .click();
    cy.url().should('include', '/monthly-treasury-statement/');
  });

  it('Validates Introduction jumps to the introduction part of the page', () => {
    cy.visit('/datasets/monthly-treasury-statement/summary-of-receipts-outlays-and-the-deficit-surplus-of-the-u-s-government/').wait(4500);
    cy.findByLabelText('Jump to Introduction section').click();
    cy.url().should('include', '#introduction');
  });
  it('Validates Preview & Download jumps to the introduction part of the page', () => {
    cy.visit('/datasets/monthly-treasury-statement/summary-of-receipts-outlays-and-the-deficit-surplus-of-the-u-s-government/').wait(4500);
    cy.findByLabelText('Jump to Introduction section').click();
    cy.url().should('include', '#data-table');
  });
  it('Validates Dataset Properties jumps to the introduction part of the page', () => {
    cy.visit('/datasets/monthly-treasury-statement/summary-of-receipts-outlays-and-the-deficit-surplus-of-the-u-s-government/').wait(4500);
    cy.findByLabelText('Jump to Introduction section').click();
    cy.url().should('include', '#dataset-properties');
  });
  it('Validates Api Quick Guide jumps to the introduction part of the page', () => {
    cy.visit('/datasets/monthly-treasury-statement/summary-of-receipts-outlays-and-the-deficit-surplus-of-the-u-s-government/').wait(4500);
    cy.findByLabelText('Jump to Introduction section').click();
    cy.url().should('include', '#api-quick-guide');
  });
  it('Validates Preview & Download  jumps to the introduction part of the page', () => {
    cy.visit('/datasets/monthly-treasury-statement/summary-of-receipts-outlays-and-the-deficit-surplus-of-the-u-s-government/').wait(4500);
    cy.findByLabelText('Jump to Introduction section').click();
    cy.url().should('include', '/monthly-treasury-statement/');
  });
});
