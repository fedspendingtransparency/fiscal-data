import React, { FunctionComponent, useState } from 'react';
import { presetContainer, radio, selected, toggleButton } from './date-presets.module.scss';
import { IDatePresets } from '../../../../../../../models/data-preview/IDatePresets';

const DatePresets: FunctionComponent<IDatePresets> = ({ hideButtons, hidden, presets, activePresetKey }) => {
  const [selectedPreset, setSelectedPreset] = useState(activePresetKey);
  console.log(activePresetKey);
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
                checked={preset.key === selectedPreset}
                id={`radio-${preset.key}`}
                onChange={() => {
                  setSelectedPreset(preset.key);
                }}
                tabIndex={hidden ? -1 : 0}
                disabled={hidden}
              />
              <label
                className={`
                    ${toggleButton} ${selectedPreset === preset.key ? selected : ''}
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
