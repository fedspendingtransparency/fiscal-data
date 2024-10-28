describe('Dataset detail page validation', () => {
  const dtsDataset = {
    url: '/datasets/daily-treasury-statement/',
    name: 'Daily Treasury Statement (DTS)',
    dataTables: [
      {
        name: 'Operating Cash Balance',
        endpoint: '/v1/accounting/dts/operating_cash_balance',
        column: { prettyName: 'Type of Account', name: 'account_type', searchTerm: 'Table II' },
        dateColumn: {
          name: 'record_date',
          filterMonthPrettyName: 'January',
          filterMonthNumber: '1',
          filterYear: '2024',
          filterDate: '1/24/2024',
          earliestDate: '1/2/2024',
          latestDate: '1/30/2024',
        },
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
        dateColumn: {
          name: 'record_date',
          filterMonthPrettyName: 'January',
          filterMonthNumber: '1',
          filterYear: '2024',
          filterDate: '1/30/2024',
          earliestDate: '1/30/2024',
          latestDate: '1/30/2024',
        },
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
        dateColumn: {
          name: 'record_date',
          filterMonthPrettyName: 'September',
          filterMonthNumber: '9',
          filterYear: '2022',
          filterDate: '9/30/2022',
          earliestDate: '9/30/2022',
          latestDate: '9/30/2022',
        },
      },
      {
        name: 'Receipts of the U.S. Government',
        endpoint: '/v1/accounting/mts/mts_table_4',
        column: { prettyName: 'Classification Description', name: 'classification_desc', searchTerm: 'Withheld' },
        dateColumn: {
          name: 'record_date',
          filterMonthPrettyName: 'September',
          filterMonthNumber: '9',
          filterYear: '2024',
          filterDate: '9/30/2024',
          earliestDate: '9/30/2024',
          latestDate: '9/30/2024',
        },
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
        dateColumn: {
          name: 'record_date',
          filterMonthPrettyName: 'September',
          filterMonthNumber: '9',
          filterYear: '2024',
          filterDate: '9/30/2024',
          earliestDate: '9/30/2024',
          latestDate: '9/30/2024',
        },
      },
      {
        name: 'Statutory Debt Limit',
        endpoint: '/v1/debt/mspd/mspd_table_2',
        column: { prettyName: 'Debt Limit Class 1 Description', name: 'debt_limit_class1_desc', searchTerm: 'Less Debt Not Subject to Limit' },
        dateColumn: {
          name: 'record_date',
          filterMonthPrettyName: 'September',
          filterMonthNumber: '9',
          filterYear: '2024',
          filterDate: '9/30/2024',
          earliestDate: '9/30/2024',
          latestDate: '9/30/2024',
        },
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
        dateColumn: {
          name: 'record_date',
          filterMonthPrettyName: 'January',
          filterMonthNumber: '1',
          filterYear: '2024',
          filterDate: '1/22/2024',
          earliestDate: '1/2/2024',
          latestDate: '1/30/2024',
        },
      },
      {
        name: 'Time Deposit Rate',
        endpoint: '/v1/accounting/od/slgs_time_deposit_rates',
        column: { prettyName: 'Through (Year-Month)', name: 'through', searchTerm: 'ONLY' },
        dateColumn: {
          name: 'record_date',
          filterMonthPrettyName: 'January',
          filterMonthNumber: '1',
          filterYear: '2024',
          filterDate: '1/30/2024',
          earliestDate: '1/2/2024',
          latestDate: '1/30/2024',
        },
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
      cy.contains(table.name)
        .click()
        .wait(1000);
      // Endpoint in the API Quick Guide documentation updates for each table
      cy.contains('/services/api/fiscal_service' + table.endpoint);
      if (table?.largeTable) {
        cy.contains('Text filtering has been limited due to large table size');
      } else {
        // Text search validation
        cy.findByRole('textbox', { name: 'filter ' + table.column.name + ' column' }).type(table.column.searchTerm);
        cy.findByRole('textbox', { name: 'filter ' + table.column.name + ' column' })
          .invoke('val')
          .should('eq', table.column.searchTerm);
        cy.findByRole('button', { name: 'Clear search bar' });
        if (table.column.dailySearchResults) {
          cy.get('td:contains("' + table.column.searchTerm + '")')
            .its('length')
            .should('be.gte', 1);
        } else {
          cy.get('td:contains("' + table.column.searchTerm + '")')
            .its('length')
            .should('eq', 10);
        }
        // Date Range Input and Sorting Validation
        cy.findByText('All')
          .click()
          .wait(500);
        cy.findByRole('button', { name: 'Open ' + table.dateColumn.name + ' Filter' }).click();
        cy.findByLabelText('Month:').select(table.dateColumn.filterMonthPrettyName);
        cy.findByLabelText('Year:').select(table.dateColumn.filterYear);
        cy.findByRole('gridcell', { name: '1' }).click();
        cy.findByRole('gridcell', { name: '30' })
          .click()
          .wait(200);
        cy.get('td:contains("' + table.dateColumn.filterDate + '")')
          .its('length')
          .should('be.gte', 1);
        cy.findAllByLabelText('Column sort')
          .first()
          .click(); // Ascending sort order
        cy.get('td:contains("' + table.dateColumn.earliestDate + '")')
          .its('length')
          .should('be.gte', 1);
        cy.findAllByLabelText('Column sort')
          .first()
          .click(); // Descending sort order
        cy.get('td:contains("' + table.dateColumn.latestDate + '")')
          .its('length')
          .should('be.gte', 1);
        cy.findAllByRole('button', { name: 'Reset Filters' })
          .first()
          .click();
        cy.reload();
        cy.wait(500);
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
});
