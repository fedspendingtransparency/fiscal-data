import { fireEvent, render } from '@testing-library/react';
import CsvDirectDownload from '../csv-direct-download/csv-direct-download';
import React from 'react';

describe('CSV Direct Download Button', () => {
  it('renders a xml download link', () => {
    const { getByRole } = render(<CsvDirectDownload filename="filename" downloadData={mockCSVData} handleClick={jest.fn()} chidren={<>CSV</>} />);
    const downloadLink = getByRole('link', { hidden: true });
    expect(downloadLink).toHaveAttribute('href', 'data:text/csv;charset=utf-8,﻿header 1,header 2');
  });
  it('renders a xml download link', () => {
    const { getByRole } = render(<CsvDirectDownload filename="filename" downloadData={mockCSVData} handleClick={jest.fn()} chidren={<>CSV</>} />);
    const downloadLink = getByRole('link', { hidden: true });
    expect(downloadLink).toHaveAttribute('href', 'data:text/csv;charset=utf-8,﻿header 1,header 2');
  });
});
