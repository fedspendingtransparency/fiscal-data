/* istanbul ignore file */

// still don't know how to make content custom but when figure out then use points to animate 

import React, { useRef, useState } from 'react';
import {
  Line,
  Dot,
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
import { spendingExplainerPrimaryDot, revenueExplainerPrimaryDot } from '../experimental.module.scss';
import { green } from '@material-ui/core/colors';


const AFGDeficitPOC = () => {
  const chartRef = useRef();
  const [x, setX] = useState();


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

  const animationDots = [];
  let yAxisCx = 0;

  const chartWidth = 730;
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

    const currentLine = testData.find(line => {
      return line.data[0]?.year === payload?.year;
    });

    const curDot = {
      year: payload.year,
      color: payload.type === 'spending' ? spendingExplainerPrimary : revenueExplainerPrimary,
      cx: cx,
      cy: cy
    }

    animationDots.push(curDot);



    if (payload.type === 'spending') {
      currentLine.data[0].spending_cx = cx;
      currentLine.data[1].spending_cx = cx;
    }
    else {
      currentLine.data[0].revenue_cx = cx;
      currentLine.data[1].revenue_cx = cx;
    }

    let pixelMidPoint = null; 

    const color = payload?.type === 'spending' ? spendingExplainerPrimary : revenueExplainerPrimary;
    const fill =  payload?.latest ? null : color;
    const midPointValue = midPointArray.find(currentPoint => currentPoint.year === payload.year).value;
    pixelMidPoint = ((midPointValue * (cx - yAxisCx)) / payload.value) + 80;

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
    console.log(props)
    yAxisCx = props.cx
    console.log(yAxisCx)
    return (
      <>
      </>
    )
  }

  return (
    <>
      <LineChart
        //key={Math.random()}
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
        <ReferenceDot x={0} y='2016' shape={<CustomShape />} />
        {testData.map((s) =>
        // maybe not use built in animate
        // custom dots/points?
        // do some math to know where the different dots should be 
            // startingPoint = (spending + revenue) / 2;
            // totalLineLengthInDollars = spending > revenue ? spending - revenue : revenue - spending;
            // howMuchDollarPerMillisecond = totalLength / 1000;
            // howMuchInEachDirection = howMuchDollarPerMillisecond / 2;
        // make it a smaller line and data changes getting bigger and bigger line as animation goes on 
          // starts with just spending point
          // change every milisecond 
          <Line dataKey="value"
                data={s.data} stroke={deficitExplainerPrimary} strokeWidth={6} strokeOpacity={1}
                dot={<CustomDot />}
                isAnimationActive={false}
                // one second delay
                // animationBegin={1500}
                // one second animation
                //animationDuration={1000}
          />
          
        )}

        {
          testData.map((s) => {
console.log(JSON.stringify(s))
            return (
            <circle  cx={s.data[0]?.spending_cx} cy={s.data[0]?.spending_cy} r={10} fillOpacity={1} strokeWidth={10} />

            )
          }
            
          )
        }
      </LineChart>
    </>
  )
}
export default AFGDeficitPOC;

// custom line component
  // css transitions
  // delay adding points to chart?

// look at car charts using spring and bar chart on Spending using css transitions

// component called customized -- catch all -- look at docs
// animation easing


// seeing if I can determine how many pixels to use then I can math to make it start in the middle
//     and the animation/transition can include positioning left or something