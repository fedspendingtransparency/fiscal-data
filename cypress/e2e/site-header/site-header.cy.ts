describe('Site header validation', () => {
  it('Validate Topics Links and logo navigation in site header', () => {
    cy.visit('/').wait(1000);

    cy.findByLabelText('Page links for Topics').trigger('mouseover');
    cy.contains('Savings Bonds').click();
    cy.url().should('include', '/treasury-savings-bonds/');

    cy.findByLabelText('Fiscal Data logo - return to home page').click();
    cy.findByLabelText('Page links for Topics').trigger('mouseover');
    cy.contains('Overview').click();
    cy.url().should('include', '/americas-finance-guide/');

    cy.findByLabelText('Fiscal Data logo - return to home page').click();
    cy.findByLabelText('Page links for Topics').trigger('mouseover');
    cy.contains('Revenue').click();
    cy.url().should('include', '/americas-finance-guide/government-revenue/');

    cy.findByLabelText('Fiscal Data logo - return to home page').click();
    cy.findByLabelText('Page links for Topics').trigger('mouseover');
    cy.contains('Spending').click();
    cy.url().should('include', '/americas-finance-guide/federal-spending/');

    cy.findByLabelText('Fiscal Data logo - return to home page').click();
    cy.findByLabelText('Page links for Topics').trigger('mouseover');
    cy.contains('Deficit').click();
    cy.url().should('include', '/americas-finance-guide/national-deficit/');

    cy.findByLabelText('Fiscal Data logo - return to home page').click();
    cy.findByLabelText('Page links for Topics').trigger('mouseover');
    cy.contains('Debt').click();
    cy.url().should('include', '/americas-finance-guide/national-debt/');
  });

  it('Validate Tools links in site header', () => {
    cy.visit('/');
    cy.findByLabelText('Page links for Tools').trigger('mouseover');
    cy.contains('Currency Exchange Rates Converter').click();
    cy.url().should('include', '/currency-exchange-rates-converter/');
  });

  it('Validate Dataset Search link in site header', () => {
    cy.visit('/');
    cy.contains('Dataset Search').click();
    cy.url().should('include', '/datasets/');
  });

  it('Validate Resources links in site header', () => {
    cy.visit('/').wait(1000);
    cy.findByLabelText('Page links for Resources').trigger('mouseover');
    cy.contains('Glossary').click();
    cy.findByText('Search the glossary').should('be.visible');
    cy.findByLabelText('Close glossary').click();

    cy.findByLabelText('Page links for Resources').trigger('mouseover');
    cy.contains('API Documentation').click();
    cy.url().should('include', '/api-documentation/');

    cy.findByLabelText('Fiscal Data logo - return to home page').click();
    cy.findByLabelText('Page links for Resources').trigger('mouseover');
    cy.contains('Release Calendar').click();
    cy.url().should('include', '/release-calendar/');
  });

  it('Validate About Us link in site header', () => {
    cy.visit('/');
    cy.contains('About Us').click();
    cy.url().should('include', '/about-us/');
  });
});
