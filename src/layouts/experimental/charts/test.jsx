/* istanbul ignore file */

import React from 'react';
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
import { Line } from 'nivo';
import { pxToNumber } from '../../../helpers/styles-helper/styles-helper';
import CustomSlices from '../../explainer/explainer-helpers/CustomSlice/custom-slice';


const AFGDeficitBarChartPOC2 = () => {
  const testData = [
    {
      id: "2016",
      color: deficitExplainerPrimary,
      data: [
        { y: "2016", x: 0.5},
        { y: "2016", x: 2},
      ]
    },
    {
      id: "2017",
      color: revenueExplainerPrimary,
      data:  [
        { y: "2017", x: 1.5},
        { y: "2018", x: 3},
      ]
    },
    {
      id: "2018",
      color: spendingExplainerPrimary,
      data:  [
        { y: "2018", x: 3.5},
        { y: "2018", x: 6},
      ]
    },
  ]

  const chartWidth = 550;
  const chartHeight = 490;

  return (
    <>
      <Line
        // data={testData}
        // width={chartWidth}
        // height={chartHeight}
        // // theme={chartBorderTheme}
        // layers={[
        //   "grid",
        //   "lines",
        //   "axes",
        //   // CustomPoint,
        //   // (props) =>
        //   //   CustomSlices({
        //   //       ...props,
        //   //     }
        //   //   ),
        //   "crosshair"
        // ]}
        // margin={{ top: 10, right: 25, bottom: 40, left: 55 }}
        // xScale={{ type: "linear", stacked: true, reverse: false}}
        // yScale={{ type: "time", precision: "year", min: "2016", max: "2022"}}
        // // yFormat=" >-.2f"
        // axisTop={null}
        // axisRight={null}
        // axisBottom={{
        //   orient: "bottom",
        //   tickSize: 6,
        //   tickPadding: 8,
        //   tickRotation: 0,
        // }}
        // axisLeft={{
        //   orient: "left",
        //   tickSize: 6,
        //   tickPadding: 8,
        // }}
        // enablePoints={false}
        // enableSlices="x"
        // pointSize={0}
        // pointColor={deficitExplainerPrimary}
        // pointBorderWidth={2}
        // pointBorderColor={deficitExplainerPrimary}
        // pointLabelYOffset={-12}
        // colors={deficitExplainerPrimary}
        // useMesh={true}
        // enableGridY={false}
        // enableGridX={true}
        // sliceTooltip={() => <></>}
        // enableCrosshair={false}
        // animate={false}
        // isInteractive={false}
        animate
        curve="monotoneX"
        data={[
          {
            color: 'hsl(42, 70%, 50%)',
            data: [
              {
                color: 'hsl(2, 70%, 50%)',
                x: 'BB',
                y: 42
              },
              {
                color: 'hsl(51, 70%, 50%)',
                x: 'GL',
                y: 44
              },
              {
                color: 'hsl(88, 70%, 50%)',
                x: 'KR',
                y: 51
              },
              {
                color: 'hsl(231, 70%, 50%)',
                x: 'MK',
                y: 35
              },
              {
                color: 'hsl(121, 70%, 50%)',
                x: 'BT',
                y: 30
              },
              {
                color: 'hsl(118, 70%, 50%)',
                x: 'AT',
                y: 60
              },
              {
                color: 'hsl(182, 70%, 50%)',
                x: 'SI',
                y: 33
              },
              {
                color: 'hsl(68, 70%, 50%)',
                x: 'KH',
                y: 45
              },
              {
                color: 'hsl(3, 70%, 50%)',
                x: 'MR',
                y: 22
              },
              {
                color: 'hsl(38, 70%, 50%)',
                x: 'VI',
                y: 45
              },
              {
                color: 'hsl(172, 70%, 50%)',
                x: 'SB',
                y: 56
              },
              {
                color: 'hsl(167, 70%, 50%)',
                x: 'SK',
                y: 35
              },
              {
                color: 'hsl(318, 70%, 50%)',
                x: 'BI',
                y: 13
              },
              {
                color: 'hsl(254, 70%, 50%)',
                x: 'TZ',
                y: 23
              },
              {
                color: 'hsl(149, 70%, 50%)',
                x: 'PT',
                y: 29
              },
              {
                color: 'hsl(276, 70%, 50%)',
                x: 'PW',
                y: 14
              },
              {
                color: 'hsl(357, 70%, 50%)',
                x: 'TN',
                y: 4
              },
              {
                color: 'hsl(331, 70%, 50%)',
                x: 'MZ',
                y: 22
              }
            ],
            id: 'whisky'
          },
          {
            color: 'hsl(255, 70%, 50%)',
            data: [
              {
                color: 'hsl(131, 70%, 50%)',
                x: 'BB',
                y: 16
              },
              {
                color: 'hsl(80, 70%, 50%)',
                x: 'GL',
                y: 56
              },
              {
                color: 'hsl(29, 70%, 50%)',
                x: 'KR',
                y: 43
              },
              {
                color: 'hsl(228, 70%, 50%)',
                x: 'MK',
                y: 44
              },
              {
                color: 'hsl(306, 70%, 50%)',
                x: 'BT',
                y: 5
              },
              {
                color: 'hsl(254, 70%, 50%)',
                x: 'AT',
                y: 8
              },
              {
                color: 'hsl(273, 70%, 50%)',
                x: 'SI',
                y: 49
              },
              {
                color: 'hsl(225, 70%, 50%)',
                x: 'KH',
                y: 49
              },
              {
                color: 'hsl(182, 70%, 50%)',
                x: 'MR',
                y: 44
              },
              {
                color: 'hsl(62, 70%, 50%)',
                x: 'VI',
                y: 48
              },
              {
                color: 'hsl(75, 70%, 50%)',
                x: 'SB',
                y: 59
              },
              {
                color: 'hsl(271, 70%, 50%)',
                x: 'SK',
                y: 7
              },
              {
                color: 'hsl(165, 70%, 50%)',
                x: 'BI',
                y: 56
              },
              {
                color: 'hsl(101, 70%, 50%)',
                x: 'TZ',
                y: 51
              },
              {
                color: 'hsl(241, 70%, 50%)',
                x: 'PT',
                y: 46
              },
              {
                color: 'hsl(88, 70%, 50%)',
                x: 'PW',
                y: 25
              },
              {
                color: 'hsl(262, 70%, 50%)',
                x: 'TN',
                y: 32
              },
              {
                color: 'hsl(92, 70%, 50%)',
                x: 'MZ',
                y: 41
              }
            ],
            id: 'rhum'
          },
          {
            color: 'hsl(179, 70%, 50%)',
            data: [
              {
                color: 'hsl(161, 70%, 50%)',
                x: 'BB',
                y: 3
              },
              {
                color: 'hsl(185, 70%, 50%)',
                x: 'GL',
                y: 2
              },
              {
                color: 'hsl(84, 70%, 50%)',
                x: 'KR',
                y: 56
              },
              {
                color: 'hsl(312, 70%, 50%)',
                x: 'MK',
                y: 34
              },
              {
                color: 'hsl(18, 70%, 50%)',
                x: 'BT',
                y: 6
              },
              {
                color: 'hsl(307, 70%, 50%)',
                x: 'AT',
                y: 44
              },
              {
                color: 'hsl(82, 70%, 50%)',
                x: 'SI',
                y: 19
              },
              {
                color: 'hsl(93, 70%, 50%)',
                x: 'KH',
                y: 40
              },
              {
                color: 'hsl(23, 70%, 50%)',
                x: 'MR',
                y: 19
              },
              {
                color: 'hsl(133, 70%, 50%)',
                x: 'VI',
                y: 52
              },
              {
                color: 'hsl(11, 70%, 50%)',
                x: 'SB',
                y: 30
              },
              {
                color: 'hsl(340, 70%, 50%)',
                x: 'SK',
                y: 33
              },
              {
                color: 'hsl(221, 70%, 50%)',
                x: 'BI',
                y: 16
              },
              {
                color: 'hsl(112, 70%, 50%)',
                x: 'TZ',
                y: 18
              },
              {
                color: 'hsl(188, 70%, 50%)',
                x: 'PT',
                y: 38
              },
              {
                color: 'hsl(188, 70%, 50%)',
                x: 'PW',
                y: 51
              },
              {
                color: 'hsl(176, 70%, 50%)',
                x: 'TN',
                y: 50
              },
              {
                color: 'hsl(49, 70%, 50%)',
                x: 'MZ',
                y: 50
              }
            ],
            id: 'gin'
          },
          {
            color: 'hsl(17, 70%, 50%)',
            data: [
              {
                color: 'hsl(180, 70%, 50%)',
                x: 'BB',
                y: 36
              },
              {
                color: 'hsl(235, 70%, 50%)',
                x: 'GL',
                y: 26
              },
              {
                color: 'hsl(194, 70%, 50%)',
                x: 'KR',
                y: 21
              },
              {
                color: 'hsl(117, 70%, 50%)',
                x: 'MK',
                y: 26
              },
              {
                color: 'hsl(338, 70%, 50%)',
                x: 'BT',
                y: 43
              },
              {
                color: 'hsl(253, 70%, 50%)',
                x: 'AT',
                y: 10
              },
              {
                color: 'hsl(58, 70%, 50%)',
                x: 'SI',
                y: 60
              },
              {
                color: 'hsl(297, 70%, 50%)',
                x: 'KH',
                y: 56
              },
              {
                color: 'hsl(27, 70%, 50%)',
                x: 'MR',
                y: 28
              },
              {
                color: 'hsl(286, 70%, 50%)',
                x: 'VI',
                y: 60
              },
              {
                color: 'hsl(309, 70%, 50%)',
                x: 'SB',
                y: 44
              },
              {
                color: 'hsl(72, 70%, 50%)',
                x: 'SK',
                y: 7
              },
              {
                color: 'hsl(338, 70%, 50%)',
                x: 'BI',
                y: 35
              },
              {
                color: 'hsl(121, 70%, 50%)',
                x: 'TZ',
                y: 7
              },
              {
                color: 'hsl(153, 70%, 50%)',
                x: 'PT',
                y: 28
              },
              {
                color: 'hsl(27, 70%, 50%)',
                x: 'PW',
                y: 11
              },
              {
                color: 'hsl(160, 70%, 50%)',
                x: 'TN',
                y: 9
              },
              {
                color: 'hsl(210, 70%, 50%)',
                x: 'MZ',
                y: 17
              }
            ],
            id: 'vodka'
          },
          {
            color: 'hsl(214, 70%, 50%)',
            data: [
              {
                color: 'hsl(2, 70%, 50%)',
                x: 'BB',
                y: 24
              },
              {
                color: 'hsl(218, 70%, 50%)',
                x: 'GL',
                y: 32
              },
              {
                color: 'hsl(5, 70%, 50%)',
                x: 'KR',
                y: 26
              },
              {
                color: 'hsl(349, 70%, 50%)',
                x: 'MK',
                y: 50
              },
              {
                color: 'hsl(204, 70%, 50%)',
                x: 'BT',
                y: 7
              },
              {
                color: 'hsl(254, 70%, 50%)',
                x: 'AT',
                y: 50
              },
              {
                color: 'hsl(288, 70%, 50%)',
                x: 'SI',
                y: 6
              },
              {
                color: 'hsl(77, 70%, 50%)',
                x: 'KH',
                y: 7
              },
              {
                color: 'hsl(226, 70%, 50%)',
                x: 'MR',
                y: 47
              },
              {
                color: 'hsl(96, 70%, 50%)',
                x: 'VI',
                y: 28
              },
              {
                color: 'hsl(240, 70%, 50%)',
                x: 'SB',
                y: 25
              },
              {
                color: 'hsl(163, 70%, 50%)',
                x: 'SK',
                y: 14
              },
              {
                color: 'hsl(46, 70%, 50%)',
                x: 'BI',
                y: 22
              },
              {
                color: 'hsl(212, 70%, 50%)',
                x: 'TZ',
                y: 46
              },
              {
                color: 'hsl(184, 70%, 50%)',
                x: 'PT',
                y: 29
              },
              {
                color: 'hsl(60, 70%, 50%)',
                x: 'PW',
                y: 33
              },
              {
                color: 'hsl(158, 70%, 50%)',
                x: 'TN',
                y: 39
              },
              {
                color: 'hsl(285, 70%, 50%)',
                x: 'MZ',
                y: 0
              }
            ],
            id: 'cognac'
          }
        ]}
        enableSlices="x"
        height={400}
        margin={{
          bottom: 60,
          left: 80,
          right: 20,
          top: 20
        }}
        width={900}
        yScale={{
          stacked: true,
          type: 'linear'
        }}
      />
    </>
  )
}
export default AFGDeficitBarChartPOC2;
