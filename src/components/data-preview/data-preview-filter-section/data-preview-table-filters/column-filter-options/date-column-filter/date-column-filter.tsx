import React, { FunctionComponent, useState } from 'react';
import {
  columnName,
  containerAdjustment,
  inputContainer,
  presetContainer,
  radioButton,
  sectionContainer,
  sectionDisabled,
} from './date-column-filter.module.scss';
import DatePresets from './date-presets/date-presets';
import CustomDateFilter from './custom-date-filter/custom-date-filter';
import { IDateColumnFilter } from '../../../../../../models/data-preview/IDateColumnFilter';

const DateColumnFilter: FunctionComponent<IDateColumnFilter> = ({
  columnConfig,
  selectedTable,
  config,
  allTablesSelected,
  finalDatesNotFound,
  detailApi,
  detailViewState,
  apiData,
  presets,
  activePresetKey,
  pickerDateRange,
  setPickerDateRange,
}) => {
  const hasPresets = selectedTable?.dateField === columnConfig?.columnName;
  const [selectedToggle, setSelectedToggle] = useState(hasPresets && config?.datePreset !== 'custom' ? 'preset' : 'custom');

  const handleDateRangeSelect = dateRange => {
    // handleDateRangeChange(dateRange);
  };
  return (
    <div className={sectionContainer}>
      <div className={columnName}>{columnConfig.prettyName}</div>
      <div className={inputContainer}>
        {hasPresets && (
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
                setPickerDateRange={setPickerDateRange}
                hidden={selectedToggle !== 'preset'}
                presets={presets}
                activePresetKey={activePresetKey}
              />
            </div>
          </div>
        )}
        <div>
          {hasPresets && (
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
          )}
          <div className={`${presetContainer} ${!hasPresets ? containerAdjustment : ''}`}>
            <CustomDateFilter
              columnConfig={columnConfig}
              pickerDateRange={pickerDateRange}
              disabled={selectedToggle !== 'custom'}
              // datePreset={config.datePreset}
              // setPickerDateRange={setPickerDateRange}
              // handleDateRangeChange={handleDateRangeSelect}
              // datasetDateRange={{
              //   earliestDate: config.techSpecs.earliestDate,
              //   latestDate: config.techSpecs.latestDate,
              // }}
              // currentDateButton={config.currentDateButton}
              // selectedToggle={selectedToggle}
              hasPresets={hasPresets}
              columnConfig={columnConfig}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default DateColumnFilter;
