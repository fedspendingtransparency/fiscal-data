import React, { FunctionComponent, useEffect, useState } from 'react';
import ChartDataHeader from '../../../../explainer/explainer-components/chart-data-header/chart-data-header';
import ChartTableContainer from '../../../../../components/chart-with-table/chart-table-container/chart-table-container';
import { chartConfig, formatDate, Legend } from './state-and-local-government-series-chart-helper';
import { useGetStateAndLocalGovernmentSeriesData } from '../useGetStateAndLocalGovernmentSeriesData';
import { getShortForm } from '../../../../../utils/rounding-utils';
import { withWindowSize } from 'react-fns';
import { customNumberFormatter } from '../../../../../helpers/text-format/text-format';
import { chartTableBorder, loadingIcon, overlay, container } from './state-and-local-government-series-chart.module.scss';
import DtgTable from '../../../../../components/dtg-table/dtg-table';
import SLGSBarChart from './SLGS-bar-chart/SLGS-bar-chart';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const breakpoint = {
  desktop: 1015,
  tablet: 600,
};

const StateAndLocalGovernmentSeriesChart: FunctionComponent = ({ width }) => {
  const [chartFocus, setChartFocus] = useState<boolean>(false);
  const [chartHover, setChartHover] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(null);
  const [curDate, setCurDate] = useState<number>(0);
  const [curAmount, setCurAmount] = useState<number>(0);
  const [curCount, setCurCount] = useState<number>(0);
  const [dateRange, setDateRange] = useState();
  const [sorting, setSorting] = useState([]);
  const [downloadData, setDownloadData] = useState([]);
  const [monthRange, setMonthRange] = useState([]);
  const [isChartLoading, setIsChartLoading] = useState<boolean>(false);

  const {
    chartData,
    xAxisValues,
    xAxisMobileValues,
    datasetDateRange,
    totalMonths,
    columnConfig,
    columnConfigArray,
    mergedTableData,
  } = useGetStateAndLocalGovernmentSeriesData(dateRange);
  const { height, altText } = chartConfig;

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
    if (window.innerWidth < breakpoint.desktop) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }, [width]);

  useEffect(() => {
    if (mergedTableData.length) {
      setMonthRange({
        from: mergedTableData[0].date,
        to: mergedTableData[mergedTableData.length - 1].date,
      });
    }
    const downloaderData = mergedTableData.map(row => {
      const cleanData = {
        date: `="${row.date}"`,
        totalAmount: `"${row.totalAmount}"`,
        totalCount: `"${row.totalCount}"`,
      };
      return columnConfig.map(col => cleanData[col.property]);
    });
    downloaderData.unshift(columnConfigArray);
    setDownloadData(downloaderData);
  }, [mergedTableData]);

  return (
    <>
      <ChartTableContainer
        title="Outstanding State and Local Government Series (SLGS) Securities"
        downloadData={downloadData}
        selectedTable={{ downloadName: 'state-and-local-government-series-securities' }}
        altText={altText}
        monthRange={monthRange}
        dateRange={dateRange}
        setDateRange={setDateRange}
        datasetDateRange={datasetDateRange}
        isLoading={!chartData}
        height={height}
        paddingBuffer={true}
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
                      isMobile={isMobile}
                      chartData={chartData}
                      xAxisValues={xAxisValues}
                      xAxisMobileValues={xAxisMobileValues}
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
          <>
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
              }}
              reactTable={true}
              sorting={sorting}
              setSorting={setSorting}
              width
            />
          </>
        }
      />
    </>
  );
};

export default withWindowSize(StateAndLocalGovernmentSeriesChart);
