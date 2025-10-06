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
import determineDateRange, { generateFormattedDate, prepAvailableDates } from '../../../filter-download-container/range-presets/helpers/helper';
import { addDays, differenceInYears, subQuarters } from 'date-fns';
import { fitDateRangeToTable } from '../../../filter-download-container/range-presets/range-presets';
import { monthNames } from '../../../../utils/api-utils';
import { DataTableContext } from '../../data-preview-context';
import { basePreset, customPreset, fallbackPresets, initializeFilterConfigMap } from './data-preview-filter-helper';

const DataPreviewTableFilters: FunctionComponent<ITableFilters> = ({
  selectedTable,
  dateRange,
  setDateRange,
  allTablesSelected,
  handleDateRangeChange,
  setIsCustomDateRange,
  finalDatesNotFound,
  apiData,
  width,
  currentDateButton,
  datePreset,
  customRangePreset,
  setIsFiltered,
  datasetDateRange,
  pivotView,
  dropdownWidth,
}) => {
  const { tableState: table, allColumns, appliedFilters, setAppliedFilters } = useContext(DataTableContext);
  const [active, setActive] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState('');
  const [isFilterSelected, setIsFilterSelected] = useState(false);
  const [filter, setFilter] = useState('');
  const [visibleOptions, setVisibleOptions] = useState();
  const [noResults, setNoResults] = useState(false);
  const [filterMap, setFiltersMap] = useState();
  // Date Range Presets
  const [activePresetKey, setActivePresetKey] = useState(null);
  const [availableDateRange, setAvailableDateRange] = useState(null);
  const [presetCustomDateRange, setPresetCustomDateRange] = useState(null);
  const [curDateRange, setCurDateRange] = useState(null);
  const [presets, setPresets] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);

  // Not all datasets will have 5 years of information; but, this is the ideal default preset.
  let idealDefaultPreset = { key: '5yr', years: 5 };

  const possiblePresets = [
    { label: '1 Year', key: '1yr', years: 1 },
    { label: '5 Years', key: '5yr', years: 5 },
    { label: '10 Years', key: '10yr', years: 10 },
  ];
  const allTablesDateRange = prepAvailableDates(datasetDateRange);
  /**
   * DATE RANGE
   */

  const applyPreset = preset => {
    let isFiltered = true;

    let label = preset.label;
    if (label && label.toLowerCase() === 'custom') {
      label = generateFormattedDate(curDateRange);
    }
    // generateAnalyticsEvent(label);
    setActivePresetKey(preset.key);
    setIsCustomDateRange(preset.key === customPreset.key);

    if (preset.key !== customPreset.key) {
      prepUpdateDateRange(preset);
    } else {
      handleDateRangeChange(curDateRange);
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

  const updateDateRange = range => {
    if (range) {
      setPresetCustomDateRange(range);
      setCurDateRange(range);
      handleDateRangeChange(range);
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
          const adjustedRange = fitDateRangeToTable(curDateRange, availableDateRange);
          setPresetCustomDateRange(availableDateRange);
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
    setFiltersMap(initializeFilterConfigMap(selectedTable, null));
  }, []);

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
      setPresets(curPresets);
    }
  }, [allTablesSelected, finalDatesNotFound, selectedTable]);

  const initializeVisibleColumns = (activeFields, allFields, pivotView) => {
    let visibleCols;
    if (activeFields && allFields) {
      if (pivotView?.title !== 'Complete Table' && pivotView?.dimensionField) {
        visibleCols = [];
        activeFields.forEach(field =>
          visibleCols.push({ id: field.id, prettyName: field.columnDef.header, dataType: 'string', columnName: field.id })
        );
      } else {
        visibleCols = allFields.filter(field => activeFields.findIndex(x => x.id === field.columnName) >= 0);
      }
      return visibleCols;
    }
  };

  const handleApply = () => {
    const allAppliedFilters = [];
    const map = JSON.parse(JSON.stringify(filterMap));
    const allLeafCols = table?.getAllLeafColumns();
    if (allLeafCols) {
      allLeafCols.forEach(col => {
        const matchedIndex = selectedTable.fields.findIndex(field => field.columnName === col.columnDef?.accessorKey);
        if (matchedIndex > -1) {
          const { columnName, dataType } = selectedTable.fields[matchedIndex];
          if (dataType !== 'DATE') {
            const pendingVal = map[columnName].pendingValue;
            const filterVal = map[columnName].filterValue;
            if (pendingVal !== filterVal) {
              map[columnName].filterValue = pendingVal;
              selectedTable.fields[matchedIndex].filterValue = pendingVal;
            }
            col.setFilterValue(pendingVal);

            if (pendingVal) {
              allAppliedFilters.push(columnName);
            }
            setFiltersMap(map);
          } else {
            //TODO: Re-add code when implementing date filters
            // const startDate = fields[matchedIndex]?.pendingStartDate;
            // const endDate = fields[matchedIndex]?.pendingEndDate;
            // if (startDate && endDate) {
            //   const datesToApply = getDaysArray(formatDateForApi(startDate), formatDateForApi(endDate));
            //   const dateRangeToApply = { ...dateRange, from: startDate, to: endDate };
            //   col.setFilterValue(datesToApply);
            //   setDateRange(dateRangeToApply);
            // }
          }
        }
      });
    }

    setTimeout(() => {
      setActive(false);
    });

    setAppliedFilters(allAppliedFilters);
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

  useEffect(() => {
    if (!active) {
      if (filterMap) {
        const map = JSON.parse(JSON.stringify(filterMap));

        if (!pivotView) {
          selectedTable.fields.forEach(field => {
            const { columnName } = field;
            map[columnName].pendingValue = map[columnName].filterValue;
          });
          setFiltersMap(map);
        }
      }
    }
  }, [active]);

  const selectedOptionDisplay = () => {
    if (appliedFilters.length !== 1) {
      return `${appliedFilters.length} applied`;
    } else {
      const initialCols = initializeVisibleColumns(table?.getAllLeafColumns(), selectedTable.fields, pivotView);
      const match = initialCols.findIndex(filter => filter.columnName === appliedFilters[0]);
      if (match !== -1) {
        return initialCols[match].prettyName;
      }
    }
  };

  const filterDropdownButton = (
    <DropdownLabelButton
      label="Filters"
      selectedOption={selectedOptionDisplay()}
      filtersAreSelected={appliedFilters.length > 0 ? true : null}
      icon={faFilter}
      active={active}
      setActive={setActive}
      dropdownWidth={dropdownWidth}
    />
  );

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
    setFiltersMap(initializeFilterConfigMap(selectedTable, null, visibleOptions, pivotView));
    setAppliedFilters([]);
  }, [selectedTable, pivotView, visibleOptions]);

  useEffect(() => {
    const search = filter.toLowerCase();

    if (!search) {
      const initialCols = initializeVisibleColumns(table?.getAllLeafColumns(), selectedTable.fields, pivotView); //selectedTable.fields;
      if (initialCols?.length > 0) {
        setVisibleOptions(initialCols);
        setSelectedColumn(initialCols[0]);
      } else {
        setVisibleOptions(selectedTable.fields);
        setSelectedColumn(selectedTable.fields[0]);
      }
      setNoResults(false);
      return;
    }

    const matches = selectedTable.fields.filter(option => {
      const name = option.prettyName.toLowerCase();
      const secondary = (option.secondary ?? '').toLowerCase();
      return name.includes(search) || secondary.includes(search);
    });

    setVisibleOptions(matches);
    setNoResults(matches.length === 0);
  }, [filter, selectedTable.fields, table, allColumns]);

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
          optionLabelKey="prettyName"
          secondaryLabelKey="filterValue"
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
      selectedColumn={selectedColumn}
      selectedTable={selectedTable}
      presets={presets}
      activePresetKey={activePresetKey}
      presetCustomDateRange={presetCustomDateRange}
      filterMap={filterMap}
      setFilterMap={setFiltersMap}
      apiData={apiData}
    />
  );

  const mobileFilterComponent = isFilterSelected ? (
    // Shows the selected filter and its options
    <DataPreviewMobileDialog
      onCancel={handleCancel}
      onBack={handleBack}
      onApply={handleApply}
      filterName={selectedColumn.prettyName}
      hasSearch={false}
      backButtonText="Filters"
      searchText="Search filters"
      filterComponent={columnFilter}
      active={active}
    />
  ) : (
    // Shows the different filters to select
    <DataPreviewMobileDialog
      onCancel={handleCancel}
      onBack={handleCancel}
      onApply={handleApply}
      filterName="Filters"
      searchText="Search filters"
      filter={filter}
      setFilter={setFilter}
      setNoSearchResults={setNoResults}
      filterComponent={filterSelectList}
      active={active}
    />
  );

  return (
    <>
      {width >= pxToNumber(breakpointLg) && (
        <DropdownContainer dropdownButton={filterDropdownButton} setActive={handleCancel}>
          {active && (
            <DataPreviewDropdownDialogContainer
              searchComponent={
                <DataPreviewDropdownDialogSearch
                  options={visibleOptions}
                  searchBarLabel="Search filters"
                  selectedOption={selectedColumn}
                  setSelectedOption={setSelectedColumn}
                  optionLabelKey="prettyName"
                  secondaryLabelKey="filterValue"
                  isFilter={true}
                />
              }
              filterComponent={columnFilter}
              handleApply={handleApply}
              handleCancel={handleCancel}
              header={selectedColumn.prettyName}
            />
          )}
        </DropdownContainer>
      )}
      {width < pxToNumber(breakpointLg) && (
        <>
          {filterDropdownButton}
          {mobileFilterComponent}
        </>
      )}
    </>
  );
};
export default DataPreviewTableFilters;
