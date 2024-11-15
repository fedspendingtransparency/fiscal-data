import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp, faCaretRight, faCloudDownload } from '@fortawesome/free-solid-svg-icons';
import { pxToNumber } from '../../../../../helpers/styles-helper/styles-helper';
import { breakpointLg } from '../../../../../variables.module.scss';
import { desktopButton, mobileButton, buttonActive, icon } from './data-preview-download-button.module.scss';

const DataPreviewDownloadButton = ({ active, setActive, width }) => {
  return (
    <>
      {width >= pxToNumber(breakpointLg) ? (
        <button className={desktopButton} onClick={() => setActive(!active)}>
          Download
          <div className={icon}>
            <FontAwesomeIcon icon={active ? faCaretUp : faCaretDown} />
          </div>
        </button>
      ) : (
        <button className={mobileButton} onClick={() => setActive(!active)}>
          Download <FontAwesomeIcon icon={active ? faCloudDownload : faCaretRight} />
        </button>
      )}
    </>
  );
};

export default DataPreviewDownloadButton;
