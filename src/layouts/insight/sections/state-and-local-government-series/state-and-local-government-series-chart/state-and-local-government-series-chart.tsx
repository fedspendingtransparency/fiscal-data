import React, { FunctionComponent, useEffect, useState } from 'react';
import ChartDataHeader from '../../../../explainer/explainer-components/chart-data-header/chart-data-header';
import ChartTableContainer from '../../../../../components/chart-with-table/chart-table-container/chart-table-container';
import { chartConfig, formatDate, infoTipTitle, Legend } from './state-and-local-government-series-chart-helper';
import { useGetStateAndLocalGovernmentSeriesData } from '../useGetStateAndLocalGovernmentSeriesData';
import { getShortForm } from '../../../../../utils/rounding-utils';
import { withWindowSize } from 'react-fns';
import { customNumberFormatter } from '../../../../../helpers/text-format/text-format';
import { chartTableBorder, container, loadingIcon, overlay } from './state-and-local-government-series-chart.module.scss';
import DtgTable from '../../../../../components/dtg-table/dtg-table';
import SLGSBarChart from './SLGS-bar-chart/SLGS-bar-chart';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format } from 'date-fns';
import { convertDate } from '../../../../../components/dataset-data/dataset-data-helper/dataset-data-helper';
import { SortingState, sortRowsForDownload } from '../../../insight-helper';

const StateAndLocalGovernmentSeriesChart: FunctionComponent = ({ width }) => {
  const [chartFocus, setChartFocus] = useState<boolean>(false);
  const [chartHover, setChartHover] = useState<boolean>(false);
  const [curDate, setCurDate] = useState<string>('');
  const [curAmount, setCurAmount] = useState<number>(0);
  const [curCount, setCurCount] = useState<number>(0);
  const [dateRange, setDateRange] = useState();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [downloadData, setDownloadData] = useState([]);
  const [monthRange, setMonthRange] = useState<{ from: string; to: string }>();
  const [isChartLoading, setIsChartLoading] = useState<boolean>(false);

  const {
    chartData,
    lineChartXAxisValues,
    datasetDateRange,
    totalMonths,
    columnConfig,
    columnConfigArray,
    mergedTableData,
  } = useGetStateAndLocalGovernmentSeriesData(dateRange);
  const { height, altText } = chartConfig;

  const infoTipWording =
    'For a date range under two years, the data is presented in a bar chart. For a date range greater than two years, ' +
    'the visualization will display a line chart. ' +
    `\nData for this visualization is available from ${datasetDateRange?.fromFormatted} to ${datasetDateRange?.toFormatted}.`;

  const setDefaultHeaderValues = () => {
    if (chartData) {
      setCurDate(chartData[chartData.length - 1].date);
      setCurAmount(chartData[chartData.length - 1].totalAmount);
      setCurCount(chartData[chartData.length - 1].totalCount);
    }
  };

  useEffect(() => {
    setDefaultHeaderValues();
    setIsChartLoading(false);
  }, [chartData]);

  useEffect(() => {
    if (mergedTableData.length && mergedTableData[0]?.date && mergedTableData[mergedTableData.length - 1]?.date) {
      setMonthRange({
        from: format(convertDate(mergedTableData[0].date), 'MMMM yyyy'),
        to: format(convertDate(mergedTableData[mergedTableData.length - 1].date), 'MMMM yyyy'),
      });
    }

    const sortedForDownload = sortRowsForDownload(mergedTableData, sorting, columnConfig);
    const downloadRows = sortedForDownload.map(row => {
      const cleanData = {
        date: `="${format(convertDate(row.date), 'MMMM yyyy')}"`,
        totalAmount: `"${row.totalAmount}"`,
        totalCount: `"${row.totalCount}"`,
      };
      return columnConfig.map(col => cleanData[col.property]);
    });

    downloadRows.unshift(columnConfigArray);
    setDownloadData(downloadRows);
    console.log(downloadData);
  }, [mergedTableData, sorting]);

  return (
    <>
      <ChartTableContainer
        title="Outstanding State and Local Government Series (SLGS) Securities"
        downloadData={downloadData}
        selectedTable={{ downloadName: 'state-and-local-government-series-securities' }}
        altText={altText}
        monthRange={monthRange}
        setDateRange={setDateRange}
        datasetDateRange={datasetDateRange}
        isLoading={!chartData}
        height={height}
        infoTip={infoTipWording}
        infoTipTitle={infoTipTitle}
        setIsChartLoading={setIsChartLoading}
        chart={
          <>
            <div className={chartTableBorder}>
              <ChartDataHeader
                dateField="Date"
                fiscalYear={formatDate(curDate)}
                right={{ label: 'Amount', value: `$${getShortForm(curAmount.toString())}` }}
                left={{ label: 'Count', value: customNumberFormatter.format(curCount, 0) }}
              />
              <>
                <Legend />
                <div
                  data-testid="chartParent"
                  role="presentation"
                  onBlur={() => {
                    setChartFocus(false);
                    setDefaultHeaderValues();
                  }}
                  onFocus={() => setChartFocus(true)}
                  onMouseOver={() => setChartHover(true)}
                  onMouseLeave={() => setChartHover(false)}
                >
                  <div className={container}>
                    {isChartLoading && (
                      <>
                        <div data-test-id="loading-overlay" className={overlay} />
                        <div data-testid="loadingSection" className={loadingIcon}>
                          <FontAwesomeIcon data-testid="loadingIcon" icon={faSpinner as IconProp} spin pulse />
                          Loading...
                        </div>
                      </>
                    )}
                    <SLGSBarChart
                      setCurAmount={setCurAmount}
                      setCurCount={setCurCount}
                      setCurDate={setCurDate}
                      height={height}
                      width={width}
                      chartData={chartData}
                      xAxisValues={lineChartXAxisValues}
                      chartFocus={chartFocus}
                      chartHover={chartHover}
                      totalMonths={totalMonths}
                    />
                  </div>
                </div>
              </>
            </div>
          </>
        }
        table={
          <DtgTable
            tableProps={{
              data: mergedTableData,
              columnConfig,
              tableName: 'State and Local Government Series Details',
              caption: 'State and Local Government Series Table',
              shouldPage: true,
              width: '99%',
              chartTable: false,
              noBorder: true,
              customFormatting: [
                {
                  type: 'DATE',
                  fields: ['date'],
                  dateFormat: 'MMMM yyyy',
                },
              ],
            }}
            reactTable={true}
            sorting={sorting}
            setSorting={setSorting}
            width
          />
        }
      />
    </>
  );
};

export default withWindowSize(StateAndLocalGovernmentSeriesChart);
