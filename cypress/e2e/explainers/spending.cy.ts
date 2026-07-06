describe('Spending Explainer Page', () => {
  const pageLoadTimeout = 15000;

  const visitSpendingExplainer = () => {
    cy.intercept('GET', '**/services/api/fiscal_service/**').as('fiscalData');
    cy.visit('/americas-finance-guide/federal-spending/');
    cy.wait('@fiscalData', { timeout: pageLoadTimeout })
      .its('response.statusCode')
      .should('be.oneOf', [200, 304]);
    cy.get('[data-testid="selectable-digits"]', { timeout: pageLoadTimeout })
      .invoke('text')
      .should('match', /\$\d/);
  };

  const waitForSourcesSection = () => {
    cy.contains('h2', 'Spending Categories', { timeout: pageLoadTimeout })
      .scrollIntoView()
      .should('be.visible');
  };

  const waitForTrendsEconomySection = () => {
    cy.contains('h2', 'Spending Trends Over Time and the U.S. Economy', { timeout: pageLoadTimeout })
      .scrollIntoView()
      .should('be.visible');
  };

  const normalizeHref = (href: string | null): string => href?.replace(/\/$/, '') || '';

  const hrefSelector = (url: string): string => {
    const normalizedHref = normalizeHref(url);
    return `a[href="${normalizedHref}"], a[href="${normalizedHref}/"]`;
  };

  const findLinkByNameAndHref = (name: string, url: string) => {
    const selector = hrefSelector(url);

    return cy
      .get(selector, { timeout: pageLoadTimeout })
      .should($links => {
        const matchingLink = [...$links].some(anchor => anchor.textContent?.includes(name));
        expect(matchingLink, `${name} link to ${url}`).to.be.true;
      })
      .then($links => {
        const target = [...$links].find(anchor => anchor.textContent?.includes(name));
        expect(target, `${name} link to ${url}`).to.exist;
        return cy.wrap(target);
      });
  };

  beforeEach(() => {
    visitSpendingExplainer();
  });

  it('Navigate to the spending explainer, ensure page does not contain NaN, null, or undefined values', () => {
    cy.findAllByText('null').should('not.exist');
    cy.findAllByText('NaN').should('not.exist');
    cy.findAllByText('undefined').should('not.exist');
  });

  it('Validate all glossary terms on page', () => {
    const glossaryTerms: string[] = [
      'fiscal year (FY)',
      'discretionary',
      'mandatory',
      'federal debt',
      'revenue',
      'object class',
      'budget functions',
      'outlays',
      'obligation',
      'agency',
      'appropriations',
      'supplemental appropriations',
    ];

    glossaryTerms.forEach(term => {
      cy.findAllByTestId('infoTipContainer')
        .contains(term)
        .should('exist');
    });

    cy.findAllByTestId('infoTipContainer')
      .contains('discretionary')
      .click();

    cy.findAllByTestId('popupContainer')
      .findByText('View in glossary')
      .click();
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
    it('Validate all external links on the page navigate to the correct destinations ', () => {
      waitForSourcesSection();
      waitForTrendsEconomySection();

      const externalHyperlinks = [
        {
          name: 'USAspending.gov',
          url: 'https://www.usaspending.gov/explorer',
        },
        {
          name: 'Social Security Act',
          url: 'https://www.ssa.gov/OP_Home/ssact/ssact-toc.htm',
        },
        {
          name: 'COVID-19 Spending Profile',
          url: 'https://www.usaspending.gov/disaster/covid-19?publicLaw=all',
        },
      ];

      externalHyperlinks.forEach(link => {
        cy.findAllByRole('link', { name: link.name }, { timeout: pageLoadTimeout })
          .first()
          .should('have.attr', 'href', link.url);
      });
    });

    it('Validate all external links (in accordians) on the page navigate to the correct destinations ', () => {
      waitForTrendsEconomySection();
      cy.findByRole('button', { name: 'What does the future of Social Security and Medicare look like? toggle contents' })
        .first()
        .click();
      cy.findByRole('link', { name: 'Annual Reports on the Financial Status of Social Security and Medicare' }, { timeout: pageLoadTimeout }).should(
        'have.attr',
        'href',
        'https://www.ssa.gov/oact/TRSUM/'
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

    it('Part 2: Validate all internal links on the page navigate to the correct destinations', () => {
      const hyperlinks2 = [
        {
          name: 'Monthly Treasury Statement (MTS)',
          url: '/datasets/monthly-treasury-statement/receipts-of-the-u-s-government',
        },
      ];
      hyperlinks2.forEach(link => {
        waitForSourcesSection();

        findLinkByNameAndHref(link.name, link.url)
          .scrollIntoView()
          .click();
        cy.url().should('include', link.url);
        visitSpendingExplainer();
      });
    });

    it('Validate that the related datasets section contains the correct datasets', () => {
      const relatedDs: string[] = [
        'Monthly Treasury Statement (MTS)',
        'Interest Expense on the Public Debt Outstanding',
        'Daily Treasury Statement (DTS)',
        'Financial Report of the U.S. Government',
      ];

      const foundRelatedDs = cy.findAllByTestId('cardWrapper');

      foundRelatedDs.each((ds, index) => {
        cy.wrap(ds).should('include.text', relatedDs[index]);
      });
    });
  });
});



