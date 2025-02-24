import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp, faCaretRight, faCloudDownload } from '@fortawesome/free-solid-svg-icons';
import { pxToNumber } from '../../../../../helpers/styles-helper/styles-helper';
import { breakpointLg } from '../../../../../variables.module.scss';
import {
  buttonActive,
  icon,
  buttonText,
  parent,
  downloadButton,
  border,
  container,
  downloadOptionButton,
} from './data-preview-download-select.module.scss';
// import { DownloadDialog } from '../../../../download-dialog/download-dialog';
import DropdownContainer from '../../../../dropdown-container/dropdown-container';
import DownloadItemButton from '../download-button/download-button';
import { useRecoilValue } from 'recoil';
import {
  smallTableDownloadDataCSV,
  smallTableDownloadDataJSON,
  smallTableDownloadDataXML,
  tableRowLengthState,
} from '../../../../../recoil/smallTableDownloadData';
import { REACT_TABLE_MAX_NON_PAGINATED_SIZE } from '../../../../../utils/api-utils';

interface IDownloadButtonProps {
  active: boolean;
  setActive: (val: boolean) => void;
  width: number;
}

const DataPreviewDownloadSelect: FunctionComponent<IDownloadButtonProps> = ({
  active,
  setActive,
  width,
  dateRange,
  selectedTable,
  dataset,
  selectedPivot,
  allTablesSelected,
  downloadClickHandler,
}: IDownloadButtonProps) => {
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
      { displayName: 'CSV', type: 'csv', size: '5 KB', onClick: () => console.log('csv click') },
      { displayName: 'JSON', type: 'json', size: '5 KB', onClick: () => console.log('json click') },
      { displayName: 'XML', type: 'xml', size: '5 KB', onClick: () => console.log('xml click') },
      { displayName: 'Data Dictionary', size: '5 KB', onClick: () => console.log('data dictionary click'), topBorder: true },
    ];
    return downloadOptions;
  };

  const smallTableCSVData = useRecoilValue(smallTableDownloadDataCSV);
  const smallTableJSONData = useRecoilValue(smallTableDownloadDataJSON);
  const smallTableXMLData = useRecoilValue(smallTableDownloadDataXML);
  const tableSize = useRecoilValue(tableRowLengthState);

  const getSmallTableDownloadData = type => {
    if (tableSize > REACT_TABLE_MAX_NON_PAGINATED_SIZE) return null;
    switch (type) {
      case 'csv':
        return smallTableCSVData;
      case 'json':
        return smallTableJSONData;
      case 'xml':
        return smallTableXMLData;
      default:
        return null;
    }
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
              {getDownloadOptions()?.map((option, index) => {
                const { displayName, type, size, onClick, topBorder } = option;
                const downloadData = getSmallTableDownloadData(type);
                return (
                  <React.Fragment key={index}>
                    {topBorder ? <div className={border} /> : null}
                    <DownloadItemButton
                      label={displayName}
                      fileSize={size}
                      handleClick={tableSize > REACT_TABLE_MAX_NON_PAGINATED_SIZE ? downloadClickHandler : null}
                      dateRange={dateRange}
                      selectedTable={selectedTable}
                      selectedFileType={type}
                      downloadTimestamp={dataset.downloadTimestamp}
                      selectedPivot={selectedPivot}
                      smallTableDownloadData={downloadData}
                    />
                  </React.Fragment>
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
