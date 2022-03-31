import React from 'react';
import {
  downloadItemBtn,
  linkDisabled,
  dictionary,
  optionIcon
} from './download-item-button.module.scss';
import Analytics from "../../../utils/analytics/analytics";
import { generateAnalyticsEvent } from '../../../layouts/dataset-detail/helper';
import globalConstants from '../../../helpers/constants';

export const downloadFileEventStr = globalConstants.gaEventLabels.downloadFile;
const DownloadItemButton = ({
  label,
  icon,
  fileSize,
  asyncAction,
  handleClick,
  href,
  download,
  disabled
}) => {
  const clickFunction = () => {
    if (handleClick) {
      handleClick();
    }

    if (download) {
      // Downloading a published report
      Analytics.event({
        category: 'Data Download',
        action: download
      });
    } else {
      // Downloading raw data.
      generateAnalyticsEvent(downloadFileEventStr);
    }
  }

  const ButtonComponent = ({ children }) => disabled ? (
    <button
      disabled
      className={`${downloadItemBtn} ${disabled ? linkDisabled : ''}`}
      data-testid="download-button"
    >
      {children}
    </button>
  ) : (
    <a
      className={`${downloadItemBtn} ${disabled ? linkDisabled : ''}`}
      href={href}
      download={download}
      target={"_blank"}
      rel={'noreferrer noopener'}
      onClick={clickFunction}
      data-testid="download-button"
    >
      {children}
    </a>
  )

  return (
    <div>
      {
        asyncAction ?
          <button className={dictionary} onClick={asyncAction} disabled={disabled}>
            <span className="labelText">{label} </span>
            {fileSize && <span className="fileSize"> ({fileSize})</span>}
          </button>
        :
          <ButtonComponent>
            <span className={optionIcon}>
              {icon}
            </span>
            <span className="labelText">{label} </span>
            {fileSize && <span className="fileSize"> ({fileSize})</span>}
          </ButtonComponent>
      }
    </div>
  );
}

export default DownloadItemButton;
