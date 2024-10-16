describe('Validate footer links ', () => {
  it('Validate the FAQ link', () => {
    cy.visit('/');
    cy.contains('FAQ').click();
    cy.url().should('include', '/about-us/#faq');
  });

  it('Validates Contact Us Opens correct email', () => {
    cy.visit('/');
    cy.contains('Contact Us')
      .click()
      .should('have.attr', 'href', 'mailto:fiscaldata@fiscal.treasury.gov?subject=Contact Us');
  });

  it('Validates the About Fiscal Data link', () => {
    cy.visit('/');
    cy.contains('About Fiscal Data').click();
    cy.url().should('include', '/about-us/#about-fiscal-data');
  });

  it('Validates Release Calendar link', () => {
    cy.visit('/');
    cy.contains('Release Calendar').click();
    cy.url().should('include', '/release-calendar/');
  });

  it('Validates Subscribe to Our Mailing list link', () => {
    cy.visit('/');
    cy.contains('Subscribe to Our Mailing List').click();
    cy.url().should('include', '/about-us/#subscribe');
  });

  it('Validates USAspending link', () => {
    cy.visit('/');
    cy.contains('USAspending')
      .click()
      .should('include', 'https://www.usaspending.gov/');
  });
});
