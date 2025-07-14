import React, { FunctionComponent, useState } from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import DownloadItemButton from '../../data-preview/data-preview-filter-section/data-preview-download-wrapper/download-button/download-button';
import {
  chartContainer,
  chartTable,
  chartTitle,
  chartTitleHeaderContainer,
  clickedLabel,
  dowloadLableContainer,
  downloadCSV,
  downloaderContainer,
  headerContainer,
  icon,
  tableBoarder,
} from './chart-table-container.module.scss';
import DateRangeMonthPicker from '../../date-range-month-picker/date-range-month-picker';
import { Skeleton } from '@mui/material';
import ChartingTableToggle from '../chart-table-toggle/charting-table-toggle';
import { faChartColumn, faTable } from '@fortawesome/free-solid-svg-icons';

interface IChartTableContainer {
  title: string;
  altText: string;
  downloader;
  children;
  customTestId;
  downloadData;
  fileType: 'csv' | 'xml' | 'json';
  dateRange;
  selectedTable;
  downloadTimestamp;
  enabledClickedColorChange;
  isLoading: boolean;
  height?: number;
}
const ChartTableContainer: FunctionComponent<IChartTableContainer> = ({
  title,
  altText,
  downloader,
  customTestId = null,
  downloadData,
  fileType = 'csv',
  dateRange,
  selectedTable,
  downloadTimestamp,
  enabledClickedColorChange = false,
  isLoading,
  height,
  chart,
  table,
  setDateRange,
}) => {
  const [selectedChartView, setSelectedChartView] = useState<string>('chartView');
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

  const toggle = (
    <ChartingTableToggle
      primaryColor="#0071BC"
      leftButtonConfig={{
        leftId: 'chartView',
        leftSelected: selectedChartView === 'chartView',
      }}
      rightButtonConfig={{
        rightId: 'tableView',
        rightSelected: selectedChartView === 'tableView',
      }}
      toggleClickHandler={(chartView: string) => setSelectedChartView(chartView)}
      chartId={null}
      leftIcon={faChartColumn}
      rightIcon={faTable}
      leftLabel="toggle for chart view"
      rightLabel="toggle for table view"
    />
  );

  return (
    <div className={chartContainer} role="figure" aria-label={altText}>
      <div className={chartTitleHeaderContainer}>
        <div className={chartTitle}>{title}</div>
        <div className={headerContainer}>{toggle}</div>
      </div>
      <DateRangeMonthPicker dateRange={dateRange} setDateRange={setDateRange} />
      {isLoading && (
        <Skeleton
          width="99%"
          variant="rounded"
          sx={{
            minHeight: height,
            transition: 'opacity 2s',
          }}
        />
      )}
      {!isLoading && selectedChartView === 'chartView' && (
        <div data-testid={customTestId ? customTestId : 'chart'} className={`${chartTable} chartContainerChart`}>
          {chart}
        </div>
      )}
      {!isLoading && selectedChartView === 'tableView' && (
        <>
          <div className={tableBoarder} />
          <div data-testid={customTestId ? customTestId : 'table'} className={`${chartTable} chartContainerChart`}>
            {table}
          </div>
        </>
      )}
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
      {/*<div className={footerContainer}>{footer}</div>*/}
    </div>
  );
};

export default ChartTableContainer;
