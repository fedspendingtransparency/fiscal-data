import { render, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import DateColumnFilter from './date-column-filter';

describe('Date column filter', () => {
  const mockPresetColumnConfig = { name: 'Record Date', columnName: 'record_date' };
  const mockCustomColumnConfig = { name: 'Different Date', columnName: 'different_date' };
  const datasetConfig = { currentDateButton: 'byFullMonth', techSpecs: { earliestDate: '3-17-2020', latestDate: '3-17-2025' } };
  const mockSelectedTable = { userFilter: null, earliestDate: '3-17-2020', latestDate: '3-17-2025', dateField: 'record_date' };
  it('renders radio buttons', () => {
    const { getByRole } = render(
      <DateColumnFilter
        presets={true}
        columnConfig={mockPresetColumnConfig}
        config={datasetConfig}
        selectedTable={mockSelectedTable}
        setIsFiltered={jest.fn()}
      />
    );
    const presetRadio = getByRole('radio', { name: 'Preset' });
    const customRadio = getByRole('radio', { name: 'Custom' });

    expect(presetRadio).toBeInTheDocument();
    expect(presetRadio).toBeChecked();
    expect(customRadio).toBeInTheDocument();
  });

  it('renders date preset buttons', () => {
    const { getByRole } = render(
      <DateColumnFilter
        presets={true}
        columnConfig={mockPresetColumnConfig}
        config={datasetConfig}
        selectedTable={mockSelectedTable}
        setIsFiltered={jest.fn()}
      />
    );
    const currentDate = getByRole('radio', { name: 'Mar 2025' });
    const oneYear = getByRole('radio', { name: '1 Year' });
    const fiveYear = getByRole('radio', { name: '5 Years' });
    const allTime = getByRole('radio', { name: 'All' });

    expect(currentDate).toBeInTheDocument();
    expect(oneYear).toBeInTheDocument();
    expect(fiveYear).toBeInTheDocument();
    expect(allTime).toBeInTheDocument();

    expect(fiveYear).toBeChecked();
  });

  it('disables custom date pickers when presets is selected', () => {
    const { getByRole } = render(
      <DateColumnFilter
        presets={true}
        columnConfig={mockPresetColumnConfig}
        config={datasetConfig}
        selectedTable={mockSelectedTable}
        setIsFiltered={jest.fn()}
      />
    );
    const startDatePicker = getByRole('button', { name: 'Select Start Date', hidden: true });
    const endDatePicker = getByRole('button', { name: 'Select End Date', hidden: true });
    expect(startDatePicker).toBeDisabled();
    expect(endDatePicker).toBeDisabled();
  });

  it('custom date pickers are not disabled when custom is selected', () => {
    const { getByRole } = render(
      <DateColumnFilter columnConfig={mockPresetColumnConfig} config={datasetConfig} selectedTable={mockSelectedTable} setIsFiltered={jest.fn()} />
    );
    const startDatePicker = getByRole('button', { name: 'Select Start Date', hidden: true });
    const endDatePicker = getByRole('button', { name: 'Select End Date', hidden: true });
    const customRadio = getByRole('radio', { name: 'Custom' });
    const presetRadio = getByRole('radio', { name: 'Preset' });

    userEvent.click(customRadio);

    expect(startDatePicker).not.toBeDisabled();
    expect(endDatePicker).not.toBeDisabled();

    userEvent.click(presetRadio);

    expect(startDatePicker).toBeDisabled();
    expect(endDatePicker).toBeDisabled();
  });

  it('does not render date preset buttons when presets is false', () => {
    const { queryByRole } = render(
      <DateColumnFilter columnConfig={mockCustomColumnConfig} config={datasetConfig} selectedTable={mockSelectedTable} setIsFiltered={jest.fn()} />
    );
    const presetRadio = queryByRole('radio', { name: 'Preset' });
    expect(presetRadio).not.toBeInTheDocument();
  });

  it('updates custom date on preset change', async () => {
    const { findByRole, getByRole } = render(
      <DateColumnFilter
        presets={true}
        columnConfig={mockPresetColumnConfig}
        config={datasetConfig}
        selectedTable={mockSelectedTable}
        setIsFiltered={jest.fn()}
      />
    );
    const startDatePicker = await findByRole('button', { name: 'Select Start Date' });
    const endDatePicker = await findByRole('button', { name: 'Select End Date' });
    expect(within(startDatePicker).getByText('March 18, 2020'));
    expect(within(endDatePicker).getByText('March 17, 2025'));

    const oneYearPreset = getByRole('radio', { name: '1 Year' });
    userEvent.click(oneYearPreset);

    expect(within(startDatePicker).getByText('March 18, 2024'));
  });
});
