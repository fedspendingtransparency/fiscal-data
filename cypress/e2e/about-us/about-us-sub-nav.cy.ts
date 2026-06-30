describe('About us interaction flow', () => {
  const pageLoadTimeout = 15000;

  const visitAboutUsPage = () => {
    cy.intercept('GET', '**/api/**').as('apiCalls'); // Adjust the pattern to match your actual API endpoints
    cy.visit('/about-us/');
    cy.wait('@apiCalls', { timeout: pageLoadTimeout })
      .its('response.statusCode')
      .should('be.oneOf', [200, 304]);
    cy.findAllByText('About Fiscal Data', { timeout: pageLoadTimeout })
      .should('exist')
      .should('be.visible');
  };

  beforeEach(() => {
    visitAboutUsPage();
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
  it('Verifies keyboard interaction about us sub nav interaction flow FAQ', () => {
    cy.findByTitle('I’m new to using APIs...')
      .should('exist')
      .focus()
      .type('{enter}');
    cy.url().should('include', '/#new-to-apis');
  });
  it('Verifies about us sub nav interaction flow About Fiscal Data', () => {
    cy.findByTitle('Background')
      .should('exist')
      .click();
    cy.url().should('include', '/#background');
  });
  it('Verifies keyboard interaction about us sub nav interaction flow About Fiscal Data', () => {
    cy.findByTitle('Mission')
      .should('exist')
      .focus()
      .type('{enter}');
    cy.url().should('include', '/#mission');
  });
  it('Verifies about us sub nav interaction flow Contact Us', () => {
    cy.findByTitle('Contact Us')
      .should('exist')
      .click();
    cy.url().should('include', '/#contact-us');
  });
  it('Verifies keyboard interaction about us sub nav interaction flow About Contact Us', () => {
    cy.findByTitle('Contact Us')
      .should('exist')
      .focus()
      .type('{enter}');
    cy.url().should('include', '/#contact-us');
  });
});
