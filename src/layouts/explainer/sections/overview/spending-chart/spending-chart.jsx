import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { apiPrefix, basicFetch } from '../../../../../utils/api-utils';
import CustomTooltip from './custom-tooltip/custom-tooltip';
import { chartTitle, chartContainer, spendingChart } from './spending-chart.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

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
  const endpointUrl = '/v1/accounting/mts/mts_table_5?filter=line_code_nbr:eq:5691&sort=-record_date';
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [currentFY, setCurrentFY] = useState();

  const previousYear = currentFY - 1;
  const previousFiveYearStart = currentFY - 6;
  const previousFiveYearEnd = currentFY - 2;

  useEffect(() => {
    if (data) {
      console.log(data);
      setLoading(false);
    }
  }, [data]);

  useEffect(() => {
    basicFetch(`${apiPrefix}${endpointUrl}`).then(res => {
      if (res?.data) {
        setCurrentFY(res.data[0].record_fiscal_year);
        console.log(res.data);
        const processedData = processData(res.data);
        setData(processedData);
      }
    });
  }, [isLoading]);

  const processData = data => {
    const yearlyData = {};
    const rollingTotals = {};

    data.sort((dateOne, dateTwo) => new Date(dateOne['record_date']) - new Date(dateTwo['record_date']));

    data.forEach(record => {
      const date = new Date(record['record_date']);
      const year = date.getFullYear();
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
      for (let year = previousYear; year <= currentFY; year++) {
        if (yearlyData[year]) {
          entry[year.toString()] = yearlyData[year][idx];
        }
      }
      entry['fiveYearAvg'] = avgData[idx];
      finalData.push(entry);
    });

    return finalData;
  };
  const tickCountXAxis = 5;
  const axisFormatter = (value, index) => {
    let ret = value.toString();
    if (index >= tickCountXAxis - 1) {
      ret = ret + 'T';
    }
    return `$${ret}`;
  };

  return (
    <div className={spendingChart}>
      <div className={chartTitle}>Cumulative Spending by Month in trillions of USD</div>
      {isLoading && (
        <div>
          <FontAwesomeIcon icon={faSpinner} spin pulse /> Loading...
        </div>
      )}
      {data && (
        <div className={chartContainer}>
          <ResponsiveContainer width="99%" height={164}>
            <LineChart cursor="pointer" data={data} strokeDasharray="3 3">
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" type="category" allowDuplicatedCategory={false} tick={<TickCount />} axisLine={false} />
              <YAxis tickFormatter={(value, index) => axisFormatter(value, index)} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ top: -16, right: 12 }} verticalAlign="top" iconType="circle" iconSize="16px" width="100%" align="center" />
              <Line
                dataKey={currentFY}
                strokeDasharray={0}
                dot={false}
                name={`${currentFY} FYTD`}
                strokeWidth={3}
                isAnimationActive={false}
                stroke="#00796B"
              />
              <Line
                dataKey={previousYear}
                strokeDasharray={0}
                dot={false}
                name={previousYear}
                strokeWidth={3}
                isAnimationActive={false}
                stroke="#99C8C4"
              />
              <Line
                dataKey="fiveYearAvg"
                dot={false}
                strokeDasharray={0}
                strokeWidth={3}
                name={`${previousFiveYearStart}-${previousFiveYearEnd}`}
                isAnimationActive={false}
                stroke="#555"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default AFGSpendingChart;
