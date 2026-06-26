describe('Deficit Explainer Page', () => {
  const pageLoadTimeout = 15000;

  const visitDeficitExplainer = () => {
    cy.intercept('GET', '**/services/api/fiscal_service/**').as('fiscalData');
    cy.visit('/americas-finance-guide/national-deficit/');
    cy.wait('@fiscalData', { timeout: pageLoadTimeout })
      .its('response.statusCode')
      .should('be.oneOf', [200, 304]);
    cy.get('[data-testid="selectable-digits"]', { timeout: pageLoadTimeout })
      .invoke('text')
      .should('match', /\$\d/);
  };

  const waitForLearnMoreSection = () => {
    cy.contains('h2', 'Learn More about the Deficit', { timeout: pageLoadTimeout })
      .scrollIntoView()
      .should('be.visible');
  };

  const waitForUnderstandingSection = () => {
    cy.contains('h2', 'Understanding the National Deficit', { timeout: pageLoadTimeout })
      .scrollIntoView()
      .should('be.visible');
  };

  const normalizeHref = (href: string | null): string => href?.replace(/\/$/, '') || '';

  const hrefSelector = (url: string): string => {
    const normalizedHref = normalizeHref(url);
    return `a[href="${normalizedHref}"], a[href="${normalizedHref}/"]`;
  };

  const assertLinkByNameAndHref = (name: string, url: string) => {
    const selector = hrefSelector(url);

    cy.get(selector, { timeout: pageLoadTimeout }).should($links => {
      const matchingLink = [...$links].some(anchor => anchor.textContent?.includes(name));
      expect(matchingLink, `${name} link to ${url}`).to.be.true;
    });
  };

  beforeEach(() => {
    visitDeficitExplainer();
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

  it.skip('Validate all internal links on the page navigate to the correct destinations', () => {
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
      cy.findByRole('link', { name: link.name }).click();
      cy.url().should('include', link.url);
      cy.visit('/americas-finance-guide/national-deficit/');
    });
  });

  it('Validate all external links on the page navigate to the correct destinations', () => {
    waitForLearnMoreSection();

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
        name: 'https://www.congress.gov/crs-product/R46729',
        url: 'https://www.congress.gov/crs-product/R46729',
      },
    ];

    externalHyperlinks.forEach(link => {
      cy.findAllByRole('link', { name: link.name }, { timeout: pageLoadTimeout })
        .first()
        .should('have.attr', 'href', link.url);
    });
  });

  it('Validate PDF links on the page point to the correct files', () => {
    waitForLearnMoreSection();

    cy.findAllByRole('link', { name: /MonthlyTreasuryStatement_202409\.pdf/ }, { timeout: pageLoadTimeout })
      .first()
      .should('have.attr', 'href')
      .and('include', 'MonthlyTreasuryStatement_202409.pdf');
  });

  it('Validate MTS links', () => {
    waitForUnderstandingSection();

    const mtsUrls: string[] = [
      '/datasets/monthly-treasury-statement/summary-of-receipts-outlays-and-the-deficit-surplus-of-the-u-s-government',
      '/datasets/monthly-treasury-statement/outlays-of-the-u-s-government',
    ];

    mtsUrls.forEach(url => {
      assertLinkByNameAndHref('Monthly Treasury Statement (MTS)', url);
    });
  });

  it.skip('Validate Data Sources & Methodologies hyperlinks', () => {
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

    glossaryTerms.forEach(term => {
      cy.findAllByTestId('infoTipContainer')
        .contains(term)
        .should('exist');
    });
  });

  // TODO
  describe('Validate charts', () => {});
});
