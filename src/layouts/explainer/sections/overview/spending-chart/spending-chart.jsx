import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { apiPrefix, basicFetch, monthNames } from '../../../../../utils/api-utils';
import CustomTooltip from '../chart-components/line-chart-custom-tooltip/custom-tooltip';
import { chartTitle, chartContainer, deficitChart } from '../deficit-chart/deficit-chart.module.scss';
import ChartLegend from '../chart-components/chart-legend';
import { trillionAxisFormatter } from '../chart-helper';
import { useIsMounted } from '../../../../../utils/useIsMounted';
import LoadingIndicator from '../../../../../components/loading-indicator/loading-indicator';

export const TickCount = props => {
  const { x, y, payload } = props;
  const monthsDisplayed = ['Oct', 'Jan', 'Apr', 'Jul'];
  return (
    <g transform={`translate(${x}, ${y})`} data-testid="tickCount">
      <text x={0} y={0} dy={16} textAnchor="middle" fill="#666666">
        {monthsDisplayed.includes(payload.value) ? payload.value : ''}
      </text>
    </g>
  );
};

const AFGSpendingChart = () => {
  const isMounted = useIsMounted();
  const endpointUrl = 'v1/accounting/mts/mts_table_5?filter=line_code_nbr:eq:5691&sort=-record_date';
  const [isLoading, setLoading] = useState(true);
  const [currentFY, setCurrentFY] = useState();
  const [legend, setLegend] = useState([]);
  const [finalChartData, setFinalChartData] = useState(null);

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
        legendItems.push({ title: `${curFY} FYTD`, color: '#00796B' });
        legendItems.push({ title: priorFY, color: '#99C8C4' });
        legendItems.push({ title: `5 Year Average (${fiveYrAvgMin}-${fiveYrAvgMax})`, color: '#555' });
        const setData = (data, i) => {
          const entry = { month: monthNames[i - 1] };
          let fiveYrAvg = 0;
          data.forEach(record => {
            const year = parseFloat(record.record_fiscal_year);
            if (year === curFY) {
              entry['currentFYValue'] = parseFloat(record.current_fytd_net_outly_amt) / 1e12;
              entry['currentFY'] = curFY;
            } else if (year === priorFY) {
              entry['priorFYValue'] = parseFloat(record.current_fytd_net_outly_amt) / 1e12;
            } else if (year >= fiveYrAvgMin) {
              fiveYrAvg += parseFloat(record.current_fytd_net_outly_amt);
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
  const tickCountYAxis = 6;

  useEffect(() => {
    if (!finalChartData) {
      getChartData().then(res => {
        if (isMounted.current) setFinalChartData(res);
        if (isMounted.current) setLoading(false);
      });
    }
  }, []);

  const ariaLabel =
    'A graph demonstrating the cumulative spending by month of the United States government. A dark green line represents the ' +
    'current cumulative spending of FY ' +
    currentFY +
    ', a light green line represents the cumulative spending of the previous fiscal year ' +
    (currentFY - 1) +
    ', and a bolded gray line represents the 5-year average spending from ' +
    (currentFY - 6) +
    '-' +
    (currentFY - 2) +
    '.';

  return (
    <figure className={deficitChart} role="figure" aria-label={ariaLabel}>
      <div className={chartTitle}>Cumulative Spending by Month in Trillions of USD</div>
      {isLoading && <LoadingIndicator />}
      {!isLoading && (
        <>
          <ChartLegend legendItems={legend} mobileDotSpacing />
          <div className={chartContainer}>
            <ResponsiveContainer width="99%" height={164}>
              <LineChart data={finalChartData} margin={{ top: 8, left: 5, right: 5, bottom: 4 }} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                  interval={0}
                  dataKey="month"
                  type="category"
                  tickSize={4}
                  allowDuplicatedCategory={false}
                  tick={<TickCount />}
                  axisLine={false}
                />
                <YAxis
                  domain={[0, 10]}
                  ticks={[0, 2, 4, 6, 8, 10]}
                  interval={0}
                  width={32}
                  tickFormatter={(value, index) => trillionAxisFormatter(value, index, tickCountYAxis)}
                  tickCount={tickCountYAxis}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '4 4', stroke: '#666', strokeWidth: '2px' }} />
                <Line
                  dataKey="fiveYearAvgValue"
                  dot={false}
                  activeDot={false}
                  strokeDasharray={0}
                  strokeWidth={2}
                  name="5 Yr Avg"
                  isAnimationActive={false}
                  stroke="#555"
                />
                <Line
                  dataKey="priorFYValue"
                  activeDot={false}
                  strokeDasharray={0}
                  dot={false}
                  name={`${currentFY - 1}`}
                  strokeWidth={2}
                  isAnimationActive={false}
                  stroke="#99C8C4"
                />
                <Line
                  dataKey="currentFYValue"
                  strokeDasharray={0}
                  dot={false}
                  name={`${currentFY} FYTD`}
                  strokeWidth={2}
                  activeDot={false}
                  isAnimationActive={false}
                  stroke="#00796B"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </figure>
  );
};

export default AFGSpendingChart;
