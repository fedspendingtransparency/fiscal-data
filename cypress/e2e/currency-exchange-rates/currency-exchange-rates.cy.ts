const getLastCompletedYear = () => {
  return new Date().getFullYear() - 1;
};

const pageLoadTimeout = 15000;

const visitCurrencyExchangeRatePage = () => {
  cy.intercept('GET', '**/services/api/fiscal_service/**').as('fiscalData');
  cy.visit('/currency-exchange-rates-converter/');
  cy.wait('@fiscalData', { timeout: pageLoadTimeout })
    .its('response.statusCode')
    .should('be.oneOf', [200, 304]);
  cy.findAllByText('Published Date', { timeout: pageLoadTimeout })
    .should('exist')
    .should('be.visible');
};

const datasetPagePath = '/datasets/treasury-reporting-rates-exchange/treasury-reporting-rates-of-exchange';

const relatedResourceLinks = [
  {
    text: 'Report of Foreign Bank and Financial Accounts (FBAR) | IRS.gov',
    url: 'https://www.irs.gov/businesses/small-businesses-self-employed/report-of-foreign-bank-and-financial-accounts-fbar',
  },
  {
    text: 'About Form 8938, Statement of Specified Foreign Financial Assets | IRS.gov',
    url: 'https://www.irs.gov/forms-pubs/about-form-8938',
  },
  {
    text: 'Foreign currency and currency exchange rates | IRS.gov',
    url: 'https://www.irs.gov/individuals/international-taxpayers/foreign-currency-and-currency-exchange-rates',
  },
  {
    text: 'Yearly Average Currency Exchange Rates | IRS.gov',
    url: 'https://www.irs.gov/individuals/international-taxpayers/yearly-average-currency-exchange-rates',
  },
  {
    text: 'U.S. citizens and residents abroad filing requirements | IRS.gov',
    url: 'https://www.irs.gov/individuals/international-taxpayers/us-citizens-and-residents-abroad-filing-requirements',
  },
];

describe('Currency exchange rates page links', () => {
  beforeEach(() => {
    visitCurrencyExchangeRatePage();
  });

  it('Validates the Related Resources links', () => {
    relatedResourceLinks.forEach(({ text, url }) => {
      cy.contains('a', text)
        .should('be.visible')
        .and('have.attr', 'href', url)
        .and('have.attr', 'target', '_blank');
    });
  });

  it('Validates the Treasury Financial Manual link in the legal disclaimer', () => {
    cy.contains('a', 'Treasury Financial Manual, volume 1, part 2, section 3235')
      .should('be.visible')
      .and('have.attr', 'target', '_blank')
      .invoke('attr', 'href')
      .should('include', 'tfx.treasury.gov/tfm/volume1/part2/chapter-3200-foreign-currency-accounting-and-reporting');
  });

  it('Validates the Data Source dataset link navigates to the dataset page', () => {
    cy.contains('h2', 'Data Source')
      .parent()
      .within(() => {
        cy.contains('a', 'Treasury Reporting Rates of Exchange')
          .invoke('attr', 'href')
          .should('include', datasetPagePath);
        cy.contains('a', 'Treasury Reporting Rates of Exchange').click();
      });
    cy.url().should('include', datasetPagePath);
  });

  it('Validates the dataset link inside the "How is this converter different" accordion', () => {
    const accordionTitle = 'How is this foreign currency converter different from others?';
    cy.contains(accordionTitle).click();
    cy.contains('[data-testid="section"]', accordionTitle).within(() => {
      cy.contains('a', 'Treasury Reporting Rates of Exchange')
        .should('be.visible')
        .invoke('attr', 'href')
        .should('include', datasetPagePath);
    });
  });

  it('Validates the IRS link inside the "IRS tax forms" accordion', () => {
    const accordionTitle = 'Can I use these exchange rates for my IRS tax forms?';
    cy.contains(accordionTitle).click();
    cy.contains('[data-testid="section"]', accordionTitle).within(() => {
      cy.contains('a', 'Let us help you | IRS.gov')
        .should('be.visible')
        .and('have.attr', 'href', 'https://www.irs.gov/help/let-us-help-you')
        .and('have.attr', 'target', '_blank');
    });
  });
});

describe('Currency exchange rates interaction flow', () => {
  beforeEach(() => {
    visitCurrencyExchangeRatePage();
  });

  it('Validates foreign currency loads on Euro Zone-Euro', () => {
    cy.findAllByText('Euro Zone-Euro').should('exist');
  });
  it('Validates published date info tip', () => {
    cy.findByLabelText('More information about Published Date.')
      .first()
      .click({ force: true });
    cy.findByTestId('popupContainer').should('be.visible');
  });
  it('Validates country currency info tip', () => {
    cy.findByLabelText('More information about Country-Currency.')
      .first()
      .click({ force: true });
    cy.findByTestId('popupContainer').should('be.visible');
  });

  it('Validates published date dropdown selector', () => {
    cy.findAllByTitle(`December 31, ${getLastCompletedYear()}`).click({ force: true });
    cy.findByText('March 31, 2024').click();
    cy.findByTitle('March 31, 2024').should('exist');
  });
});

describe('Currency exchange rates with different published date', () => {
  beforeEach(() => {
    visitCurrencyExchangeRatePage();
    cy.findAllByTitle(`December 31, ${getLastCompletedYear()}`).click({ force: true });
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
    visitCurrencyExchangeRatePage();
    cy.findAllByTitle(`December 31, ${getLastCompletedYear()}`).click({ force: true });
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
