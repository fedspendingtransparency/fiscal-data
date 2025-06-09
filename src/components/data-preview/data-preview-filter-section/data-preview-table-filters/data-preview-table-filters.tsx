import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import DropdownLabelButton from '../../../dropdown-label-button/dropdown-label-button';
import DropdownContainer from '../../../dropdown-container/dropdown-container';
import DataPreviewDropdownDialogContainer from '../../data-preview-dropdown-dialog/data-preview-dropdown-dialog';
import ColumnFilterOptions from './column-filter-options/column-filter-options';
import { ITableFilters } from '../../../../models/data-preview/ITableFilters';
import DataPreviewMobileDialog from '../../data-preview-mobile-dialog/data-preview-mobile-dialog';
import { pxToNumber } from '../../../../helpers/styles-helper/styles-helper';
import { breakpointLg } from '../../data-preview.module.scss';
import DataPreviewMobileFilterList from '../data-preview-mobile-filter-list/data-preview-mobile-filter-list';
import DataPreviewDropdownDialogSearch from '../../data-preview-dropdown-search/data-preview-dropdown-dialog-search';
import { boldedSearchText, noFilterMatchContainer } from '../data-preview-filter-section.module.scss';
import determineDateRange, {
  generateAnalyticsEvent,
  generateFormattedDate,
  prepAvailableDates,
} from '../../../filter-download-container/range-presets/helpers/helper';
import { addDays, differenceInYears, subQuarters } from 'date-fns';
import { fitDateRangeToTable } from '../../../filter-download-container/range-presets/range-presets';
import { monthNames } from '../../../../utils/api-utils';
import { DataTableContext } from '../../data-preview-context';

const DataPreviewTableFilters: FunctionComponent<ITableFilters> = ({
  selectedTable,
  config,
  setDateRange,
  allTablesSelected,
  handleDateRangeChange,
  setIsCustomDateRange,
  finalDatesNotFound,
  detailApi,
  detailViewState,
  apiData,
  width,
  currentDateButton,
  datePreset,
  customRangePreset,
  setIsFiltered,
  datasetDateRange,
}) => {
  const { tableState: table } = useContext(DataTableContext);

  const createFilterConfigs = (fields, datePreset) => {
    console.log(selectedTable);
    const fieldsConfig = [...fields];
    fieldsConfig.forEach(field => {
      if (field.dataType === 'DATE') {
        field.pendingStartDate = field?.pendingStartDate;
        field.pendingEndDate = field?.pendingEndDate;
        if (field.columnName === selectedTable?.dateField && datePreset) {
          console.log(datePreset);
          field.defaultStartDate = datePreset?.from;
          field.defaultEndDate = datePreset?.to;
        }
      } else {
        field.pendingValue = '';
      }
    });
    console.log(fieldsConfig);
    return fieldsConfig;
  };

  const [filterFieldConfig, setFilterFieldsConfig] = useState(createFilterConfigs(selectedTable.fields, null));
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [active, setActive] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState('');
  const [isFilterSelected, setIsFilterSelected] = useState(false);
  const [filter, setFilter] = useState('');
  const [visibleOptions, setVisibleOptions] = useState(filterFieldConfig);
  const [noResults, setNoResults] = useState(false);
  const [activePresetKey, setActivePresetKey] = useState(null);
  const [availableDateRange, setAvailableDateRange] = useState(null);
  const [pickerDateRange, setPickerDateRange] = useState(null);
  const [dateRange, setCurDateRange] = useState(null);
  const [presets, setPresets] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const basePreset = [{ label: 'All', key: 'all', years: null }];
  const possiblePresets = [
    { label: '1 Year', key: '1yr', years: 1 },
    { label: '5 Years', key: '5yr', years: 5 },
    { label: '10 Years', key: '10yr', years: 10 },
  ];
  const customPreset = { label: 'Custom', key: 'custom', years: null };
  // Not all datasets will have 5 years of information; but, this is the ideal default preset.
  let idealDefaultPreset = { key: '5yr', years: 5 };
  // If a data table has less than 5 years of data, we need to find the next best option to select
  // by default.
  const fallbackPresets = ['1yr', 'current', 'all'];

  const allTablesDateRange = prepAvailableDates(datasetDateRange);
  /**
   * DATE RANGE
   */

  const applyPreset = preset => {
    let isFiltered = true;

    let label = preset.label;
    if (label && label.toLowerCase() === 'custom') {
      label = generateFormattedDate(dateRange);
    }
    generateAnalyticsEvent(label);

    setActivePresetKey(preset.key);
    setIsCustomDateRange(preset.key === customPreset.key);

    if (preset.key !== customPreset.key) {
      prepUpdateDateRange(preset);
    } else {
      handleDateRangeChange(dateRange);
    }

    if (preset.key === 'all') {
      isFiltered = false;
    }

    setIsFiltered(isFiltered);
  };

  const prepUpdateDateRange = preset => {
    const curDateRange = determineDateRange(availableDateRange, preset, currentDateButton);
    updateDateRange(curDateRange);
  };

  useEffect(() => {
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!');
  }, []);

  // useEffect(() => {}, [pickerDateRange]);

  const updateDateRange = curDateRange => {
    if (curDateRange) {
      console.log('!', pickerDateRange);
      setPickerDateRange(curDateRange);
      setFilterFieldsConfig(createFilterConfigs(filterFieldConfig, curDateRange));
      setCurDateRange(curDateRange);
      handleDateRangeChange(curDateRange);
    }
  };

  const placeApplicableYearPresets = ({ to, from }) => {
    const curPresets = basePreset.slice();
    const dateYearDifference = differenceInYears(to, from);

    for (let i = possiblePresets.length; i--; ) {
      if (possiblePresets[i].years <= dateYearDifference) {
        possiblePresets.length = i + 1;
        curPresets.unshift(...possiblePresets);
        break;
      }
    }

    return curPresets;
  };

  const setMostAppropriatePreset = () => {
    if (presets && presets.length) {
      // If the currently selected date option is available on the newly created presets,
      // then keep the current selection.
      const curSelectedOption = presets.find(preset => preset.key === activePresetKey);
      if (curSelectedOption) {
        // We need to pass back the date range for the new data table. Note, the actual dates
        // might not be the same from the previously selected table, even though the preset is
        // the same.
        if (curSelectedOption.key === 'custom') {
          const adjustedRange = fitDateRangeToTable(dateRange, availableDateRange);
          setPickerDateRange(availableDateRange);
          setCurDateRange(adjustedRange);
          handleDateRangeChange(adjustedRange);
        } else {
          prepUpdateDateRange(curSelectedOption);
        }
        return;
      }
      if (datePreset === 'current' && presets[0].key === 'current') {
        idealDefaultPreset = presets[0];
      }
      if (datePreset === 'all' && presets[4].key === 'all') {
        idealDefaultPreset = presets[4];
      }
      if (datePreset === 'custom' && customRangePreset === 'latestQuarter') {
        // idealDefaultPreset = presets.find(({ key }) => key === 'custom');
        const dateObj = new Date(Date.parse(datasetDateRange.latestDate));
        const quarterRange = {
          userSelected: {
            from: subQuarters(addDays(dateObj, 1), 1),
            to: dateObj,
          },
        };
        const adjRange = fitDateRangeToTable(quarterRange, availableDateRange);
        updateDateRange(adjRange);
      }
      // Check if the default date option is available in the preset list. If so, select the default
      // preset, else select the next available option.
      const defaultPresetIsFound = presets.some(preset => preset.key === idealDefaultPreset.key);
      let defaultKey = null;

      // If the desired default preset is not available because of the date range on the dataset
      // table, find the next appropriate button to highlight
      if (!defaultPresetIsFound) {
        for (let i = 0, il = fallbackPresets.length; i < il; i++) {
          const fallbackPreset = presets.find(p => p.key === fallbackPresets[i]);
          if (fallbackPreset) {
            defaultKey = fallbackPreset;
            break;
          }
        }
      } else {
        defaultKey = idealDefaultPreset;
      }
      if (datePreset !== 'custom') {
        applyPreset(defaultKey);
      }
    }
  };

  useEffect(() => {
    setMostAppropriatePreset();
  }, [presets]);

  useEffect(() => {
    if (selectedTable.userFilter && apiData?.data && initialLoad) {
      setInitialLoad(false);
      applyPreset(customPreset);
    }
  }, [apiData]);

  useEffect(() => {
    if (!finalDatesNotFound) {
      const availableRangeForSelection = allTablesSelected ? allTablesDateRange : prepAvailableDates(selectedTable);
      setAvailableDateRange(availableRangeForSelection);
      const curPresets = placeApplicableYearPresets(availableRangeForSelection);

      if (currentDateButton) {
        const latestDate = availableRangeForSelection.to;
        let buttonLabel;

        const month = latestDate.getMonth();
        const date = latestDate.getDate();
        const fullYear = latestDate.getFullYear();

        if (currentDateButton === 'byDay') {
          buttonLabel = latestDate ? `${monthNames[month]} ${date}, ${fullYear}` : '';
        } else if (currentDateButton === 'byLast30Days') {
          buttonLabel = latestDate ? 'Last 30 Days' : '';
        } else {
          buttonLabel = latestDate ? monthNames[month] + ' ' + fullYear.toString() : '';
        }
        curPresets.unshift({ label: buttonLabel, key: 'current', years: null });
      }
      // curPresets.push(customPreset);
      setPresets(curPresets);
    }
  }, [allTablesSelected, finalDatesNotFound, selectedTable]);

  const initializeVisibleColumns = (activeFields, allFields) => {
    if (activeFields && allFields) {
      return allFields.filter(field => activeFields.findIndex(x => x.id === field.columnName) >= 0);
    }
  };

  const filterDropdownButton = (
    <DropdownLabelButton label="Filters" selectedOption={appliedFilters.length + ' applied'} icon={faFilter} active={active} setActive={setActive} />
  );

  const handleApply = () => {
    setActive(false);
    if (isFilterSelected) {
      setIsFilterSelected(false);
    }
  };
  const handleCancel = () => {
    setActive(false);
    if (isFilterSelected) {
      setIsFilterSelected(false);
    }
  };

  const handleBack = () => {
    if (isFilterSelected) {
      setIsFilterSelected(false);
    }
  };

  // Need to find a way to prevent background scrolling for mobile users
  // useEffect(() => {
  //   if (active) {
  //     document.body.style.overflow = 'hidden';
  //   } else {
  //     document.body.style.overflow = '';
  //   }
  // }, [active]);

  useEffect(() => {
    const search = filter.toLowerCase();

    if (!search) {
      const initialCols = initializeVisibleColumns(table?.getAllLeafColumns(), filterFieldConfig);
      if (initialCols?.length > 0) {
        setVisibleOptions(initialCols);
        setSelectedColumn(initialCols[0]);
      }
      setNoResults(false);
      return;
    }

    const matches = filterFieldConfig.filter(option => {
      const name = option.prettyName.toLowerCase();
      const secondary = (option.secondary ?? '').toLowerCase();
      return name.includes(search) || secondary.includes(search);
    });

    setVisibleOptions(matches);
    setNoResults(matches.length === 0);
  }, [filter, selectedTable.fields, table]);

  const filterSelectList = (
    <>
      {noResults ? (
        <div className={noFilterMatchContainer}>
          No match for <span className={boldedSearchText}>'{filter}'</span>. Please revise your search and try again.
        </div>
      ) : (
        <DataPreviewMobileFilterList
          filterOptions={visibleOptions}
          filter={filter}
          getName={option => option.prettyName}
          getSecondary={option => option.secondary}
          onIsFilterSelected={() => {
            setIsFilterSelected(true);
          }}
          onWhichFilterSelected={filter => {
            setSelectedColumn(filter);
          }}
        />
      )}
    </>
  );

  const columnFilter = (
    <ColumnFilterOptions
      setAppliedFilters={setAppliedFilters}
      selectedColumn={selectedColumn}
      selectedTable={selectedTable}
      config={config}
      allTablesSelected={allTablesSelected}
      finalDatesNotFound={finalDatesNotFound}
      detailApi={detailApi}
      detailViewState={detailViewState}
      apiData={apiData}
      presets={presets}
      activePresetKey={activePresetKey}
      pickerDateRange={pickerDateRange}
      setPickerDateRange={setPickerDateRange}
    />
  );

  const mobileFilterComponent = isFilterSelected ? (
    // Shows the selected filter and its options
    <DataPreviewMobileDialog
      onCancel={handleCancel}
      onBack={handleBack}
      filterName={selectedColumn.prettyName}
      hasSearch={false}
      backButtonText="Filters"
      searchText="Search filters"
      filterComponent={columnFilter}
    />
  ) : (
    // Shows the different filters to select
    <DataPreviewMobileDialog
      onCancel={handleCancel}
      onBack={handleCancel}
      filterName="Filters"
      searchText="Search filters"
      filter={filter}
      setFilter={setFilter}
      setNoSearchResults={setNoResults}
      filterComponent={filterSelectList}
    />
  );

  return (
    <>
      {width >= pxToNumber(breakpointLg) && (
        <DropdownContainer dropdownButton={filterDropdownButton} setActive={setActive}>
          {active && (
            <DataPreviewDropdownDialogContainer
              searchComponent={
                <DataPreviewDropdownDialogSearch
                  options={visibleOptions}
                  searchBarLabel="Search filters"
                  selectedFilter={selectedColumn}
                  setSelectedFilter={setSelectedColumn}
                  optionLabelKey="prettyName"
                  secondaryLabelKey="filter"
                  isFilter={true}
                />
              }
              filterComponent={columnFilter}
              handleApply={handleApply}
              handleCancel={handleCancel}
            />
          )}
        </DropdownContainer>
      )}
      {width < pxToNumber(breakpointLg) && (
        <>
          {filterDropdownButton}
          {active && mobileFilterComponent}
        </>
      )}
    </>
  );
};
export default DataPreviewTableFilters;
