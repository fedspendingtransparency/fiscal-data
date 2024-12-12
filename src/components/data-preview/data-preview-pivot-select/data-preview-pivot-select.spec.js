import React from 'react';
import { render, within } from '@testing-library/react';
import DataPreviewPivotSelect from './data-preview-pivot-select';

describe('Pivot select', () => {
  it('renders Raw Data radio button', () => {
    const { getByRole } = render(<DataPreviewPivotSelect />);
    expect(getByRole('radio', { name: 'Raw Data' })).toBeInTheDocument();
  });

  it('does not render the Pivot Data radio button when no pivot view are configured', () => {
    const { queryByRole } = render(<DataPreviewPivotSelect />);
    expect(queryByRole('radio', { name: 'Pivot Data' })).not.toBeInTheDocument();
  });

  it('renders Pivot Data radio button when pivot views are configured', () => {
    const { findByRole } = render(<DataPreviewPivotSelect />);
    expect(findByRole('radio', { name: 'Pivot Data' })).toBeInTheDocument();
  });

  it('renders Pivot View and Pivot Value dropdowns', () => {
    const { getByRole } = render(<DataPreviewPivotSelect />);
    const pivotViewDropdown = getByRole('button', { name: 'Select Pivot View' });
    const pivotValueDropdown = getByRole('button', { name: 'Select Pivot Value' });
    expect(pivotViewDropdown).toBeInTheDocument();
    expect(within(pivotViewDropdown).getByText('--')).toBeInTheDocument();
    expect(pivotValueDropdown).toBeInTheDocument();
    expect(within(pivotValueDropdown).getByText('--')).toBeInTheDocument();
  });

  it('calls setSelectedPivotView on Pivot View update', () => {
    const setSelectedPivotViewSpy = jest.fn();
    const { getByRole } = render(<DataPreviewPivotSelect setSelectedPivotView={setSelectedPivotViewSpy} />);
    const pivotViewDropdown = getByRole('button', { name: 'Select Pivot View' });
    pivotViewDropdown.click();
    const pivotViewOption = getByRole('button', { name: 'Pivot View 1' });
    pivotViewOption.click();
    expect(within(pivotViewDropdown).getByText('Pivot View 1')).toBeInTheDocument();
    expect(setSelectedPivotViewSpy).toHaveBeenCalledWith();
  });

  it('calls setSelectedPivotValue on Pivot View update', () => {
    const setSelectedPivotValueSpy = jest.fn();
    const { getByRole } = render(<DataPreviewPivotSelect setSelectedPivotValue={setSelectedPivotValueSpy} />);
    const pivotValueDropdown = getByRole('button', { name: 'Select Pivot View' });
    pivotValueDropdown.click();
    const pivotValueOption = getByRole('button', { name: 'Pivot Value 1' });
    pivotValueOption.click();
    expect(within(pivotValueDropdown).getByText('Pivot View 1')).toBeInTheDocument();
    expect(setSelectedPivotValueSpy).toHaveBeenCalledWith();
  });
});
