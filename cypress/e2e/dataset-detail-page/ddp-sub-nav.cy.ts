describe('Homepage user flow validation', () => {
  beforeEach(() => {
    cy.visit('/datasets/monthly-treasury-statement/summary-of-receipts-outlays-and-the-deficit-surplus-of-the-u-s-government').wait(3000);
  });
  it('Validates the DDP page loads', () => {
    cy.findByLabelText('Jump to Introduction section').should('be.visible');
    cy.findByTitle('Monthly Treasury Statement (MTS)').should('be.visible');
  });

  it('Validates Introduction jumps to the introduction part of the page', () => {
    cy.findByLabelText('Jump to Introduction section').click();
    cy.url().should('include', '#introduction');
  });

  it('Validates Data Preview jumps to the data Table part of the page', () => {
    cy.findByLabelText('Jump to Data Preview section').click();
    cy.url().should('include', '#data-table');
  });
  it('Validates Dataset Properties jumps to the Data Sets part of the page', () => {
    cy.findByLabelText('Jump to Dataset Properties section').click();
    cy.url().should('include', '#dataset-properties');
  });
  it('Validates Api Quick Guide jumps to the API Quick Guide part of the page', () => {
    cy.findByLabelText('Jump to API Quick Guide section').click();
    cy.url().should('include', '#api-quick-guide');
  });

  it('Validates tabbing through sub nav', () => {
    cy.findByLabelText('Jump to Introduction section').click();
    cy.focused()
      .should('contain', 'Introduction')
      .type('{enter}');
    cy.url().should('include', '#introduction');

    cy.findByLabelText('Jump to Data Preview section').click();
    cy.focused()
      .should('contain', 'Data Preview')
      .type('{enter}');
    cy.url().should('include', '#data-table');

    cy.findByLabelText('Jump to Dataset Properties section').click();
    cy.focused()
      .should('contain', 'Dataset Properties')
      .type('{enter}');
    cy.url().should('include', '#dataset-properties');

    cy.findByLabelText('Jump to API Quick Guide section').click();
    cy.focused()
      .should('contain', 'API Quick Guide')
      .type('{enter}');
    cy.url().should('include', '#api-quick-guide');
  });
});
