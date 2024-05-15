describe('Dataset detail page validation', () => {
  it('navigates to DTS', () => {
    cy.visit('/datasets/daily-treasury-statement/');
    cy.contains('Daily Treasury Statement (DTS)');
  });
});
