describe('About Us Links interaction flow', () => {
  beforeEach(() => {
    cy.visit('/about-us/');
  });

  it('Navigates to the About Us page', () => {
    cy.findAllByText('About Fiscal Data').should('exist');
  });

  it('Validates all links on the page function as intended', () => {
    const links: object[] = [
      {
        name: 'Bureau of the Fiscal Service (Fiscal Service)',
        url: 'https://fiscal.treasury.gov/about.html',
        external: true,
      },
      {
        name: 'getting started section',
        url: 'api-documentation/#getting-started',
        external: false,
      },
      {
        name: 'International Monetary Fund (IMF)',
        url: 'https://www.imf.org/en/home',
        external: true,
      },
      {
        name: 'Special Data Dissemination Standard (SDDS)',
        url:
          'https://www.imf.org/en/About/Factsheets/Sheets/2023/Standards-for-data-dissemination#:~:text=The%20Special%20Data%20Dissemination%20System,access%20to%20international%20capital%20markets.',
        external: true,
      },
      {
        name: 'Monthly Statement of the Public Debt (MSPD)',
        url: 'datasets/monthly-statement-public-debt/summary-of-treasury-securities-outstanding',
        external: false,
      },
      {
        name: 'Monthly Treasury Statement (MTS)',
        url: 'datasets/monthly-treasury-statement/summary-of-receipts-outlays-and-the-deficit-surplus-of-the-u-s-government',
        external: false,
      },
      {
        name: 'IMF SDDS website',
        url:
          'https://www.imf.org/en/About/Factsheets/Sheets/2023/Standards-for-data-dissemination#:~:text=The%20Special%20Data%20Dissemination%20System,access%20to%20international%20capital%20markets.',
        external: true,
      },
      {
        name: 'API Documentation',
        url: 'api-documentation/',
        external: false,
      },
    ];

    links.forEach(link => {
      if (link.external) {
        cy.findByRole('link', { name: link.name }).should('have.attr', 'href', link.url);
      } else {
        cy.findByRole('link', { name: link.name }).click();
        cy.url().should('include', link.url);
        cy.visit('/about-us/');
      }
    });
  });

  it('Validates duplicate links', () => {
    const duplicateLinks: object[] = [
      {
        name: 'visit their Contact Us page',
        url: 'https://fiscal.treasury.gov/top/contact.html',
        external: true,
      },
      {
        name: 'Economic Impact Payments Page',
        url: 'http://www.irs.gov/coronavirus-tax-relief-and-economic-impact-payments',
        external: true,
      },
      {
        name: "Where's My Refund?",
        url: 'https://www.irs.gov/refunds',
        external: true,
      },
      {
        name: 'contact the Bureau of the Fiscal Service',
        url: 'https://fiscal.treasury.gov/contact/',
        external: true,
      },
      {
        name: 'visit their Contact Us page',
        url: 'https://fiscal.treasury.gov/top/contact.html',
        external: true,
      },
      {
        name: 'Economic Impact Payments Page',
        url: 'http://www.irs.gov/coronavirus-tax-relief-and-economic-impact-payments',
        external: true,
      },
    ];

    duplicateLinks.forEach(link => {
      const dupes = cy.findAllByRole('link', { name: link.name });

      dupes.each(dupe => {
        cy.wrap(dupe).should('have.attr', 'href', link.url);
      });
    });
  });

  it('Validates download links', () => {
    const downloadLinks: object[] = [
      {
        name: 'Open Data Policy',
        url: '/data/about-us/901-1 Open Data Policy.pdf',
      },
      {
        name: 'https://fiscaldata.treasury.gov/static-data/reports-statements/mts/imf/cgd.xml',
        url: 'https://fiscaldata.treasury.gov/static-data/reports-statements/mts/imf/cgd.xml',
      },
      {
        name: 'https://fiscaldata.treasury.gov/static-data/reports-statements/mts/imf/cgo.xml',
        url: 'https://fiscaldata.treasury.gov/static-data/reports-statements/mts/imf/cgo.xml',
      },
    ];

    downloadLinks.forEach(link => {
      cy.findByRole('link', { name: link.name }).should('have.attr', 'href', link.url);
    });
  });
});
