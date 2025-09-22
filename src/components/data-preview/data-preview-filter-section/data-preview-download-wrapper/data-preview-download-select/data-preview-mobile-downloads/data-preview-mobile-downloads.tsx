import React, { FunctionComponent } from 'react';
import {
  mobileDownloadOptionsContainer,
  mobileDownloadOptions,
  mobileDownloadInput,
  mobileDownloadLabel,
  mobileDropdownDisplayName,
} from './data-preview-mobile-downloads.module.scss';

interface MobileDownloadOption {
  displayName: string;
  type: string;
  size: string;
}

interface MobileDownloadOptionsProps {
  options: MobileDownloadOption[];
  selectedOption: string | null;
  onSelect: (type: string) => void;
  tableSize: number | null;
}

const DataPreviewMobileDownloadOptions: FunctionComponent<MobileDownloadOptionsProps> = ({ options, selectedOption, onSelect, tableSize }) => {
  return (
    <div className={mobileDownloadOptionsContainer}>
      {options.map((option, index) => (
        <div key={index} className={mobileDownloadOptions}>
          <div className={mobileDropdownDisplayName}>
            <input
              type="radio"
              id={`download-option-${index}`}
              name="downloadOption"
              value={option.type}
              checked={selectedOption === option.type}
              onChange={() => onSelect(option.type)}
              className={mobileDownloadInput}
            />
            <label htmlFor={`download-option-${index}`} className={mobileDownloadLabel}>
              {option.displayName}
            </label>
          </div>
          <div>{tableSize || option.type === 'data-dictionary' ? option.size : ''}</div>
        </div>
      ))}
    </div>
  );
};

export default DataPreviewMobileDownloadOptions;
