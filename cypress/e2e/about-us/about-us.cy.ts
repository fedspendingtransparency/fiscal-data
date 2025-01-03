describe('About Us interaction flow', () => {
  beforeEach(() => {
    cy.visit('/about-us/');
  });

  it('Navigates to the About Us page', () => {
    cy.findAllByText('About Fiscal Data').should('exist');
  });

  it('Validates all links on the page function as intended', () => {});
});
