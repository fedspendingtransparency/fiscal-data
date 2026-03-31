import React, { FunctionComponent, useEffect, useState } from 'react';
import ChartContainer from '../../../../explainer-components/chart-container/chart-container';
import { chartStyle, loadingIcon, container } from './savings-bonds-sold-by-type-chart.module.scss';
import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import ChartLegend from './chart-legend/chart-legend';
import {
  chartCopy,
  fyEndpoint,
  getXAxisValues,
  savingsBonds,
  savingsBondsMap,
  sortByType,
  yAxisFormatter,
} from './savings-bonds-sold-by-type-chart-helper';
import CustomTooltip from './custom-tooltip/custom-tooltip';
import ChartHeader from './chart-header/chart-header';
import ChartDescription from './chart-description/chart-description';
import { analyticsEventHandler } from '../../../../explainer-helpers/explainer-helpers';
import { ga4DataLayerPush } from '../../../../../../helpers/google-analytics/google-analytics-helper';
import globalConstants from '../../../../../../helpers/constants';
import LoadingIndicator from '../../../../../../components/loading-indicator/loading-indicator';
import { treasurySavingsBondsExplainerSecondary } from '../../treasury-savings-bonds.module.scss';
import { getShortForm } from '../../../../../../utils/rounding-utils';
import VisualizationCallout from '../../../../../../components/visualization-callout/visualization-callout';
import { graphql, useStaticQuery } from 'gatsby';
import { getSaleBondsFootNotes } from '../../learn-more/learn-more-helper';
import { apiPrefix, basicFetch } from '../../../../../../utils/api-utils';
import { adjustDataForInflation } from '../../../../../../helpers/inflation-adjust/inflation-adjust';
import { getDateWithoutTimeZoneAdjust } from '../../../../../../utils/date-utils';
import { ICpiDataMap } from '../../../../../../models/ICpiDataMap';
import { useErrorBoundary } from 'react-error-boundary';

export interface ISavingBondsByTypeChartData {
  year: string;
  AD?: number;
  E?: number;
  EE?: number;
  F?: number;
  G?: number;
  H?: number;
  HH?: number;
  I?: number;
  J?: number;
  K?: number;
}

let gaTimer;

interface BondSaleEntry {
  year: string;
  [key: string]: string;
}

type SalesData = Record<string, number>;

const SavingsBondsSoldByTypeChart: FunctionComponent = ({ cpiDataByYear }) => {
  const [selectedChartView, setSelectedChartView] = useState<string>('amounts');
  const [hiddenFields, setHiddenFields] = useState<string[]>([]);
  const [sortedBonds, setSortedBonds] = useState<string[]>();
  const [maxYear, setMaxYear] = useState<number>();
  const [xAxis, setXAxis] = useState<number[]>();
  const [inflationSwitch, setInflationSwitch] = useState<boolean>(false);
  const [chartFocus, setChartFocus] = useState<boolean>(false);
  const [chartHover, setChartHover] = useState<boolean>(false);
  const [chartData, setChartData] = useState<ISavingBondsByTypeChartData[]>();
  const [curFy, setCurFy] = useState<string>();
  const [historyChartDate, setHistoryChartDate] = useState<Date>(null);
  const [inflationChartData, setInflationChartData] = useState<ISavingBondsByTypeChartData[]>();
  const [mostBondSalesYear, setMostBondSalesYear] = useState<string | null>(null);
  const [mostBondSales, setMostBondSales] = useState<number>(0);
  const [secondMostBondSalesYear, setSecondMostBondSalesYear] = useState<string | null>(null);
  const [secondMostBondSales, setSecondMostBondSales] = useState<number>(0);
  const chartTitle = `Savings Bonds Sold by Type Over Time, FY 1935 – FYTD ${curFy ?? '--'}`;

  const { showBoundary } = useErrorBoundary();

  const allSavingsBondsByTypeHistorical = useStaticQuery(
    graphql`
      query {
        allSavingsBondsByTypeHistoricalCsv {
          savingsBondsByTypeHistoricalCsv: nodes {
            year
            bond_type
            sales
          }
        }
      }
    `
  );
  let savingsBondsByTypeHistorical = allSavingsBondsByTypeHistorical.allSavingsBondsByTypeHistoricalCsv.savingsBondsByTypeHistoricalCsv;

  const savingsBondsEndpoint = 'v1/accounting/od/securities_sales?filter=security_type_desc:eq:Savings%20Bond';

  useEffect(() => {
    basicFetch(`${apiPrefix}${savingsBondsEndpoint}&page[size]=1`).then(metaRes => {
      if (metaRes.meta && typeof metaRes.meta['total-pages'] !== 'undefined') {
        const pageSize = metaRes.meta['total-pages'];
        basicFetch(`${apiPrefix}${savingsBondsEndpoint}&page[size]=${pageSize}`)
          .then(res => {
            if (res.data) {
              const currentData = sortByType(res.data, 'record_fiscal_year', 'security_class_desc', 'net_sales_amt');
              const historicalData = sortByType(savingsBondsByTypeHistorical, 'year', 'bond_type', 'sales');
              const allData = [...historicalData, ...currentData].sort((a, b) => a.year - b.year);

              res.data = adjustDataForInflation(res.data, 'net_sales_amt', 'record_fiscal_year', cpiDataByYear);
              const inflationCurrentData = sortByType(res.data, 'record_fiscal_year', 'security_class_desc', 'net_sales_amt');

              savingsBondsByTypeHistorical = adjustDataForInflation(savingsBondsByTypeHistorical, 'sales', 'year', cpiDataByYear);
              const inflationHistoricalData = sortByType(savingsBondsByTypeHistorical, 'year', 'bond_type', 'sales');
              const inflationAllData = [...inflationHistoricalData, ...inflationCurrentData]
                .sort((a, b) => a.year - b.year)
                .filter(entry => cpiDataByYear[entry.year]);

              const salesByYear: SalesData = allData.reduce((acc, entry: BondSaleEntry) => {
                const totalSalesForYear = acc[entry.year] || 0;
                const yearlySales = Object.keys(entry)
                  .filter(key => key !== 'year')
                  .reduce((sum, key) => sum + Number(entry[key]), 0);

                acc[entry.year] = totalSalesForYear + yearlySales;
                return acc;
              }, {});

              const sortedYears = Object.entries(salesByYear)
                .map(([year, totalSales]) => ({ year, totalSales }))
                .sort((a, b) => b.totalSales - a.totalSales);

              if (sortedYears.length > 0) {
                setMostBondSalesYear(sortedYears[0].year);
                setMostBondSales(sortedYears[0].totalSales);
                if (sortedYears.length > 1) {
                  setSecondMostBondSalesYear(sortedYears[1].year);
                  setSecondMostBondSales(sortedYears[1].totalSales);
                }
              }
              setChartData(allData);
              setInflationChartData(inflationAllData);
            }
          })
          .catch(err => {
            showBoundary(err);
          });
      }
    });
  }, []);

  useEffect(() => {
    basicFetch(`${apiPrefix}${fyEndpoint}`).then(res => {
      if (res.data) {
        const data = res.data[0];
        setCurFy(data.record_fiscal_year);
        setHistoryChartDate(getDateWithoutTimeZoneAdjust(data.record_date));
      }
    });
  }, []);

  let activeChartData = inflationSwitch ? inflationChartData : chartData;
  const handleInflationToggle = (isAdjusted: boolean) => {
    setInflationSwitch(isAdjusted);
    analyticsEventHandler('Savings Bonds - Savings Bonds Sold Inflation Adjustment', 'Chart Toggle');
  };

  const { explainers } = globalConstants;

  const handleChartMouseEnter = () => {
    setChartHover(true);
    const eventLabel = 'Savings Bonds - Savings Bonds Sold by Type Over Time';
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
  };

  const header = (
    <ChartHeader
      selectedChartView={selectedChartView}
      setSelectedChartView={setSelectedChartView}
      onToggle={handleInflationToggle}
      isInflationAdjusted={inflationSwitch}
    />
  );

  useEffect(() => {
    if (chartData) {
      const max = Number(chartData[chartData.length - 1].year);
      setXAxis(getXAxisValues(1935, max));
      setMaxYear(max);
      setSortedBonds(sortedByDate(savingsBonds, chartData));
    }
    if (selectedChartView === 'description') {
      activeChartData = chartData;
    }
  }, [chartData, activeChartData, selectedChartView]);

  const sortedByDate = (savingsBonds, data) => {
    if (data) {
      const sorted = [];
      data.forEach(year => {
        savingsBonds.forEach(bondType => {
          if (!!year[bondType] && !sorted.includes(bondType)) {
            sorted.push(bondType);
          }
        });
      });
      return sorted;
    }
  };

  return (
    <>
      <div className={container}>
        <ChartContainer title={chartTitle} altText={chartCopy.altText} date={historyChartDate} footer={chartCopy.footer} header={header}>
          {selectedChartView === 'amounts' &&
            (!chartData || !sortedBonds ? (
              <LoadingIndicator loadingClass={loadingIcon} />
            ) : (
              <div className={chartStyle} data-testid="chartParent">
                <div
                  role="presentation"
                  onBlur={() => setChartFocus(false)}
                  onFocus={() => setChartFocus(true)}
                  onMouseEnter={handleChartMouseEnter}
                  onMouseLeave={handleChartMouseLeave}
                >
                  <ResponsiveContainer height={377} width="99%">
                    <AreaChart data={activeChartData} margin={{ top: 16, bottom: 0, left: -4, right: 16 }} accessibilityLayer>
                      <CartesianGrid vertical={false} stroke="#d9d9d9" />
                      <ReferenceLine y={0} stroke="#555555" />
                      <XAxis dataKey="year" type="number" domain={[1935, maxYear]} ticks={xAxis} minTickGap={3} />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={value => `${yAxisFormatter(parseFloat(value))}`}
                        domain={['auto', 'dataMax']}
                        tickCount={8}
                      />
                      {sortedBonds.map((id, index) => {
                        return (
                          <Area
                            dataKey={id}
                            key={index}
                            fill={savingsBondsMap[id].color}
                            fillOpacity={0.8}
                            stroke={savingsBondsMap[id].color}
                            strokeOpacity={0.8}
                            hide={hiddenFields.includes(id)}
                            isAnimationActive={false}
                            activeDot={false}
                          />
                        );
                      })}
                      <Tooltip
                        content={<CustomTooltip hiddenFields={hiddenFields} />}
                        cursor={{ strokeDasharray: '4 4', stroke: '#555', strokeWidth: '2px' }}
                        isAnimationActive={false}
                        active={chartFocus || chartHover}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <ChartLegend lines={savingsBonds} lineMap={savingsBondsMap} setHiddenFields={setHiddenFields} hiddenFields={hiddenFields} />
              </div>
            ))}
          {selectedChartView === 'description' && <ChartDescription />}
        </ChartContainer>
      </div>
      <VisualizationCallout color={treasurySavingsBondsExplainerSecondary}>
        <p>
          Savings bonds were most popular in {mostBondSalesYear ?? '--'} and {secondMostBondSalesYear ?? '--'} when $
          {mostBondSales ? getShortForm(mostBondSales) : '--'} and ${secondMostBondSales ? getShortForm(secondMostBondSales) : '--'} bonds were sold,
          respectively.
        </p>
      </VisualizationCallout>
    </>
  );
};

export default SavingsBondsSoldByTypeChart;
