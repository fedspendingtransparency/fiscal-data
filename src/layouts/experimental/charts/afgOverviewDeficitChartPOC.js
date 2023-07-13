/* istanbul ignore file */

import React from 'react';
import {
  Area,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Dot,
  Scatter,
} from 'recharts';
import {
  deficitExplainerLightSecondary, deficitExplainerPrimary
} from "../../explainer/sections/national-deficit/national-deficit.module.scss";
import {
  spendingExplainerLightSecondary,
  spendingExplainerPrimary
} from "../../explainer/sections/federal-spending/federal-spending.module.scss";
import {
  revenueExplainerLightSecondary, revenueExplainerPrimary
} from "../../explainer/sections/government-revenue/revenue.module.scss";
import {dot, toolTip} from '../experimental.module.scss';


const AFGDeficitPOC = () => {


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

  const CustomDot = (props) => {
    console.log(props);
    const {cx, cy, payload, value, strokeWidth, r} = props;
    const color = payload?.type === 'spending' ? spendingExplainerPrimary : revenueExplainerPrimary;
    const fill =  payload?.latest ? null : color;
    return (
        <circle
          fill={fill}
          r={r}
          strokeWidth={strokeWidth}
          stroke={color}
          fillOpacity={1}
          cx={cx}
          cy={cy}
        />
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
        {testData.map((s) =>
          <Line dataKey="value"
                data={s.data} stroke={deficitExplainerPrimary} strokeWidth={2} strokeOpacity={1}
                dot={<CustomDot />}
                isAnimationActive={false}
          />
        )}
        <YAxis dataKey="year" type="category" allowDuplicatedCategory={false} />
        <XAxis />
      </LineChart>
    </>
  )
}
export default AFGDeficitPOC;
