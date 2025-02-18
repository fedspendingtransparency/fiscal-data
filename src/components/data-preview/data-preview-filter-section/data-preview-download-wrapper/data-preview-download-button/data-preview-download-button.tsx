import React, { FunctionComponent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp, faCaretRight, faCloudDownload } from '@fortawesome/free-solid-svg-icons';
import { pxToNumber } from '../../../../../helpers/styles-helper/styles-helper';
import { breakpointLg } from '../../../../../variables.module.scss';
import { downloadButton, buttonActive, icon, buttonText, parent } from './data-preview-download-button.module.scss';
import { DownloadDialog } from '../../../../download-dialog/download-dialog';
import DropdownContainer from '../../../../dropdown-container/dropdown-container';

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

  const downloadOptions = [
    { displayName: 'CSV', size: '5 KB', onClick: () => console.log('csv click') },
    { displayName: 'JSON', size: '5 KB', onClick: () => console.log('json click') },
    { displayName: 'XML', size: '5 KB', onClick: () => console.log('xml click') },
    { displayName: 'Data Dictionary', size: '5 KB', onClick: () => console.log('data dictionary click'), topBorder: true },
  ];

  return (
    <div className={parent}>
      <DropdownContainer
        containerWidth="fit-content"
        dropdownButton={
          <button className={`${downloadButton} ${active && buttonActive}`} onClick={() => setActive(!active)}>
            <div className={buttonText}>Download</div>
            <div className={icon}>
              <FontAwesomeIcon icon={getIcon(width >= pxToNumber(breakpointLg))} />
            </div>
          </button>
        }
        setActive={setActive}
      >
        <DownloadDialog active={active} setActive={setActive} downloadOptions={downloadOptions} />
      </DropdownContainer>
    </div>
  );
};

export default DataPreviewDownloadButton;
