/* istanbul ignore file */

import React from 'react';
import { Area, ComposedChart, Bar, XAxis, YAxis, Tooltip, BarChart } from 'recharts';
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


const AFGDeficitBarChartPOC = () => {

  const data = [
    {
      "year": "2016",
      "Deficit": [
        0.5,
        0
      ]
    },
    {
      "year": "2017",
      "Deficit": [2,4],
    },
    {
      "year": "2018",
      "Deficit": [3,5],
    },
    {
      "year": "2019",
      "Deficit": [5,6],
    },
    {
      "year": "2020",
      "Deficit": [7,10],
    },
    {
      "year": "2021",
      "Deficit": [9,12],
    },
    {
      "year": "2022",
      "Deficit": [7,9],
    },
    {
      "year": "2023",
      "Deficit": [2, 4],
    }
  ]


  const CustomBar = ({ active, payload, label}) => {
    console.log(payload);
    if (active && payload && payload.length) {
      return (
        <React.Fragment data-testid='custom bar'>
          <line x1={payload['Deficit'][0]}
                x2={payload['Deficit'][1]}
                y1={payload['year']}
                y2={payload['year']}
          />
        </React.Fragment>
      )
    }
    return null;
  }

  return (
    <>
      <BarChart
        width={730}
        height={250}
        data={data}
        margin={{
          top: 20, right: 20, bottom: 20, left: 20,
        }}
        layout="vertical"
      >
        <Bar dataKey="Deficit" shape={CustomBar} />
        <YAxis dataKey="year" type="category" />
        <XAxis />
      </BarChart>
    </>
  )
}
export default AFGDeficitBarChartPOC;
