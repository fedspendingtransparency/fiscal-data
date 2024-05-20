describe('Dataset detail page validation', () => {
  const dtsDataset = {
    url: '/datasets/daily-treasury-statement/',
    name: 'Daily Treasury Statement (DTS)',
    dataTables: [
      {
        name: 'Operating Cash Balance',
        endpoint: '/v1/accounting/dts/operating_cash_balance',
        column: { prettyName: 'Type of Account', name: 'account_type', searchTerm: 'Table II' },
      },
      // {
      //   name: 'Public Debt Transactions',
      //   endpoint: '/v1/accounting/dts/public_debt_transactions',
      //   largeTable: true,
      //   column: { prettyName: 'Type of Account', name: 'account_type', searchTerm: 'Table II' },
      // },
      {
        name: 'Adjustment of Public Debt Transactions to Cash Basis',
        endpoint: '/v1/accounting/dts/adjustment_public_debt_transactions_cash_basis',
        column: { prettyName: 'Adjustment Type', name: 'adj_type', searchTerm: 'Government Account Transactions (-)' },
      },
    ],
  };

  const mtsDataset = {
    url: '/datasets/monthly-treasury-statement/',
    name: 'Monthly Treasury Statement (MTS)',
    dataTables: [
      {
        name: 'Summary of Receipts, Outlays, and the Deficit/Surplus of the U.S. Government',
        endpoint: '/v1/accounting/mts/mts_table_1',
        column: { prettyName: 'Classification Description', name: 'classification_desc', searchTerm: 'October' },
      },
      {
        name: 'Receipts of the U.S. Government',
        endpoint: '/v1/accounting/mts/mts_table_4',
        column: { prettyName: 'Classification Description', name: 'classification_desc', searchTerm: 'Withheld' },
      },
    ],
  };

  const checkDataTables = dataset => {
    cy.visit(dataset.url);
    cy.contains(dataset.dataTables[0].name).click();
    dataset.dataTables.forEach(table => {
      cy.contains(table.name).click();
      // Endpoint in the API Quick Guide documentation updates for each table
      cy.contains('/services/api/fiscal_service' + table.endpoint);
      cy.findByRole('textbox', { name: 'filter ' + table.column.name + ' column' }).type(table.column.searchTerm);
      cy.findByRole('textbox', { name: 'filter ' + table.column.name + ' column' })
        .invoke('val')
        .should('eq', table.column.searchTerm);
      cy.get('svg[aria-label="Clear search bar"]');
      cy.get('td:contains("' + table.column.searchTerm + '")')
        .its('length')
        .should('eq', 10);
      cy.contains(table.name).click();
    });
  };

  it('Loads DTS Dataset Detail Page', () => {
    checkDataTables(dtsDataset);
  });

  it('loads MTS Dataset Detail Page', () => {
    checkDataTables(mtsDataset);
  });
});
