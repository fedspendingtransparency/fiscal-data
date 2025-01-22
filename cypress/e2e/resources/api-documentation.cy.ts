describe('API Documentation Page', () => {
  beforeEach(() => {
    cy.visit('/api-documentation');
  });

  it('Navigate to the api documentation, ensure page does not contain NaN, null, or undefined values', () => {
    cy.findAllByText('null').should('not.exist');
    cy.findAllByText('NaN').should('not.exist');
    cy.findAllByText('undefined').should('not.exist');
  });

  it('Validate all links', () => {});
});
