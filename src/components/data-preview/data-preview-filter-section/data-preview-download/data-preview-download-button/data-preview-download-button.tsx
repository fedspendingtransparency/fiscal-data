import React, { FunctionComponent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp, faCaretRight, faCloudDownload } from '@fortawesome/free-solid-svg-icons';
import { pxToNumber } from '../../../../../helpers/styles-helper/styles-helper';
import { breakpointLg } from '../../../../../variables.module.scss';
import { downloadButton, buttonActive, icon, buttonText, parent } from './data-preview-download-button.module.scss';
import { DownloadDialog } from '../../../../download-dialog/download-dialog';

interface IDownloadButtonProps {
  active: boolean;
  setActive: (val: boolean) => void;
  width: number;
}

const DataPreviewDownloadButton: FunctionComponent<IDownloadButtonProps> = ({ active, setActive, width }: IDownloadButtonProps) => {
  const getIcon = desktopWidth => {
    if (desktopWidth) {
      return active ? faCaretUp : faCaretDown;
    } else {
      return active ? faCloudDownload : faCaretRight;
    }
  };

  return (
    <div className={parent}>
      <button className={`${downloadButton} ${active && buttonActive}`} onClick={() => setActive(!active)}>
        <div className={buttonText}>Download</div>
        <div className={icon}>
          <FontAwesomeIcon icon={getIcon(width >= pxToNumber(breakpointLg))} />
        </div>
      </button>
      {active && <DownloadDialog />}
    </div>
  );
};

export default DataPreviewDownloadButton;
