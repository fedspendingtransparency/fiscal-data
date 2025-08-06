import React, { FunctionComponent, ReactElement, useState } from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import DownloadItemButton from '../../data-preview/data-preview-filter-section/data-preview-download-wrapper/download-button/download-button';
import {
  chartContainer,
  chartTable,
  chartTitle,
  chartTitleHeaderContainer,
  clickedLabel,
  dateRangeContainer,
  downloadCSV,
  downloaderContainer,
  downloadLabelContainer,
  headerContainer,
  icon,
  infoTipContainer,
  tableBoarder,
} from './chart-table-container.module.scss';
import DateRangeMonthPicker from '../../date-range-month-picker/date-range-month-picker';
import { Skeleton } from '@mui/material';
import ChartingTableToggle from '../chart-table-toggle/charting-table-toggle';
import { faChartColumn, faTable } from '@fortawesome/free-solid-svg-icons';
import InfoTip from '../../info-tip/info-tip';

interface IChartTableContainer {
  title: string;
  altText: string;
  downloader?;
  customTestId?: string;
  downloadData;
  fileType?: 'csv' | 'xml' | 'json';
  dateRange;
  setDateRange;
  downloadTimestamp?;
  enabledClickedColorChange?;
  isLoading: boolean;
  height?: number;
  chart: ReactElement;
  table: ReactElement;
  monthRange?;
}

const ChartTableContainer: FunctionComponent<IChartTableContainer> = ({
  title,
  altText,
  downloader,
  customTestId = null,
  downloadData,
  fileType = 'csv',
  dateRange,
  setDateRange,
  datasetDateRange,
  selectedTable,
  downloadTimestamp,
  enabledClickedColorChange = false,
  isLoading,
  height,
  chart,
  table,
  paddingBuffer,
  setIsChartLoading,
  monthRange,
  infoTip,
  infoTipTitle,
}) => {
  const [selectedChartView, setSelectedChartView] = useState<string>('chartView');
  const [downloadClicked, setDownloadClick] = useState(false);
  const handleDownloadClicked = () => {
    if (enabledClickedColorChange) {
      setDownloadClick(true);
    }
  };

  const csvDownloader = (
    <div className={downloadClicked ? clickedLabel : downloadLabelContainer} onClick={handleDownloadClicked} role="presentation">
      <div className={downloadCSV}>Download CSV</div>
      <DownloadIcon className={icon} />
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
      {datasetDateRange && (
        <div className={dateRangeContainer}>
          <DateRangeMonthPicker
            dateRange={dateRange}
            setDateRange={setDateRange}
            datasetDateRange={datasetDateRange}
            paddingBuffer={paddingBuffer}
            setIsChartLoading={setIsChartLoading}
            validMonths={monthRange}
          />
          <div className={infoTipContainer}>
            <InfoTip title={infoTipTitle} iconStyle={{ color: '#666666', width: '1rem', height: '1rem' }}>
              {infoTip}
            </InfoTip>
          </div>
        </div>
      )}
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
            dateRange={monthRange}
            selectedTable={selectedTable}
            downloadTimestamp={downloadTimestamp}
            label={csvDownloader}
            formatDownloadDate={false}
            onClick={handleDownloadClicked}
          />
        )}
      </div>
    </div>
  );
};

export default ChartTableContainer;
