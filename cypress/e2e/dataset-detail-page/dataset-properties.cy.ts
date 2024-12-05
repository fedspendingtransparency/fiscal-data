describe('Dataset Properties', () => {
  beforeEach((), => {
    cy.visit('/datasets/daily-treasury-statement/');
  });

  it('Navigate to the dataset page, click between the data dictionary, data tables, metadata, and notes & known limitations tabs and verify that content loads for each tab', () => {
    const propertyTabs = cy.findAllByRole('tab');

    propertyTabs.forEach(tab => {

    });
  });
});
