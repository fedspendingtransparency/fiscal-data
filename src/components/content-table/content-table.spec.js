import React from 'react';
import { render, within } from '@testing-library/react';
import ContentTable from './content-table';

const mockColumns = [
  {
    header: 'Dataset',
    cells: ['Treasury Securities Auctions Data', 'FRN Daily Indexes', 'Upcoming Auctions'],
    urls: ['/datasets/treasury-securities-auctions-data/', '/datasets/frn-daily-indexes/'],
  },
  {
    header: 'Table',
    cells: ['Treasury Securities Auctions Data', { text: 'FRN Daily Indexes', url: '/datasets/frn-daily-indexes/frn-daily-indexes' }],
  },
  {
    header: 'Summary of Changes',
    cells: ['Over 70 new fields', 'New XML file', 'Field Name Changes'],
  },
];

describe('ContentTable', () => {
  it('renders a header for each column', () => {
    const { getAllByRole } = render(<ContentTable columns={mockColumns} />);
    const headers = getAllByRole('columnheader');
    expect(headers.map(header => header.textContent)).toEqual(['Dataset', 'Table', 'Summary of Changes']);
  });

  it('uses the longest column for the row count and leaves missing cells empty', () => {
    const { getAllByTestId } = render(<ContentTable columns={mockColumns} />);
    const rows = getAllByTestId('content-table-row');
    expect(rows).toHaveLength(3);
    const lastRowCells = within(rows[2]).getAllByRole('cell');
    expect(lastRowCells[1].textContent).toBe('Table:');
  });

  it('renders links from the column urls shortcut and from link cells', () => {
    const { getByRole } = render(<ContentTable columns={mockColumns} />);
    expect(getByRole('link', { name: 'Treasury Securities Auctions Data' })).toHaveAttribute('href', '/datasets/treasury-securities-auctions-data/');
  });

  it('renders cells without a url as plain text', () => {
    const { queryByRole, getByText } = render(<ContentTable columns={mockColumns} />);
    expect(getByText('Over 70 new fields')).toBeInTheDocument();
    expect(queryByRole('link', { name: 'Over 70 new fields' })).toBeNull();
    expect(queryByRole('link', { name: 'Upcoming Auctions' })).toBeNull();
  });

  it('renders a link cell inside a column without urls', () => {
    const { getAllByRole } = render(<ContentTable columns={mockColumns} />);
    const frnLinks = getAllByRole('link', { name: 'FRN Daily Indexes' });
    expect(frnLinks.map(link => link.getAttribute('href'))).toEqual(['/datasets/frn-daily-indexes/', '/datasets/frn-daily-indexes/frn-daily-indexes']);
  });

  it('renders a caption when provided', () => {
    const { getByText } = render(<ContentTable columns={mockColumns} caption="Dataset changes" />);
    expect(getByText('Dataset changes').tagName).toBe('CAPTION');
  });
});
