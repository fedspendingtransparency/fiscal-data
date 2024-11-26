describe('Deficit Explainer Page', () => {
  beforeEach(() => {
    cy.visit('/americas-finance-guide/national-deficit/');
  });

  it('Navigate to the deficit explainer, ensure page does not contain NaN, null, or undefined values', () => {
    cy.findAllByText('null').should('not.exist');
    cy.findAllByText('NaN').should('not.exist');
    cy.findAllByText('undefined').should('not.exist');

    // also an option to get everything in the body
    // cy.get('body').then(body => {
    //   cy.contains('null').should('not.exist');
    //   cy.contains('NaN').should('not.exist');
    //   cy.contains('undefined').should('not.exist');
    // });
  });

  describe('Validate that the sub nav takes the user to the correct section on the page', () => {
    it('Validate that the sub nav takes the user Overview section', () => {
      cy.findByRole('link', { name: 'Overview' }).click();
      cy.url().should('include', 'americas-finance-guide/');
    });

    it('Validate that the sub nav takes the user Revenue section', () => {
      cy.findByRole('link', { name: 'Revenue' }).click();
      cy.url().should('include', 'americas-finance-guide/government-revenue');
    });

    it('Validate that the sub nav takes the user Spending section', () => {
      cy.findByRole('link', { name: 'Spending' }).click();
      cy.url().should('include', 'americas-finance-guide/federal-spending');
    });

    it('Validate that the sub nav takes the user Debt section', () => {
      cy.findByRole('link', { name: 'Debt' }).click();
      cy.url().should('include', 'americas-finance-guide/national-debt');
    });
  });

  it('Validate all internal links on the page navigate to the correct destinations', () => {
    const hyperlinks = [
      {
        name: 'national debt',
        url: 'americas-finance-guide/national-debt/',
      },
      {
        name: 'spending',
        url: 'americas-finance-guide/federal-spending/',
      },
      {
        name: 'revenue',
        url: 'americas-finance-guide/government-revenue/',
      },
      {
        name: 'National Debt Explainer',
        url: 'americas-finance-guide/national-debt/',
      },
      {
        name: 'federal revenue',
        url: 'americas-finance-guide/government-revenue/',
      },
      {
        name: 'federal spending',
        url: 'americas-finance-guide/federal-spending/',
      },
    ];

    hyperlinks.forEach(link => {
      // cy.findByText(link.name).click();
      cy.findByRole('link', { name: link.name }).click();
      cy.url().should('include', link.url);
      cy.visit('/americas-finance-guide/national-deficit/');
    });
  });

  it('Validate all external links on the page navigate to the correct destinations', () => {
    const externalHyperlinks: object[] = [
      {
        name: 'the federal response to COVID-19',
        url: 'https://www.usaspending.gov/disaster/covid-19?publicLaw=all',
      },
      {
        name: 'in response to the COVID-19 pandemic',
        url: 'https://www.usaspending.gov/disaster/covid-19?publicLaw=all',
      },
      {
        name: 'https://www.gao.gov/americas-fiscal-future',
        url: 'https://www.gao.gov/americas-fiscal-future',
      },
      {
        name: 'https://www.cbo.gov/publication/57339',
        url: 'https://www.cbo.gov/publication/57339',
      },
      {
        name: 'https://www.cbo.gov/topics/budget',
        url: 'https://www.cbo.gov/topics/budget',
      },
      {
        name: 'https://crsreports.congress.gov/product/pdf/R/R46729',
        url: 'https://crsreports.congress.gov/product/pdf/R/R46729',
      },
      {
        name: 'https://www.whitehouse.gov/omb/historical-tables/',
        url: 'https://www.whitehouse.gov/omb/historical-tables/',
      },
      {
        name: 'https://fiscaldata.treasury.gov/static-data/published-reports/mts/MonthlyTreasuryStatement_202209.pdf',
        url: 'https://fiscaldata.treasury.gov/static-data/published-reports/mts/MonthlyTreasuryStatement_202209.pdf',
      },
    ];

    externalHyperlinks.forEach(link => {
      cy.findByRole('link', { name: link.name }).should('have.attr', 'href', link.url);
    });
  });

  it('Validate MTS links', () => {
    const mtsLinks: object[] = [
      {
        name: 'Monthly Treasury Statement (MTS)',
        url: '/datasets/monthly-treasury-statement/summary-of-receipts-outlays-and-the-deficit-surplus-of-the-u-s-government',
      },
      {
        name: 'Monthly Treasury Statement (MTS)',
        url: '/datasets/monthly-treasury-statement/outlays-of-the-u-s-government',
      },
    ];

    const mts = cy.findAllByRole('link', { name: 'Monthly Treasury Statement (MTS)' });

    mts.each((link, index) => {
      cy.wrap(link).should('have.attr', 'href', mtsLinks[index].url);
    });
  });

  it('Validate Data Sources & Methodologies hyperlinks', () => {
    const dsmLinks = [
      {
        name: 'Monthly Treasury Statement (MTS)',
        url: '/datasets/monthly-treasury-statement/summary-of-receipts-and-outlays-of-the-u-s-government',
      },
      {
        name: 'GitHub repository',
        url: 'https://github.com/fedspendingtransparency/fiscal-data/tree/master/documentation',
      },
    ];

    const button = cy.findByRole('button', { name: 'Data Sources & Methodologies toggle contents' });
    button.scrollIntoView({ offset: { top: 300, left: 0 }, duration: 1000 });
    button.click();
    cy.findByTestId('DSM_content').within(() =>
      dsmLinks.forEach(link => {
        cy.findByRole('link', { name: link.name }).should('have.attr', 'href', link.url);
      })
    );
  });

  it('Validate that the related datasets section contains the correct datasets', () => {
    const relatedDs: string[] = [
      'Monthly Treasury Statement (MTS)',
      'U.S. Treasury Savings Bonds: Issues, Redemptions, and Maturities by Series',
      'Financial Report of the U.S. Government',
      'Daily Treasury Statement (DTS)',
    ];

    const foundRelatedDs = cy.findAllByTestId('cardWrapper');

    foundRelatedDs.each((ds, index) => {
      cy.wrap(ds).should('include.text', relatedDs[index]);
    });
  });

  it('Validate all glossary terms on page', () => {
    const glossaryTerms: string[] = [
      'fiscal year (FY)',
      'spending',
      'revenue',
      'surplus',
      'balanced',
      'gross domestic product (GDP)',
      'bonds',
      'bills',
    ];

    const foundTerms = cy.findAllByTestId('infoTipContainer');

    foundTerms.each((term, index) => {
      cy.wrap(term).should('include.text', glossaryTerms[index]);
    });
  });

  // this may get put into its own story
  describe('Validate charts', () => {});
});
