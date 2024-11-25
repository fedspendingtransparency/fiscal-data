import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import ReportFilter from './report-filter';
import userEvent from '@testing-library/user-event';

const mockReports = [
  {
    path: '/test/file/path/file.pdf',
    report_date: new Date('Fri Jul 19 2024 00:00:00 GMT-0500'),
    report_group_desc: 'The Download File.pdf',
    report_group_sort_order_nbr: '01',
    report_group_id: '01',
    value: [],
  },
  {
    path: '/test/file/path/another_file.pdf',
    report_date: new Date('Fri Jul 19 2024 00:00:00 GMT-0500'),
    report_group_desc: 'Another Download File.xml',
    report_group_sort_order_nbr: '02',
    report_group_id: '02',
    value: [],
  },
];

describe('Report Filter', () => {
  it('renders filter dropdown button with all reports options in the dropdown', () => {
    const { getByRole } = render(<ReportFilter reports={mockReports} setAllReports={jest.fn()} />);
    const dropdownButton = getByRole('button', { name: 'Report: The Download File.pdf' });
    userEvent.click(dropdownButton);
    expect(getByRole('button', { name: 'The Download File.pdf' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'Another Download File.xml' })).toBeInTheDocument();
  });

  it('updates available reports', () => {
    const setAllReportsSpy = jest.fn();
    const { getByRole, getByLabelText } = render(<ReportFilter reports={mockReports} setAllReports={setAllReportsSpy} />);
    const dropdownButton = getByRole('button', { name: 'Report: The Download File.pdf' });
    userEvent.click(dropdownButton);

    expect(getByRole('button', { name: 'The Download File.pdf' })).toBeInTheDocument();
    const newReportButton = getByLabelText('Another Download File.xml');
    fireEvent.click(newReportButton);

    expect(setAllReportsSpy).toHaveBeenCalledWith([
      {
        path: '/test/file/path/another_file.pdf',
        report_date: new Date('2024-07-19T05:00:00.000Z'),
        report_group_desc: 'Another Download File.xml',
        report_group_id: '02',
        report_group_sort_order_nbr: '02',
        value: [],
      },
    ]);
  });
});
