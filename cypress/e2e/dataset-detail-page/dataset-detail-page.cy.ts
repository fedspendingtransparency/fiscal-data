describe('Dataset detail page validation', () => {
  const datasets: { url: string; name: string; dataTables: { name: string; endpoint: string }[] }[] = [
    {
      url: '/datasets/daily-treasury-statement/',
      name: 'Daily Treasury Statement (DTS)',
      dataTables: [
        {
          name: 'Operating Cash Balance',
          endpoint: '/v1/accounting/dts/operating_cash_balance',
          columns: [{ prettyName: 'Type of Account', name: 'account_type' }],
        },
        // { name: 'Public Debt Transactions', endpoint: '/v1/accounting/dts/public_debt_transactions' },
        // {
        //   name: 'Adjustment of Public Debt Transactions to Cash Basis',
        //   endpoint: '/v1/accounting/dts/adjustment_public_debt_transactions_cash_basis',
        // },
      ],
    },
  ];

  it('loops', () => {
    datasets.forEach(dataset => {
      cy.visit(dataset.url);
      cy.contains(dataset.dataTables[0].name).click();
      dataset.dataTables.forEach(table => {
        cy.contains(table.name).click();
        // Endpoint in the API Quick Guide documentation updates for each table
        cy.contains('/services/api/fiscal_service' + table.endpoint);
        cy.get('input[aria-label="filter account_type column"]').type('opening balance');
        cy.contains(table.name).click();
      });
    });
  });
});
