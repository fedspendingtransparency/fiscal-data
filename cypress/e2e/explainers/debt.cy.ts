describe('Debt Explainer Page', () => {
  const pageLoadTimeout = 15000;

  const visitDebtExplainer = () => {
    cy.intercept('GET', '**/services/api/fiscal_service/**').as('fiscalData');
    cy.visit('/americas-finance-guide/national-debt/');
    cy.wait('@fiscalData', { timeout: pageLoadTimeout })
      .its('response.statusCode')
      .should('be.oneOf', [200, 304]);
    cy.get('[data-testid="selectable-digits"]', { timeout: pageLoadTimeout })
      .invoke('text')
      .should('match', /\$\d/);
  };

  const waitForDiveDeeperSection = () => {
    cy.contains('h2', 'Dive Deeper into the Debt', { timeout: pageLoadTimeout })
      .scrollIntoView()
      .should('be.visible');
  };

  beforeEach(() => {
    visitDebtExplainer();
  });

  it('Navigate to the debt explainer, ensure page does not contain NaN, null, or undefined values', () => {
    cy.findAllByText('null').should('not.exist');
    cy.findAllByText('NaN').should('not.exist');
    cy.findAllByText('undefined').should('not.exist');
  });

  describe('Validate that the sub nav takes the user to the correct section on the page', () => {
    it('Validate that the sub nav takes the user Overview section', () => {
      cy.findByRole('link', { name: 'Overview' }).type('{enter}');
      cy.url().should('include', 'americas-finance-guide/');
    });

    it('Validate that the sub nav takes the user Revenue section', () => {
      cy.findByRole('link', { name: 'Revenue' }).type('{enter}');
      cy.url().should('include', 'americas-finance-guide/government-revenue');
    });

    it('Validate that the sub nav takes the user Spending section', () => {
      cy.findByRole('link', { name: 'Spending' }).type('{enter}');
      cy.url().should('include', 'americas-finance-guide/federal-spending');
    });

    it('Validate that the sub nav takes the user Deficit section', () => {
      cy.get('span')
        .contains('Deficit')
        .type('{enter}');
      cy.url().should('include', 'americas-finance-guide/national-deficit');
    });
  });

  describe('Validate all links on page', () => {
    it('Part 1: Validate all internal links on the page navigate to the correct destinations ', () => {
      const hyperlinks1: object[] = [
        {
          name: 'deficit',
          url: '/americas-finance-guide/national-deficit/',
        },
        {
          name: 'federal revenues',
          url: '/americas-finance-guide/government-revenue/',
        },
        {
          name: 'spending',
          url: '/americas-finance-guide/federal-spending/',
        },
        {
          name: 'Historical Debt Outstanding',
          url: '/datasets/historical-debt-outstanding/historical-debt-outstanding',
        },
      ];
      hyperlinks1.forEach(link => {
        cy.findAllByRole('link', { name: link.name }, { timeout: pageLoadTimeout })
          .first()
          .click();
        cy.url().should('include', link.url);
        visitDebtExplainer();
      });
    });

    it('Part 2: Validate all internal links on the page navigate to the correct destinations', () => {
      const hyperlinks2: object[] = [
        {
          name: 'U.S. Treasury Monthly Statement of the Public Debt (MSPD)',
          url: '/datasets/monthly-statement-public-debt/summary-of-treasury-securities-outstanding',
        },
        {
          name: 'Average Interest Rates on U.S. Treasury Securities',
          url: '/datasets/average-interest-rates-treasury-securities/average-interest-rates-on-u-s-treasury-securities',
        },
      ];
      hyperlinks2.forEach(link => {
        cy.findAllByRole('link', { name: link.name }, { timeout: pageLoadTimeout })
          .first()
          .click();
        cy.url().should('include', link.url);
        visitDebtExplainer();
      });
    });

    it('Validate all external links on the page navigate to the correct destinations ', () => {
      waitForDiveDeeperSection();

      const externalHyperlinks: object[] = [
        {
          name: 'Bureau of Labor Statistics',
          url: 'https://www.bls.gov/developers/',
        },
        {
          name: 'Bureau of Economic Analysis',
          url: 'https://www.bea.gov/',
        },
        {
          name: 'Bureau of the Fiscal Service',
          url: 'https://www.fiscal.treasury.gov/',
        },
        {
          name: 'https://www.gao.gov/americas-fiscal-future',
          url: 'https://www.gao.gov/americas-fiscal-future',
        },
        {
          name: 'https://www.cbo.gov/publication/56910',
          url: 'https://www.cbo.gov/publication/56910',
        },
        {
          name: 'https://www.federalreserve.gov/faqs/money_12853.htm',
          url: 'https://www.federalreserve.gov/faqs/money_12853.htm',
        },
        {
          name: 'https://www.cbo.gov/publication/56783',
          url: 'https://www.cbo.gov/publication/56783',
        },
        {
          name: 'https://fiscal.treasury.gov/reports-statements/treasury-bulletin/',
          url: 'https://fiscal.treasury.gov/reports-statements/treasury-bulletin/',
        },
        {
          name: 'https://www.usaspending.gov',
          url: 'https://www.usaspending.gov',
        },
      ];

      externalHyperlinks.forEach(link => {
        cy.findAllByRole('link', { name: link.name }, { timeout: pageLoadTimeout })
          .first()
          .should('have.attr', 'href', link.url);
      });
    });

    it('Validate PDF links on the page point to the correct files', () => {
      waitForDiveDeeperSection();

      cy.findAllByRole('link', { name: /FRUSG_2024\.pdf/ }, { timeout: pageLoadTimeout })
        .first()
        .should('have.attr', 'href')
        .and('include', 'FRUSG_2024.pdf');
    });
  });

  describe('Validate charts', () => {
    it('Load properly with no null or empty values', () => {
      cy.get('[role="figure"]').each(chart => {
        cy.wrap(chart)
          .scrollIntoView({ duration: 2000 })
          .findAllByText('null')
          .should('not.exist')
          .findAllByText('NaN')
          .should('not.exist')
          .findAllByText('undefined')
          .should('not.exist');
      });
    });

    // it('Toggle-able views render properly on charts that have them', () => {
    //
    // });
    //
    // it('Test keyboard accessibility on charts that have it', () => {
    //
    // });
  });

  it('Validate all glossary terms on page', () => {
    const glossaryTerms: string[] = [
      'non-marketable',
      'marketable',
      'fiscal year (FY)',
      'spending',
      'revenue',
      'deficit',
      'bonds',
      'bills',
      'notes',
      'floating rate notes',
      'Treasury inflation-protected securities (TIPS)',
      'gross domestic product (GDP)',
      'debt held by the public',
      'intragovernmental',
      'calendar year',
      'interest rates',
    ];

    glossaryTerms.forEach(term => {
      cy.findAllByTestId('infoTipContainer')
        .contains(term)
        .should('exist');
    });

    cy.findAllByTestId('infoTipContainer')
      .contains('bills')
      .click();
    cy.findAllByTestId('popupContainer')
      .findByText('View in glossary')
      .click();
  });

  it('Validate that the related datasets section contains the correct datasets', () => {
    const relatedDs: string[] = [
      'Debt to the Penny',
      'Historical Debt Outstanding',
      'U.S. Treasury Monthly Statement of the Public Debt (MSPD)',
      'Average Interest Rates on U.S. Treasury Securities',
    ];

    const foundRelatedDs = cy.findAllByTestId('cardWrapper');

    foundRelatedDs.each((ds, index) => {
      cy.wrap(ds).should('include.text', relatedDs[index]);
    });
  });
});
