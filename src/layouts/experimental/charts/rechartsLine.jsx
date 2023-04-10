/* istanbul ignore file */

import React from 'react';
import {Area, ComposedChart, Line, XAxis, YAxis, Tooltip} from "recharts";
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


const ReChartsLine = () => {
  const data = [
    {
      "month": "Oct",
      "Deficit/Spending '21": [0,.5],
      "Deficit/Spending '22": [3,5],
      "Spending '21": 0,
      "Revenue '21": 0.5,
      "Spending '22": 3,
      "Revenue '22": 5,
    },
    {
      "month": "Nov",
      "Deficit/Spending '21": [2,4],
      "Deficit/Spending '22": [5,6],
      "Spending '21": 2,
      "Revenue '21": 4,
      "Spending '22": 5,
      "Revenue '22": 6,
    },
    {
      "month": "Dec",
      "Deficit/Spending '21": [3,5],
      "Deficit/Spending '22": [8,7],
      "Spending '21": 3,
      "Revenue '21": 5,
      "Spending '22": 8,
      "Revenue '22": 7,
    },
    {
      "month": "Jan",
      "Deficit/Spending '21": [5,6],
      "Deficit/Spending '22": [12,9,],
      "Spending '21": 5,
      "Revenue '21": 6,
      "Spending '22": 12,
      "Revenue '22": 9,
    },
    {
      "month": "Feb",
      "Deficit/Spending '21": [7,10],
      "Spending '21": 7,
      "Revenue '21": 10,
    },
    {
      "month": "Mar",
      "Deficit/Spending '21": [9,12],
      "Spending '21": 9,
      "Revenue '21": 12,
    },
    {
      "month": "Apr",
      "Deficit/Spending '21": [7,9],
      "Spending '21": 7,
      "Revenue '21": 9,
    },
    {
      "month": "May",
      "Deficit/Spending '21": [2,4],
      "Spending '21": 2,
      "Revenue '21": 4,
    },
    {
      "month": "Jun",
      "Deficit/Spending '21": [3,5],
      "Spending '21": 3,
      "Revenue '21": 5,
    },
    {
      "month": "Jul",
      "Deficit/Spending '21": [5,6],
      "Spending '21": 5,
      "Revenue '21": 6,
    },
    {
      "month": "Aug",
      "Deficit/Spending '21": [7,10],
      "Spending '21": 7,
      "Revenue '21": 10,
    },
    {
      "month": "Sept",
      "Deficit/Spending '21": [9,12],
      "Spending '21": 9,
      "Revenue '21": 12,
    },
  ]

  const CustomTooltip = ({ active, payload, label}) => {
    if (active && payload && payload.length) {
      console.log(active);
      console.log(payload);
      console.log(label);

      return (
        <div className={toolTip}>
          {label}
          <table>
            <tr>
              <td>FY</td>
              <td>'21</td>
              <td>'22</td>
            </tr>
            <tr>
              <td>Spending</td>
              <td>
                <span className={dot} style={{backgroundColor: spendingExplainerLightSecondary}}></span>
                $X.XX T
              </td>
              <td>
                <span className={dot} style={{backgroundColor: spendingExplainerPrimary}}></span>
                $X.XX T
              </td>
            </tr>
            <tr>
              <td>Revenue</td>
              <td>
                <span className={dot} style={{backgroundColor: revenueExplainerLightSecondary}}></span>
                $X.XX T
              </td>
              <td>
                <span className={dot} style={{backgroundColor: revenueExplainerPrimary}}></span>
                $X.XX T
              </td>
            </tr>
            <tr>
              <td>Deficit / Surplus</td>
              <td>
                <span className={dot} style={{backgroundColor: deficitExplainerLightSecondary}}></span>
                $X.XX T
              </td>
              <td>
                <span className={dot} style={{backgroundColor: deficitExplainerPrimary}}></span>
                $X.XX T
              </td>
            </tr>
          </table>
        </div>
      )
    }
    return null;
  }

  return (
    <>
      <ComposedChart
        width={730}
        height={250}
        data={data}
        margin={{
          top: 20, right: 20, bottom: 20, left: 20,
        }}
      >
        <Area dataKey="Deficit/Spending '21" stroke="none" fill={deficitExplainerLightSecondary} fillOpacity={1}  dot={false} activeDot={false} />
        <Area dataKey="Deficit/Spending '22" stroke="none" fill={deficitExplainerPrimary} fillOpacity={1}  dot={false} activeDot={false} />
        <Line dataKey="Spending '22" stroke={spendingExplainerPrimary} strokeWidth={2} dot={false} activeDot={false} strokeOpacity={1} />
        <Line dataKey="Revenue '22" stroke={revenueExplainerPrimary} strokeWidth={2} dot={false} activeDot={false} strokeOpacity={1} />
        <Line dataKey="Spending '21" stroke={spendingExplainerLightSecondary} strokeWidth={2} dot={false} activeDot={false} strokeOpacity={1} />
        <Line dataKey="Revenue '21" stroke={revenueExplainerLightSecondary} strokeWidth={2} dot={false} activeDot={false} strokeOpacity={1} />
        <XAxis dataKey="month" ticks={["Oct", "Jan", "Apr", "Jul"]} />
        <YAxis tickFormatter={(value,index) => `$${value}`} />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#666666', strokeWidth: 2, strokeDasharray: 3}} />
      </ComposedChart>
    </>
  )
}

export default ReChartsLine;
