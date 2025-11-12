import React, { ReactElement, useEffect, useState } from 'react';
import { Line, XAxis, YAxis, LineChart, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { deficitExplainerPrimary, spendingExplainerPrimary, revenueExplainerPrimary } from '../../../../../variables.module.scss';
import { chartContainer, chartTitle, surplusPrimary, deficitChart, breakpointLg } from './deficit-chart.module.scss';
import { apiPrefix, basicFetch } from '../../../../../utils/api-utils';
import CustomTooltip from '../chart-components/custom-tooltip/custom-tooltip';
import CustomDotNoAnimation from './custom-dot/custom-dot';
import ChartLegend from '../chart-components/chart-legend';
import { trillionAxisFormatter } from '../chart-helper';
import { pxToNumber } from '../../../../../helpers/styles-helper/styles-helper';
import { useIsMounted } from '../../../../../utils/useIsMounted';
import LoadingIndicator from '../../../../../components/loading-indicator/loading-indicator';

const AFGDeficitChart = ({ width }: { width: number }): ReactElement => {
  const isMounted = useIsMounted();
  const [focusedYear, setFocusedYear] = useState(null);
  const [currentFY, setCurrentFY] = useState();
  const [finalChartData, setFinalChartData] = useState(null);
  const [legendItems, setLegendItems] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [highlightIndex, setHighlightIndex] = useState(null);
  const [chartFocus, setChartFocus] = useState(false);

  const revenueEndpointUrl = '/v1/accounting/mts/mts_table_4?filter=line_code_nbr:eq:830&sort=-record_date';
  const spendingEndpointUrl = '/v1/accounting/mts/mts_table_5?filter=line_code_nbr:eq:5691&sort=-record_date';
  const currentFYEndpointUrl = '/v1/accounting/mts/mts_table_5?filter=line_code_nbr:eq:5694&sort=-record_date&page[size]=1';

  const tickCountXAxis = 5;

  const ariaLabel =
    'A chart demonstrating the yearly deficit or surplus caused by gaps between revenue and spending. ' +
    'Spending and revenue are represented on the graph as two different colored dots corresponding to the total in trillions of ' +
    'USD for each respective category. The deficit/surplus is then represented as a line connecting the two dots, exhibiting how ' +
    'the deficit/surplus is calculated as the difference between revenue and spending. ';

  const getChartData = async () => {
    if (currentFY) {
      const chart_data = [];
      const round = x => x / 1e12;
      let allSpending;
      let allRevenue;
      let surplusLegend = false;
      const getPastValues = record =>
        record.record_calendar_month === '09' && record.record_fiscal_year !== currentFY && record.record_fiscal_year >= currentFY - 4;

      await basicFetch(`${apiPrefix}${spendingEndpointUrl}`)?.then(async spendingRes => {
        const currentFYSpending = spendingRes.data[0];
        const priorSpending = spendingRes.data.filter(record => getPastValues(record));
        allSpending = [currentFYSpending, ...priorSpending];
        await basicFetch(`${apiPrefix}${revenueEndpointUrl}`)?.then(async revenueRes => {
          const currentFYRevenue = revenueRes.data[0];
          const priorRevenue = revenueRes.data.filter(record => getPastValues(record));
          allRevenue = [currentFYRevenue, ...priorRevenue];
        });
      });
      //Construct chart data
      for (let i = 0; i < allRevenue.length; i++) {
        const { current_fytd_net_rcpt_amt: revenueValue, record_fiscal_year: revenueFY } = allRevenue[i];
        const { current_fytd_net_outly_amt: spendingValue, record_fiscal_year: spendingFY } = allSpending[i];
        const surplus = Number(revenueValue) > Number(spendingValue);
        if (surplus) {
          surplusLegend = true;
        }
        const toolTipContent = [
          { title: 'Spending', color: spendingExplainerPrimary, value: spendingValue },
          { title: 'Revenue', color: revenueExplainerPrimary, value: revenueValue },
          {
            title: surplus ? 'Surplus' : 'Deficit',
            color: surplus ? surplusPrimary : deficitExplainerPrimary,
            value: Math.abs(revenueValue - spendingValue),
          },
        ];
        if (revenueFY === spendingFY) {
          chart_data.push({
            data: [
              { year: revenueFY, value: round(revenueValue), type: 'revenue', tooltip: toolTipContent, surplus: surplus },
              { year: spendingFY, value: round(spendingValue), type: 'spending', tooltip: toolTipContent, surplus: surplus },
            ],
          });
        }
      }
      const legendBase = [
        { title: 'Spending', color: spendingExplainerPrimary },
        { title: 'Revenue', color: revenueExplainerPrimary },
        { title: 'Deficit', color: deficitExplainerPrimary },
      ];
      if (isMounted.current) setLegendItems(surplusLegend ? [...legendBase, { title: 'Surplus', color: surplusPrimary }] : [...legendBase]);
      return chart_data;
    }
  };

  useEffect(() => {
    if (!finalChartData && currentFY) {
      getChartData().then(res => {
        if (isMounted.current) setFinalChartData(res);
        if (isMounted.current) setLoading(false);
      });
    }
  }, [currentFY]);

  useEffect(() => {
    basicFetch(`${apiPrefix}${currentFYEndpointUrl}`).then(result => {
      if (result?.data) {
        if (isMounted.current) setCurrentFY(result.data[0].record_fiscal_year);
      }
    });
  }, []);

  return (
    <figure className={deficitChart} data-testid="AFGDeficitChart" role="figure" aria-label={ariaLabel}>
      <div className={chartTitle}>{`Deficit: FYTD ${currentFY} and Last 4 Years in Trillions of USD`}</div>
      {isLoading && <LoadingIndicator />}
      {!isLoading && (
        <>
          <ChartLegend legendItems={legendItems} mobileDotSpacing={false} />
          <div
            className={chartContainer}
            data-testid="chartContainer"
            onMouseEnter={() => setChartFocus(true)}
            onMouseLeave={() => {
              setFocusedYear(null);
              setChartFocus(false);
            }}
            onBlur={() => {
              setFocusedYear(null);
              setHighlightIndex(null);
              setChartFocus(false);
            }}
            role="presentation"
          >
            <ResponsiveContainer height={164} width="99%">
              <LineChart
                margin={{
                  top: 8,
                  right: 12,
                  bottom: 8,
                  left: -18,
                }}
                layout="vertical"
              >
                <CartesianGrid horizontal={false} height={128} />
                <YAxis
                  dataKey="year"
                  padding={{ bottom: 2, top: 8 }}
                  type="category"
                  allowDuplicatedCategory={false}
                  axisLine={false}
                  tickLine={false}
                  tickCount={5}
                  tickMargin={8}
                />
                <XAxis
                  tickMargin={16}
                  type="number"
                  tickFormatter={(value, index) => trillionAxisFormatter(value, index, tickCountXAxis)}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                  tickCount={tickCountXAxis}
                />
                {finalChartData.map((year, index) => {
                  return (
                    <Line
                      key={index}
                      dataKey="value"
                      data={year.data}
                      stroke={year.data[0].surplus ? surplusPrimary : deficitExplainerPrimary}
                      strokeWidth={4}
                      strokeOpacity={focusedYear === year.data[0].year || focusedYear === null ? 1 : 0.5}
                      dot={<CustomDotNoAnimation focusedYear={focusedYear} />}
                      isAnimationActive={false}
                      activeDot={false}
                      tabIndex={0}
                      onFocus={() => {
                        setChartFocus(true);
                        setHighlightIndex(index);
                      }}
                    />
                  );
                })}
                <Tooltip
                  content={<CustomTooltip setFocused={setFocusedYear} curFY={currentFY} />}
                  cursor={{ strokeWidth: 0 }}
                  isAnimationActive={false}
                  allowEscapeViewBox={width > pxToNumber(breakpointLg) ? { x: true } : { y: true }}
                  defaultIndex={highlightIndex}
                  active={chartFocus}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </figure>
  );
};

export default AFGDeficitChart;
