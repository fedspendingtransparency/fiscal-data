import React, { useEffect, useState } from 'react';
import { Line, XAxis, YAxis, LineChart, CartesianGrid, Tooltip } from 'recharts';
import { deficitExplainerPrimary } from '../../../sections/national-deficit/national-deficit.module.scss';
import { spendingExplainerPrimary } from '../../../sections/federal-spending/federal-spending.module.scss';
import { revenueExplainerPrimary } from '../../../sections/government-revenue/revenue.module.scss';
import { legend, legendItem, dot, chartContainer, chartTitle, surplusPrimary } from './deficit-chart.module.scss';
import { apiPrefix, basicFetch } from '../../../../../utils/api-utils';
import CustomTooltip from './custom-tooltip';
const AFGDefictChart = () => {
  const [focusedYear, setFocusedYear] = useState(null);
  const [currentFY, setCurrentFY] = useState(null);
  const [finalChartData, setFinalChartData] = useState(null);
  const [legendItems, setLegendItems] = useState(null);

  const revenueEndpointUrl = '/v1/accounting/mts/mts_table_4?filter=line_code_nbr:eq:830&sort=-record_date';
  const spendingEndpointUrl = '/v1/accounting/mts/mts_table_5?filter=line_code_nbr:eq:5691&sort=-record_date';
  const currentFYEndpointUrl = '/v1/accounting/mts/mts_table_5?filter=line_code_nbr:eq:5694&sort=-record_date&page[size]=1';

  const CustomDotNoAnimation = props => {
    const { cx, cy, payload, r } = props;

    const color = payload?.type === 'spending' ? spendingExplainerPrimary : revenueExplainerPrimary;
    const fill = color;

    return (
      <>
        <circle fill="white" r={r} strokeWidth={4} stroke="white" fillOpacity={1} cx={cx} cy={cy}></circle>
        <circle fill={fill} r={r} strokeWidth={2} stroke={color} fillOpacity={1} cx={cx} cy={cy}></circle>
      </>
    );
  };

  const getChartData = async () => {
    const chart_data = [];
    const round = x => x / 1000000000000;
    let allSpending;
    let allRevenue;
    let allSurplus = false;
    await basicFetch(`${apiPrefix}${spendingEndpointUrl}`).then(async spendingRes => {
      const currentFYSpending = spendingRes.data[0];
      const priorSpending = spendingRes.data.filter(
        record => record.record_calendar_month === '12' && record.record_fiscal_year !== currentFY && record.record_fiscal_year >= currentFY - 4
      );
      allSpending = [currentFYSpending, ...priorSpending];
      await basicFetch(`${apiPrefix}${revenueEndpointUrl}`).then(async revenueRes => {
        const currentFYRevenue = revenueRes.data[0];
        const priorRevenue = revenueRes.data.filter(
          record => record.record_calendar_month === '12' && record.record_fiscal_year !== currentFY && record.record_fiscal_year >= currentFY - 4
        );
        allRevenue = [currentFYRevenue, ...priorRevenue];
      });
    });
    //Construct chart data
    for (let i = 0; i < allRevenue.length; i++) {
      const { current_fytd_net_rcpt_amt: revenueValue, record_fiscal_year: revenueFY } = allRevenue[i];
      const { current_fytd_net_outly_amt: spendingValue, record_fiscal_year: spendingFY } = allSpending[i];
      const surplus = Number(revenueValue) > Number(spendingValue);
      if (surplus) {
        allSurplus = true;
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
            { year: revenueFY, value: round(revenueValue), type: 'revenue', opacity: 0, tooltip: toolTipContent, surplus: surplus },
            { year: spendingFY, value: round(spendingValue), type: 'spending', opacity: 0, tooltip: toolTipContent, surplus: surplus },
          ],
        });
      }
    }
    const legendBase = [
      { title: 'Spending', color: spendingExplainerPrimary },
      { title: 'Revenue', color: revenueExplainerPrimary },
      { title: 'Deficit', color: deficitExplainerPrimary },
    ];
    setLegendItems(allSurplus ? [...legendBase, { title: 'Surplus', color: surplusPrimary }] : [...legendBase]);
    return chart_data;
  };

  useEffect(() => {
    if (!finalChartData && currentFY) {
      getChartData().then(res => setFinalChartData(res));
    }
  }, [currentFY]);

  useEffect(() => {
    basicFetch(`${apiPrefix}${currentFYEndpointUrl}`).then(result => {
      if (result?.data) {
        setCurrentFY(result.data[0].record_fiscal_year);
      }
    });
  }, []);

  return (
    <>
      <div className={chartTitle}>{`Deficit: FYTD ${currentFY} and Last 4 Years in Trillions of USD`}</div>
      <div className={legend}>
        {legendItems?.map(row => {
          return (
            <div className={legendItem}>
              <span className={dot} style={{ backgroundColor: row.color }}></span>
              {row.title}
            </div>
          );
        })}
      </div>
      <div className={chartContainer}>
        {finalChartData && (
          <LineChart
            key={Math.random()}
            width={396}
            height={164}
            margin={{
              top: 8,
              right: 8,
              bottom: 8,
              left: -18,
            }}
            layout="vertical"
            onMouseLeave={() => setFocusedYear(null)}
          >
            <CartesianGrid horizontal={false} height={128} />
            <YAxis
              dataKey="year"
              padding={{ bottom: 4, top: 4 }}
              type="category"
              allowDuplicatedCategory={false}
              axisLine={false}
              tickLine={false}
              tickCount={5}
              tickMargin={8}
            />
            <XAxis tickMargin={16} type="number" tickFormatter={value => `$${value}`} axisLine={false} tickLine={false} />
            {finalChartData.map(s => (
              <Line
                dataKey="value"
                data={s.data}
                stroke={s.data[0].surplus ? surplusPrimary : deficitExplainerPrimary}
                strokeWidth={4}
                strokeOpacity={focusedYear === s.data[0].year || focusedYear === null ? 1 : 0.5}
                dot={<CustomDotNoAnimation />}
                isAnimationActive={false}
                activeDot={false}
              />
            ))}
            <Tooltip content={<CustomTooltip setFocused={setFocusedYear} />} cursor={{ strokeWidth: 0 }} isAnimationActive={false} />
          </LineChart>
        )}
      </div>
    </>
  );
};

export default AFGDefictChart;
