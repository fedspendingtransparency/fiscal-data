describe('Revenue Explainer Page', () => {
  const pageLoadTimeout = 15000;

  const visitRevenueExplainer = () => {
    cy.intercept('GET', '**/services/api/fiscal_service/**').as('fiscalData');
    cy.visit('/americas-finance-guide/government-revenue/');
    cy.wait('@fiscalData', { timeout: pageLoadTimeout })
      .its('response.statusCode')
      .should('be.oneOf', [200, 304]);
    cy.get('[data-testid="selectable-digits"]', { timeout: pageLoadTimeout })
      .invoke('text')
      .should('match', /\$\d/);
    cy.findByRole('link', { name: 'Overview' }).should('be.visible');
  };

  const waitForSourcesSection = () => {
    cy.contains('h2', 'Sources of Federal Revenue', { timeout: pageLoadTimeout })
      .scrollIntoView()
      .should('be.visible');
  };

  const waitForTrendsEconomySection = () => {
    cy.contains('h2', 'Federal Revenue Trends and the U.S. Economy', { timeout: pageLoadTimeout })
      .scrollIntoView()
      .should('be.visible');
  };

  beforeEach(() => {
    visitRevenueExplainer();
  });

  it('Navigate to the revenue explainer, ensure page does not contain NaN, null, or undefined values', () => {
    cy.findAllByText('null').should('not.exist');
    cy.findAllByText('NaN').should('not.exist');
    cy.findAllByText('undefined').should('not.exist');
  });

  describe('Validate that the sub nav takes the user to the correct page on the site', () => {
    it('Validate that the sub nav takes the user Overview section', () => {
      cy.findByRole('link', { name: 'Overview' }).type('{enter}');
      cy.url().should('include', 'americas-finance-guide/');
    });

    it('Validate that the sub nav takes the user Debt section', () => {
      cy.findByRole('link', { name: 'Debt' }).type('{enter}');
      cy.url().should('include', 'americas-finance-guide/national-debt');
    });

    it('Validate that the sub nav takes the user Spending section', () => {
      cy.get('span')
        .contains('Spending')
        .type('{enter}');
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
      const hyperlinks1 = [
        {
          name: 'Spending',
          url: '/americas-finance-guide/federal-spending/',
        },
        {
          name: 'Deficit',
          url: '/americas-finance-guide/national-deficit/',
        },
      ];
      hyperlinks1.forEach(link => {
        cy.findAllByRole('link', { name: link.name }, { timeout: pageLoadTimeout })
          .first()
          .click();
        cy.url().should('include', link.url);
        visitRevenueExplainer();
      });
    });

    it('Part 2: Validate all internal links on the page navigate to the correct destinations', () => {
      const hyperlinks2 = [
        {
          name: 'Monthly Treasury Statement (MTS)',
          url: '/datasets/monthly-treasury-statement/receipts-of-the-u-s-government',
        },
      ];
      hyperlinks2.forEach(link => {
        waitForSourcesSection();

        cy.findAllByRole('link', { name: link.name }, { timeout: pageLoadTimeout }).should($links => {
          const matchingHref = [...$links].some(anchor => anchor.getAttribute('href')?.replace(/\/$/, '') === link.url);
          expect(matchingHref, `${link.name} link to ${link.url}`).to.be.true;
        });

        cy.findAllByRole('link', { name: link.name }, { timeout: pageLoadTimeout }).then($links => {
          const target = [...$links].find(anchor => anchor.getAttribute('href')?.replace(/\/$/, '') === link.url);
          cy.wrap(target)
            .scrollIntoView()
            .click();
        });
        cy.url().should('include', link.url);
        visitRevenueExplainer();
      });
    });

    it('Validate all external links on the page navigate to the correct destinations ', () => {
      waitForSourcesSection();
      waitForTrendsEconomySection();

      const externalHyperlinks = [
        {
          name: 'IRS.gov',
          url: 'https://www.irs.gov/newsroom/historical-highlights-of-the-irs',
        },
        {
          name: 'Bureau of Labor Statistics',
          url: 'https://www.bls.gov/developers/',
        },
        {
          name: 'Bureau of Economic Analysis',
          url: 'https://www.bea.gov/',
        },
        {
          name: 'GPS.gov',
          url: 'https://www.gps.gov/program-funding-0',
        },
      ];

      externalHyperlinks.forEach(link => {
        cy.findAllByRole('link', { name: link.name }, { timeout: pageLoadTimeout })
          .first()
          .should('have.attr', 'href', link.url);
      });
    });

    it('Validate all external links (in accordians) on the page navigate to the correct destinations ', () => {
      waitForSourcesSection();
      cy.findByRole('button', { name: 'Why does the Federal Reserve send money to the federal government? toggle contents' })
        .first()
        .click();
      cy.findByRole('link', { name: 'Federal Reserve Act, Section 7(a)(1-3)' }, { timeout: pageLoadTimeout }).should(
        'have.attr',
        'href',
        'https://www.federalreserve.gov/aboutthefed/section7.htm'
      );

      cy.findByRole('button', { name: 'Data Sources & Methodologies toggle contents' })
        .first()
        .click();
      cy.findByRole('link', { name: 'GitHub repository' }, { timeout: pageLoadTimeout }).should(
        'have.attr',
        'href',
        'https://github.com/fedspendingtransparency/fiscal-data/tree/master/documentation'
      );
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
  });

  it('Validate all glossary terms on page', () => {
    const glossaryTerms: string[] = ['expenditures', 'fiscal year (FY)', 'excise', 'trust funds'];

    glossaryTerms.forEach(term => {
      cy.findAllByTestId('infoTipContainer')
        .contains(term)
        .should('exist');
    });

    cy.findAllByTestId('infoTipContainer')
      .contains('excise')
      .click();

    cy.findAllByTestId('popupContainer')
      .findByText('View in glossary')
      .click();
  });

  it('Validate that the related datasets section contains the correct datasets', () => {
    const relatedDs: string[] = [
      'Monthly Treasury Statement (MTS)',
      'Treasury Reporting Rates of Exchange',
      'U.S. Government Revenue Collections',
      'Financial Report of the U.S. Government',
    ];

    const foundRelatedDs = cy.findAllByTestId('cardWrapper');

    foundRelatedDs.each((ds, index) => {
      cy.wrap(ds).should('include.text', relatedDs[index]);
    });
  });
});
