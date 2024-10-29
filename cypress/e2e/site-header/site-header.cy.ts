describe('Site header validation', { retries: 2 }, () => {
  beforeEach(() => {
    cy.visit('/').wait(3000);
  });
  it('Validate Savings Bonds Topics Link and logo navigation in site header', () => {
    cy.findByLabelText('Page links for Topics')
      .trigger('mouseover')
      .wait(0);
    cy.contains('Savings Bonds')
      .click()
      .wait(0);
    cy.url().should('include', '/treasury-savings-bonds/');
  });

  it('Validate Overview Topics Link and logo navigation in site header', () => {
    cy.findByLabelText('Page links for Topics')
      .trigger('mouseover')
      .wait(0);
    cy.contains('Overview')
      .click()
      .wait(0);
    cy.url().should('include', '/americas-finance-guide/');
  });

  it('Validate Revenue Topics Link and logo navigation in site header', () => {
    cy.findByLabelText('Page links for Topics')
      .trigger('mouseover')
      .wait(0);
    cy.contains('Revenue')
      .click()
      .wait(0);
    cy.url().should('include', '/americas-finance-guide/government-revenue/');
  });

  // it('Validate Spending Topics Link and logo navigation in site header', () => {
  //   cy.findByLabelText('Page links for Topics')
  //     .trigger('mouseover')
  //     .wait(0);
  //   cy.contains('Spending')
  //     .click()
  //     .wait(0);
  //   cy.url().should('include', '/americas-finance-guide/federal-spending/');
  // });

  it('Validate Deficit Topics Link and logo navigation in site header', () => {
    cy.findByLabelText('Page links for Topics')
      .trigger('mouseover')
      .wait(0);
    cy.contains('Deficit')
      .click()
      .wait(0);
    cy.url().should('include', '/americas-finance-guide/national-deficit/');
  });

  it('Validate Debt Topics Link and logo navigation in site header', () => {
    cy.findByLabelText('Page links for Topics')
      .trigger('mouseover')
      .wait(0);
    cy.contains('Debt')
      .click()
      .wait(0);
    cy.url().should('include', '/americas-finance-guide/national-debt/');
  });

  it('Validate Tools links in site header', () => {
    cy.findByLabelText('Page links for Tools')
      .trigger('mouseover')
      .wait(0);
    cy.contains('Currency Exchange Rates Converter')
      .click()
      .wait(0);
    cy.url().should('include', '/currency-exchange-rates-converter/');
  });

  it('Validate Dataset Search link in site header', () => {
    cy.contains('Dataset Search')
      .click()
      .wait(0);
    cy.url().should('include', '/datasets/');
  });

  it('Validate glossary links in site header', () => {
    cy.findByLabelText('Page links for Resources')
      .trigger('mouseover')
      .wait(0);
    cy.contains('Glossary')
      .click()
      .wait(0);
    cy.findByText('Search the glossary').should('be.visible');
    cy.findByLabelText('Close glossary')
      .click()
      .wait(0);
  });

  it('Validate Resources links in site header', () => {
    cy.findByLabelText('Page links for Resources')
      .trigger('mouseover')
      .wait(0);
    cy.contains('API Documentation')
      .click()
      .wait(0);
    cy.url().should('include', '/api-documentation/');

    cy.findByLabelText('Fiscal Data logo - return to home page')
      .click()
      .wait(0);
    cy.findByLabelText('Page links for Resources')
      .trigger('mouseover')
      .wait(0);
    cy.contains('Release Calendar')
      .click()
      .wait(0);
    cy.url().should('include', '/release-calendar/');
  });

  it('Validate About Us link in site header', () => {
    cy.contains('About Us')
      .click()
      .wait(0);
    cy.url().should('include', '/about-us/');
  });
});
