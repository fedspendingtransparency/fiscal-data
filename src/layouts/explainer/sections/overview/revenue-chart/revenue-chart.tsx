import React, { ReactElement, useEffect, useState } from 'react';
import { apiPrefix, basicFetch, monthNames } from '../../../../../utils/api-utils';
import { Tooltip } from 'recharts/es6/component/Tooltip';
import { LineChart } from 'recharts/es6/chart/LineChart';
import { ResponsiveContainer } from 'recharts/es6/component/ResponsiveContainer';
import { CartesianGrid } from 'recharts/es6/cartesian/CartesianGrid';
import { Line } from 'recharts/es6/cartesian/Line';
import { XAxis } from 'recharts/es6/cartesian/XAxis';
import { YAxis } from 'recharts/es6/cartesian/YAxis';
import CustomTooltip from '../chart-components/line-chart-custom-tooltip/custom-tooltip';
import { chartContainer, chartTitle, deficitChart } from '../deficit-chart/deficit-chart.module.scss';
import ChartLegend from '../chart-components/chart-legend';
import { monthAxisFormatter, trillionAxisFormatter } from '../chart-helper';
import { useIsMounted } from '../../../../../utils/useIsMounted';
import LoadingIndicator from '../../../../../components/loading-indicator/loading-indicator';

const AFGRevenueChart = (): ReactElement => {
  const isMounted = useIsMounted();
  const endpointUrl = 'v1/accounting/mts/mts_table_4?filter=line_code_nbr:eq:830&sort=-record_date';
  const [finalChartData, setFinalChartData] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [legend, setLegend] = useState([]);
  const [currentFY, setCurrentFY] = useState(null);

  const curFYColor = '#0A2F5A';
  const priorFYColor = '#9DABBD';
  const avgFYColor = '#555';

  const tickCountYAxis = 6;
  const getChartData = async () => {
    const chartData = [];
    const legendItems = [];
    let curFY;
    let priorFY;
    let fiveYrAvgMin;
    let fiveYrAvgMax;
    await basicFetch(`${apiPrefix}${endpointUrl}`)?.then(async res => {
      if (res.data) {
        curFY = parseFloat(res.data[0].record_fiscal_year);
        if (isMounted.current) setCurrentFY(curFY);
        priorFY = curFY - 1;
        fiveYrAvgMin = curFY - 6;
        fiveYrAvgMax = curFY - 2;
        legendItems.push({ title: `${curFY} FYTD`, color: curFYColor });
        legendItems.push({ title: priorFY, color: priorFYColor });
        legendItems.push({ title: `5 Year Average (${fiveYrAvgMin}-${fiveYrAvgMax})`, color: avgFYColor });
        const setData = (data, i) => {
          const entry = { month: monthNames[i - 1] };
          let fiveYrAvg = 0;
          data.forEach(record => {
            const year = parseFloat(record.record_fiscal_year);
            if (year === curFY) {
              entry['currentFYValue'] = parseFloat(record.current_fytd_net_rcpt_amt) / 1e12;
              entry['currentFY'] = curFY;
            } else if (year === priorFY) {
              entry['priorFYValue'] = parseFloat(record.current_fytd_net_rcpt_amt) / 1e12;
            } else if (year >= fiveYrAvgMin) {
              fiveYrAvg += parseFloat(record.current_fytd_net_rcpt_amt);
            }
          });
          entry['fiveYearAvgValue'] = fiveYrAvg / 5 / 1e12;
          return entry;
        };

        for (let i = 10; i <= 12; i++) {
          const filteredMonth = res.data.filter(record => record.record_calendar_month === i.toString());
          chartData.push(setData(filteredMonth, i));
        }

        for (let i = 1; i <= 9; i++) {
          const filteredMonth = res.data.filter(record => record.record_calendar_month === '0' + i.toString());
          chartData.push(setData(filteredMonth, i));
        }
      }
    });
    if (isMounted.current) setLegend(legendItems);
    return chartData;
  };

  useEffect(() => {
    if (!finalChartData) {
      getChartData().then(res => {
        if (isMounted.current) setFinalChartData(res);
        if (isMounted.current) setLoading(false);
      });
    }
  }, []);

  const ariaLabel =
    'A graph demonstrating the cumulative revenue by month of the United States government. A dark blue line represents the ' +
    'current cumulative revenue of FY ' +
    currentFY +
    ', a light blue line represents the cumulative revenue of the previous fiscal year ' +
    (currentFY - 1) +
    ', and a dark gray line represents the 5-year average revenue from ' +
    (currentFY - 6) +
    '-' +
    (currentFY - 2) +
    '.';

  return (
    <figure className={deficitChart} data-testid="AFGRevenueChart" role="figure" aria-label={ariaLabel}>
      <div className={chartTitle}>Cumulative Revenue by Month in Trillions of USD</div>
      {isLoading && <LoadingIndicator />}
      {!isLoading && finalChartData && (
        <>
          <ChartLegend legendItems={legend} mobileDotSpacing />
          <div className={chartContainer} data-testid="chartContainer">
            <ResponsiveContainer height={164} width="99%">
              <LineChart data={finalChartData} margin={{ top: 8, left: 5, right: 5, bottom: 4 }} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  type="category"
                  allowDuplicatedCategory={false}
                  axisLine={false}
                  tickFormatter={value => monthAxisFormatter(value)}
                  tickSize={4}
                  height={16}
                  tickMargin={4}
                />
                <YAxis
                  tickFormatter={(value, index) => trillionAxisFormatter(value, index, tickCountYAxis)}
                  tickCount={tickCountYAxis}
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  width={32}
                  interval={0}
                  domain={[0, dataMax => (dataMax > 10 ? 'auto' : 10)]}
                />
                <Line
                  dataKey="fiveYearAvgValue"
                  isAnimationActive={false}
                  dot={false}
                  activeDot={false}
                  name="5 Yr Avg"
                  strokeWidth={2}
                  stroke={avgFYColor}
                />
                <Line
                  dataKey="priorFYValue"
                  isAnimationActive={false}
                  dot={false}
                  activeDot={false}
                  name={`${currentFY - 1}`}
                  strokeWidth={2}
                  stroke={priorFYColor}
                />
                <Line
                  dataKey="currentFYValue"
                  isAnimationActive={false}
                  dot={false}
                  activeDot={false}
                  name={`${currentFY} FYTD`}
                  strokeWidth={2}
                  stroke={curFYColor}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '4 4', stroke: '#666', strokeWidth: '2px' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </figure>
  );
};

export default AFGRevenueChart;
