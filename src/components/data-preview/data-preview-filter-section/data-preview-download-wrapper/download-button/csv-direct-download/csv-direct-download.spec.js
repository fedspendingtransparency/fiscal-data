import React from 'react';
import CsvDirectDownload from './csv-direct-download';
import { fireEvent, render } from '@testing-library/react';

describe('CSV Direct Download Button', () => {
  global.structuredClone = val => JSON.parse(JSON.stringify(val));
  jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));
  const mockCSVData = [['header 1', 'header 2']];
  it('renders a download link', () => {
    const { getByRole } = render(<CsvDirectDownload filename="filename" downloadData={mockCSVData} handleClick={jest.fn()} chidren={<>CSV</>} />);
    const downloadLink = getByRole('link', { hidden: true });
    expect(downloadLink).toHaveAttribute('href', 'data:text/csv;charset=utf-8,﻿header 1,header 2');
  });

  it('direct CSV download with timestamp', () => {
    const { getByTestId, getByRole } = render(
      <CsvDirectDownload filename="filename" downloadData={mockCSVData} handleClick={jest.fn()} chidren={<>CSV</>} downloadTimestamp={true} />
    );
    const timestampDownloadButton = getByTestId('csv-timestamp-download-button');
    expect(timestampDownloadButton).toBeInTheDocument();
    expect(getByTestId('csv-download-button')).toBeInTheDocument();
    fireEvent.click(timestampDownloadButton);
    const downloadLink = getByRole('link', { hidden: true });
    const downloadHref = downloadLink.getAttribute('href');
    expect(downloadHref.toString()).toContain('Report Run:');
  });
});
