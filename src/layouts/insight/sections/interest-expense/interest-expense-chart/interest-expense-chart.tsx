import { Bar, CartesianGrid, Cell, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CustomTooltip, footer, Legend } from './interest-expense-chart-helper';
import React, { useEffect, useState } from 'react';
import { Skeleton } from '@mui/material';
import { interestExpensePrimary } from '../../../insight.module.scss';
import { getShortForm } from '../../../../../utils/rounding-utils';
import ChartDataHeader from '../../../../explainer/explainer-components/chart-data-header/chart-data-header';
import { useWindowSize } from '../../../../../hooks/windowResize';
import { useGetInterestExpenseData } from '../useGetInterestExpenseData';
import globalConstants from '../../../../../helpers/constants';
import { analyticsEventHandler } from '../../../../../helpers/insights/insight-helpers';
import { ga4DataLayerPush } from '../../../../../helpers/google-analytics/google-analytics-helper';
import { ChartTableContainer } from '../../../../../components/chart-with-table/chart-table-container/chart-table-container';
import { faChartColumn, faTable } from '@fortawesome/free-solid-svg-icons';
import { chartTableBoarder } from './interest-expense-chart.module.scss';
import DtgTable from '../../../../../components/dtg-table/dtg-table';
import ChartingTableToggle from '../../../../../components/chart-with-table/chart-table-toggle/charting-table-toggle';

const breakpoint = {
  desktop: 1015,
  tablet: 600,
};

let gaTimer;

export const InterestExpenseChart = () => {
  const [selectedChartView, setSelectedChartView] = useState<string>('chartView');

  const { explainers } = globalConstants;
  const [width] = useWindowSize();
  const [isMobile, setIsMobile] = useState<boolean>(null);
  const {
    chartData,
    chartXAxisValues,
    expenseYAxisValues,
    rateYAxisValues,
    latestChartData,
    altText,
    chartLoading,
    currentFY,
    startFY,
    columnConfig,
    mergedTableData,
    columnConfigArray,
  } = useGetInterestExpenseData(true, isMobile);
  const [fiscalYear, setFiscalYear] = useState<number>(0);
  const [curExpenseAmount, setCurExpenseAmount] = useState<number>(0);
  const [curRate, setCurRate] = useState<number>(0);
  const [chartFocus, setChartFocus] = useState<boolean>(false);
  const [chartHover, setChartHover] = useState<boolean>(false);
  const [sorting, setSorting] = useState([]);
  const [downloadData, setDownloadData] = useState([]);
  const chartTitle = `Interest Expense and Average Interest Rates on the National Debt FY ${startFY} - FYTD ${currentFY}`;
  const toggle = (
    <ChartingTableToggle
      primaryColor={'#0071BC'}
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
      leftLabel={'toggle for chart view'}
      rightLabel={'toggle for table view'}
    />
  );
  const resetDataHeader = () => {
    if (latestChartData) {
      setFiscalYear(latestChartData.year);
      setCurExpenseAmount(latestChartData.expense);
      setCurRate(latestChartData.rate);
    }
  };
  const handleChartMouseEnter = () => {
    const eventLabel = 'Interest Expense and Average Interest Rates on the National Debt';
    const eventAction = 'Chart Hover';
    gaTimer = setTimeout(() => {
      analyticsEventHandler('Interest Expense', eventLabel, eventAction);
      ga4DataLayerPush({
        event: eventAction,
        eventLabel: eventLabel,
      });
    }, explainers.chartHoverDelay);
  };

  const handleChartMouseLeave = () => {
    clearTimeout(gaTimer);
  };

  useEffect(() => {
    if (!chartLoading) {
      setFiscalYear(latestChartData.year);
      setCurExpenseAmount(latestChartData.expense);
      setCurRate(latestChartData.rate);
    }
  }, [chartLoading]);

  useEffect(() => {
    if (window.innerWidth < breakpoint.desktop) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }, [width]);

  useEffect(() => {
    const downloaderData = mergedTableData.map(row => columnConfig.map(col => row[col.property]));
    downloaderData.unshift(columnConfigArray);
    setDownloadData(downloaderData);
  }, [mergedTableData]);

  return (
    <>
      <ChartTableContainer
        tableView={selectedChartView === 'tableView'}
        title={chartTitle}
        footer={footer}
        toggle={toggle}
        downloadData={downloadData}
        selectedTable={{ downloadName: 'interest-expense-avg-interest-rates' }}
        dateRange={{ from: startFY, to: currentFY }}
        enabledClickedColorChange={true}
      >
        {selectedChartView === 'chartView' && (
          <div className={chartTableBoarder}>
            {chartLoading ? (
              <div>
                <Skeleton
                  width="99%"
                  variant="rounded"
                  sx={{
                    minHeight: 360,
                    transition: 'opacity 2s',
                  }}
                />
              </div>
            ) : (
              <div aria-label={altText}>
                {fiscalYear > 0 && (
                  <div>
                    <ChartDataHeader
                      dateField={fiscalYear === latestChartData.year ? 'FYTD' : 'Fiscal Year'}
                      fiscalYear={fiscalYear}
                      right={{ label: 'Interest Expense', value: `$${getShortForm(curExpenseAmount.toString())}` }}
                      left={{ label: 'Avg. Interest Rate', value: `${curRate}%` }}
                    />
                  </div>
                )}
                <div
                  data-testid="chartParent"
                  role="presentation"
                  onFocus={handleChartMouseEnter}
                  onMouseEnter={handleChartMouseEnter}
                  onMouseLeave={handleChartMouseLeave}
                >
                  <Legend />
                  <div
                    role="presentation"
                    onBlur={() => {
                      setChartFocus(false);
                      resetDataHeader();
                    }}
                    onFocus={() => setChartFocus(true)}
                    onMouseOver={() => setChartHover(true)}
                    onMouseLeave={() => setChartHover(false)}
                  >
                    <ResponsiveContainer height={360} width="99%">
                      <ComposedChart
                        data={chartData}
                        margin={{ top: 12, bottom: -8, left: 3, right: -18 }}
                        accessibilityLayer
                        onMouseLeave={resetDataHeader}
                      >
                        <defs>
                          <pattern id="diagStripes" width={6} height={6} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                            <line x1="0" y1="0" x2="0" y2="6" style={{ stroke: interestExpensePrimary, strokeWidth: 8 }} />
                          </pattern>
                        </defs>
                        <CartesianGrid vertical={false} stroke="#d9d9d9" />
                        <XAxis dataKey="year" ticks={chartXAxisValues} />
                        <YAxis
                          dataKey="expense"
                          type="number"
                          tickFormatter={value => {
                            if (value === 0) {
                              return '$0';
                            } else {
                              return `$${getShortForm(value)}`;
                            }
                          }}
                          axisLine={false}
                          tickLine={false}
                          tickCount={5}
                          ticks={expenseYAxisValues}
                          tick={{ fill: interestExpensePrimary }}
                        />
                        <YAxis
                          yAxisId={1}
                          dataKey="rate"
                          orientation="right"
                          axisLine={false}
                          tickLine={false}
                          type="number"
                          tickCount={5}
                          ticks={rateYAxisValues}
                          tickFormatter={value => `${value.toFixed(1)}%`}
                        />
                        <Tooltip
                          cursor={{
                            stroke: '#00796B20',
                            strokeWidth: isMobile ? 16 : 32,
                          }}
                          content={<CustomTooltip setYear={setFiscalYear} setExpense={setCurExpenseAmount} setRate={setCurRate} />}
                          isAnimationActive={false}
                          active={chartFocus || chartHover}
                        />
                        <Bar dataKey="expense" barSize={isMobile ? 12 : 20} fill={interestExpensePrimary} isAnimationActive={false}>
                          {chartData.map((entry, index) => {
                            return (
                              <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? 'url(#diagStripes)' : interestExpensePrimary} />
                            );
                          })}
                        </Bar>
                        <Line
                          dataKey="rate"
                          yAxisId={1}
                          stroke="#666666"
                          type="monotone"
                          strokeWidth={1}
                          activeDot={false}
                          isAnimationActive={false}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {selectedChartView === 'tableView' && (
          <DtgTable
            tableProps={{
              data: mergedTableData,
              columnConfig,
              tableName: 'Interest Expense Details',
              caption: 'Interest Expense and Rates Table',
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
        )}
      </ChartTableContainer>
    </>
  );
};
