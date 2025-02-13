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

  it('Validate all sub-nav links navigate to the correct destinations', () => {
    const links = [
      {
        text: 'What is an API?',
        url: 'api-documentation/#what-is-an-api',
      },
      {
        text: 'Getting Started',
        url: 'api-documentation/#getting-started',
      },
      {
        text: 'What is a dataset?',
        url: 'api-documentation/#what-is-a-dataset',
      },
      {
        text: 'API Endpoint URL structure',
        url: 'api-documentation/#api-endpoint-url-structure',
      },
      {
        text: 'How to Access our API',
        url: 'api-documentation/#how-to-access-our-api',
      },
      {
        text: 'License & Authorization',
        url: 'api-documentation/#license-and-authorization',
      },
      {
        text: 'Change Log',
        url: 'api-documentation/#change-log',
      },
      {
        text: 'Endpoints',
        url: 'api-documentation/#endpoints',
      },
      {
        text: 'List of Endpoints',
        url: 'api-documentation/#list-of-endpoints',
      },
      {
        text: 'Fiscal Service Data Registry',
        url: 'api-documentation/#data-registry',
      },
      {
        text: 'Methods',
        url: 'api-documentation/#methods',
      },
      {
        text: 'Parameters',
        url: 'api-documentation/#parameters',
      },
      {
        text: 'Data Types',
        url: 'api-documentation/#data-types',
      },
      {
        text: 'Responses & Response Objects',
        url: 'api-documentation/#responses-response-objects',
      },
      {
        text: 'Response Codes',
        url: 'api-documentation/#responses-response-codes',
      },
      {
        text: 'Meta Object',
        url: 'api-documentation/#responses-meta-object',
      },
      {
        text: 'Links Object',
        url: 'api-documentation/#responses-links-object',
      },
      {
        text: 'Data Object',
        url: 'api-documentation/#responses-data-object',
      },
      {
        text: 'Error Object',
        url: 'api-documentation/#responses-error-object',
      },
      {
        text: 'Pagination Header',
        url: 'api-documentation/#responses-pagination-header',
      },
      {
        text: 'Aggregation & Sums',
        url: 'api-documentation/#aggregation-sums',
      },
      {
        text: 'Examples and Code Snippets',
        url: 'api-documentation/#examples-code-snippets',
      },
      {
        text: 'Aggregation',
        url: 'api-documentation/#examples-aggregation',
      },
      {
        text: 'Multi-dimension Datasets',
        url: 'api-documentation/#examples-multi-dimension-datasets',
      },
      {
        text: 'Fields by Endpoint',
        url: 'api-documentation/#fields-by-endpoint',
        level: 3,
      },
      {
        text: 'Fields by Endpoint',
        url: 'api-documentation/#fields-fields-by-endpoint',
        level: 4,
      },
    ];

    cy.findByText('Getting Started', { selector: 'h2' });
    links.forEach(link => {
      let sel = '[class^="api-module--link"]';
      sel = link.level ? `${sel}[class*="Level${link.level}"]` : sel;
      cy.findByText(link.text, { selector: sel }).click();
      cy.url().should('include', link.url);
    });
  });

  it('Validate sub-nav duplicate names/links', () => {
    // duplicate nodes outside of testId
    const links = [
      {
        text: 'Fields',
        url: 'api-documentation/#fields',
        testId: 'tocLink13',
      },
      {
        text: 'Fields',
        url: 'api-documentation/#examples-fields',
        testId: 'tocLink29',
      },
      {
        text: 'Filters',
        url: 'api-documentation/#filters',
        testId: 'tocLink16',
      },
      {
        text: 'Filters',
        url: 'api-documentation/#examples-filters',
        testId: 'tocLink30',
      },
      {
        text: 'Sorting',
        url: 'api-documentation/#parameters-sorting',
        testId: 'tocLink17',
      },
      {
        text: 'Sorting',
        url: 'api-documentation/#examples-sorting',
        testId: 'tocLink31',
      },
      {
        text: 'Format',
        url: 'api-documentation/#parameters-format',
        testId: 'tocLink18',
      },
      {
        text: 'Format',
        url: 'api-documentation/#examples-format',
        testId: 'tocLink32',
      },
      {
        text: 'Pagination',
        url: 'api-documentation/#parameters-pagination',
        testId: 'tocLink19',
      },
      {
        text: 'Pagination',
        url: 'api-documentation/#examples-pagination',
        testId: 'tocLink33',
      },
    ];

    cy.findByText('Getting Started', { selector: 'h2' });
    links.forEach(link => {
      const sel = `[data-test-id="${link.testId}"]`;
      cy.findByText(link.text, { selector: sel }).click();
      cy.url().should('include', link.url);
    });
  });
});
