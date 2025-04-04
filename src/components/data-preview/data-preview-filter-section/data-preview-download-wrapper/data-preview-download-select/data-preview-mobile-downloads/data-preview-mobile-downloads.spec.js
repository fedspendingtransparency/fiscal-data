import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import DataPreviewMobileDownloadOptions from './data-preview-mobile-downloads';

describe('DataPreviewMobileDownloadOptions Component', () => {
  const options = [
    { displayName: 'CSV', type: 'csv' },
    { displayName: 'JSON', type: 'json' },
    { displayName: 'XML', type: 'xml' },
  ];

  it('renders all data type options with correct labels', () => {
    render(<DataPreviewMobileDownloadOptions options={options} selectedOption={null} onSelect={() => {}} />);
    options.forEach(option => {
      expect(screen.getByLabelText(option.displayName)).toBeInTheDocument();
    });
  });

  it('calls onSelect with the correct type when an option is clicked', () => {
    const onSelectMock = jest.fn();
    render(<DataPreviewMobileDownloadOptions options={options} selectedOption={null} onSelect={onSelectMock} />);

    const jsonRadio = screen.getByLabelText('JSON');
    fireEvent.click(jsonRadio);

    expect(onSelectMock).toHaveBeenCalledWith('json');
  });

  it('correctly marks the selected option as checked', () => {
    render(<DataPreviewMobileDownloadOptions options={options} selectedOption="xml" onSelect={() => {}} />);

    const xmlRadio = screen.getByLabelText('XML');
    const csvRadio = screen.getByLabelText('CSV');

    expect(xmlRadio.checked).toBe(true);
    expect(csvRadio.checked).toBe(false);
  });
});
