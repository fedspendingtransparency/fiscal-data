// describe('Homepage user flow validation', () => {
//   it('Validates Contact Us Opens correct email', () => {
//     cy.visit('/');
//
//     cy.findByRole('link', { name: 'Dataset Search' }).then($link => {
//       cy.log($link.prop('outerHTML'));
//     });
//   });
// });

describe('Fiscal Data Treasury Datasets Page', () => {
  it('validate search query searches', () => {
    cy.visit('/datasets/');
    cy.findByLabelText('Enter search terms')
      .should('be.visible')
      .type('MTS');
    cy.contains("Searching Datasets matching '").should('be.visible');
  });
  it('validate search query clears', () => {
    cy.visit('/datasets/');
    cy.findByLabelText('Enter search terms')
      .should('be.visible')
      .type('MTS');
    cy.contains("Searching Datasets matching 'MTS'").should('be.visible');
    cy.findByLabelText('clear').click();
    cy.contains("Searching Datasets matching 'MTS'").should('not.exist');
  });
  it('validates tooltips on the page', () => {
    cy.visit('/datasets/');
    cy.findByLabelText('More information about Dataset Keyword Search.').should('exist');
    cy.findByLabelText('More information about Dataset Keyword Search.').click({ force: true });
    cy.findByText('Dataset Keyword Search').should('be.visible');
  });
  it('validates tooltips on the page', () => {
    cy.visit('/datasets/');
    cy.findByLabelText('More information about Last Updated.').should('exist');
    cy.findByLabelText('More information about Last Updated.').click({ force: true });
    cy.findByText('Last Updated filters for datasets that have been updated within the selected time period.').should('be.visible');
  });
  it('validates tooltips on the page', () => {
    cy.visit('/datasets/');
    cy.findByLabelText('More information about Date Range.').should('exist');
    cy.findByLabelText('More information about Date Range.').click({ force: true });
    cy.findByText('The Start Date tab filters for datasets whose first record falls within the selected year range.').should('be.visible');
  });
  it('validates tooltips on the page', () => {
    cy.visit('/datasets/');
    cy.findByText('Time Range').click();
    cy.findByLabelText('More information about Time Range.').should('exist');
    cy.findByLabelText('More information about Time Range.').click({ force: true });
    cy.findByText(
      'Select Limit results to datasets spanning entire time range to return only datasets whose start date is equal to or before the submitted start ("From") date and the end date is equal to or later than the submitted end ("To") date.'
    ).should('be.visible');
  });
  it('validates tooltips on the page', () => {
    cy.visit('/datasets/');
    cy.findByLabelText('More information about Dataset Publisher.').should('exist');
    cy.findByLabelText('More information about Dataset Publisher.').click({ force: true });
    cy.findByText("Dataset Publisher filters for datasets by entity within the U.S. Department of the Treasury's organizational structure.").should(
      'be.visible'
    );
  });
  it('validates tooltips on the page', () => {
    cy.visit('/datasets/');
    cy.findByLabelText('More information about Data Format.').should('exist');
    cy.findByLabelText('More information about Data Format.').click({ force: true });
    cy.findByText('Data Format filters for datasets with the selected options to access the data or published report.').should('be.visible');
  });

  it('sorts search results properly when selecting different options from the Sort By dropdown', () => {
    cy.visit('/datasets/');
    cy.findByText('Recently Updated').click();
    cy.findByText('Alphabetical (A to Z)').click();
    cy.findByText('Alphabetical (A to Z)').click();
    cy.findByText('Alphabetical (Z to A)').click();
  });

  it('filters by Last Updated and validates the filters and results', () => {
    // Open the 'Last Updated' filter section
    cy.visit('/datasets/');
    cy.findByText('Last Year').click();
    cy.findByRole('button', { name: 'Last Year' }).should('be.visible');

    cy.findByText('Last Updated:').should('exist');
  });

  it('filters by Start Date and validates the filters and results', () => {
    cy.visit('/datasets/');
    cy.findByText('1790 - 1989').click();
    cy.findByRole('button', { name: '1790 - 1989' }).should('be.visible');
    cy.findByText('Start Date:').should('exist');
    cy.findByText('Historical Debt OutStanding').should('exist');
  });

  it('filters by Time Range and validates results', () => {
    cy.visit('/datasets/');
    cy.findByText('Time Range').click();
    cy.findByAltText('From Date').type('01/01/2015');
    cy.findByAltText('To Date').type('01/01/2015');
  });

  it('filters by Dataset Publisher and validates the filters and results', () => {
    cy.visit('/datasets/');
    cy.findByText('Disbursing and Debt Management').click();
    cy.findByRole('button', { name: 'Disbursing and Debt Management' }).should('be.visible');
    cy.contains('Federal Credit Similar Maturity Rate').should('be.visible');
  });

  it('filters by Date Format and validates the filters and results', () => {
    cy.visit('/datasets/');
    cy.findByText('Reports (PDF)').click();

    cy.contains('Financial Report of the U.S. Government').should('be.visible');
    cy.findByText('Clear All Filters').should('be.visible');
    cy.findByRole('button', { name: 'Reports (PDF)' }).should('be.visible');
    cy.findByRole('button', { name: 'Reports (PDF)' }).click();

    cy.findByText('Clear All Filters').should('not.exist');
  });

  it('filters by Topics and validates the filters and results', () => {
    cy.visit('/datasets/');
    cy.findByText('Interest & Exchange Rates').click();
    cy.findByText('Financial Summaries').click();

    cy.findByText('TIPS and CPI Data').should('be.visible');
    cy.findByText('Gift Contributions to Reduce The public Debt').should('not.exist');
  });

  it('combines multiple filters and validates results', () => {
    cy.visit('/datasets/');
    cy.findByText('1990 - 1999').click();
    cy.findByText('Revenue').click();

    cy.findByText('Showing 3 of 50 Datasets, 11 of 172 Data Tables').should('be.visible');
  });

  it('selects filters with zero results and displays no search results banner', () => {
    cy.visit('/datasets/');
    cy.findByText("Searching Datasets matching 'MTS'").should('exist');
    cy.findByText('1990 - 1999').click();
    cy.findByText('Revenue').click();
    cy.findByText('Administrative Resource Center').click();

    cy.findByText('Sorry, no results were found matching your search.').should('be.visible');
  });

  it('clears all filters and resets the search results', () => {
    // Apply multiple filters
    cy.visit('/datasets/');
    cy.findByText('Last Year').click();
    cy.findByText('Last 30 Days').click();
    // Verify that filters are applied
    cy.contains('Clear All Filters').should('exist');
    cy.contains('Clear All Filters').click();
    cy.contains('Clear All Filters').should('not.exist');
  });
});
