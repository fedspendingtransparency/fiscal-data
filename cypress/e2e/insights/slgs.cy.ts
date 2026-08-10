describe('SLGS Insights Page', () => {
  const pageLoadTimeout = 15000;

  const visitSlgsInsightPage = () => {
    cy.intercept('GET', '**/services/api/fiscal_service/**').as('fiscalData');
    cy.visit('/state-and-local-government-series/');
    cy.wait('@fiscalData', { timeout: pageLoadTimeout })
      .its('response.statusCode')
      .should('be.oneOf', [200, 304]);
  };

  const waitForExploreMoreSection = () => {
    cy.contains('h2', 'Explore More', { timeout: pageLoadTimeout })
      .scrollIntoView()
      .should('be.visible');
  };

  const waitForDiscoverDatasetsSection = () => {
    cy.contains('h2', 'Discover Datasets', { timeout: pageLoadTimeout })
      .scrollIntoView()
      .should('be.visible');
  };

  const waitForDataSourcesSection = () => {
    cy.contains('h2', 'Data Sources and Methodologies', { timeout: pageLoadTimeout })
      .scrollIntoView()
      .should('be.visible');
  };

  beforeEach(() => {
    visitSlgsInsightPage();
  });

  it('Validate all glossary terms on page', () => {
    const glossaryTerms: string[] = [
      'State and Local Government Series (SLGS)',
      'non-marketable securities',
      'federal debt',
      'treasury securities',
      'total public debt outstanding',
    ];

    glossaryTerms.forEach(term => {
      cy.findAllByTestId('infoTipContainer')
        .contains(term)
        .should('exist');
    });
  });

  describe('Validate all links on page', () => {
    it('Part 1: Validate all internal links under Explore More on the page navigate to the correct destinations ', () => {
      waitForExploreMoreSection();
      const hyperlinks1: object[] = [
        {
          name: 'Understanding the National Debt | U.S. Treasury Fiscal Data',
          url: '/americas-finance-guide/national-debt/',
        },
        {
          name: 'Treasury Savings Bonds Explained | U.S. Treasury Fiscal Data',
          url: '/treasury-savings-bonds/',
        },
      ];
      hyperlinks1.forEach(link => {
        cy.findAllByRole('link', { name: link.name }, { timeout: pageLoadTimeout })
          .first()
          .click();
        cy.url().should('include', link.url);
        visitSlgsInsightPage();
      });
    });
  });

  it('Part 2: Validate all internal links under Discover Datasets on the page navigate to the correct destinations ', () => {
    waitForDiscoverDatasetsSection();
    const hyperlinks1: object[] = [
      {
        name: 'State and Local Government Series Securities (Non-Marketable) | U.S. Treasury Fiscal Data',
        url: '/datasets/slgs-securities/state-and-local-government-series-securities-non-marketable',
      },
      {
        name: 'SLGS Daily Rate Table | U.S. Treasury Fiscal Data',
        url: '/datasets/slgs-daily-rate-table/demand-deposit-rate',
      },
      {
        name: 'Debt to the Penny | U.S. Treasury Fiscal Data',
        url: '/datasets/debt-to-the-penny/debt-to-the-penny',
      },
      {
        name: 'Monthly Statement of the Public Debt (MSPD) | U.S. Treasury Fiscal Data',
        url: '/datasets/monthly-statement-public-debt/detail-of-treasury-securities-outstanding',
      },
    ];
    hyperlinks1.forEach(link => {
      cy.findAllByRole('link', { name: link.name }, { timeout: pageLoadTimeout })
        .first()
        .click();
      cy.url().should('include', link.url);
      visitSlgsInsightPage();
    });
  });

  it('Part 3: Validate all links under Data Sources navigate to the correct destinations ', () => {
    waitForDataSourcesSection();
    cy.findByRole('link', { name: 'State and Local Government Series Securities (Non-Marketable)' }, { timeout: pageLoadTimeout }).should(
      'have.attr',
      'href',
      '/datasets/slgs-securities/state-and-local-government-series-securities-non-marketable/'
    );
    cy.findByRole('link', { name: 'Debt to the Penny' }, { timeout: pageLoadTimeout }).should(
      'have.attr',
      'href',
      '/datasets/debt-to-the-penny/debt-to-the-penny/'
    );
  });

  describe('Validate charts', () => {
    it('Finishes loading and exits its animation', () => {
      cy.get('[role="figure"]').each(chart => {
        cy.wrap(chart)
          .scrollIntoView({ duration: 2000 })
          .findAllByText('Loading...')
          .should('not.exist');
      });
    });
  });
});
