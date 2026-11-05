// Matches the feature content design mock: every Dataset cell is a link via the column urls shortcut
export const datasetChangesColumns = [
  {
    header: 'Dataset',
    cells: ['Treasury Securities Auctions Data', 'Treasury Securities Auctions Data', 'FRN Daily Indexes', 'Upcoming Auctions', 'TIPs and CPI'],
    urls: [
      '/datasets/treasury-securities-auctions-data/',
      '/datasets/treasury-securities-auctions-data/',
      '/datasets/frn-daily-indexes/',
      '/datasets/upcoming-auctions/',
      '/datasets/tips-cpi-data/',
    ],
  },
  {
    header: 'Table',
    cells: [
      'Treasury Securities Auctions Data',
      'Treasury Securities Interest Payments',
      'FRN Daily Indexes',
      'Treasury Securities Upcoming Auctions',
      'Reference CPI Numbers and Daily Index Ratios Summary',
    ],
  },
  {
    header: 'Summary of Changes',
    cells: ['Over 70 new fields, field name changes', 'New data table', 'New XML file, field name changes', 'Field Name Changes', 'Field Name Changes'],
  },
];

// Only one cell is a link, set inline on the cell
export const singleLinkColumns = [
  {
    header: 'Topic',
    cells: ['Debt', 'Spending', 'Revenue'],
  },
  {
    header: 'Explainer',
    cells: [{ text: 'National Debt Explainer', url: '/americas-finance-guide/national-debt/' }, 'Coming soon', 'Coming soon'],
  },
];
