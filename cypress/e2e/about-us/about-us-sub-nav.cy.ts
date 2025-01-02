describe('About us interaction flow', () => {
  beforeEach(() => {
    cy.visit('/about-us/').wait(1500);
  });

  it('Verifies about us page loads', () => {
    cy.findAllByText('About Fiscal Data').should('exist');
  });
  it('Verifies about us sub nav interaction flow FAQ', () => {
    cy.findByTitle('Why do some datasets...')
      .should('exist')
      .click();
    cy.url().should('include', '/#why-datasets-go-further-than-others');
  });
  it('Verifies about us sub nav interaction flow About Fiscal Data', () => {
    cy.findByTitle('Background')
      .should('exist')
      .click();
    cy.url().should('include', '/#background');
  });
});
