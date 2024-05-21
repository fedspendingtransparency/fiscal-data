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
      {
        name: 'Public Debt Transactions',
        endpoint: '/v1/accounting/dts/public_debt_transactions',
        largeTable: true,
      },
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

  const mspdDataset = {
    url: '/datasets/monthly-statement-public-debt/',
    name: 'U.S. Treasury Monthly Statement of the Public Debt (MSPD)',
    dataTables: [
      {
        name: 'Summary of Treasury Securities Outstanding',
        endpoint: '/v1/debt/mspd/mspd_table_1',
        column: { prettyName: 'Security Type Description', name: 'security_type_desc', searchTerm: 'Total Marketable' },
      },
      {
        name: 'Statutory Debt Limit',
        endpoint: '/v1/debt/mspd/mspd_table_2',
        column: { prettyName: 'Debt Limit Class 1 Description', name: 'debt_limit_class1_desc', searchTerm: 'Less Debt Not Subject to Limit' },
      },
    ],
  };

  const slgsDailyRatesDataset = {
    url: '/datasets/slgs-daily-rate-table/',
    name: 'State and Local Government Series (SLGS) Daily Rate Table',
    dataTables: [
      {
        name: 'Demand Deposit Rate',
        endpoint: '/v1/accounting/od/slgs_demand_deposit_rates',
        column: { prettyName: 'Fiscal Year', name: 'record_fiscal_year', searchTerm: '20', dailySearchResults: 1 },
      },
      // {
      //   name: 'Time Deposit Rate',
      //   endpoint: '/v1/accounting/od/slgs_time_deposit_rates',
      //   column: { prettyName: 'Through (Year-Month)', name: 'through', searchTerm: 'ONLY' },
      // },
    ],
  };

  const slgsDailyRatesDataset2 = {
    url: '/datasets/slgs-daily-rate-table/',
    name: 'State and Local Government Series (SLGS) Daily Rate Table',
    dataTables: [
      // {
      //   name: 'Demand Deposit Rate',
      //   endpoint: '/v1/accounting/od/slgs_demand_deposit_rates',
      //   column: { prettyName: 'Fiscal Year', name: 'record_fiscal_year', searchTerm: '20', dailySearchResults: 1 },
      // },
      {
        name: 'Time Deposit Rate',
        endpoint: '/v1/accounting/od/slgs_time_deposit_rates',
        column: { prettyName: 'Through (Year-Month)', name: 'through', searchTerm: 'ONLY' },
      },
    ],
  };

  const checkDataTables = (dataset: {
    url: string;
    name: string;
    dataTables: {
      name: string;
      endpoint: string;
      largeTable?: boolean;
      updateDateRange?: string;
      column: { prettyName: string; name: string; searchTerm: string };
    }[];
  }) => {
    cy.visit(dataset.url);
    cy.contains(dataset.dataTables[0].name).click();
    dataset.dataTables.forEach(table => {
      cy.contains(table.name).click();
      // Endpoint in the API Quick Guide documentation updates for each table
      cy.contains('/services/api/fiscal_service' + table.endpoint);
      if (table?.largeTable) {
        cy.contains('Text filtering has been limited due to large table size');
      } else {
        cy.findByRole('textbox', { name: 'filter ' + table.column.name + ' column' }).type(table.column.searchTerm);
        cy.findByRole('textbox', { name: 'filter ' + table.column.name + ' column' })
          .invoke('val')
          .should('eq', table.column.searchTerm);
        cy.get('svg[aria-label="Clear search bar"]');
        if (table.column.dailySearchResults) {
          cy.get('td:contains("' + table.column.searchTerm + '")')
            .its('length')
            .should('eq', 1);
        } else {
          cy.get('td:contains("' + table.column.searchTerm + '")')
            .its('length')
            .should('eq', 10);
        }
      }
      cy.contains(table.name).click();
    });
  };

  it('Loads DTS Dataset Detail Page', () => {
    checkDataTables(dtsDataset);
  });

  it('loads MTS Dataset Detail Page', () => {
    checkDataTables(mtsDataset);
  });

  it('loads MSPD Dataset Detail Page', () => {
    checkDataTables(mspdDataset);
  });

  it('loads SLGS Daily Rates Dataset Detail Page', () => {
    checkDataTables(slgsDailyRatesDataset);
  });

  it('loads SLGS Daily Rates Dataset Detail Page 2', () => {
    checkDataTables(slgsDailyRatesDataset2);
  });
});
