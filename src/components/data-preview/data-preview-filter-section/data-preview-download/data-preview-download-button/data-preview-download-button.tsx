import React, { FunctionComponent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp, faCaretRight, faCloudDownload } from '@fortawesome/free-solid-svg-icons';
import { pxToNumber } from '../../../../../helpers/styles-helper/styles-helper';
import { breakpointLg } from '../../../../../variables.module.scss';
import { desktopButton, mobileButton, buttonActive, icon, buttonText } from './data-preview-download-button.module.scss';

interface IDownloadButtonProps {
  active: boolean;
  setActive: (val: boolean) => void;
  width: number;
}

const DataPreviewDownloadButton: FunctionComponent<IDownloadButtonProps> = ({ active, setActive, width }: IDownloadButtonProps) => {
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
        <button className={`${mobileButton} ${active && buttonActive}`} onClick={() => setActive(!active)}>
          <div className={buttonText}>Download</div>
          <div className={icon}>
            <FontAwesomeIcon icon={active ? faCloudDownload : faCaretRight} />
          </div>
        </button>
      )}
    </>
  );
};

export default DataPreviewDownloadButton;
