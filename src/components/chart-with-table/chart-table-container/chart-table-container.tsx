import React, { useState } from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import DownloadItemButton from '../../data-preview/data-preview-filter-section/data-preview-download-wrapper/download-button/download-button';
import {
  chartTable,
  chartTitleHeaderContainer,
  chartContainer,
  headerContainer,
  footerContainer,
  chartTitle,
  downloaderContainer,
  tableBoarder,
  icon,
  clickedLabel,
  dowloadLableContainer,
  downloadCSV,
} from './chart-table-container.module.scss';

export const ChartTableContainer = ({
  tableView,
  title,
  altText,
  toggle,
  footer,
  downloader,
  children,
  customTestId = null,
  downloadData,
  fileType = 'csv',
  dateRange,
  selectedTable,
  downloadTimestamp,
  enabledClickedColorChange = false,
}) => {
  const [downloadClicked, setDownloadClick] = useState(false);
  const handleDownloadClicked = () => {
    if (enabledClickedColorChange) {
      setDownloadClick(true);
    }
  };
  const csvDownloader = (
    <div className={downloadClicked ? clickedLabel : dowloadLableContainer} onClick={handleDownloadClicked} role="presentation">
      <div className={downloadCSV}>Download CSV</div> <DownloadIcon className={icon} />
    </div>
  );

  return (
    <div className={chartContainer} role="figure" aria-label={altText}>
      <div className={chartTitleHeaderContainer}>
        <div className={chartTitle}>{title}</div>
        <div className={headerContainer}>{toggle}</div>
      </div>
      <div className={tableView && tableBoarder} />
      <div data-testid={customTestId ? customTestId : 'chart'} className={`${chartTable} chartContainerChart`}>
        {children}
      </div>
      <div className={`${downloaderContainer} chartContainerFooter`}>
        {downloader ? (
          downloader
        ) : (
          <DownloadItemButton
            fileType={fileType}
            smallTableDownloadData={downloadData}
            dateRange={dateRange}
            selectedTable={selectedTable}
            downloadTimestamp={downloadTimestamp}
            label={csvDownloader}
            formatDownloadDate={false}
            onClick={handleDownloadClicked}
          />
        )}
      </div>
      <div className={footerContainer}>{footer}</div>
    </div>
  );
};
