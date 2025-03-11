describe('Revenue Explainer Page', () => {
  beforeEach(() => {
    cy.visit('/americas-finance-guide/government-revenue/');
    cy.wait(3000);
  });

  it('Navigate to the revenue explainer, ensure page does not contain NaN, null, or undefined values', () => {
    cy.findAllByText('null').should('not.exist');
    cy.findAllByText('NaN').should('not.exist');
    cy.findAllByText('undefined').should('not.exist');
  });

  describe('Validate that the sub nav takes the user to the correct page on the site', () => {
    it('Validate that the sub nav takes the user Overview section', () => {
      cy.findByRole('link', { name: 'Overview' })
        .type('{enter}')
        .wait(2000);
      cy.url().should('include', 'americas-finance-guide/');
    });

    it('Validate that the sub nav takes the user Debt section', () => {
      cy.findByRole('link', { name: 'Debt' })
        .type('{enter}')
        .wait(2000);
      cy.url().should('include', 'americas-finance-guide/national-debt');
    });

    it('Validate that the sub nav takes the user Spending section', () => {
      cy.get('span')
        .contains('Spending')
        .type('{enter}')
        .wait(2000);
      cy.url().should('include', 'americas-finance-guide/federal-spending');
    });

    it('Validate that the sub nav takes the user Deficit section', () => {
      cy.get('span')
        .contains('Deficit')
        .type('{enter}')
        .wait(2000);
      cy.url().should('include', 'americas-finance-guide/national-deficit');
    });
  });

  describe('Validate all links on page', () => {
    it('Part 1: Validate all internal links on the page navigate to the correct destinations ', () => {
      const hyperlinks1: object[] = [
        {
          name: 'spending',
          url: '/americas-finance-guide/federal-spending/',
        },
        {
          name: 'deficit',
          url: '/americas-finance-guide/national-deficit/',
        },
      ];
      hyperlinks1.forEach(link => {
        cy.findAllByRole('link', { name: link.name })
          .first()
          .click()
          .wait(2000);
        cy.url().should('include', link.url);
        cy.visit('/americas-finance-guide/government-revenue/');
      });
    });

    it('Part 2: Validate all internal links on the page navigate to the correct destinations', () => {
      const hyperlinks2: object[] = [
        {
          name: 'Monthly Treasury Statement (MTS)',
          url: '/datasets/monthly-treasury-statement/receipts-of-the-u-s-government',
        },
      ];
      hyperlinks2.forEach(link => {
        cy.findAllByRole('link', { name: link.name })
          .first()
          .click()
          .wait(2000);
        cy.url().should('include', link.url);
        cy.visit('/americas-finance-guide/government-revenue/');
      });
    });

    it('Validate all external links on the page navigate to the correct destinations ', () => {
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
          url: 'https://www.gps.gov/policy/funding/',
        },
      ];

      externalHyperlinks.forEach(link => {
        cy.findByRole('link', { name: link.name }).should('have.attr', 'href', link.url);
      });
    });
  });

  // Create test opens up the accordians to test the two links below (they are in separate accordians)

  // id= accordian-false-source-rev     (data-testid = heading, role = button)
  // name: 'Federal Reserve Act, Section 7(a)(1-3)',
  // url: 'https://www.federalreserve.gov/aboutthefed/section7.htm',

  // id= accordian-false-DSM       (data-testid = heading, role = button)
  // name: 'GitHub repository',
  // url: 'https://github.com/fedspendingtransparency/fiscal-data/tree/master/documentation',

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

    const foundTerms = cy.findAllByTestId('infoTipContainer');

    foundTerms.each((term, index) => {
      cy.wrap(term).should('include.text', glossaryTerms[index]);
    });

    foundTerms.contains('excise').click();

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
