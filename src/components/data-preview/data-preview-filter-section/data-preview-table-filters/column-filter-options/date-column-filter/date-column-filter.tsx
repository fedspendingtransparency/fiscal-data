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
  presets,
  activePresetKey,
  pickerDateRange,
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
              <DatePresets hidden={selectedToggle !== 'preset'} presets={presets} activePresetKey={activePresetKey} />
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
              hasPresets={hasPresets}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default DateColumnFilter;
