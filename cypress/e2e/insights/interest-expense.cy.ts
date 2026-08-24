describe('SLGS Insights Page', () => {
  const pageLoadTimeout = 15000;

  const visitInterestExpenseInsightPage = () => {
    cy.intercept('GET', '**/services/api/fiscal_service/**').as('fiscalData');
    cy.visit('/interest-expense-avg-interest-rates/');
    cy.wait('@fiscalData', { timeout: pageLoadTimeout })
      .its('response.statusCode')
      .should('be.oneOf', [200, 304]);
  };

  beforeEach(() => {
    visitInterestExpenseInsightPage();
  });

  it('Validate all glossary terms on page', () => {
    const glossaryTerms: string[] = [
      'Interest Expense',
      'Treasury securities',
      'federal debt',
      'interest rates',
    ];

    glossaryTerms.forEach(term => {
      cy.findAllByTestId('infoTipContainer')
        .contains(term)
        .should('exist');
    });
  });

  describe('Validate all links on page', () => {
    it('Part 1: Validate all internal links under Explore More on the page navigate to the correct destinations ', () => {
      const hyperlinks1: object[] = [
        {
          name: 'Federal Spending | U.S. Treasury Fiscal Data',
          url: '/americas-finance-guide/federal-spending/',
        },
        {
          name: 'Understanding the National Debt | U.S. Treasury Fiscal Data',
          url: '/americas-finance-guide/national-debt/',
        },
      ];
      hyperlinks1.forEach(link => {
        cy.findAllByRole('link', { name: link.name }, { timeout: pageLoadTimeout })
          .first()
          .click();
        cy.url().should('include', link.url);
        visitInterestExpenseInsightPage();
      });
    });
  });

  it('Part 2: Validate all internal links under Discover Datasets on the page navigate to the correct destinations ', () => {
    const hyperlinks1: object[] = [
      {
        name: 'Interest Expense on the Debt Outstanding | U.S. Treasury Fiscal Data',
        url: '/datasets/interest-expense-debt-outstanding/interest-expense-on-the-public-debt-outstanding/',
      },
      {
        name: 'Average Interest Rates on U.S. Treasury Securities | U.S. Treasury Fiscal Data',
        url: '/datasets/average-interest-rates-treasury-securities/average-interest-rates-on-u-s-treasury-securities/',
      },
      {
        name: 'Monthly Treasury Statement (MTS) | U.S. Treasury Fiscal Data',
        url: 'datasets/monthly-treasury-statement/summary-of-receipts-by-source-and-outlays-by-function-of-the-u-s-government/',
      },
      {
        name: 'Monthly Statement of the Public Debt (MSPD) | U.S. Treasury Fiscal Data',
        url: '/datasets/monthly-statement-public-debt/summary-of-treasury-securities-outstanding/',
      },
    ];
    hyperlinks1.forEach(link => {
      cy.findAllByRole('link', { name: link.name }, { timeout: pageLoadTimeout })
        .first()
        .click();
      cy.url().should('include', link.url);
      visitInterestExpenseInsightPage();
    });
  });

  it('Part 3: Validate all links under Data Sources navigate to the correct destinations ', () => {
    cy.contains('Data Sources and Methodologies', { timeout: pageLoadTimeout })
      .parent()
      .within(() => {
        cy.findByRole('link', { name: 'Interest Expense on the Debt Outstanding' }, { timeout: pageLoadTimeout })
          .should('have.attr', 'href', '/datasets/interest-expense-debt-outstanding/interest-expense-on-the-public-debt-outstanding/');
        cy.findByRole('link', { name: 'Average Interest Rates on U.S. Treasury Securities' }, { timeout: pageLoadTimeout })
          .should(
          'have.attr',
          'href',
          '/datasets/average-interest-rates-treasury-securities/average-interest-rates-on-u-s-treasury-securities/'
      );
      });
  });

  it('Part 4: Validate paragraph link navigates to the correct destinations', () => {
    cy.contains('Interest Expense is the interest the government pays', { timeout: pageLoadTimeout })
      .parent()
      .findByRole('link', { name: 'Average Interest Rates on U.S. Treasury Securities' }, { timeout: pageLoadTimeout }).should(
      'have.attr',
      'href',
      '/datasets/average-interest-rates-treasury-securities/average-interest-rates-on-u-s-treasury-securities/'
    );
  });

  describe('Validate charts', () => {
    it('Finishes loading and exits its animation', () => {
      cy.get('[role="figure"]').each(chart => {
        cy.wrap(chart)
          .scrollIntoView({ duration: 2000 })
          .find('.recharts-wrapper', { timeout: pageLoadTimeout })
          .should('be.visible');
      });
    });
  });
});
