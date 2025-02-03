describe('API Documentation Page', () => {
  beforeEach(() => {
    cy.visit('/api-documentation/');
  });

  it('Navigate to the api documentation, ensure page does not contain NaN, null, or undefined values', () => {
    cy.findAllByText('null').should('not.exist');
    cy.findAllByText('NaN').should('not.exist');
    cy.findAllByText('undefined').should('not.exist');
  });

  it('Validate all internal links on the page navigate to the correct destinations', () => {
    const links = [
      {
        name: 'our website',
        url: '/',
      },
      {
        name: "Your Guide to America's Finances",
        url: 'americas-finance-guide/',
      },
      {
        name: 'Search and filter',
        url: 'datasets/',
      },
      {
        name: 'full documentation on Aggregation and Sums.',
        url: 'api-documentation/#aggregation-sums',
      },
      {
        name: 'Endpoints by Dataset',
        url: 'api-documentation/#list-of-endpoints-table',
      },
      {
        name: 'Format',
        url: 'api-documentation/#parameters-format',
      },
    ];

    links.forEach(link => {
      cy.findByRole('link', { name: link.name }).click();
      cy.url().should('include', link.url);
      cy.visit('/api-documentation/');
    });
  });

  it('Validate all external links on the page navigate to the correct destinations', () => {
    const links = [
      {
        name: 'data registry',
        url: 'https://fiscal.treasury.gov/data-registry/index.html',
      },
    ];

    links.forEach(link => {
      cy.findByRole('link', { name: link.name }).should('have.attr', 'href', link.url);
    });
  });

  it('Validate duplicate names/links', () => {
    const ds = cy.findAllByRole('link', { name: 'Datasets' });

    ds.each((link, index) => {
      cy.wrap(link).should('have.attr', 'href', '/datasets/');
    });

    const usas = cy.findAllByRole('link', { name: 'USAspending' });

    usas.each((link, index) => {
      cy.wrap(link).should('have.attr', 'href', 'https://www.usaspending.gov/');
    });
  });
});
