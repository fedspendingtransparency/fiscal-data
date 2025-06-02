import React, { FunctionComponent, useState } from 'react';
import { columnName, inputContainer, presetContainer, radioButton, sectionContainer, sectionDisabled } from './date-column-filter.module.scss';
import DatePresets from './date-presets/date-presets';
import CustomDateFilter from './custom-date-filter/custom-date-filter';
import { IDateColumnFilter } from '../../../../../../models/data-preview/IDateColumnFilter';

const DateColumnFilter: FunctionComponent<IDateColumnFilter> = ({
  columnConfig,
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
}) => {
  const presets = selectedTable?.dateField === columnConfig?.columnName;
  const [selectedToggle, setSelectedToggle] = useState(config.datePreset ? config.datePreset : 'preset');
  // const [selectedToggle, setSelectedToggle] = useState(presets ? 'preset' : 'custom');
  const [pickerDateRange, setPickerDateRange] = useState({
    from: undefined,
    to: undefined,
    earliestDate: '1-1-1900',
    latestDate: '12-31-2999',
  });

  const handleDateRangeSelect = dateRange => {
    // handleDateRangeChange(dateRange);
  };

  return (
    <div className={sectionContainer}>
      <div className={columnName}>{columnConfig.prettyName}</div>
      <div className={inputContainer}>
        {presets && (
          <div>
            <label className={radioButton}>
              <input
                type="radio"
                name="date-toggle"
                id="radio-preset"
                checked={selectedToggle === 'preset'}
                onChange={() => setSelectedToggle('preset')}
              />
              Preset
            </label>
            <div className={`${presetContainer} ${selectedToggle !== 'preset' ? sectionDisabled : undefined}`}>
              <DatePresets
                handleDateRangeChange={handleDateRangeSelect}
                selectedTable={!!detailViewState ? detailApi : selectedTable}
                apiData={apiData}
                currentDateButton={config.currentDateButton}
                datePreset={config.datePreset}
                customRangePreset={config.customRangePreset}
                allTablesSelected={allTablesSelected}
                datasetDateRange={{
                  earliestDate: config.techSpecs.earliestDate,
                  latestDate: config.techSpecs.latestDate,
                }}
                finalDatesNotFound={finalDatesNotFound}
                hideButtons={detailApi && !detailViewState}
                setPickerDateRange={setPickerDateRange}
                hidden={selectedToggle !== 'preset'}
              />
            </div>
          </div>
        )}
        <div>
          <label className={radioButton}>
            <input
              type="radio"
              name="date-toggle"
              id="radio-custom"
              checked={selectedToggle === 'custom'}
              onChange={() => setSelectedToggle('custom')}
            />
            Custom
          </label>
          <div className={presetContainer}>
            <CustomDateFilter
              pickerDateRange={pickerDateRange}
              disabled={selectedToggle !== 'custom'}
              datePreset={config.datePreset}
              setPickerDateRange={setPickerDateRange}
              handleDateRangeChange={handleDateRangeSelect}
              datasetDateRange={{
                earliestDate: config.techSpecs.earliestDate,
                latestDate: config.techSpecs.latestDate,
              }}
              currentDateButton={config.currentDateButton}
              selectedToggle={selectedToggle}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateColumnFilter;
