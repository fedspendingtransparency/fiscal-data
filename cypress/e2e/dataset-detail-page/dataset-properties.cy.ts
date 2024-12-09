describe('Dataset Properties', () => {
  beforeEach(() => {
    cy.visit('/datasets/daily-treasury-statement/');
  });

  it('Navigate to the dataset page, click between the data dictionary, data tables, metadata, and notes & known limitations tabs and verify that content loads for each tab', () => {
    const datasetPropertiesTabs: object[] = [
      {
        tabName: 'Data Dictionary',
        text: 'The date that data was published.',
      },
      {
        tabName: 'Data Tables',
        text: 'Operating Cash Balance',
      },
      {
        tabName: 'Metadata',
        text: 'Daily Treasury Statement (DTS)',
      },
    ];

    datasetPropertiesTabs.forEach(tab => {
      cy.findAllByTestId(tab.tabName).click();
      cy.get('table').contains('td', tab.text);
    });

    // making Notes & Limitations its own because it's not using a table
    cy.findAllByTestId('Notes & Known Limitations').click();
    cy.get('h4').contains('Notes & Known Limitations');
  });
});
