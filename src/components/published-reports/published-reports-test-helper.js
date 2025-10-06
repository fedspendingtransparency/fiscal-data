export const mockReports = [
  {
    path: '/test/file/path/file.pdf',
    report_date: new Date('Fri Jul 19 2024 00:00:00 GMT-0500'),
    report_group_desc: 'The Download File.pdf',
    report_group_sort_order_nbr: '01',
    report_group_id: '01',
  },
  {
    path: '/test/file/path/another_file.pdf',
    report_date: new Date('Fri Jul 19 2023 00:00:00 GMT-0500'),
    report_group_desc: 'Another Download File.xml',
    report_group_sort_order_nbr: '02',
    report_group_id: '02',
  },
];

export const mockDailyReports = [
  {
    path: '/test/file/path/file.pdf',
    report_date: new Date('Fri Jul 19 2024 00:00:00 GMT-0500'),
    report_group_desc: 'The Download File (.pdf)',
    report_group_sort_order_nbr: '01',
    report_group_id: '01',
  },
  {
    path: '/test/file/path/file.pdf',
    report_date: new Date('Fri Jul 19 2023 00:00:00 GMT-0500'),
    report_group_desc: 'The Download File (.pdf)',
    report_group_sort_order_nbr: '01',
    report_group_id: '01',
  },
];

export const runTimeFilterDatasetConfig = {
  runTimeReportConfig: {
    unmatchedHeader: 'Unmatched Header',
    unmatchedMessage: 'Unmatched Message',
    defaultHeader: 'Default Header',
    defaultMessage: 'Default Message',
    filterField: 'account',
    filterLabel: 'Account',
  },
};
export const runTimeFilterDatasetConfigCustomFilter = {
  runTimeReportConfig: {
    unmatchedHeader: 'Unmatched Header',
    unmatchedMessage: 'Unmatched Message',
    defaultHeader: 'Default Header',
    defaultMessage: 'Default Message',
    customFilterOption: 'No CUSIP - Special Announcement',
  },
};
