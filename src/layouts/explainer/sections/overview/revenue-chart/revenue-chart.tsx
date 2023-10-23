import React, { ReactElement, useEffect, useState } from 'react';
import { apiPrefix, basicFetch } from '../../../../../utils/api-utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import CustomTooltip from '../spending-chart/custom-tooltip/custom-tooltip';
import { chartContainer, chartTitle, deficitChart } from '../deficit-chart/deficit-chart.module.scss';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { monthNames } from '../../../../../utils/api-utils';
import ChartLegend from '../chart-components/chart-legend';
import { monthAxisFormatter, yearAxisFormatter } from '../chart-helper';

const AFGRevenueChart = (): ReactElement => {
  const endpointUrl = 'v1/accounting/mts/mts_table_4?filter=line_code_nbr:eq:830&sort=-record_date';
  const [finalChartData, setFinalChartData] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [legend, setLegend] = useState([]);

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
              entry['currentFY'] = parseFloat(record.current_fytd_net_rcpt_amt) / 1e12;
            } else if (year === priorFY) {
              entry['priorFY'] = parseFloat(record.current_fytd_net_rcpt_amt) / 1e12;
            } else if (year >= fiveYrAvgMin) {
              fiveYrAvg += parseFloat(record.current_fytd_net_rcpt_amt);
            }
          });
          entry['fiveYearAvg'] = fiveYrAvg / 5 / 1e12;
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
    setLegend(legendItems);
    return chartData;
  };

  useEffect(() => {
    if (!finalChartData) {
      getChartData().then(res => {
        setFinalChartData(res);
        setLoading(false);
      });
    }
  }, []);

  return (
    <div className={deficitChart} data-testid="AFGDeficitChart">
      <div className={chartTitle}>Cumulative Revenue by Month in trillions of USD</div>
      {isLoading && (
        <div>
          <FontAwesomeIcon icon={faSpinner as IconProp} spin pulse /> Loading...
        </div>
      )}
      {!isLoading && (
        <>
          <ChartLegend legendItems={legend} />
          <div className={chartContainer} data-testid="chartContainer" role="presentation">
            <ResponsiveContainer height={164} width="99%">
              <LineChart data={finalChartData} margin={{ top: 8, left: 5, right: 5, bottom: 4 }}>
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
                  tickFormatter={(value, index) => yearAxisFormatter(value, index, tickCountYAxis)}
                  tickCount={tickCountYAxis}
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  width={32}
                  interval={0}
                  domain={[0, dataMax => (dataMax > 10 ? 'auto' : 10)]}
                />
                <Line
                  dataKey="fiveYearAvg"
                  isAnimationActive={false}
                  dot={false}
                  activeDot={false}
                  name="Five Year Average"
                  strokeWidth={2}
                  stroke={avgFYColor}
                />
                <Line
                  dataKey="priorFY"
                  isAnimationActive={false}
                  dot={false}
                  activeDot={false}
                  name="Prior FY"
                  strokeWidth={2}
                  stroke={priorFYColor}
                />
                <Line
                  dataKey="currentFY"
                  isAnimationActive={false}
                  dot={false}
                  activeDot={false}
                  name="Current FY"
                  strokeWidth={2}
                  stroke={curFYColor}
                />
                <Tooltip cursor={{ strokeDasharray: '4 4', stroke: '#666', strokeWidth: '2px' }} allowEscapeViewBox={{ y: true }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default AFGRevenueChart;
