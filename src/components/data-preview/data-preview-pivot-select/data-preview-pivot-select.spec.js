import React from 'react';
import { fireEvent, render, within } from '@testing-library/react';
import DataPreviewPivotSelect from './data-preview-pivot-select';
import userEvent from '@testing-library/user-event';

describe('Pivot select', () => {
  const mockTable = {
    tableName: 'Test table name',
    fields: [
      { columnName: 'open_today_bal', prettyName: 'Opening Balance Today' },
      { columnName: 'open_month_bal', prettyName: 'Opening Balance This Month' },
      { columnName: 'account_type', prettyName: 'By Type of Account' },
    ],
    valueFieldOptions: ['open_today_bal', 'open_month_bal'],
    dataDisplays: [{ title: 'Complete Table' }, { dimensionField: 'account_type', title: 'By Type of Account' }],
  };

  const mockTable_noPivots = {
    tableName: 'Test table name',
    fields: [
      { columnName: 'open_today_bal', prettyName: 'Opening Balance Today' },
      { columnName: 'open_month_bal', prettyName: 'Opening Balance This Month' },
      { columnName: 'account_type', prettyName: 'By Type of Account' },
    ],
    dataDisplays: [{ title: 'Complete Table' }],
  };

  const mockSelectedPivot = {
    pivotValue: { prettyName: 'Opening Balance Today', columnName: 'open_today_bal' },
    pivotView: { title: 'By Type of Account', dimensionField: 'account_type' },
  };

  it('renders Raw Data radio button', () => {
    const setTableViewSelectionSpy = jest.fn();

    const { getByRole } = render(<DataPreviewPivotSelect tableViewSelection="pivotData" setTableViewSelection={setTableViewSelectionSpy} />);
    const rawDataRadioButton = getByRole('radio', { name: 'Raw Data' });
    expect(rawDataRadioButton).toBeInTheDocument();
    userEvent.click(rawDataRadioButton);
    expect(setTableViewSelectionSpy).toHaveBeenCalledWith('rawData');
  });

  it('does not render the Pivot Data radio button when no pivot view are configured', () => {
    const { queryByRole } = render(<DataPreviewPivotSelect table={mockTable_noPivots} />);
    expect(queryByRole('radio', { name: 'Pivot Data' })).not.toBeInTheDocument();
  });

  it('renders Pivot Data radio button when pivot views are configured', async () => {
    const setTableViewSelectionSpy = jest.fn();
    const setPivotToApplySpy = jest.fn();

    const { findByRole } = render(
      <DataPreviewPivotSelect
        table={mockTable}
        pivotToApply={mockSelectedPivot}
        setPivotToApply={setPivotToApplySpy}
        tableViewSelection="rawData"
        setTableViewSelection={setTableViewSelectionSpy}
      />
    );
    const rawDataRadioButton = findByRole('radio', { name: 'Raw Data' });
    const pivotRadioButton = await findByRole('radio', { name: 'Pivot Data' });

    expect(pivotRadioButton).toBeInTheDocument();
    userEvent.click(pivotRadioButton);
    expect(setTableViewSelectionSpy).toBeCalledWith('pivotData');
  });

  it('renders Pivot View and Pivot Value dropdowns', async () => {
    const setTableViewSelectionSpy = jest.fn();
    const setPivotToApplySpy = jest.fn();

    const { findByRole } = render(
      <DataPreviewPivotSelect
        table={mockTable}
        pivotToApply={mockSelectedPivot}
        setPivotToApply={setPivotToApplySpy}
        tableViewSelection="rawData"
        setTableViewSelection={setTableViewSelectionSpy}
      />
    );
    const pivotViewDropdown = await findByRole('button', { name: 'Select Pivot View' });
    const pivotValueDropdown = await findByRole('button', { name: 'Select Pivot Value' });

    expect(pivotViewDropdown).toBeInTheDocument();
    expect(pivotValueDropdown).toBeInTheDocument();
    expect(within(pivotValueDropdown).getByText('Opening Balance Today')).toBeInTheDocument();
    expect(within(pivotViewDropdown).getByText('By Type of Account')).toBeInTheDocument();

    //disabled by default
    expect(pivotViewDropdown).toBeDisabled();
    expect(pivotValueDropdown).toBeDisabled();
  });

  it('Pivot View and Pivot Value dropdowns are not disabled when table view is pivot data', async () => {
    const setTableViewSelectionSpy = jest.fn();
    const setPivotToApplySpy = jest.fn();

    const { findByRole } = render(
      <DataPreviewPivotSelect
        table={mockTable}
        pivotToApply={mockSelectedPivot}
        setPivotToApply={setPivotToApplySpy}
        tableViewSelection="pivotData"
        setTableViewSelection={setTableViewSelectionSpy}
      />
    );
    const pivotViewDropdown = await findByRole('button', { name: 'Select Pivot View' });
    const pivotValueDropdown = await findByRole('button', { name: 'Select Pivot Value' });

    expect(pivotViewDropdown).not.toBeDisabled();
    expect(pivotValueDropdown).not.toBeDisabled();
  });

  it('calls setSelectedPivotView on Pivot View update', async () => {
    const setTableViewSelectionSpy = jest.fn();
    const setPivotToApplySpy = jest.fn();
    const { findByRole } = render(
      <DataPreviewPivotSelect
        table={mockTable}
        pivotToApply={mockSelectedPivot}
        setPivotToApply={setPivotToApplySpy}
        tableViewSelection="pivotData"
        setTableViewSelection={setTableViewSelectionSpy}
      />
    );
    const pivotViewDropdown = await findByRole('button', { name: 'Select Pivot View' });
    userEvent.click(pivotViewDropdown);
    const pivotViewOption = await findByRole('button', { name: 'By Type of Account' });
    fireEvent.click(pivotViewOption);

    expect(setPivotToApplySpy).toHaveBeenCalledWith({
      pivotValue: { columnName: 'open_today_bal', prettyName: 'Opening Balance Today' },
      pivotView: { dimensionField: 'account_type', title: 'By Type of Account' },
    });
  });

  it('calls setSelectedPivotValue on Pivot View update', async () => {
    const setTableViewSelectionSpy = jest.fn();
    const setPivotToApplySpy = jest.fn();
    const { findByRole } = render(
      <DataPreviewPivotSelect
        table={mockTable}
        pivotToApply={mockSelectedPivot}
        setPivotToApply={setPivotToApplySpy}
        tableViewSelection="pivotData"
        setTableViewSelection={setTableViewSelectionSpy}
      />
    );
    const pivotValueDropdown = await findByRole('button', { name: 'Select Pivot Value' });
    userEvent.click(pivotValueDropdown);
    const pivotValueOption = await findByRole('button', { name: 'Opening Balance This Month' });
    fireEvent.click(pivotValueOption);
    expect(setPivotToApplySpy).toHaveBeenCalledWith({
      pivotValue: { columnName: 'open_month_bal', prettyName: 'Opening Balance This Month' },
      pivotView: { dimensionField: 'account_type', title: 'By Type of Account' },
    });
  });
});
