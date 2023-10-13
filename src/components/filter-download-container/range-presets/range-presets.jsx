import React, { useState, useEffect } from 'react';
import { header, presetContainer, radio, toggleButton, selected } from './range-presets.module.scss';
import { monthNames } from '../../../utils/api-utils';
import { addDays, subQuarters, differenceInYears } from 'date-fns';
import determineDateRange, { generateAnalyticsEvent, generateFormattedDate, prepAvailableDates } from './helpers/helper';
import DatePickers from '../datepickers/datepickers';
import UserFilter from '../user-filter/user-filter';

const RangePresets = ({
  currentDateButton,
  datePreset,
  customRangePreset,
  selectedTable,
  apiData,
  onUserFilter,
  setDateRange,
  setIsFiltered,
  setIsCustomDateRange,
  allTablesSelected,
  datasetDateRange,
  finalDatesNotFound,
}) => {
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
      setDateRange(dateRange);
    }

    if (preset.key === 'all') {
      isFiltered = false;
    }

    setIsFiltered(isFiltered);
  };

  const prepUpdateDateRange = preset => {
    const curDateRange = determineDateRange(availableDateRange, preset);
    updateDateRange(curDateRange);
  };

  const updateDateRange = curDateRange => {
    if (curDateRange) {
      setPickerDateRange(availableDateRange);
      setCurDateRange(curDateRange);
      setDateRange(curDateRange);
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
          setDateRange(adjustedRange);
        } else {
          prepUpdateDateRange(curSelectedOption);
        }
        return;
      }
      if (datePreset === 'current' && presets[0].key === 'current') {
        idealDefaultPreset = presets[0];
      }
      if (datePreset === 'custom' && customRangePreset === 'latestQuarter') {
        idealDefaultPreset = presets.find(({ key }) => key === 'custom');

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
      applyPreset(defaultKey);
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
      curPresets.push(customPreset);
      setPresets(curPresets);
    }
  }, [selectedTable, allTablesSelected, finalDatesNotFound]);

  const label =
    selectedTable && selectedTable.fields
      ? ` (${selectedTable.fields.find(field => field.columnName === selectedTable.dateField).prettyName})`
      : null;
  return (
    <>
      <h3 className={header} data-test-id={'header'}>
        Date Range<span data-test-id={'label'}>{label}</span>:
      </h3>
      <div id={presetContainer}>
        {presets.map(preset => (
          <React.Fragment key={preset.key}>
            {preset.key === 'custom' ? (
              <>
                <input
                  type="radio"
                  name="range-toggle"
                  className={radio}
                  checked={customPreset.key === activePresetKey}
                  id={`radio-${customPreset.key}`}
                  onChange={() => {
                    applyPreset(customPreset);
                  }}
                  tabIndex={0}
                  data-test-id={`preset-radio-${customPreset.key}`}
                />
                <label
                  className={`
                    ${toggleButton} ${activePresetKey === customPreset.key ? selected : ''}
                  `}
                  htmlFor={`radio-${customPreset.key}`}
                  data-test-id={`preset-label-${customPreset.key}`}
                >
                  {customPreset.label}
                </label>
              </>
            ) : (
              <>
                <input
                  type="radio"
                  name="range-toggle"
                  className={radio}
                  checked={preset.key === activePresetKey}
                  id={`radio-${preset.key}`}
                  onChange={() => {
                    applyPreset(preset);
                  }}
                  tabIndex={0}
                  data-test-id={`preset-radio-${preset.key}`}
                />
                <label
                  className={`
                    ${toggleButton} ${activePresetKey === preset.key ? selected : ''}
                  `}
                  htmlFor={`radio-${preset.key}`}
                  data-test-id={`preset-label-${preset.key}`}
                >
                  {preset.label}
                </label>
              </>
            )}
          </React.Fragment>
        ))}
      </div>
      {activePresetKey === customPreset.key && (
        <DatePickers selectedDateRange={dateRange} availableDateRange={pickerDateRange} setSelectedDates={updateDateRange} />
      )}
      {selectedTable.userFilter && <UserFilter selectedTable={selectedTable} onUserFilter={onUserFilter} apiData={apiData} />}
    </>
  );
};

export default RangePresets;

export const fitDateRangeToTable = (dateRange, availableRange) => {
  // if there's a userSelected range stored, start with that instead of whatever it was adjusted to
  const selectedRange = dateRange.userSelected ? dateRange.userSelected : dateRange;
  const adjRange = Object.assign({}, selectedRange);
  if (selectedRange.to < availableRange.from) {
    // the whole selected range comes before new available range, so set both dates to the earliest
    // available
    adjRange.to = adjRange.from = availableRange.from;
    adjRange.userSelected = selectedRange; // store the range as it was when requested
    return adjRange;
  }
  if (selectedRange.from > availableRange.to) {
    // the whole selected range comes after new available range, so set both dates to the latest
    // available
    adjRange.to = adjRange.from = availableRange.to;
    adjRange.userSelected = selectedRange; // store the range as it was when requested
    return adjRange;
  }
  adjRange.from = selectedRange.from > availableRange.from ? selectedRange.from : availableRange.from;
  adjRange.to = selectedRange.to < availableRange.to ? selectedRange.to : availableRange.to;
  if (adjRange.from.getTime() === selectedRange.from.getTime() && adjRange.to.getTime() === selectedRange.to.getTime()) {
    // able to use the full latest user selected range as-is, so don't store it separately
    delete adjRange.userSelected;
  } else {
    adjRange.userSelected = selectedRange; // store the range as it was when requested
  }
  return adjRange;
};
