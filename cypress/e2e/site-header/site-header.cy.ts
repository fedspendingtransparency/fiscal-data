const pageLoadTimeout = 15000;

const visitSiteHeader = () => {
  cy.intercept('GET', '**/services/api/fiscal_service/**').as('fiscalData');
  cy.visit('/');
  cy.wait('@fiscalData', { timeout: pageLoadTimeout })
    .its('response.statusCode')
    .should('be.oneOf', [200, 304]);
};

describe('Site header - Topics navigation', () => {
  beforeEach(() => {
    visitSiteHeader();
  });

  it('navigates to Savings Bonds', () => {
    visitSiteHeader();
    cy.findByLabelText('Page links for Topics').trigger('mouseover');
    cy.get('a[href*="/treasury-savings-bonds/"]')
      .should('be.visible')
      .click({ force: true });
    cy.url().should('include', '/treasury-savings-bonds/');
  });

  it('navigates to Revenue', () => {
    visitSiteHeader();
    cy.findByLabelText('Page links for Topics').trigger('mouseover');
    cy.get('a[href*="/americas-finance-guide/government-revenue/"]')
      .should('be.visible')
      .click({ force: true });
    cy.url().should('include', '/americas-finance-guide/government-revenue/');
  });

  it('navigates to Spending', () => {
    visitSiteHeader();
    cy.findByLabelText('Page links for Topics').trigger('mouseover');
    cy.get('a[href*="/americas-finance-guide/federal-spending/"]')
      .should('be.visible')
      .click({ force: true });
    cy.url().should('include', '/americas-finance-guide/federal-spending/');
  });

  it('navigates to Deficit', () => {
    visitSiteHeader();
    cy.findByLabelText('Page links for Topics').trigger('mouseover');
    cy.get('a[href*="/americas-finance-guide/national-deficit/"]')
      .should('be.visible')
      .click({ force: true });
    cy.url().should('include', '/americas-finance-guide/national-deficit/');
  });

  it('navigates to Debt', () => {
    visitSiteHeader();
    cy.findByLabelText('Page links for Topics').trigger('mouseover');
    cy.get('a[href*="/americas-finance-guide/national-debt/"]')
      .should('be.visible')
      .click({ force: true });
    cy.url().should('include', '/americas-finance-guide/national-debt/');
  });
});

// TODO: The test suite below is a more ideal solution, but I CANNOT figure out a way to make a non-flakey
//  Cypress test that tests for this many things in one test.

// describe('Site header - Topics navigation', () => {
//   const topicLinks = [
//     { name: 'Savings Bonds', url: '/treasury-savings-bonds/' },
//     { name: 'Revenue', url: '/americas-finance-guide/government-revenue/' },
//     { name: 'Spending', url: '/americas-finance-guide/federal-spending/' },
//     { name: 'Deficit', url: '/americas-finance-guide/national-deficit/' },
//     { name: 'Debt', url: '/americas-finance-guide/national-debt/' },
//   ];
//
//   topicLinks.forEach(({ name, url }) => {
//     it(`navigates to ${name}`, () => {
//       visitSiteHeader();
//       cy.findByLabelText('Page links for Topics').trigger('mouseover');
//       cy.get('a[href*="' + url + '"]')
//         .should('be.visible')
//         .click({ force: true });
//       cy.url().should('include', url);
//     });
//   });
// });

describe('Site header validation', () => {
  beforeEach(() => {
    visitSiteHeader();
  });

  it('Validate Tools links in site header', () => {
    cy.findByLabelText('Page links for Tools').trigger('mouseover');
    cy.contains('Currency Exchange Rates Converter').click();
    cy.url().should('include', '/currency-exchange-rates-converter/');
  });

  it('Validate Dataset Search link in site header', () => {
    cy.contains('Dataset Search').click();
    cy.url().should('include', '/datasets/');
  });

  it('Validate Resources links in site header', () => {
    cy.findByLabelText('Page links for Resources').trigger('mouseover');
    cy.contains('Glossary').click();
    cy.findByText('Search the glossary').should('be.visible');
    cy.findByLabelText('Close glossary').click();

    cy.findByLabelText('Page links for Resources').trigger('mouseover');
    cy.contains('API Documentation').click();
    cy.url().should('include', '/api-documentation/');
  });

  it('Validates other resource link in site header', () => {
    cy.findByLabelText('Page links for Resources').trigger('mouseover');
    cy.get('[data-testid="pageLinks"]')
      .contains('Release Calendar')
      .click();
    cy.url().should('include', '/release-calendar/');
  });

  it('Validate About Us link in site header', () => {
    cy.contains('About Us').click();
    cy.url().should('include', '/about-us/');
  });
});
