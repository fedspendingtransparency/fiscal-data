import React, { FunctionComponent, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudDownload } from '@fortawesome/free-solid-svg-icons';
import { pxToNumber } from '../../../../../helpers/styles-helper/styles-helper';
import { breakpointXl } from '../../../../../variables.module.scss';
import { border, buttonActive, buttonText, container, downloadButton, icon, parent } from './data-preview-download-select.module.scss';
import DropdownContainer from '../../../../dropdown-container/dropdown-container';
import DownloadItemButton from '../download-button/download-button';
import DataPreviewMobileDialog from '../../../data-preview-mobile-dialog/data-preview-mobile-dialog';
import { useRecoilValue } from 'recoil';
import {
  smallTableDownloadDataCSV,
  smallTableDownloadDataJSON,
  smallTableDownloadDataXML,
  tableRowLengthState,
} from '../../../../../recoil/smallTableDownloadData';
import Analytics from '../../../../../utils/analytics/analytics';
import {
  calcDictionaryDownloadSize,
  convertDataDictionaryToCsv,
  triggerDataDictionaryDownload,
} from '../../../../download-wrapper/data-dictionary-download-helper';
import { getDownloadIcon, shouldUseDirectDownload } from '../download-wrapper-helper';
import { IDataset } from '../../../../../models/IDataset';
import { IDatasetApi } from '../../../../../models/IDatasetApi';
import { IPivotOption } from '../../../../../models/data-preview/IPivotOption';
import { constructDownloadFileName } from '../../../../download-wrapper/download-helpers';
import DataPreviewMobileDownloadOptions from './data-preview-mobile-downloads/data-preview-mobile-downloads';

interface IDownloadButtonProps {
  dateRange: { from: Date; to: Date };
  selectedTable: IDatasetApi;
  dataset: IDataset;
  selectedPivot: IPivotOption;
  allTablesSelected: boolean;
  downloadClickHandler: (fileType: string, event) => void;
  isDisabled: boolean;
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
  isDisabled,
}: IDownloadButtonProps) => {
  const [active, setActive] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

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
    if (!shouldUseDirectDownload(tableSize, allTablesSelected)) downloadClickHandler(fileType);
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
    if (!shouldUseDirectDownload(tableSize, allTablesSelected)) return null;
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

  const performDirectDownload = fileType => {
    const downloadData = getSmallTableDownloadData(fileType);
    if (!downloadData) return;
    let type, extension;
    if (fileType === 'csv') {
      type = 'text/csv';
      extension = 'csv';
    } else if (fileType === 'json') {
      type = 'application/json';
      extension = 'json';
    } else if (fileType === 'xml') {
      type = 'application/xml';
      extension = 'xml';
    } else {
      return;
    }
    const downloadName = constructDownloadFileName(dateRange, selectedTable, true);
    const blob = new Blob([downloadData], { type: type });
    const url = URL.createObjectURL(blob);
    const download = document.createElement('a');
    download.href = url;
    download.download = `${downloadName}.${extension}`;
    document.body.appendChild(download);
    download.click();
    document.body.removeChild(download);
    URL.revokeObjectURL(url);
  };

  const handleMobileDownload = () => {
    if (!selectedOption) {
      return;
    }
    const option = getDownloadOptions().find(opt => opt.type === selectedOption);
    if (option && option.onClick) {
      if (selectedOption !== 'data-dictionary' && shouldUseDirectDownload(tableSize, allTablesSelected)) {
        performDirectDownload(selectedOption);
      } else {
        option.onClick();
      }
    }
  };

  const downloadButtonElement = (
    <button className={`${downloadButton} ${active ? buttonActive : ''}`} disabled={isDisabled} onClick={() => setActive(!active)}>
      <div className={buttonText}>Download</div>
      <div className={icon}>
        <FontAwesomeIcon icon={getDownloadIcon(width, active)} />
      </div>
    </button>
  );

  const mobileOptions = getDownloadOptions().map(option => ({
    displayName: option.displayName,
    type: option.type,
    size: option.size,
  }));

  if (width >= pxToNumber(breakpointXl)) {
    return (
      <div className={parent}>
        <DropdownContainer containerWidth="fit-content" dropdownButton={downloadButtonElement} setActive={setActive}>
          {active && (
            <div className={container}>
              {getDownloadOptions().map((option, index) => {
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
          )}
        </DropdownContainer>
      </div>
    );
  } else {
    return (
      <div className={parent}>
        {downloadButtonElement}
        {active && (
          <DataPreviewMobileDialog
            onClose={() => setActive(false)}
            backButtonTitle="Data Preview"
            filterName="Download"
            bottomButton="Download"
            bottomButtonIcon={faCloudDownload}
            hasSearch={false}
            filterComponent={
              <DataPreviewMobileDownloadOptions options={mobileOptions} selectedOption={selectedOption} onSelect={setSelectedOption} />
            }
            onBottomButtonClick={handleMobileDownload}
          />
        )}
      </div>
    );
  }
};

export default DataPreviewDownloadSelect;
