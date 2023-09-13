/* istanbul ignore file */

import React from 'react';
import {
  Line,
  XAxis,
  YAxis,
  LineChart, CartesianGrid, ReferenceDot,
} from 'recharts';
import { deficitExplainerPrimary } from "../../explainer/sections/national-deficit/national-deficit.module.scss";
import {
  spendingExplainerPrimary
} from "../../explainer/sections/federal-spending/federal-spending.module.scss";
import {
   revenueExplainerPrimary
} from "../../explainer/sections/government-revenue/revenue.module.scss";


const AFGDeficitPOC = () => {

  const testData = [
    {
      data: [
        {year: '2016', value: 0.5, type: 'revenue'},
        {year: '2016', value: 2, type: 'spending'},
      ]
    },
    {
      data: [
        {year: '2017', value: 1, type: 'revenue'},
        {year: '2017', value: 2.5, type: 'spending'},
      ]
    },
    {
      data: [
        {year: '2018', value: 2.4, type: 'revenue'},
        {year: '2018', value: 4, type: 'spending'},
      ]
    },
    {
      data: [
        {year: '2019', value: 3.5, type: 'revenue'},
        {year: '2019', value: 6, type: 'spending'},
      ]
    },
    {
      data: [
        {year: '2020', value: 5.5, type: 'revenue'},
        {year: '2020', value: 7, type: 'spending'},
      ]
    },
    {
      data: [
        {year: '2021', value: 6, type: 'revenue', latest: true},
        {year: '2021', value: 8, type: 'spending', latest: true},
      ]
    }
  ]

  let yAxisCx = 0;
  const midPointArray = [];

  testData.forEach((curData) => {
      const midPoint = {
        year: curData.data[0].year,
        value: ((curData.data[0]?.value + curData.data[1]?.value) / 2)
      }
      midPointArray.push(midPoint);
    });

  const CustomDot = (props) => {
    const {cx, cy, payload, strokeWidth, r} = props;

    const color = payload?.type === 'spending' ? spendingExplainerPrimary : revenueExplainerPrimary;
    const fill =  payload?.latest ? null : color;
    const midPointValue = midPointArray.find(currentPoint => currentPoint.year === payload.year).value;
    const pixelMidPoint = ((midPointValue * (cx - yAxisCx)) / payload.value) + 80;
    const rectangleWidth = pixelMidPoint > cx ? pixelMidPoint - cx : cx - pixelMidPoint;

    return (
      <>
        <rect
          height={6}
          width={rectangleWidth}
          x={pixelMidPoint > cx ? cx : pixelMidPoint}z
          y={cy - 3}
          fill={deficitExplainerPrimary}
          stroke={deficitExplainerPrimary}
        >
          <animate 
            attributeName='width'
            from={0}
            to={rectangleWidth}
            dur='1s' 
          />
          {
            cx < pixelMidPoint && 
            <animate 
            attributeName='x'
            from={pixelMidPoint}
            to={cx}
            dur='1s'
            /> 
          }
        </rect>
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
            from={pixelMidPoint}
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
        >
          <animate 
            attributeName='cx'
            from={pixelMidPoint}
            to={cx}
            dur='1s'
          />
        </circle>
        
      </>
    )
  }

  const CustomShape = (props) => {
    yAxisCx = props.cx
    return (
      <>
      </>
    )
  }

  return (
    <>
      <LineChart
        key={Math.random()}
        width={730}
        height={250}
        margin={{
          top: 20, right: 20, bottom: 20, left: 20,
        }}
        layout="vertical"
      >
        <CartesianGrid horizontal={false} />
        <YAxis dataKey="year" type="category" allowDuplicatedCategory={false} axisLine={false} tickLine={false} />
        <XAxis ticks={[0,2,4,6,8]} type="number" tickFormatter={(value) => `$${value}`} axisLine={false} tickLine={false} />
        <ReferenceDot x={0} y='2016' shape={<CustomShape />} />
        {testData.map((s) => 
          <Line dataKey="value"
                data={s.data} stroke='transparent' strokeWidth={6} strokeOpacity={0}
                dot={<CustomDot />}
                isAnimationActive={false}
          />
          
        )}
      </LineChart>
    </>
  )
}
export default AFGDeficitPOC;