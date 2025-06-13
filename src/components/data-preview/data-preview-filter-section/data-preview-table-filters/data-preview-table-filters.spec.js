import React from 'react';
import DataPreviewTableFilters from './data-preview-table-filters';
import { fireEvent, render } from '@testing-library/react';
import { DataTableContext } from '../../data-preview-context';
import { monthNames } from '../../../../utils/api-utils';

describe('Table filters dropdown', () => {
  const datasetConfig = { currentDateButton: 'byFullMonth', techSpecs: { earliestDate: '3-17-2020', latestDate: '3-17-2025' } };
  const mockSelectedTable = {
    userFilter: null,
    earliestDate: '3-17-2020',
    latestDate: '3-17-2025',
    dateField: 'record_date',
    fields: [{ prettyName: 'Record Date', columnName: 'record_date' }],
  };
  const mockColumnConfigs = [{ id: 'record_date' }];
  const mockContextValues = {
    tableState: {
      getAllLeafColumns: jest.fn().mockImplementation(() => mockColumnConfigs),
    },
  };
  const setIsCustomDateRange = jest.fn();
  const handleDateRangeChange = jest.fn();
  const setIsFiltered = jest.fn();

  it('renders the dropdown button', () => {
    const { getByRole } = render(
      <DataTableContext.Provider
        value={{
          ...mockContextValues,
        }}
      >
        <DataPreviewTableFilters
          width={1000}
          selectedTable={mockSelectedTable}
          setIsCustomDateRange={setIsCustomDateRange}
          handleDateRangeChange={handleDateRangeChange}
          setIsFiltered={setIsFiltered}
        />
      </DataTableContext.Provider>
    );
    const dropdownButton = getByRole('button', { name: 'Filters: 0 applied' });
    fireEvent.click(dropdownButton);
    //Filters dropdown opens on click
    const applyButton = getByRole('button', { name: 'Apply' });
    expect(applyButton).toBeInTheDocument();
  });

  it('apply button closes dropdown panel and applies any selected filters', () => {
    const { getByRole } = render(
      <DataTableContext.Provider
        value={{
          ...mockContextValues,
        }}
      >
        <DataPreviewTableFilters
          width={1000}
          selectedTable={mockSelectedTable}
          setIsCustomDateRange={setIsCustomDateRange}
          handleDateRangeChange={handleDateRangeChange}
          setIsFiltered={setIsFiltered}
        />
      </DataTableContext.Provider>
    );
    const dropdownButton = getByRole('button', { name: 'Filters: 0 applied' });
    fireEvent.click(dropdownButton);
    //Filters dropdown opens on click
    const applyButton = getByRole('button', { name: 'Apply' });
    expect(applyButton).toBeInTheDocument();
    fireEvent.click(applyButton);
    expect(applyButton).not.toBeInTheDocument();
    //Todo: check that filters are applied
    expect(getByRole('button', { name: 'Filters: 0 applied' })).toBeInTheDocument();
  });

  it('cancel button closes dropdown panel without applying filters', () => {
    const { getByRole } = render(
      <DataTableContext.Provider
        value={{
          ...mockContextValues,
        }}
      >
        <DataPreviewTableFilters
          width={1000}
          selectedTable={mockSelectedTable}
          setIsCustomDateRange={setIsCustomDateRange}
          handleDateRangeChange={handleDateRangeChange}
          setIsFiltered={setIsFiltered}
        />
      </DataTableContext.Provider>
    );
    const dropdownButton = getByRole('button', { name: 'Filters: 0 applied' });
    fireEvent.click(dropdownButton);
    //Filters dropdown opens on click
    const cancelButton = getByRole('button', { name: 'Cancel' });
    expect(cancelButton).toBeInTheDocument();
    fireEvent.click(cancelButton);
    expect(cancelButton).not.toBeInTheDocument();
    //no filters are applied
    expect(getByRole('button', { name: 'Filters: 0 applied' })).toBeInTheDocument();
  });

  it('renders the column filters', () => {
    const { getByRole } = render(
      <DataTableContext.Provider
        value={{
          ...mockContextValues,
        }}
      >
        <DataPreviewTableFilters
          selectedTable={mockSelectedTable}
          config={datasetConfig}
          width={1000}
          setIsCustomDateRange={setIsCustomDateRange}
          handleDateRangeChange={handleDateRangeChange}
          setIsFiltered={setIsFiltered}
        />
      </DataTableContext.Provider>
    );
    const dropdownButton = getByRole('button', { name: 'Filters: 0 applied' });
    fireEvent.click(dropdownButton);
    const filterButton = getByRole('button', { name: 'Record Date' });
    expect(filterButton).toBeInTheDocument();
  });
});

describe('Table Filter Date Range Presets', () => {
  const datasetConfig = { currentDateButton: 'byFullMonth', techSpecs: { earliestDate: '3-17-2020', latestDate: '3-17-2025' } };
  const mockColumnConfigs = [{ id: 'column A' }];
  const mockContextValues = {
    tableState: {
      getAllLeafColumns: jest.fn().mockImplementation(() => mockColumnConfigs),
    },
  };
  const mockSelectedTable = {
    earliestDate: '2002-01-01',
    latestDate: '2020-01-01',
    dateField: 'column A',
    fields: [{ columnName: 'column A', prettyName: 'Column A', dataType: 'DATE' }],
  };

  const setIsCustomDateRange = jest.fn();
  const handleDateRangeChange = jest.fn();
  const setIsFiltered = jest.fn();

  it('contains a preset radio button for All which sets is filtered to true', async () => {
    const { getByRole, findByRole } = render(
      <DataTableContext.Provider
        value={{
          ...mockContextValues,
        }}
      >
        <DataPreviewTableFilters
          width={1000}
          selectedTable={mockSelectedTable}
          setIsCustomDateRange={setIsCustomDateRange}
          handleDateRangeChange={handleDateRangeChange}
          setIsFiltered={setIsFiltered}
          config={datasetConfig}
        />
      </DataTableContext.Provider>
    );
    const dropdownButton = getByRole('button', { name: 'Filters: 0 applied' });
    fireEvent.click(dropdownButton);
    const radioBtn = await findByRole('radio', { name: 'All' });
    expect(radioBtn).toBeInTheDocument();
  });

  it('does not contain a preset radio button for the latest report by default', () => {
    const { getAllByRole, getByRole } = render(
      <DataTableContext.Provider
        value={{
          ...mockContextValues,
        }}
      >
        <DataPreviewTableFilters
          width={1000}
          selectedTable={mockSelectedTable}
          setIsCustomDateRange={setIsCustomDateRange}
          handleDateRangeChange={handleDateRangeChange}
          setIsFiltered={setIsFiltered}
          config={datasetConfig}
        />
      </DataTableContext.Provider>
    );
    const dropdownButton = getByRole('button', { name: 'Filters: 0 applied' });
    fireEvent.click(dropdownButton);
    const radioBtns = getAllByRole('radio');
    expect(radioBtns).toHaveLength(6); // Date presets + Presets and Custom buttons
    expect(getByRole('radio', { name: '1 Year' })).toBeInTheDocument();
    expect(getByRole('radio', { name: '5 Years' })).toBeInTheDocument();
    expect(getByRole('radio', { name: '10 Years' })).toBeInTheDocument();
    expect(getByRole('radio', { name: 'All' })).toBeInTheDocument();
  });

  it('defaults the "5 Years" date Range preset button on first load', () => {
    const { getByRole } = render(
      <DataTableContext.Provider
        value={{
          ...mockContextValues,
        }}
      >
        <DataPreviewTableFilters
          width={1000}
          selectedTable={mockSelectedTable}
          setIsCustomDateRange={setIsCustomDateRange}
          handleDateRangeChange={handleDateRangeChange}
          setIsFiltered={setIsFiltered}
          config={datasetConfig}
        />
      </DataTableContext.Provider>
    );
    const dropdownButton = getByRole('button', { name: 'Filters: 0 applied' });
    fireEvent.click(dropdownButton);
    const radioBtn = getByRole('radio', { name: '5 Years' });
    expect(radioBtn).toBeChecked();
  });

  it('initially selects the "1 Year" option when date range is > 1 year and < 5 years', () => {
    const mockTable = Object.assign({}, mockSelectedTable, { earliestDate: '2017-01-01' });

    const { getByRole, queryByRole } = render(
      <DataTableContext.Provider
        value={{
          ...mockContextValues,
        }}
      >
        <DataPreviewTableFilters
          width={1000}
          selectedTable={mockTable}
          setIsCustomDateRange={setIsCustomDateRange}
          handleDateRangeChange={handleDateRangeChange}
          setIsFiltered={setIsFiltered}
          config={datasetConfig}
          currentDateButton={true}
        />
      </DataTableContext.Provider>
    );
    const dropdownButton = getByRole('button', { name: 'Filters: 0 applied' });
    fireEvent.click(dropdownButton);

    let radioBtn = getByRole('radio', { name: '1 Year' });
    expect(radioBtn).toBeChecked();

    // 5 year button will not exist
    radioBtn = queryByRole('radio', { name: '5 Years' });
    expect(radioBtn).not.toBeInTheDocument();

    // 10 year button will also not exist
    radioBtn = queryByRole('radio', { name: '10 Years' });
    expect(radioBtn).not.toBeInTheDocument();
  });

  it('initially selects the current date option when datePreset is set to "current', () => {
    const mockTable = Object.assign({}, mockSelectedTable, { earliestDate: '2017-01-01' });

    const { getByRole, queryByRole } = render(
      <DataTableContext.Provider
        value={{
          ...mockContextValues,
        }}
      >
        <DataPreviewTableFilters
          width={1000}
          selectedTable={mockTable}
          setIsCustomDateRange={setIsCustomDateRange}
          handleDateRangeChange={handleDateRangeChange}
          setIsFiltered={setIsFiltered}
          config={datasetConfig}
          currentDateButton={true}
          datePreset="current"
        />
      </DataTableContext.Provider>
    );

    const dropdownButton = getByRole('button', { name: 'Filters: 0 applied' });
    fireEvent.click(dropdownButton);

    let radioBtn = getByRole('radio', { name: 'Jan 2020' });
    expect(radioBtn).toBeChecked();

    // 1 year button will exist, but will not be checked
    radioBtn = getByRole('radio', { name: '1 Year' });
    expect(radioBtn).not.toBeChecked();

    // 5 year button will not exist
    radioBtn = queryByRole('radio', { name: '5 Years' });
    expect(radioBtn).not.toBeInTheDocument();

    // 10 year button will also not exist
    radioBtn = queryByRole('radio', { name: '10 Years' });
    expect(radioBtn).not.toBeInTheDocument();
  });

  describe('Current report button available', () => {
    const dateRange = {
      from: new Date('01/01/2002'),
      to: new Date('01/01/2020'),
      min: new Date('01/31/2002'),
    };

    it('updates the selected radio button when pressed', async () => {
      const { getByRole } = render(
        <DataTableContext.Provider
          value={{
            ...mockContextValues,
          }}
        >
          <DataPreviewTableFilters
            width={1000}
            selectedTable={mockSelectedTable}
            setIsCustomDateRange={setIsCustomDateRange}
            handleDateRangeChange={handleDateRangeChange}
            setIsFiltered={setIsFiltered}
            config={datasetConfig}
            datePreset="current"
            currentDateButton="byMonth"
          />
        </DataTableContext.Provider>
      );

      const dropdownButton = getByRole('button', { name: 'Filters: 0 applied' });
      fireEvent.click(dropdownButton);
      // 1 year
      let radioBtn = getByRole('radio', { name: '1 Year' });
      fireEvent.click(radioBtn);
      expect(radioBtn).toBeChecked();

      // 5 years
      radioBtn = getByRole('radio', { name: '5 Years' });
      fireEvent.click(radioBtn);
      expect(radioBtn).toBeChecked();

      // 10 years
      radioBtn = getByRole('radio', { name: '10 Years' });
      fireEvent.click(radioBtn);
      expect(radioBtn).toBeChecked();

      // current report
      radioBtn = getByRole('radio', { name: 'Jan 2020' });
      fireEvent.click(radioBtn);
      expect(radioBtn).toBeChecked();
    });

    it(`when requested, contains a preset radio button for the latest report date labeled by
    the three-letter month and four-digit year`, async () => {
      const { getByRole } = render(
        <DataTableContext.Provider
          value={{
            ...mockContextValues,
          }}
        >
          <DataPreviewTableFilters
            width={1000}
            selectedTable={mockSelectedTable}
            setIsCustomDateRange={setIsCustomDateRange}
            handleDateRangeChange={handleDateRangeChange}
            setIsFiltered={setIsFiltered}
            config={datasetConfig}
            currentDateButton="byMonth"
          />
        </DataTableContext.Provider>
      );

      const dropdownButton = getByRole('button', { name: 'Filters: 0 applied' });
      fireEvent.click(dropdownButton);
      const month = dateRange.to.getMonth();
      const fullYear = dateRange.to.getFullYear();
      const expectedLabel = `${monthNames[month]} ${fullYear.toString()}`;
      const radioLabel = getByRole('radio', { name: expectedLabel });
      expect(radioLabel).toBeInTheDocument();
    });

    it(`adds a preset radio button for the latest report date labeled "Mmm d, YYYY" when
    currentDateButton is "byDay"`, async () => {
      const { getByRole } = render(
        <DataTableContext.Provider
          value={{
            ...mockContextValues,
          }}
        >
          <DataPreviewTableFilters
            width={1000}
            selectedTable={mockSelectedTable}
            setIsCustomDateRange={setIsCustomDateRange}
            handleDateRangeChange={handleDateRangeChange}
            setIsFiltered={setIsFiltered}
            config={datasetConfig}
            currentDateButton="byDay"
          />
        </DataTableContext.Provider>
      );

      const dropdownButton = getByRole('button', { name: 'Filters: 0 applied' });
      fireEvent.click(dropdownButton);
      const expectedLabel = 'Jan 1, 2020';
      const radioBtn = getByRole('radio', { name: expectedLabel });
      expect(radioBtn).toBeInTheDocument();
    });

    it(`adds a preset radio button for the latest report date labeled "Last 30 Days" when
    currentDateButton is "byLast30Days"`, async () => {
      const { getByRole } = render(
        <DataTableContext.Provider
          value={{
            ...mockContextValues,
          }}
        >
          <DataPreviewTableFilters
            width={1000}
            selectedTable={mockSelectedTable}
            setIsCustomDateRange={setIsCustomDateRange}
            handleDateRangeChange={handleDateRangeChange}
            setIsFiltered={setIsFiltered}
            config={datasetConfig}
            currentDateButton="byLast30Days"
          />
        </DataTableContext.Provider>
      );

      const dropdownButton = getByRole('button', { name: 'Filters: 0 applied' });
      fireEvent.click(dropdownButton);
      const expectedLabel = 'Last 30 Days';
      const radioBtn = getByRole('radio', { name: expectedLabel });
      expect(radioBtn).toBeInTheDocument();
    });
    // TODO: Add back when analytics are enabled
    // it('initiates Analytics.event with correct parameters for all buttons', async () => {
    //   const { getByRole } = render(
    //     <DataTableContext.Provider
    //       value={{
    //         ...mockContextValues,
    //       }}
    //     >
    //       <DataPreviewTableFilters
    //         width={1000}
    //         selectedTable={mockSelectedTable}
    //         setIsCustomDateRange={setIsCustomDateRange}
    //         handleDateRangeChange={handleDateRangeChange}
    //         setIsFiltered={setIsFiltered}
    //         config={datasetConfig}
    //         currentDateButton="byLast30Days"
    //       />
    //     </DataTableContext.Provider>
    //   );
    //
    //   const dropdownButton = getByRole('button', { name: 'Filters: 0 applied' });
    //   fireEvent.click(dropdownButton);
    //
    //   const radioBtn = getByRole('radio', { name: 'All' });
    //   const spy = jest.spyOn(Analytics, 'event');
    //   fireEvent.click(radioBtn);
    //   expect(spy).toHaveBeenCalledWith(expect.objectContaining({ label: 'All' }));
    // });
  });
});
