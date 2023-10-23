import React, { ReactElement, useEffect, useState } from 'react';
import { apiPrefix, basicFetch } from '../../../../../utils/api-utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import CustomTooltip from '../spending-chart/custom-tooltip/custom-tooltip';
import spendingChart, { TickCount } from '../spending-chart/spending-chart';
import { chartContainer, chartTitle } from '../deficit-chart/deficit-chart.module.scss';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { monthNames } from '../../../../../utils/api-utils';

const AFGRevenueChart = (): ReactElement => {
  const endpointUrl = 'v1/accounting/mts/mts_table_4?filter=line_code_nbr:eq:830&sort=-record_date';
  const [finalChartData, setFinalChartData] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [currentFY, setCurrentFY] = useState(null);
  const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];

  const getChartData = async () => {
    const chartData = [];
    await basicFetch(`${apiPrefix}${endpointUrl}`)?.then(async res => {
      if (res.data) {
        const curFY = parseFloat(res.data[0].record_fiscal_year);
        setCurrentFY(curFY);
        const priorFY = curFY - 1;
        const fiveYrAvgMin = curFY - 6;
        const fiveYrAvgMax = curFY - 2;
        const setData = (data, i) => {
          const entry = { month: monthNames[i - 1] };
          let fiveYrAvg = 0;
          data.forEach(record => {
            const year = parseFloat(record.record_fiscal_year);
            if (year === curFY || year === priorFY) {
              entry[year] = parseFloat(record.current_fytd_net_rcpt_amt) / 1e12;
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
    return chartData;
  };

  useEffect(() => {
    if (!finalChartData) {
      getChartData().then(res => {
        setFinalChartData(res);
        console.log(res);
        setLoading(false);
      });
    }
  }, []);

  const axisFormatter = (value, index) => {
    let ret = value.toString();
    if (index >= 5 - 1) {
      ret = ret + 'T';
    }
    return `$${ret}`;
  };

  return (
    <div>
      {!isLoading && (
        <ResponsiveContainer height={164} width="99%">
          <LineChart data={finalChartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" type="category" allowDuplicatedCategory={false} axisLine={false} ticks={['Oct', 'Jan', 'Apr', 'Jul']} />
            <YAxis tickFormatter={(value, index) => axisFormatter(value, index)} axisLine={false} tickLine={false} />
            <Line dataKey="fiveYearAvg" isAnimationActive={false} dot={false} name="Five Year Average" strokeWidth={2} stroke="#555" />
            <Line dataKey="2021" isAnimationActive={false} dot={false} name="Prior FY" strokeWidth={2} stroke="#9DABBD" />
            <Line dataKey="2022" isAnimationActive={false} dot={false} name="Current FY" strokeWidth={2} stroke="#0A2F5A" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default AFGRevenueChart;
