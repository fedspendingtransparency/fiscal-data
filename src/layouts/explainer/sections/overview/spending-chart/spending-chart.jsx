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
    <g transform={`translate(${x}, ${y})`}>
      <text x={0} y={0} dy={16} textAnchor="middle">
        {monthsDisplayed.includes(payload.value) ? payload.value : ''}
      </text>
    </g>
  );
};

const AFGSpendingChart = () => {
  const endpointUrl = 'v1/accounting/mts/mts_table_5?filter=line_code_nbr:eq:5691&sort=-record_date';
  const [data, setData] = useState(null);
  const [data2, setData2] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [currentFY, setCurrentFY] = useState();

  useEffect(() => {
    basicFetch(`${apiPrefix}${endpointUrl}`).then(res => {
      const processedData = processData(res.data);
      setData(processedData);
      setData2(res.data);
    });
  }, []);

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
      for (let year = 2015; year <= 2019; year++) {
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
      for (let year = 2020; year <= 2021; year++) {
        if (yearlyData[year]) {
          entry[year.toString()] = yearlyData[year][idx];
        }
      }
      entry['2015-2019'] = avgData[idx];
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

  useEffect(() => {
    basicFetch(`${apiPrefix}${endpointUrl}`).then(result => {
      if (result?.data) {
        setCurrentFY(result.data[0].record_fiscal_year);
      }
    });
  }, []);

  useEffect(() => {
    if (currentFY) {
      setLoading(false);
    }
  }, [currentFY]);

  return (
    <div className={spendingChart}>
      <div className={chartTitle}>Cumulative Spending by Month in trillions of USD</div>
      {isLoading && (
        <div>
          <FontAwesomeIcon icon={faSpinner} spin pulse /> Loading...
        </div>
      )}
      {!isLoading && (
        <div className={chartContainer}>
          <ResponsiveContainer width="100%" height={164}>
            <LineChart cursor="pointer" data={data}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" type="category" allowDuplicatedCategory={false} tick={<TickCount />} axisLine={false} />
              <YAxis tickFormatter={(value, index) => axisFormatter(value, index)} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ top: -16, right: 12 }} verticalAlign="top" iconType="circle" iconSize="16px" width="100%" align="center" />
              <Line dataKey={currentFY} dot={false} name={`${currentFY} FYTD`} strokeWidth={3} stroke="#00796B" />
              <Line dataKey={currentFY - 1} dot={false} name={currentFY - 1} strokeWidth={3} stroke="#99C8C4" />
              <Line dataKey="2015-2019" dot={false} strokeWidth={3} name="5 Year Average (2016-2021)" stroke="#555" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default AFGSpendingChart;
