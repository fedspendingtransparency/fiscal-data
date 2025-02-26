import React, { FunctionComponent, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretRight, faCaretUp, faCloudDownload } from '@fortawesome/free-solid-svg-icons';
import { pxToNumber } from '../../../../../helpers/styles-helper/styles-helper';
import { breakpointLg } from '../../../../../variables.module.scss';
import { border, buttonActive, buttonText, container, downloadButton, icon, parent } from './data-preview-download-select.module.scss';
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
import Analytics from '../../../../../utils/analytics/analytics';
import {
  calcDictionaryDownloadSize,
  convertDataDictionaryToCsv,
  triggerDataDictionaryDownload,
} from '../../../../download-wrapper/data-dictionary-download-helper';

interface IDownloadButtonProps {
  dateRange;
  selectedTable;
  dataset;
  selectedPivot;
  allTablesSelected;
  downloadClickHandler;
  width: number;
}

const DataPreviewDownloadSelect: FunctionComponent<IDownloadButtonProps> = ({
  width,
  dateRange,
  selectedTable,
  dataset,
  selectedPivot,
  allTablesSelected,
  downloadClickHandler,
}: IDownloadButtonProps) => {
  const [active, setActive] = useState(false);

  const getIcon = desktopWidth => {
    if (desktopWidth) {
      return active ? faCaretUp : faCaretDown;
    } else {
      return active ? faCloudDownload : faCaretRight;
    }
  };
  const dataDictionaryCsv = convertDataDictionaryToCsv(dataset);
  const ddSize = calcDictionaryDownloadSize(dataDictionaryCsv);

  const metadataDownloader = async () => {
    Analytics.event({
      category: 'Dataset Dictionary Download',
      action: 'Data Dictionary Click',
      label: dataset.name,
    });
    return triggerDataDictionaryDownload(dataDictionaryCsv, dataset.name);
  };

  const handleDownloadClick = fileType => {
    if (tableSize > REACT_TABLE_MAX_NON_PAGINATED_SIZE || !tableSize) downloadClickHandler(fileType);
  };

  const getDownloadOptions = () => {
    return [
      {
        displayName: 'CSV',
        type: 'csv',
        size: '5 KB',
        onClick: () => handleDownloadClick('csv'),
      },
      {
        displayName: 'JSON',
        type: 'json',
        size: '5 KB',
        onClick: () => handleDownloadClick('json'),
      },
      {
        displayName: 'XML',
        type: 'xml',
        size: '5 KB',
        onClick: () => handleDownloadClick('xml'),
      },
      {
        displayName: 'Data Dictionary',
        type: 'data-dictionary',
        size: ddSize,
        onClick: metadataDownloader,
        topBorder: true,
      },
    ];
  };

  const smallTableCSVData = useRecoilValue(smallTableDownloadDataCSV);
  const smallTableJSONData = useRecoilValue(smallTableDownloadDataJSON);
  const smallTableXMLData = useRecoilValue(smallTableDownloadDataXML);
  const tableSize = useRecoilValue(tableRowLengthState);

  const getSmallTableDownloadData = type => {
    if (tableSize > REACT_TABLE_MAX_NON_PAGINATED_SIZE || !tableSize) return null;
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
            <div className={container}>
              {getDownloadOptions()?.map((option, index) => {
                const { displayName, type, size, onClick, topBorder } = option;
                const downloadData = getSmallTableDownloadData(type);
                return (
                  <React.Fragment key={index}>
                    {topBorder ? <div className={border} /> : null}
                    <DownloadItemButton
                      label={displayName}
                      fileSize={size}
                      handleClick={onClick}
                      dateRange={dateRange}
                      selectedTable={selectedTable}
                      fileType={type}
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
