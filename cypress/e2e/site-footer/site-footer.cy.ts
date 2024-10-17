describe('Validate footer links ', () => {
  it('Validate the FAQ link', () => {
    cy.visit('/');
    cy.findByRole('link', { name: 'FAQ' }).click();
    cy.url().should('include', '/about-us/#faq');
  });

  it('Validates Contact Us Opens correct email', () => {
    cy.visit('/');
    cy.findByRole('link', { name: 'Contact Us' }).then($link => {
      cy.log($link.prop('outerHTML'));
    });
  });

  it('Validates the About Fiscal Data link', () => {
    cy.visit('/');
    cy.findByRole('link', { name: 'About Fiscal Data' }).click();
    cy.url().should('include', '/about-us/#about-fiscal-data');
  });

  it('Validates Release Calendar link', () => {
    cy.visit('/');
    cy.findByRole('link', { name: 'Release Calendar' }).click();
    cy.url().should('include', '/release-calendar/');
  });

  it('Validates Subscribe to Our Mailing list link', () => {
    cy.visit('/');
    cy.findByRole('link', { name: 'Subscribe to Our Mailing List' }).click();
    cy.url().should('include', '/about-us/#subscribe');
  });

  it('Validates USAspending link', () => {
    cy.visit('/');
    cy.findByRole('link', { name: 'USAspending' }).then($link => {
      cy.log($link.prop('outerHTML'));
    });
  });
  it('Validates Accessibility link', () => {
    cy.visit('/');
    cy.findByRole('link', { name: 'Accessibility' }).then($link => {
      cy.log($link.prop('outerHTML'));
    });
  });
  it('Validates Privacy Policy link', () => {
    cy.visit('/');
    cy.findByRole('link', { name: 'Privacy Policy' }).then($link => {
      cy.log($link.prop('outerHTML'));
    });
  });
  it('Validates Freedom of Information Act link', () => {
    cy.visit('/');
    cy.findByRole('link', { name: 'Freedom of Information Act' }).then($link => {
      cy.log($link.prop('outerHTML'));
    });
  });
  it('Validates the logo navigate to the homepage', () => {
    cy.visit('/about-us/');
    cy.findByRole('link', { name: 'Redirect to Fiscal Data homepage' }).then($link => {
      cy.log($link.prop('outerHTML'));
    });
  });
});
