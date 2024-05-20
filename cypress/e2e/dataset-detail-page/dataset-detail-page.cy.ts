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

  it('Loads DTS Dataset Detail Page', () => {
    const dataset = dtsDataset;
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
  });

  it('Loads DTS Operating Cash Balance', () => {
    const dataset = dtsDataset;
    cy.visit(dataset.url);
    cy.contains(dataset.dataTables[0].name).click();
    const tableName = 'Operating Cash Balance';
    const endpoint = '/v1/accounting/dts/operating_cash_balance';
    const column = { prettyName: 'Type of Account', name: 'account_type', searchTerm: 'Table II' };
    cy.contains(tableName).click();
    // Endpoint in the API Quick Guide documentation updates for each table
    cy.contains('/services/api/fiscal_service' + endpoint);
    cy.findByRole('textbox', { name: 'filter ' + column.name + ' column' }).type(column.searchTerm);
    cy.findByRole('textbox', { name: 'filter ' + column.name + ' column' })
      .invoke('val')
      .should('eq', column.searchTerm);
    cy.get('svg[aria-label="Clear search bar"]');
    cy.get('td:contains("' + column.searchTerm + '")')
      .its('length')
      .should('eq', 10);
    cy.contains(tableName).click();
  });

  it('Loads DTS Adjustment of Public Debt Transactions to Cash Basis', () => {
    const dataset = dtsDataset;
    cy.visit(dataset.url);
    cy.contains(dataset.dataTables[0].name).click();
    const tableName = 'Adjustment of Public Debt Transactions to Cash Basis';
    const endpoint = '/v1/accounting/dts/adjustment_public_debt_transactions_cash_basis';
    const column = { prettyName: 'Adjustment Type', name: 'adj_type', searchTerm: 'Government Account Transactions (-)' };
    cy.contains(tableName).click();
    // Endpoint in the API Quick Guide documentation updates for each table
    cy.contains('/services/api/fiscal_service' + endpoint);
    cy.findByRole('textbox', { name: 'filter ' + column.name + ' column' }).type(column.searchTerm);
    cy.findByRole('textbox', { name: 'filter ' + column.name + ' column' })
      .invoke('val')
      .should('eq', column.searchTerm);
    cy.get('svg[aria-label="Clear search bar"]');
    cy.get('td:contains("' + column.searchTerm + '")')
      .its('length')
      .should('eq', 10);
    cy.contains(tableName).click();
  });

  // it('loads MTS Dataset Detail Page', () => {});
});
