import React, { FunctionComponent, useEffect, useState } from 'react';
import ChartDataHeader from '../../../../explainer/explainer-components/chart-data-header/chart-data-header';
import ChartTableContainer from '../../../../../components/chart-with-table/chart-table-container/chart-table-container';
import { chartConfig, formatDate, Legend } from './state-and-local-government-series-chart-helper';
import { useGetStateAndLocalGovernmentSeriesData } from '../useGetStateAndLocalGovernmentSeriesData';
import { getShortForm } from '../../../../../utils/rounding-utils';
import { withWindowSize } from 'react-fns';
import { customNumberFormatter } from '../../../../../helpers/text-format/text-format';
import { chartTableBorder } from './state-and-local-government-series-chart.module.scss';
import SLGSBarChart from './SLGS-bar-chart/SLGS-bar-chart';

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

  const { chartData, xAxisValues, xAxisMobileValues, datasetDateRange, totalMonths } = useGetStateAndLocalGovernmentSeriesData(dateRange);
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
  }, [chartData]);

  useEffect(() => {
    if (window.innerWidth < breakpoint.desktop) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }, [width]);

  return (
    <>
      <ChartTableContainer
        title="Outstanding State and Local Government Series (SLGS) Securities"
        altText={altText}
        dateRange={dateRange}
        setDateRange={setDateRange}
        datasetDateRange={datasetDateRange}
        isLoading={!chartData}
        height={height}
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
              </>
            </div>
          </>
        }
        table={<>table</>}
      />
    </>
  );
};

export default withWindowSize(StateAndLocalGovernmentSeriesChart);
