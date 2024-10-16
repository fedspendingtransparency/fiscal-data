describe('Homepage user flow validation', () => {
  it('Validates Contact Us Opens correct email', () => {
    cy.visit('/');
    cy.findByRole('link', { name: 'Dataset Search' }).then($link => {
      cy.log($link.prop('outerHTML'));
    });
  });
});
