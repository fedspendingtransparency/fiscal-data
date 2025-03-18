import React, { FunctionComponent, useEffect, useState } from 'react';
import determineDateRange, {
  generateAnalyticsEvent,
  generateFormattedDate,
  prepAvailableDates,
} from '../../../../../../filter-download-container/range-presets/helpers/helper';
import { differenceInYears } from 'date-fns';
import { monthNames } from '../../../../../../../utils/api-utils';
import { presetContainer, radio, selected, toggleButton } from './date-presets.module.scss';
import { IDatePresets } from '../../../../../../../models/data-preview/IDatePresets';

const DatePresets: FunctionComponent<IDatePresets> = ({
  currentDateButton,
  datePreset,
  customRangePreset,
  selectedTable,
  apiData,
  handleDateRangeChange,
  allTablesSelected,
  datasetDateRange,
  finalDatesNotFound,
  hideButtons,
  setPickerDateRange,
  hidden,
}) => {
  const [activePresetKey, setActivePresetKey] = useState(null);
  const [availableDateRange, setAvailableDateRange] = useState(null);
  const [dateRange, setCurDateRange] = useState(null);
  const [presets, setPresets] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const basePreset = [{ label: 'All', key: 'all', years: null }];
  const possiblePresets = [
    { label: '1 Year', key: '1yr', years: 1 },
    { label: '5 Years', key: '5yr', years: 5 },
    { label: '10 Years', key: '10yr', years: 10 },
  ];
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
    let label = preset.label;
    if (label && label.toLowerCase() === 'custom') {
      label = generateFormattedDate(dateRange);
    }
    generateAnalyticsEvent(label);
    setActivePresetKey(preset.key);
    prepUpdateDateRange(preset);
  };

  const prepUpdateDateRange = preset => {
    const curDateRange = determineDateRange(availableDateRange, preset, currentDateButton);
    updateDateRange(curDateRange);
  };

  const updateDateRange = curDateRange => {
    if (curDateRange) {
      setPickerDateRange({ ...availableDateRange, from: curDateRange.from, to: curDateRange.to });
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
        //TODO adjust logic for external custom pickers
        // if (curSelectedOption.key === 'custom') {
        //   const adjustedRange = fitDateRangeToTable(dateRange, availableDateRange);
        //   setPickerDateRange(availableDateRange);
        //   setCurDateRange(adjustedRange);
        //   handleDateRangeChange(adjustedRange);
        // } else {
        prepUpdateDateRange(curSelectedOption);
        // }
        return;
      }
      if (datePreset === 'current' && presets[0].key === 'current') {
        idealDefaultPreset = presets[0];
      }
      if (datePreset === 'all' && presets[4].key === 'all') {
        idealDefaultPreset = presets[4];
      }
      // if (datePreset === 'custom' && customRangePreset === 'latestQuarter') {
      //   idealDefaultPreset = presets.find(({ key }) => key === 'custom');
      //
      //   const dateObj = new Date(Date.parse(datasetDateRange.latestDate));
      //   const quarterRange = {
      //     userSelected: {
      //       from: subQuarters(addDays(dateObj, 1), 1),
      //       to: dateObj,
      //     },
      //   };
      //   const adjRange = fitDateRangeToTable(quarterRange, availableDateRange);
      //   updateDateRange(adjRange);
      // }
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
      // applyPreset(customPreset);
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

  useEffect(() => {
    // This hook is used for nested tables
    // when the summary view date range is locked, all rows should display
    if (hideButtons) {
      setActivePresetKey('all');
    }
  }, [hideButtons]);

  return (
    <>
      {!hideButtons && (
        <div id={presetContainer}>
          {presets.map(preset => (
            <React.Fragment key={preset.key}>
              <input
                type="radio"
                name="range-toggle"
                className={radio}
                checked={preset.key === activePresetKey}
                id={`radio-${preset.key}`}
                onChange={() => {
                  applyPreset(preset);
                }}
                tabIndex={hidden ? -1 : 0}
                disabled={hidden}
              />
              <label
                className={`
                    ${toggleButton} ${activePresetKey === preset.key ? selected : ''}
                  `}
                htmlFor={`radio-${preset.key}`}
              >
                {preset.label}
              </label>
            </React.Fragment>
          ))}
        </div>
      )}
    </>
  );
};

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

export default DatePresets;
