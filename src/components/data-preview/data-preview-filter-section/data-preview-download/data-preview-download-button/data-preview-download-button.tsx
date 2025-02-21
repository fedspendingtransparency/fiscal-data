import React, { FunctionComponent, useEffect, useState } from 'react';
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
  disabled: boolean;
}

const DataPreviewDownloadButton: FunctionComponent<IDownloadButtonProps> = ({ active, setActive, width, apiFilterDefault }: IDownloadButtonProps) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const getIcon = desktopWidth => {
    if (desktopWidth) {
      return active ? faCaretUp : faCaretDown;
    } else {
      return active ? faCloudDownload : faCaretRight;
    }
  };
  console.log(apiFilterDefault);
  const toggleDisabled = () => {
    if (apiFilterDefault === true) {
      setIsDisabled(true);
    }
  };
  const activateToggle = () => {
    if (isDisabled !== true) {
      setActive(!active);
    }
  };

  useEffect(() => {
    toggleDisabled();
  }, [apiFilterDefault]);

  return (
    <div className={parent}>
      <button className={`${downloadButton} ${active && buttonActive}`} onClick={() => activateToggle()} disabled={isDisabled}>
        <div className={buttonText}>Download</div>
        <div className={icon}>
          <FontAwesomeIcon icon={getIcon(width >= pxToNumber(breakpointLg))} />
        </div>
      </button>
      <DownloadDialog active={active} setActive={setActive} />
    </div>
  );
};

export default DataPreviewDownloadButton;
