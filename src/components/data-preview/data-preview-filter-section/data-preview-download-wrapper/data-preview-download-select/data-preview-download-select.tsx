import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp, faCaretRight, faCloudDownload } from '@fortawesome/free-solid-svg-icons';
import { pxToNumber } from '../../../../../helpers/styles-helper/styles-helper';
import { breakpointLg } from '../../../../../variables.module.scss';
import { downloadButton, buttonActive, icon, buttonText, parent } from './data-preview-download-button.module.scss';
// import { DownloadDialog } from '../../../../download-dialog/download-dialog';
import DropdownContainer from '../../../../dropdown-container/dropdown-container';
import { border, container } from '../download-button/download-dialog.module.scss';
// import { border, container } from '../../../../download-dialog/download-dialog.module.scss';

interface IDownloadButtonProps {
  active: boolean;
  setActive: (val: boolean) => void;
  width: number;
}

const DataPreviewDownloadSelect: FunctionComponent<IDownloadButtonProps> = ({ active, setActive, width }: IDownloadButtonProps) => {
  const containerRef = useRef(null);
  const [inFocus, setInFocus] = useState(false);

  useEffect(() => {
    if (!inFocus) {
      setActive(false);
    }
  }, [inFocus]);

  const getIcon = desktopWidth => {
    if (desktopWidth) {
      return active ? faCaretUp : faCaretDown;
    } else {
      return active ? faCloudDownload : faCaretRight;
    }
  };

  const getDownloadOptions = () => {
    const downloadOptions = [
      { displayName: 'CSV', size: '5 KB', onClick: () => console.log('csv click') },
      { displayName: 'JSON', size: '5 KB', onClick: () => console.log('json click') },
      { displayName: 'XML', size: '5 KB', onClick: () => console.log('xml click') },
      { displayName: 'Data Dictionary', size: '5 KB', onClick: () => console.log('data dictionary click'), topBorder: true },
    ];
    return downloadOptions;
  };

  return (
    <div className={parent}>
      <DropdownContainer
        containerWidth={width >= pxToNumber(breakpointLg) ? 'fit-content' : '100%'}
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
        <>
          {active ? (
            <div
              className={container}
              role="presentation"
              ref={containerRef}
              onFocus={() => setInFocus(true)}
              onBlur={e => {
                // if (!e.relatedTarget.className.includes('download-dialog')) {
                //   setInFocus(false);
                // }
              }}
            >
              {getDownloadOptions()?.map(option => {
                const { displayName, size, onClick, topBorder } = option;
                return (
                  <>
                    {topBorder ? <div className={border} /> : null}
                    <button className={downloadButton} onClick={onClick}>
                      <span>{displayName}</span>
                      <span>{size}</span>
                    </button>
                  </>
                );
              })}
            </div>
          ) : (
            <></>
          )}
        </>
      </DropdownContainer>
    </div>
  );
};

export default DataPreviewDownloadSelect;
