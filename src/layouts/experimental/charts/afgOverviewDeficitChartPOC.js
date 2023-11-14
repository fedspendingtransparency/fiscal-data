/* istanbul ignore file */

import React, { useEffect, useState } from 'react';
import { Line, XAxis, YAxis, LineChart, CartesianGrid, ReferenceDot, Tooltip } from 'recharts';
import { deficitExplainerPrimary } from '../../explainer/sections/national-deficit/national-deficit.module.scss';
import { spendingExplainerPrimary } from '../../explainer/sections/federal-spending/federal-spending.module.scss';
import { revenueExplainerPrimary } from '../../explainer/sections/government-revenue/revenue.module.scss';
import { toolTip, dot } from '../experimental.module.scss';

const AFGDeficitPOC = () => {
  const [focusedYear, setFocusedYear] = useState(null);
  const [animationComplete, setAnimationComplete] = useState(false);

  const testData2 = [
    {
      data: [
        { year: '2016', value: 0.5, type: 'revenue', opacity: 0 },
        { year: '2016', value: 2, type: 'spending', opacity: 0 },
      ],
    },
    {
      data: [
        { year: '2017', value: 1, type: 'revenue', opacity: 0 },
        { year: '2017', value: 2.5, type: 'spending', opacity: 0 },
      ],
    },
    {
      data: [
        { year: '2018', value: 2.4, type: 'revenue', opacity: 0 },
        { year: '2018', value: 4, type: 'spending', opacity: 0 },
      ],
    },
    {
      data: [
        { year: '2019', value: 3.5, type: 'revenue', opacity: 0 },
        { year: '2019', value: 6, type: 'spending', opacity: 0 },
      ],
    },
    {
      data: [
        { year: '2020', value: 5.5, type: 'revenue', opacity: 0 },
        { year: '2020', value: 7, type: 'spending', opacity: 0 },
      ],
    },
    {
      data: [
        { year: '2021', value: 6, type: 'revenue', latest: true, opacity: 0 },
        { year: '2021', value: 8, type: 'spending', latest: true, opacity: 0 },
      ],
    },
  ];

  const [testData] = useState(testData2);

  const midPointArray = [];

  testData.forEach(curData => {
    const midPoint = {
      year: curData.data[0].year,
      value: (curData.data[0]?.value + curData.data[1]?.value) / 2,
    };
    midPointArray.push(midPoint);
  });

  let yAxisCx = 0;
  // let animate = 0;

  const CustomDot = props => {
    const { cx, cy, payload, strokeWidth, r } = props;

    const color = payload?.type === 'spending' ? spendingExplainerPrimary : revenueExplainerPrimary;
    const fill = payload?.latest ? null : color;
    const midPointValue = midPointArray.find(currentPoint => currentPoint.year === payload.year).value;
    const pixelMidPoint = (midPointValue * (cx - yAxisCx)) / payload.value + 80;
    const rectangleWidth = pixelMidPoint > cx ? pixelMidPoint - cx : cx - pixelMidPoint;
    const animate = false;

    return (
      <>
        <rect
          height={6}
          width={rectangleWidth}
          x={pixelMidPoint > cx ? cx : pixelMidPoint}
          y={cy - 3}
          fill={deficitExplainerPrimary}
          opacity={1}
          stroke={deficitExplainerPrimary}
          strokeWidth={0}
          style={{ pointerEvents: 'none' }}
        >
          {!animate && <animate attributeName="width" from={0} to={rectangleWidth} dur="1s" />}
          {!animate && cx < pixelMidPoint && <animate attributeName="x" from={pixelMidPoint} to={cx} dur="1s" />}
        </rect>
        <circle fill="white" r={r} strokeWidth={strokeWidth + 2} stroke="white" fillOpacity={1} cx={cx} cy={cy}>
          {!animate && <animate attributeName="cx" from={pixelMidPoint} to={cx} dur="1s" />}
        </circle>
        <circle fill={fill} r={r} strokeWidth={strokeWidth - 1} stroke={color} fillOpacity={1} cx={cx} cy={cy}>
          {!animate && <animate attributeName="cx" from={pixelMidPoint} to={cx} dur="1s" />}
        </circle>
      </>
    );
  };

  const CustomDotNoAnimation = props => {
    const { cx, cy, payload, strokeWidth, r } = props;

    const color = payload?.type === 'spending' ? spendingExplainerPrimary : revenueExplainerPrimary;
    const fill = payload?.latest ? null : color;

    return (
      <>
        <circle fill="white" r={r} strokeWidth={strokeWidth + 2} stroke="white" fillOpacity={1} cx={cx} cy={cy}></circle>
        <circle fill={fill} r={r} strokeWidth={strokeWidth - 1} stroke={color} fillOpacity={1} cx={cx} cy={cy}></circle>
      </>
    );
  };

  const CustomShape = props => {
    const { cx } = props;
    yAxisCx = cx;
    return <></>;
  };

  const CustomTooltip = ({ payload, label }) => {
    if (payload && payload.length) {
      setFocusedYear(payload[0].payload.year);

      return (
        <div>
          {
            <div className={toolTip}>
              {label}
              <table>
                <tr>
                  <td>Spending</td>
                  <td>
                    <span className={dot} style={{ backgroundColor: spendingExplainerPrimary }}></span>
                    $X.XX T
                  </td>
                </tr>
                <tr>
                  <td>Revenue</td>
                  <td>
                    <span className={dot} style={{ backgroundColor: revenueExplainerPrimary }}></span>
                    $X.XX T
                  </td>
                </tr>
                <tr>
                  <td>Deficit</td>
                  <td>
                    <span className={dot} style={{ backgroundColor: deficitExplainerPrimary }}></span>
                    $X.XX T
                  </td>
                </tr>
              </table>
            </div>
          }
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    setTimeout(() => {
      setAnimationComplete(true);
    }, 3000);
  });

  return (
    <>
      {!animationComplete && (
        <LineChart
          key={Math.random()}
          width={730}
          height={250}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
          layout="vertical"
          onMouseLeave={() => setFocusedYear(null)}
        >
          <CartesianGrid horizontal={false} />
          <YAxis dataKey="year" type="category" allowDuplicatedCategory={false} axisLine={false} tickLine={false} />
          <XAxis ticks={[0, 2, 4, 6, 8]} type="number" tickFormatter={value => `$${value}`} axisLine={false} tickLine={false} />
          <ReferenceDot x={0} y="2016" shape={<CustomShape />} />
          {testData.map(s => (
            <Line
              dataKey="value"
              data={s.data}
              stroke="transparent"
              strokeWidth={6}
              strokeOpacity={0}
              dot={<CustomDot />}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      )}
      {animationComplete && (
        <LineChart
          key={Math.random()}
          width={730}
          height={250}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
          layout="vertical"
          onMouseLeave={() => setFocusedYear(null)}
        >
          <CartesianGrid horizontal={false} />
          <YAxis dataKey="year" type="category" allowDuplicatedCategory={false} axisLine={false} tickLine={false} />
          <XAxis ticks={[0, 2, 4, 6, 8]} type="number" tickFormatter={value => `$${value}`} axisLine={false} tickLine={false} />
          <ReferenceDot x={0} y="2016" shape={<CustomShape />} />
          {testData.map(s => (
            <Line
              dataKey="value"
              data={s.data}
              stroke={deficitExplainerPrimary}
              strokeWidth={6}
              strokeOpacity={focusedYear === s.data[0].year || focusedYear === null ? 1 : 0.5}
              dot={<CustomDotNoAnimation />}
              isAnimationActive={false}
              activeDot={false}
            />
          ))}
          <Tooltip content={<CustomTooltip />} cursor={{ strokeWidth: 0 }} isAnimationActive={false} />
        </LineChart>
      )}
    </>
  );
};

export default AFGDeficitPOC;
