import React, { ReactElement, useEffect, useState } from 'react';
import { Line, XAxis, YAxis, LineChart, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { deficitExplainerPrimary } from '../../national-deficit/national-deficit.module.scss';
import { spendingExplainerPrimary } from '../../federal-spending/federal-spending.module.scss';
import { revenueExplainerPrimary } from '../../government-revenue/revenue.module.scss';
import { legend, legendItem, dot, chartContainer, chartTitle, surplusPrimary, deficitChart } from './deficit-chart.module.scss';
import { apiPrefix, basicFetch } from '../../../../../utils/api-utils';
import CustomTooltip from './custom-tooltip/custom-tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import CustomDotNoAnimation from './custom-dot/custom-dot';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import ChartLegend from '../chart-components/chart-legend';

const AFGDeficitChart = (): ReactElement => {
  const [focusedYear, setFocusedYear] = useState(null);
  const [currentFY, setCurrentFY] = useState();
  const [finalChartData, setFinalChartData] = useState(null);
  const [legendItems, setLegendItems] = useState(null);
  const [isLoading, setLoading] = useState(true);

  const revenueEndpointUrl = '/v1/accounting/mts/mts_table_4?filter=line_code_nbr:eq:830&sort=-record_date';
  const spendingEndpointUrl = '/v1/accounting/mts/mts_table_5?filter=line_code_nbr:eq:5691&sort=-record_date';
  const currentFYEndpointUrl = '/v1/accounting/mts/mts_table_5?filter=line_code_nbr:eq:5694&sort=-record_date&page[size]=1';

  const tickCountXAxis = 5;

  const getChartData = async () => {
    if (currentFY) {
      const chart_data = [];
      const round = x => x / 1000000000000;
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
      setLegendItems(surplusLegend ? [...legendBase, { title: 'Surplus', color: surplusPrimary }] : [...legendBase]);
      return chart_data;
    }
  };

  useEffect(() => {
    if (!finalChartData && currentFY) {
      getChartData().then(res => {
        setFinalChartData(res);
        setLoading(false);
      });
    }
  }, [currentFY]);

  useEffect(() => {
    basicFetch(`${apiPrefix}${currentFYEndpointUrl}`).then(result => {
      if (result?.data) {
        setCurrentFY(result.data[0].record_fiscal_year);
      }
    });
  }, []);

  const axisFormatter = (value, index) => {
    let ret = value.toString();
    if (index >= tickCountXAxis - 1) {
      ret = ret + 'T';
    }
    return `$${ret}`;
  };

  return (
    <div className={deficitChart} data-testid="AFGDeficitChart">
      <div className={chartTitle}>{`Deficit: FYTD ${currentFY} and Last 4 Years in Trillions of USD`}</div>
      {isLoading && (
        <div>
          <FontAwesomeIcon icon={faSpinner as IconProp} spin pulse /> Loading...
        </div>
      )}
      {!isLoading && (
        <>
          <ChartLegend legendItems={legendItems} />
          <div>
            <div
              className={chartContainer}
              data-testid="chartContainer"
              onMouseLeave={() => setFocusedYear(null)}
              onBlur={() => setFocusedYear(null)}
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
                    tickFormatter={(value, index) => axisFormatter(value, index)}
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
                        dot={<CustomDotNoAnimation />}
                        isAnimationActive={false}
                        activeDot={false}
                      />
                    );
                  })}
                  <Tooltip content={<CustomTooltip setFocused={setFocusedYear} />} cursor={{ strokeWidth: 0 }} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AFGDeficitChart;
