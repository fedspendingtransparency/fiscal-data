import React, { FunctionComponent, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { pxToNumber } from '../../../../../helpers/styles-helper/styles-helper';
import { breakpointXl } from '../../../../../variables.module.scss';
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

  return (
    <div className={parent}>
      <DropdownContainer
        containerWidth={width >= pxToNumber(breakpointXl) ? 'fit-content' : '100%'}
        dropdownButton={
          <button className={`${downloadButton} ${active && buttonActive}`} disabled={isDisabled} onClick={() => setActive(!active)}>
            <div className={buttonText}>Download</div>
            <div className={icon}>
              <FontAwesomeIcon icon={getDownloadIcon(width, active)} />
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
