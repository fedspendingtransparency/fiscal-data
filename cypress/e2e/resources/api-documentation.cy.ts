const pageLoadTimeout = 15000;

const visitApiDocimentationPage = () => {
  cy.intercept('GET', '**/services/api/fiscal_service/**').as('fiscalData');
  cy.visit('/api-documentation/');
  cy.wait('@fiscalData', { timeout: pageLoadTimeout })
    .its('response.statusCode')
    .should('be.oneOf', [200, 304]);
};

describe('API Documentation Page', () => {
  beforeEach(() => {
    visitApiDocimentationPage();
  });

  it('Validate all sub-nav links navigate to the correct destinations', () => {
    const links = [
      {
        text: 'Getting Started',
        url: 'api-documentation/#getting-started',
      },
      {
        text: 'What is an API?',
        url: 'api-documentation/#what-is-an-api',
      },
      {
        text: 'What is a Dataset?',
        url: 'api-documentation/#what-is-a-dataset',
      },
      {
        text: 'API Endpoint URL Structure',
        url: 'api-documentation/#api-endpoint-url-structure',
      },
      {
        text: 'How to Access our API',
        url: 'api-documentation/#how-to-access-our-api',
      },
      {
        text: 'License and Authorization',
        url: 'api-documentation/#license-and-authorization',
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
        text: 'Fields by Endpoint',
        url: 'api-documentation/#fields-by-endpoint',
        level: 3,
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
        text: 'Fields by Endpoint',
        url: 'api-documentation/#fields-fields-by-endpoint',
        level: 4,
      },
      {
        text: 'Responses and Response...',
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
        text: 'Aggregation and Sums',
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
    ];

    cy.findByText('Getting Started', { selector: 'h2' }).should('be.visible');
    links.forEach(link => {
      let sel = '[class*="secondary-nav-module--sectionLink"]';
      sel = link.level ? `${sel}[class*="headingLevel${link.level}"]` : sel;
      cy.findByText(link.text, { selector: sel })
        .should('be.visible')
        .scrollIntoView()
        .click({ force: true });

      // Wait specifically for the hash to update
      cy.location('hash').should('equal', `#${link.url.split('#')[1]}`);
    });
  });
});
