import React, { FunctionComponent } from 'react';
import { columnName, inputContainer, radioButton, sectionContainer } from './date-column-filter.module.scss';
import DatePresets from './date-presets/date-presets';
import CustomDateFilter from './custom-date-filter/custom-date-filter';

interface IDateColumnFilter {
  presets?: boolean;
  columnConfig;
}

const DateColumnFilter: FunctionComponent<IDateColumnFilter> = ({ presets = true, columnConfig }) => {
  return (
    <div className={sectionContainer}>
      <div className={columnName}>{columnConfig.name}</div>
      <div className={inputContainer}>
        {presets && (
          <div>
            <label className={radioButton}>
              <input type="radio" name="date-toggle" id="radio-preset" checked={true} />
              Preset
            </label>
            <DatePresets />
          </div>
        )}
        <div>
          <label className={radioButton}>
            <input type="radio" name="date-toggle" id="radio-custom" />
            Custom
          </label>
          <CustomDateFilter />
        </div>
      </div>
    </div>
  );
};

export default DateColumnFilter;
