describe('Homepage user flow validation', () => {
  it('Validates Contact Us Opens correct email', () => {
    cy.visit('/');

    cy.findByRole('link', { name: 'Dataset Search' }).then($link => {
      cy.log($link.prop('outerHTML'));
    });
  });
});

describe('Fiscal Data Treasury Datasets Page', () => {
  beforeEach(() => {
    cy.visit('/datasets/').wait(3000);
  });
  it('validate search query searches', () => {
    cy.findByLabelText('Enter search terms')

      .should('be.visible')
      .type('MTS');
    cy.contains("Searching Datasets matching '").should('be.visible');
  });
  it('validate search query clears', () => {
    cy.findByLabelText('Enter search terms')
      .should('be.visible')
      .type('MTS');
    cy.contains("Searching Datasets matching '").should('be.visible');
    cy.findByLabelText('clear').click();
    cy.contains("Searching Datasets matching '").should('not.exist');
  });
  it('validates tooltips on the Dataset Keyword Search tooltip', () => {
    cy.findByLabelText('More information about Dataset Keyword Search.')
      .should('exist')
      .click({ force: true });
    cy.findByText('Dataset Keyword Search').should('be.visible');
  });

  it('sorts search results properly when selecting different options from the Sort By dropdown', () => {
    cy.findByText('Recently Updated').click();
    cy.findByText('Alphabetical (A to Z)').click();
    cy.findByText('Alphabetical (A to Z)').click();
    cy.findByText('Alphabetical (Z to A)').click();
  });

  it('filters by Last Updated and validates the filters and results', () => {
    // Open the 'Last Updated' filter section
    cy.findByText('Last Year').click();
    cy.findByRole('button', { name: 'Last Year' }).should('be.visible');

    cy.findByText('Last Updated:').should('exist');

    //Last Updated tooltip validation
    cy.findByLabelText('More information about Last Updated.')
      .should('exist')
      .click({ force: true });
    cy.contains('Last Updated filters for datasets that have been updated within the selected time period. ').should('be.visible');
  });

  it('filters by Start Date and validates the filters and results', () => {
    cy.findByText('1790 - 1989').click({ force: true });
    cy.findByText('Start Date:').should('be.visible');
    cy.findByText('Clear All Filters').should('be.visible');
    cy.findByText('Historical Debt Outstanding').should('exist');

    //Date Range tooltip validation
    cy.findByLabelText('More information about Date Range.')
      .should('exist')
      .click({ force: true });
    cy.contains(' tab filters for datasets whose first record falls within the selected year range.').should('be.visible');
  });

  it('filters by Time Range and validates results', () => {
    cy.findByText('Time Range').click({ force: true });
    cy.findByLabelText('From Date').type('01/01/2015');
    cy.findByLabelText('To Date').type('01/01/2015');
    cy.findByText('TIPS and CPI Data');

    //Time Range tooltip validation

    cy.findByLabelText('More information about Time Range.')
      .should('exist')
      .click({ force: true });
    cy.contains('Limit results to datasets spanning entire time range').should('be.visible');
  });

  it('filters by Dataset Publisher and validates the filters and results', () => {
    cy.findByText('Disbursing and Debt Management').click({ force: true });
    cy.findByText('Dataset Publisher:').click();
    cy.contains('Federal Credit Similar Maturity Rates').should('be.visible');

    //Dataset Publisher Tooltip validation
    cy.findByLabelText('More information about Dataset Publisher.')
      .should('exist')
      .click({ force: true });
    cy.contains("Dataset Publisher filters for datasets by entity within the U.S. Department of the Treasury's organizational structure.").should(
      'be.visible'
    );
  });

  it('filters by Date Format and validates the filters and results', () => {
    cy.findByText('Reports (PDF)').click({ force: true });

    cy.contains('Financial Report of the U.S. Government').should('be.visible');
    cy.findByText('Clear All Filters').should('be.visible');
    cy.findByRole('button', { name: 'Reports (PDF)' }).should('be.visible');
    cy.findByRole('button', { name: 'Reports (PDF)' }).click();

    cy.findByText('Clear All Filters').should('not.exist');

    //Data Format Tooltip validation
    cy.findByLabelText('More information about Data Format.')
      .should('exist')
      .click({ force: true });
    cy.contains('Data Format filters for datasets with the selected options to access the data or published report.').should('be.visible');
  });

  it('filters by Topics and validates the filters and results', () => {
    cy.findByText('Interest & Exchange Rates').click();
    cy.findByText('Financial Summaries').click();

    cy.findByText('TIPS and CPI Data').should('be.visible');
    cy.findByText('Gift Contributions to Reduce The public Debt').should('not.exist');
  });

  it('combines multiple filters and validates results', () => {
    cy.findByText('1990 - 1999').click();
    cy.findByText('Revenue').click();

    cy.findByText('Financial Report of the U.S. Government').should('be.visible');
  });

  it('displays no search results banner and clears filters', () => {
    cy.findByText('1990 - 1999').click();
    cy.findByText('Revenue').click();
    cy.findByText('Administrative Resource Center').click();

    cy.findByText('Sorry, no results were found matching your search.').should('be.visible');
    //clears filters
    cy.findByText('Clear All Filters').should('exist');
    cy.findByText('Clear All Filters').click();
    cy.findByText('Clear All Filters').should('not.exist');
    cy.findByText('Sorry, no results were found matching your search.').should('not.exist');
  });
});
