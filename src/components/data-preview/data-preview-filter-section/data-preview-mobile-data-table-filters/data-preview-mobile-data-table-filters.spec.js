import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import DataPreviewMobileDataTableFilters from '../data-preview-mobile-data-table-filters/data-preview-mobile-data-table-filters';

const mockFilters = [{ datasetName: 'Outlays of the U.S. Government' }, { datasetName: 'Outlays of the U.S. Government' }];

describe('Data preview mobile data table filters', () => {
  it('Renders the raw data button', () => {
    const { getByRole } = render(<DataPreviewMobileDataTableFilters />);
    expect(getByRole('radio', { name: 'rawData' })).toBeInTheDocument();
  });

  it('Renders the pivot data button', () => {
    const { getByRole } = render(<DataPreviewMobileDataTableFilters />);
    expect(getByRole('radio', { name: 'pivotData' })).toBeInTheDocument();
  });

  it('Renders the pivot view selection when the pivot data button is selected', () => {
    const { getByRole, getByText } = render(<DataPreviewMobileDataTableFilters />);
    const pivotDataButton = getByRole('radio', { name: 'pivotData' });
    fireEvent.click(pivotDataButton);
    expect(getByText('Pivot View')).toBeInTheDocument();
    expect(getByText('Pivot Value')).toBeInTheDocument();
  });

  it('Renders the selected data table name at the top of the menu', () => {
    const { getByText } = render(<DataPreviewMobileDataTableFilters />);
    expect(getByText('Outlays of the U.S. Government')).toBeInTheDocument();
  });

  it('Does not render a pivot data button when tables only contain raw data', () => {
    const { getByRole } = render(<DataPreviewMobileDataTableFilters />);
    expect(getByRole('radio', { name: 'pivotData' })).not.toBeInTheDocument();
  });

  it('Removes the faded class from the pivot data options when the radio is selected');
});
