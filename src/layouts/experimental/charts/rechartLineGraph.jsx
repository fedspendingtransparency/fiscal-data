/* istanbul ignore file */
import React, {useEffect, useState} from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { apiPrefix, basicFetch } from '../../../utils/api-utils';
import CustomTooltip from '../../explainer/sections/overview/spending-chart/custom-tooltip/custom-tooltip'
import { chartTitle, spendingChart } from '../../../layouts/explainer/sections/overview/spending-chart/spending-chart.module.scss'

const TickCount = (props) => {
  const {x ,y, payload } = props;
  const index = payload.index;
  return (
    <g transform={`translate(${x}, ${y})`}>
      <text x={0} y={0} dy={16} textAnchor='middle' fill='#666'>
        {index % 3 === 0 ? payload.value : ''}
      </text>
    </g>
  )
};



const ReLineGraph = () => {
  const endpointUrl ='v1/accounting/mts/mts_table_5?filter=line_code_nbr:eq:5691&sort=-record_date';
  const [data, setData] = useState(null);
  const [data2, setData2] = useState(null);


  useEffect(() => {
    basicFetch(`${apiPrefix}${endpointUrl}`)
      .then((res) => {
        setData2(res.data);
        let processedData = processData(res.data);
        setData(processedData);
      })
  }, []);

  const processData = (data) => {
    let yearlyData = {};
    let rollingTotals = {};
  
    data.sort((dateOne, dateTwo) => new Date(dateOne["record_date"]) - new Date(dateTwo["record_date"]));
  
    data.forEach((record) => {
      let date = new Date(record["record_date"]);
      let year = date.getFullYear();
      let month = date.getMonth();
  
      if (!yearlyData[year]) {
        yearlyData[year] = Array(12).fill(null);
        rollingTotals[year] = 0;
      }
  
      let currentMonthValue =  + parseFloat(record["current_month_gross_outly_amt"]) / 1e12;
      rollingTotals[year] += currentMonthValue;
      yearlyData[year][month] = rollingTotals[year];
    });
  
    // for (let year in yearlyData) {
    //   let lastKnownValue = 0;
    //   for (let i = 0; i < 12; i++) {
    //     if (yearlyData[year][i] !== null) {
    //       lastKnownValue = yearlyData[year][i];
    //     } else if (i > 0 && yearlyData[year][i - 1] !== null) {
    //       yearlyData[year][i] = lastKnownValue;
    //     }
    //   }
    // }
  
    let avgData = Array(12).fill(0);
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
  
    let finalData = [];
    const months = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];
  
    months.forEach((month, idx) => {
      let entry = { month: month };
      for (let year = 2020; year <= 2021; year++) {
        if (yearlyData[year]) {
          entry[year.toString()] = yearlyData[year][idx];
        }
      }
      entry["2015-2019"] = avgData[idx];
      finalData.push(entry);
    });
  
    return finalData;
  };


  return (
    <div className={spendingChart}>
        {console.log('chartData', data)}
        {console.log('chartData', data2)}
        <div className={chartTitle}>Cumulative Spending by Month in trillions of USD</div>
      <ResponsiveContainer width="100%" aspect={3}>
        <LineChart width={500} height={300} cursor="pointer" data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" type="category" allowDuplicatedCategory={false} tick={ <TickCount /> } />
            <YAxis tickFormatter={(tickItem) => `$${tickItem}T`} />
            <Tooltip 
              content={<CustomTooltip />}
            />
            <Legend verticalAlign="top" iconType="circle" width="100%" align='left' />
              <Line 
                dataKey="2021"  
                dot={false}
                name="2021"
                strokeWidth={3}
                stroke="#00796B"
              />
              <Line 
                dataKey="2020"  
                dot={false}
                name="2020"
                strokeWidth={3}
                stroke="#99C8C4"
              />
              <Line 
                dataKey="2015-2019"  
                dot={false}
                strokeWidth={3}
                name="5 Year Average (2016-2021)"
                stroke="#555"
              />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReLineGraph;
