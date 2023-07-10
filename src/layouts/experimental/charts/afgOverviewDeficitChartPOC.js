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


const AFGDeficitPOC = () => {

  // const data = [
  //   {
  //     "year": "2016",
  //     "Deficit": [0,.5],
  //     "Spending": 0,
  //     "Revenue": 0.5,
  //   },
  //   {
  //     "year": "2017",
  //     "Deficit": [2,4],
  //     "Spending": 2,
  //     "Revenue": 4,
  //   },
  //   {
  //     "year": "2018",
  //     "Deficit": [3,5],
  //     "Spending": 3,
  //     "Revenue": 5,
  //   },
  //   {
  //     "year": "2019",
  //     "Deficit": [5,6],
  //     "Spending ": 5,
  //     "Revenue": 6,
  //
  //   },
  //   {
  //     "year": "2020",
  //     "Deficit": [7,10],
  //     "Spending": 7,
  //     "Revenue": 10,
  //   },
  //   {
  //     "year": "2021",
  //     "Deficit": [9,12],
  //     "Spending": 9,
  //     "Revenue": 12,
  //   },
  //   {
  //     "year": "2022",
  //     "Deficit": [7,9],
  //     "Spending": 7,
  //     "Revenue": 9,
  //   },
  //   {
  //     "year": "2023",
  //     "Deficit": [2, 4],
  //     "Spending": 2,
  //     "Revenue": 4,
  //   }
  // ]


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
  const testData = [
      {
        'year': '2016',
         '2016-Deficit': 0,
       },
       {
         'year': '2016',
         "2016-Deficit": 4,
       },
       {
         'year': '2016',
         "2016-Deficit": 6,
       },
    ]
    //  [
    //    {
    //      "2016-Deficit": 0,
    //      "2016-Spending": 0,
    //      "2016-Revenue": 0.5,
    //    },
    //    {
    //      "2017-Deficit": [2,4],
    //      "2017-Spending": 2,
    //      "2017-Revenue": 4,
    //    },
    //    {
    //      "2018-Deficit": [3,5],
    //      "2018-Spending": 3,
    //      "2018-Revenue": 5,
    //    },
    // ];


  const CustomTooltip = ({ active, payload, label}) => {
    if (active && payload && payload.length) {
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
  const NewLine = () => {

  }

  const years = ['2016', '2017', '2018'];

  return (
    <>
      <ComposedChart
        width={730}
        height={250}
        data={testData}
        margin={{
          top: 20, right: 20, bottom: 20, left: 20,
        }}
        layout="vertical"
      >
        <Line dataKey={'Deficit'} stroke={spendingExplainerPrimary} strokeWidth={2} dot={false} activeDot={false} strokeOpacity={1} />

        <YAxis dataKey="year" type="category" ticks={["2016", "2017", "2018",]} />
        <XAxis />
        {/*<Tooltip content={<CustomTooltip />} cursor={{ stroke: '#666666', strokeWidth: 2, strokeDasharray: 3}} />*/}
      </ComposedChart>
    </>
  )
}
export default AFGDeficitPOC;
