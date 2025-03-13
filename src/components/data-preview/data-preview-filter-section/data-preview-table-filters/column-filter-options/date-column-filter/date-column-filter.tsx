import React, { FunctionComponent, useState } from 'react';
import { columnName, inputContainer, presetContainer, radioButton, sectionContainer, sectionDisabled } from './date-column-filter.module.scss';
import DatePresets from './date-presets/date-presets';
import CustomDateFilter from './custom-date-filter/custom-date-filter';

interface IDateColumnFilter {
  presets?: boolean;
  columnConfig;
  selectedTable;
  setDateRange;
  allTablesSelected;
  setIsFiltered;
  handleDateRangeChange;
  setIsCustomDateRange;
  finalDatesNotFound;
  detailApi;
  detailViewState;
}

const DateColumnFilter: FunctionComponent<IDateColumnFilter> = ({
  columnConfig,
  selectedTable,
  config,
  setDateRange,
  allTablesSelected,
  setIsFiltered,
  handleDateRangeChange,
  setIsCustomDateRange,
  finalDatesNotFound,
  detailApi,
  detailViewState,
  apiData,
}) => {
  const [selectedToggle, setSelectedToggle] = useState('preset');
  const [pickerDateRange, setPickerDateRange] = useState(null);

  const handleDateRangeSelect = dateRange => {
    console.log('selectedDateRange: ', dateRange);
    // handleDateRangeChange(dateRange);
  };
  return (
    <div className={sectionContainer}>
      <div className={columnName}>{columnConfig.name}</div>
      <div className={inputContainer}>
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
              setIsFiltered={setIsFiltered}
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
