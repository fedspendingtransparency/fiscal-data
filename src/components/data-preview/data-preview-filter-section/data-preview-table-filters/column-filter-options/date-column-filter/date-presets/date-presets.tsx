import React, { FunctionComponent } from 'react';
import determineDateRange, {
  generateAnalyticsEvent,
  generateFormattedDate,
} from '../../../../../../filter-download-container/range-presets/helpers/helper';
import { presetContainer, radio, selected, toggleButton } from './date-presets.module.scss';
import { IDatePresets } from '../../../../../../../models/data-preview/IDatePresets';

const DatePresets: FunctionComponent<IDatePresets> = ({
  handleDateRangeChange,
  hideButtons,
  setPickerDateRange,
  hidden,
  presets,
  activePresetKey,
}) => {
  // const applyPreset = preset => {
  //   let label = preset.label;
  //   if (label && label.toLowerCase() === 'custom') {
  //     label = generateFormattedDate(dateRange);
  //   }
  //   generateAnalyticsEvent(label);
  //   setActivePresetKey(preset.key);
  //   prepUpdateDateRange(preset);
  // };

  // const updateDateRange = curDateRange => {
  //   if (curDateRange) {
  //     setPickerDateRange({ ...availableDateRange, from: curDateRange.from, to: curDateRange.to });
  //     setCurDateRange(curDateRange);
  //     handleDateRangeChange(curDateRange);
  //   }
  // };

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
                  // applyPreset(preset);
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

export default DatePresets;
