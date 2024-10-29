describe('Homepage user flow validation', () => {
  beforeEach(() => {
    cy.visit('/datasets/monthly-treasury-statement/summary-of-receipts-outlays-and-the-deficit-surplus-of-the-u-s-government').wait(3000);
  });
  // it('Current date loads properly', () => {
  //   cy.findByText('Current Date')
  //     .should('be.visible')
  //     .click();
  // });
  // it('Current date loads properly', () => {
  //   cy.findByText('1 Year')
  //     .should('be.visible')
  //     .click();
  // });
  // it('Current date loads properly', () => {
  //   cy.findByText('5 Years')
  //     .should('be.visible')
  //     .click();
  // });
  // it('Current date loads properly', () => {
  //   cy.findByText('All')
  //     .should('be.visible')
  //     .click();
  // });
  it('Current date loads properly', () => {
    cy.findByText('Custom')
      .should('be.visible')
      .click();
    cy.findByLabelText('From Date')
      .should('be.visible')
      .click()
      .type('{selectall}{del')
      .type('10012015'); //date format of 10/01/2015
    cy.findByLabelText('To Date')
      .should('be.visible')
      .click()
      .type('{selectall}{del')
      .type('10312015'); //date format of 10/31/2015
    cy.findByTestId('dateString').should('be.visible');
  });
});
