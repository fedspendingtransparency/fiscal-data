import React from 'react';
import { render, screen } from '@testing-library/react'; 
import DatasetUnavailable from './dataset-unavailable'; 

describe('DatasetUnavailable', () => {
  const testDatasetName = 'Test Dataset';
  
  it('renders with the correct dataset name', () => {
    render(<DatasetUnavailable datasetPageName={testDatasetName} />);
    const regex = new RegExp('Test Dataset', 'i')

    expect(screen.getByText(`Dataset Unavailable:`)).toBeInTheDocument();
    expect(screen.getByText(regex)).toBeInTheDocument();
  });

  it('contains an email link with the correct address', () => {
    render(<DatasetUnavailable datasetPageName={testDatasetName} />);

    const mailtoLink = screen.getByRole('link');
    expect(mailtoLink).toHaveAttribute('href', 'mailto:fiscaldata@fiscal.treasury.gov');
  });

  it('does not close when closable is set to false', () => {
    render(<DatasetUnavailable datasetPageName={testDatasetName} />);
    expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument();
  });

});
