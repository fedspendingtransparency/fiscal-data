/* istanbul ignore file */

// still don't know how to make content custom but when figure out then use points to animate 

import React, { useEffect, useRef, useState } from 'react';
import {
  Line,
  XAxis,
  YAxis,
  LineChart, CartesianGrid,
} from 'recharts';
import { deficitExplainerPrimary } from "../../explainer/sections/national-deficit/national-deficit.module.scss";
import {
  spendingExplainerPrimary
} from "../../explainer/sections/federal-spending/federal-spending.module.scss";
import {
   revenueExplainerPrimary
} from "../../explainer/sections/government-revenue/revenue.module.scss";


const AFGDeficitPOC = () => {
  const chartRef = useRef();
  const [x, setX] = useState();


  const testData = [
    {
      data: [
        {year: '2016', value: 0.5, type: 'spending'},
        {year: '2016', value: 2, type: 'revenue'},
      ]
    },
    {
      data: [
        {year: '2017', value: 1, type: 'spending'},
        {year: '2017', value: 2.5, type: 'revenue'},
      ]
    },
    {
      data: [
        {year: '2018', value: 2.4, type: 'spending'},
        {year: '2018', value: 4, type: 'revenue'},
      ]
    },
    {
      data: [
        {year: '2019', value: 3.5, type: 'spending'},
        {year: '2019', value: 6, type: 'revenue'},
      ]
    },
    {
      data: [
        {year: '2020', value: 5.5, type: 'spending'},
        {year: '2020', value: 7, type: 'revenue'},
      ]
    },
    {
      data: [
        {year: '2021', value: 6, type: 'spending', latest: true},
        {year: '2021', value: 8, type: 'revenue', latest: true},
      ]
    }
  ]

  const chartWidth = 730;
  const midPointArray = [];

  testData.forEach((curData) => {
      const midPoint = {
        year: curData.data[0].year,
        value: ((curData.data[0]?.value + curData.data[1]?.value) / 2)
      }
      midPointArray.push(midPoint);
    console.log("ARRAY: ", midPointArray);
    });

  const getCurrentX = () => {
    const curX = chartRef.current?.container.offsetLeft;
    console.log("LOOK HERE REF", chartRef);
    console.log("LOOK HERE", curX);
    setX(x);
  }


  // call it when ref
  useEffect(() => {
    getCurrentX();
  }, []);

  useEffect(() => {
    window.addEventListener("resize", getCurrentX);
  }, []);

  const CustomDot = (props) => {
    const {cx, cy, payload, strokeWidth, r} = props;
    const color = payload?.type === 'spending' ? spendingExplainerPrimary : revenueExplainerPrimary;
   // const curStyle = payload?.type === 'spending' ? "z-index: 1;" : '';
    const fill =  payload?.latest ? null : color;
    const startValue = midPointArray.find(currentPoint => currentPoint.year === payload.year).value;
    const endValue = payload.value; 
    const startXPoint = (((cx-110) / endValue) * startValue) + 110;
    const endXPoint = cx;
    console.log("START VALUE ", startValue)
    console.log("START X -- WANT TO BE THE SAME ", startXPoint)
    console.log("END ",  endValue)

    return (
      <>
        <circle
          fill={'red'}
          r={r}
          strokeWidth={strokeWidth + 2}
          stroke="white"
          fillOpacity={1}
          cx={cx}
          cy={cy}
        >
          <animate 
            attributeName='cx'
            from={startXPoint}
            to={cx}
            dur='1s'
          />
        </circle>
        <circle
          fill={fill}
          r={r}
          strokeWidth={strokeWidth - 1}
          stroke={color}
          fillOpacity={1}
          cx={cx}
          cy={cy}
          //style={curStyle} // how to specify style
        >
          <animate 
            attributeName='cx'
            from={startXPoint}
            to={cx}
            dur='1s'
          />
        </circle>
        
      </>
    )
  }
// how to make it take my version of the line
// stroke probs isnt the right answer
// make sure my line style is fine
  const lineStyle = {
    stroke: spendingExplainerPrimary, 
    'stroke-width':2
  };

  const CustomLine = (props) => {
    return (
      <>
        <line x1="0" y1="0" x2="200" y2="200" style={lineStyle} />
          
      </>
    )
  }

  return (
    <>
      <LineChart
        key={Math.random()}
        width={chartWidth}
        height={250}
        margin={{
          top: 20, right: 20, bottom: 20, left: 20,
        }}
        layout="vertical"
        ref={chartRef}
      >
        <CartesianGrid horizontal={false} />
        <YAxis dataKey="year" type="category" allowDuplicatedCategory={false} axisLine={false} tickLine={false} />
        <XAxis ticks={[0,2,4,6,8]} type="number" tickFormatter={(value) => `$${value}`} axisLine={false} tickLine={false} />
        {testData.map((s) =>

          <Line dataKey="value"
                data={s.data} stroke={deficitExplainerPrimary} strokeWidth={6} strokeOpacity={1}
                dot={<CustomDot />}
                isAnimationActive={false}
                // one second delay
                //animationBegin={1000}
                // one second animation
                //animationDuration={1000}
          />
        )}
      </LineChart>
    </>
  )
}
export default AFGDeficitPOC;
