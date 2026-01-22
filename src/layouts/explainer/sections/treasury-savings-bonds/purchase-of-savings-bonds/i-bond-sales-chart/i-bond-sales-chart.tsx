import React, { FunctionComponent, useEffect, useState } from 'react';
import { chartCopy, CustomTooltip } from './i-bond-sales-chart-helper';
import ChartContainer from '../../../../explainer-components/chart-container/chart-container';
import { Tooltip } from 'recharts/es6/component/Tooltip';
import { LineChart } from 'recharts/es6/chart/LineChart';
import { ResponsiveContainer } from 'recharts/es6/component/ResponsiveContainer';
import { CartesianGrid } from 'recharts/es6/cartesian/CartesianGrid';
import { ReferenceLine } from 'recharts/es6/cartesian/ReferenceLine';
import { Line } from 'recharts/es6/cartesian/Line';
import { XAxis } from 'recharts/es6/cartesian/XAxis';
import { YAxis } from 'recharts/es6/cartesian/YAxis';
import ChartDataHeader from '../../../../explainer-components/chart-data-header/chart-data-header';
import { chartLegend, chartStyle, headerContainer, label, leftLabel, leftLine, lengendItem, line, rightLine } from './i-bond-sales-chart.module.scss';
import classNames from 'classnames';
import { treasurySavingsBondsExplainerSecondary } from '../../treasury-savings-bonds.module.scss';
import { apiPrefix, basicFetch } from '../../../../../../utils/api-utils';
import { ICpiDataMap } from '../../../../../../models/ICpiDataMap';
import { yAxisFormatter } from '../savings-bonds-sold-by-type-chart/savings-bonds-sold-by-type-chart-helper';
import { analyticsEventHandler, getDateWithoutOffset } from '../../../../explainer-helpers/explainer-helpers';
import globalConstants from '../../../../../../helpers/constants';
import { ga4DataLayerPush } from '../../../../../../helpers/google-analytics/google-analytics-helper';

interface IIBondsSalesChart {
  cpi12MonthPercentChange: ICpiDataMap;
  curFy: number;
}

let gaTimer;

const IBondSalesChart: FunctionComponent<IIBondsSalesChart> = ({ cpi12MonthPercentChange, curFy }) => {
  const [curInflation, setCurInflation] = useState(null);
  const [curSales, setCurSales] = useState(null);
  const [curYear, setCurYear] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [xAxisValues, setXAxisValues] = useState(null);
  const [latestData, setLatestData] = useState<{
    year: string;
    sales: number;
    inflation: number;
    recordDate: string;
  }>();
  const [inflationAxis, setInflationAxis] = useState<number[]>();
  const [salesAxis, setSalesAxis] = useState<number[]>();
  const [chartFocus, setChartFocus] = useState<boolean>(false);
  const [chartHover, setChartHover] = useState<boolean>(false);

  const defaultInflationAxis: number[] = [-2.5, 0, 2.5, 5, 7.5, 10];
  const inflationAxisInterval = 2.5;
  const defaultSalesAxis: number[] = [0, 2000000000, 4000000000, 6000000000];
  const salesAxisInterval = 2000000000;

  const header = (
    <div className={headerContainer}>
      <ChartDataHeader
        fiscalYear={curYear}
        right={{ label: 'I Bonds Sales', value: `${yAxisFormatter(curSales)}` }}
        left={{ label: 'Inflation', value: `${curInflation}%` }}
        dateField="Date"
      />
    </div>
  );

  const Legend = () => (
    <div className={chartLegend}>
      <div className={lengendItem}>
        <div className={classNames([label, leftLabel])}>I Bond Sales</div>
        <div className={classNames([line, leftLine])} />
      </div>
      <div className={lengendItem}>
        <div className={classNames([line, rightLine])} />
        <div className={label}>Inflation</div>
      </div>
    </div>
  );
  const resetDataHeader = () => {
    if (latestData) {
      setCurYear(latestData.year);
      setCurSales(latestData.sales);
      setCurInflation(latestData.inflation);
    }
  };

  const adjustYAxisArrays = (salesValues, inflationValues, maxSales, minSales, maxInflation, minInflation) => {
    const salesAxisValues = [...salesValues];
    const inflationAxisValues = [...inflationValues];

    // Adjust each y-axis to cover the full range of available data
    while (maxSales > salesAxisValues[salesAxisValues.length - 1]) {
      salesAxisValues.push(salesAxisValues[salesAxisValues.length - 1] + salesAxisInterval);
    }
    while (minSales < salesAxisValues[0]) {
      salesAxisValues.unshift(salesAxisValues[0] - salesAxisInterval);
    }
    while (maxInflation > inflationAxisValues[inflationAxisValues.length - 1]) {
      inflationAxisValues.push(inflationAxisValues[inflationAxisValues.length - 1] + inflationAxisInterval);
    }
    while (minInflation < inflationAxisValues[0]) {
      inflationAxisValues.unshift(inflationAxisValues[0] - inflationAxisInterval);
    }

    //Adjust either y-axis to be the same length, with zero in the same position
    const salesAxisLength = salesAxisValues.length;
    const inflationAxisLength = inflationAxisValues.length;
    const salesZeroIndex = salesAxisValues.findIndex(x => x === 0);
    const inflationZeroIndex = inflationAxisValues.findIndex(x => x === 0);

    if (salesZeroIndex !== inflationZeroIndex || salesAxisLength !== inflationAxisLength) {
      const salesPositiveTotal = salesAxisLength - salesZeroIndex - 1;
      const inflationPositiveTotal = inflationAxisLength - inflationZeroIndex - 1;

      if (salesZeroIndex !== inflationZeroIndex) {
        // Add additional negative values to either axis as needed, until both zeros are in at the same index
        // and there are the same amount of negative axis values
        if (salesZeroIndex > inflationZeroIndex) {
          let negativeDif = salesZeroIndex - inflationZeroIndex;
          while (negativeDif !== 0) {
            inflationAxisValues.unshift(inflationAxisValues[0] - inflationAxisInterval);
            negativeDif = negativeDif - 1;
          }
        } else {
          let negativeDif = inflationZeroIndex - salesZeroIndex;
          while (negativeDif !== 0) {
            salesAxisValues.unshift(salesAxisValues[0] - salesAxisInterval);
            negativeDif = negativeDif - 1;
          }
        }
      }

      if (salesPositiveTotal !== inflationPositiveTotal) {
        // Add additional positive values to either axis as needed, until there are the same amount of positive axis values
        if (salesPositiveTotal > inflationPositiveTotal) {
          let positiveDif = salesPositiveTotal - inflationPositiveTotal;
          while (positiveDif !== 0) {
            inflationAxisValues.push(inflationAxisValues[inflationAxisValues.length - 1] + inflationAxisInterval);
            positiveDif = positiveDif - 1;
          }
        } else {
          let positiveDif = inflationPositiveTotal - salesPositiveTotal;
          while (positiveDif !== 0) {
            salesAxisValues.push(salesAxisValues[salesAxisValues.length - 1] + salesAxisInterval);
            positiveDif = positiveDif - 1;
          }
        }
      }
    }

    return { sales: salesAxisValues, inflation: inflationAxisValues };
  };

  const { explainers } = globalConstants;

  const handleChartMouseEnter = () => {
    setChartHover(true);
    const eventLabel = 'Savings Bonds - Correlation Between Inflation and I Bond Sales';
    const eventAction = 'Chart Hover';
    gaTimer = setTimeout(() => {
      analyticsEventHandler(eventLabel, eventAction);
      ga4DataLayerPush({
        event: eventAction,
        eventLabel: eventLabel,
      });
    }, explainers.chartHoverDelay);
  };

  const handleChartMouseLeave = () => {
    setChartHover(false);
    clearTimeout(gaTimer);
    resetDataHeader();
  };

  useEffect(() => {
    const filter = `security_type_desc:eq:Savings Bond,security_class_desc:eq:I,record_fiscal_year:gte:${curFy - 15}`;
    const sort = '-record_date';
    const endpoint = `v1/accounting/od/securities_sales?filter=${filter}&sort=${sort}`;

    if (curFy) {
      basicFetch(`${apiPrefix}${endpoint}&page[size]=1`).then(metaRes => {
        if (metaRes.meta && typeof metaRes.meta['total-pages'] !== 'undefined') {
          const pageSize = metaRes.meta['total-pages'];
          basicFetch(`${apiPrefix}${endpoint}&page[size]=${pageSize}`).then(res => {
            if (res.data) {
              const data = res.data;
              const tempChartData = [];
              const xAxis = [];
              let maxSalesValue;
              let minSalesValue;
              let maxInflationValue;
              let minInflationValue;
              data.forEach(val => {
                const { record_calendar_month, record_calendar_year, record_fiscal_year, net_sales_amt, record_date } = val;
                const cpiKey = 'M' + record_calendar_month + record_calendar_year;
                const inflationChange = cpi12MonthPercentChange[cpiKey];
                const salesAmount = net_sales_amt;
                if (inflationChange && salesAmount) {
                  maxSalesValue = maxSalesValue ? Math.max(salesAmount, maxSalesValue) : salesAmount;
                  minSalesValue = minSalesValue ? Math.min(salesAmount, minSalesValue) : salesAmount;
                  maxInflationValue = maxInflationValue ? Math.max(inflationChange, maxInflationValue) : inflationChange;
                  minInflationValue = minInflationValue ? Math.min(inflationChange, minInflationValue) : inflationChange;
                  const month = new Date(record_date).toLocaleDateString('default', { month: 'short' });
                  tempChartData.push({
                    year: month + ' ' + record_calendar_year,
                    sales: salesAmount,
                    inflation: inflationChange,
                    recordDate: record_date,
                  });
                  // Create an x-axis tick at the start of the fiscal year ( Oct ), every 3 years
                  if (record_calendar_month === '10' && (curFy - record_fiscal_year) % 3 === 0) {
                    xAxis.push(record_date);
                  }
                }
              });
              if (tempChartData.length > 0) {
                const latest = tempChartData[0];
                setLatestData(latest);
                // Set default header values
                setCurYear(latest?.year);
                setCurSales(latest?.sales);
                setCurInflation(latest?.inflation);

                //Set axis values, additional y-axis values may be added based on current data
                const yAxisValues = adjustYAxisArrays(
                  defaultSalesAxis,
                  defaultInflationAxis,
                  maxSalesValue,
                  minSalesValue,
                  maxInflationValue,
                  minInflationValue
                );
                setSalesAxis(yAxisValues.sales);
                setInflationAxis(yAxisValues.inflation);
                setXAxisValues(xAxis);
                tempChartData.reverse();
                setChartData(tempChartData);
              }
            }
          });
        }
      });
    }
  }, [curFy]);

  const formatTick = value => {
    // Display tick as the fiscal year for October dates
    return new Date(value).getFullYear() + 1;
  };

  const chartTitle = `Correlation Between Inflation and I Bond Sales, FY ${curFy - 15} – FYTD ${curFy}`;
  return (
    <>
      {chartData && (
        <ChartContainer
          title={chartTitle}
          altText={chartCopy.altText}
          date={getDateWithoutOffset(latestData?.recordDate)}
          footer={chartCopy.footer}
          header={header}
        >
          <div className={chartStyle} data-testid="chartParent">
            <Legend />
            <div
              role="presentation"
              onBlur={() => {
                setChartFocus(false);
                resetDataHeader();
              }}
              onFocus={() => setChartFocus(true)}
              onMouseEnter={handleChartMouseEnter}
              onMouseLeave={handleChartMouseLeave}
            >
              <ResponsiveContainer height={352} width="99%">
                <LineChart data={chartData} margin={{ top: 12, bottom: -8, left: -8, right: -12 }} accessibilityLayer>
                  <CartesianGrid vertical={false} stroke="#d9d9d9" />
                  <ReferenceLine y={0} stroke="#555555" />
                  <XAxis dataKey="recordDate" ticks={xAxisValues} tickCount={5} tickFormatter={value => formatTick(value).toString()} />
                  <YAxis
                    dataKey="sales"
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={value => yAxisFormatter(value)}
                    tick={{ fill: treasurySavingsBondsExplainerSecondary }}
                    ticks={salesAxis}
                    tickCount={salesAxis.length}
                  />
                  <YAxis
                    yAxisId={1}
                    dataKey="inflation"
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tickCount={inflationAxis.length}
                    ticks={inflationAxis}
                    tickFormatter={value => `${value.toFixed(1)}%`}
                    orientation="right"
                    domain={[inflationAxis[0], inflationAxis[inflationAxis.length]]}
                  />
                  <Line
                    dataKey="sales"
                    stroke={treasurySavingsBondsExplainerSecondary}
                    dot={false}
                    strokeWidth={1}
                    activeDot={false}
                    isAnimationActive={false}
                  />
                  <Line
                    dataKey="inflation"
                    stroke="#666"
                    strokeDasharray="2 2"
                    dot={false}
                    strokeWidth={2}
                    activeDot={false}
                    isAnimationActive={false}
                    yAxisId={1}
                  />
                  <Tooltip
                    content={<CustomTooltip setYear={setCurYear} setInflation={setCurInflation} setSales={setCurSales} />}
                    cursor={{ strokeDasharray: '4 4', stroke: '#555', strokeWidth: '2px' }}
                    isAnimationActive={false}
                    active={chartFocus || chartHover}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ChartContainer>
      )}
    </>
  );
};

export default IBondSalesChart;
