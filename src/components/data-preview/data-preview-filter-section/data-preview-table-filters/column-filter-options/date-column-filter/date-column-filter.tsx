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
  const presets = selectedTable?.dateField === columnConfig?.field;
  const [selectedToggle, setSelectedToggle] = useState(presets ? 'preset' : 'custom');
  const [pickerDateRange, setPickerDateRange] = useState({
    from: undefined,
    to: undefined,
    earliestDate: '1-1-1900',
    latestDate: '12-31-1299',
  });

  const handleDateRangeSelect = dateRange => {
    // handleDateRangeChange(dateRange);
  };

  return (
    <div className={sectionContainer}>
      <div className={columnName}>{columnConfig.name}</div>
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
                setDateRange={setDateRange}
                handleDateRangeChange={handleDateRangeSelect}
                selectedTable={!!detailViewState ? detailApi : selectedTable}
                apiData={apiData}
                onUserFilter={allTablesSelected}
                currentDateButton={config.currentDateButton}
                datePreset={config.datePreset}
                customRangePreset={config.customRangePreset}
                setIsCustomDateRange={setIsCustomDateRange}
                allTablesSelected={allTablesSelected}
                datasetDateRange={{
                  earliestDate: config.techSpecs.earliestDate,
                  latestDate: config.techSpecs.latestDate,
                }}
                finalDatesNotFound={finalDatesNotFound}
                datatableBanner={config.datatableBanner}
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
            <CustomDateFilter pickerDateRange={pickerDateRange} disabled={selectedToggle !== 'custom'} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateColumnFilter;
