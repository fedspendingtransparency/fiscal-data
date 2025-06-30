import React, { FunctionComponent, useEffect, useState } from 'react';
import {
  containerAdjustment,
  inputContainer,
  presetButton,
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
  presetCustomDateRange,
}) => {
  const hasPresets = selectedTable?.dateField === columnConfig?.columnName;
  const shouldUsePreset = preset => (preset !== 'custom' ? 'preset' : 'custom');
  const getDefaultToggle = () => {
    let defaultVal = 'custom';
    if (hasPresets) {
      defaultVal = !!columnConfig?.pendingPreset ? shouldUsePreset(columnConfig.pendingPreset) : shouldUsePreset(activePresetKey);
    }
    return defaultVal;
  };

  const [selectedToggle, setSelectedToggle] = useState(getDefaultToggle());

  useEffect(() => {
    setSelectedToggle(getDefaultToggle());
  }, [columnConfig]);

  useEffect(() => {
    columnConfig['pendingPreset'] = selectedToggle !== 'custom' ? activePresetKey : 'custom';
  }, [selectedToggle]);

  const handleDateRangeSelect = dateRange => {
    // handleDateRangeChange(dateRange);
  };

  return (
    <div className={sectionContainer}>
      <div className={inputContainer}>
        {hasPresets && (
          <div>
            <label className={`${radioButton} ${presetButton}`}>
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
              pickerDateRange={hasPresets && presetCustomDateRange}
              disabled={selectedToggle !== 'custom'}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default DateColumnFilter;
