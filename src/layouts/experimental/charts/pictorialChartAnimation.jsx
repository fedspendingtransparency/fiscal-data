/* istanbul ignore file */
import React, {useState, useEffect} from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from 'recharts';
import { totalDebtData } from "./experimental-helper";

const PictorialChart = () => {
  const [currentBarIndex, setCurrentBarIndex] = useState(0);

  useEffect(() => {
    let animationFrameId;

    const animateBars = () => {
      const maxBarIndex = totalDebtData.data[0]
        ? Object.keys(totalDebtData.data[0]).length + 1
        : 0;

      if (currentBarIndex < maxBarIndex) {
        setCurrentBarIndex((prevIndex) => prevIndex + 1);
        animationFrameId = requestAnimationFrame(animateBars);
      }
    };

    animationFrameId = requestAnimationFrame(animateBars);

    return () => cancelAnimationFrame(animationFrameId);
  }, [currentBarIndex]);

  const mapLegendType = (barType) => {
    if (barType === 'debt') {
      return 'circle';
    } else if (barType === 'deficit') {
      return 'circle';
    } else {
      return 'none';
    }
  };

  const keysToRender = Object.keys(totalDebtData.data[0] || {}).filter(
    (key) => key !== 'year'
  );

  const renderedBars = keysToRender
  .slice(0, currentBarIndex + 1)
  .map((key) => (
    <Bar
      key={key}
      dataKey={key}
      stackId="a"
      fill={
        key.includes('deficit')
          ? '#BD4E12'
          : key.includes('debt')
          ? '#4B1B79'
          : 'white'
      }
      layout={'horizontal'}
      name={
        key.includes('deficit')
          ? 'Deficit'
          : key.includes('debt')
          ? 'Debt'
          : ''
      }
      legendType={mapLegendType(key)}
    />
  ));

  

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <BarChart width={650} height={300} data={totalDebtData.data} layout="vertical" barGap={10} barSize={40}>
        <CartesianGrid horizontal={false} />
        <XAxis type="number" domain={[0, 40]} unit="T" tickFormatter={v => `$${v}`} />
        <YAxis type="category" dataKey="year" reversed={true} />
        <Legend align="left" verticalAlign="top" />
        {renderedBars}
        <Bar
          name=" = $1T"
          dataKey="null"
          stackId="a"
          fill="#555555"
          legendType="square"
        />
      </BarChart>
    </div>
  );
};

export default PictorialChart;
