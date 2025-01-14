describe('Currency exchange rates interaction flow', () => {
  beforeEach(() => {
    cy.visit('/currency-exchange-rates-converter/').wait(3000);
  });

  it('Validates currency exchange rates url goes to the correct page', () => {
    cy.findByTitle('Currency Exchange Rates Converter').click();
    cy.url().should('include', '/currency-exchange-rates-converter/');
  });

  it('Validates foreign currency loads on Euro Zone-Euro', () => {
    cy.findAllByText('Euro Zone-Euro').should('exist');
  });
  it('Validates published date info tip', () => {
    cy.findByLabelText('More information about Published Date.').focus();
    cy.findAllByText('Treasury Reporting Rates of Exchange').click();
    cy.url().should('include', '/treasury-reporting-rates-of-exchange');
  });
  it('Validates country currency info tip', () => {
    cy.findByLabelText('More information about Country-Currency.').click();
    cy.findAllByText(
      'Currencies listed in grey do not have available data for the date range selected. Please ensure that the desired currency does not appear by another name, or change the date selected for available results.'
    ).should('exist');
  });
  it('Validates published date dropdown selector', () => {
    cy.findAllByTitle('December 31, 2024').click({ force: true });
    cy.findByText('March 31, 2024').click();
    cy.findByTitle('March 31, 2024').should('exist');
  });
});

describe('Currency exchange rates with different published date', () => {
  beforeEach(() => {
    cy.visit('/currency-exchange-rates-converter/').wait(3000);
    cy.findAllByTitle('December 31, 2024').click({ force: true });
    cy.findByText('March 31, 2024').click();
    cy.findByTitle('March 31, 2024').should('exist');
  });

  it('Validates country currency is grayed out', () => {
    cy.findByTitle('Euro Zone-Euro').click();
    cy.findAllByLabelText('Belarus-New Ruble').should('exist');
  });
  it('Validates country currency search flow and currency change', () => {
    cy.findByTitle('Euro Zone-Euro').click();
    cy.findAllByLabelText('Search currencies')
      .eq(1)
      .type('albania');
    cy.findAllByLabelText('Albania-Lek').click();
    cy.findByText('Albania-Lek').should('exist');
    cy.findByText('1.00 U.S. Dollar = 94.92 Albania-Lek').should('be.visible');
    cy.findAllByLabelText('Enter Albania-Lek Amount')
      .clear()
      .type(' 12350');
    cy.findByDisplayValue('130.11').should('exist');
    cy.findAllByLabelText('Enter Albania-Lek Amount')
      .clear()
      .type(' 303.50');
    cy.findByDisplayValue('3.20').should('exist');
    cy.findAllByLabelText('Enter U.S. Dollar Amount')
      .clear()
      .type('2511');
    cy.findByDisplayValue('238344.12').should('exist');
    cy.findAllByLabelText('Enter U.S. Dollar Amount')
      .clear()
      .type('989.25');
    cy.findByDisplayValue('93899.61').should('exist');
  });
  it('Validates letters dont generate values', () => {
    cy.findByTitle('Euro Zone-Euro').click();
    cy.findAllByLabelText('Search currencies')
      .eq(1)
      .type('albania');
    cy.findAllByLabelText('Albania-Lek').click();
    cy.findAllByLabelText('Enter U.S. Dollar Amount')
      .clear()
      .type('aaaz');
    cy.findAllByLabelText('Enter Albania-Lek Amount').should('be.empty');
  });
});

describe('Currency exchange rates with different published date', () => {
  beforeEach(() => {
    cy.visit('/currency-exchange-rates-converter/').wait(3000);
    cy.findAllByTitle('December 31, 2024').click({ force: true });
    cy.findByText('September 30, 2024').click();
    cy.findByTitle('September 30, 2024').should('exist');
  });

  it('Validates country currency search flow and currency change', () => {
    cy.findByTitle('Euro Zone-Euro').click();
    cy.findAllByLabelText('Search currencies')
      .eq(1)
      .type('Zimbabwe');
    cy.findAllByLabelText('Zimbabwe-Gold').click();
    cy.findByText('Zimbabwe-Gold').should('exist');
    cy.findAllByTitle('September 30, 2024').click({ force: true });
    cy.findByText('June 30, 2023').click();
    cy.findAllByText('--').should('exist');
    cy.findByText('No exchange rate available for this date range.').should('exist');
  });
});
