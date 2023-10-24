import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { apiPrefix, basicFetch } from '../../../../../utils/api-utils';
import CustomTooltip from './custom-tooltip/custom-tooltip';
import { chartTitle, chartContainer, deficitChart } from '../deficit-chart/deficit-chart.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import ChartLegend from '../chart-components/chart-legend';

export const TickCount = props => {
  const { x, y, payload } = props;
  const monthsDisplayed = ['Oct', 'Jan', 'Apr', 'Jul'];
  return (
    <g transform={`translate(${x}, ${y})`} data-testid="tickCount">
      <text x={0} y={0} dy={16} textAnchor="middle">
        {monthsDisplayed.includes(payload.value) ? payload.value : ''}
      </text>
    </g>
  );
};

const AFGSpendingChart = () => {
  const endpointUrl = 'v1/accounting/mts/mts_table_5?filter=line_code_nbr:eq:5691&sort=-record_date';
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [currentFY, setCurrentFY] = useState();
  const [prevYear, setPrevYear] = useState();
  const [legend, setLegend] = useState([]);

  useEffect(() => {
    if (data) {
      setLoading(false);
    }
  }, [data]);

  useEffect(() => {
    basicFetch(`${apiPrefix}${endpointUrl}`).then(res => {
      if (res?.data) {
        setCurrentFY(res.data[0].record_fiscal_year);
        setPrevYear(res.data[0].record_fiscal_year - 1);
        const processedData = processData(res.data);
        setData(processedData);
      }
    });
  }, []);

  const processData = data => {
    const yearlyData = {};
    const rollingTotals = {};
    const previousYear = data[0].record_fiscal_year - 1;
    const currentYear = data[0].record_fiscal_year;
    const previousFiveYearStart = data[0].record_fiscal_year - 6;
    const previousFiveYearEnd = data[0].record_fiscal_year - 2;

    data.sort((dateOne, dateTwo) => new Date(dateOne['record_date']) - new Date(dateTwo['record_date']));

    data.forEach(record => {
      const date = new Date(record['record_date']);
      let year = date.getFullYear();

      if(date.getMonth() >= 9) {
        year -= 1;
      }

      const month = date.getMonth();

      if (!yearlyData[year]) {
        yearlyData[year] = Array(12).fill(null);
        rollingTotals[year] = 0;
      }

      const currentMonthValue = parseFloat(record['current_month_gross_outly_amt']) / 1e12;
      rollingTotals[year] += currentMonthValue;
      yearlyData[year][month] = rollingTotals[year];
    });

    const avgData = Array(12).fill(0);
    for (let i = 0; i < 12; i++) {
      let sum = 0;
      let count = 0;
      for (let year = previousFiveYearStart; year <= previousFiveYearEnd; year++) {
        if (yearlyData[year] && yearlyData[year][i] !== null) {
          sum += yearlyData[year][i];
          count++;
        }
      }
      avgData[i] = sum / (count || 1);
    }

    const finalData = [];
    const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];

    months.forEach((month, idx) => {
      const entry = { month: month };
      for (let year = previousYear; year <= currentYear; year++) {
        if (yearlyData[year]) {
          entry[year.toString()] = yearlyData[year][idx];
        }
      }
      entry['fiveYearAvg'] = avgData[idx];
      finalData.push(entry);
    });

    const legendItems = [];
    legendItems.push({ title: `${currentYear} FYTD`, color: '#00796B' });
    legendItems.push({ title: previousYear, color: '#99C8C4' });
    legendItems.push({ title: `5 Year Average (${previousFiveYearStart}-${previousFiveYearEnd})`, color: '#555' });
    setLegend(legendItems)
    return finalData;
  };
  const tickCountXAxis = 6;
  const axisFormatter = (value, index) => {
    let ret = value.toString();
    if (index >= tickCountXAxis - 1) {
      ret = ret + 'T';
    }
    return `$${ret}`;
  };

  return (
    <div className={deficitChart}>
      <div className={chartTitle}>Cumulative Spending by Month in trillions of USD</div>
      {isLoading && (
        <div>
          <FontAwesomeIcon icon={faSpinner} spin pulse /> Loading...
        </div>
      )}
      {data && (
        <>
          <ChartLegend legendItems={legend} />
          <div className={chartContainer}>
            <ResponsiveContainer width="99%" height={164}>
              <LineChart cursor="pointer" data={data} margin={{ top: 8, left: 5, right: 5, bottom: 4 }}>
                <CartesianGrid vertical={false} />
                <XAxis 
                  interval={0} 
                  dataKey="month" 
                  type="category" 
                  allowDuplicatedCategory={false} 
                  tick={<TickCount />} axisLine={false} 
                />
                <YAxis 
                  domain={[0, 10]} 
                  ticks={[0,2,4,6,8,10]} 
                  interval={0}
                  width={32}
                  tickFormatter={(value, index) => axisFormatter(value, index)} 
                  axisLine={false} 
                  tickLine={false} 
                />
                <Tooltip content={<CustomTooltip />}  cursor={{ strokeDasharray: '4 4', stroke: '#666', strokeWidth: '2px' }} />
                {/* <Legend wrapperStyle={{ top: -22 }} verticalAlign="top" iconType="circle" iconSize="16px" width="100%" align="left" /> */}
                <Line
                  dataKey={currentFY}
                  strokeDasharray={0}
                  dot={false}
                  name={`${currentFY} FYTD`}
                  strokeWidth={3}
                  isAnimationActive={false}
                  stroke="#00796B"
                />
                <Line dataKey={prevYear} strokeDasharray={0} dot={false} name={prevYear} strokeWidth={3} isAnimationActive={false} stroke="#99C8C4" />
                <Line
                  dataKey="fiveYearAvg"
                  dot={false}
                  strokeDasharray={0}
                  strokeWidth={3}
                  name={`5 Yr Avg`}
                  isAnimationActive={false}
                  stroke="#555"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default AFGSpendingChart;
