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
    const barLoop = () => {
        for (let i = 0; i < Object.keys(totalDebtData.data[4]).length + 1; i++) {
          setTimeout(() => setCurrentBarIndex(i), 1);
      }
    }
    barLoop();
  }, []);



  const mapLegendType = (barType) => {
    if (barType === 'debt') {
      return 'circle';
    } else if (barType === 'deficit') {
      return 'circle';
    } else {
      return 'none';
    }
  };

  const mapBarColors = (barType) => {
    if (barType.includes('debt')) {
      return '#4B1B79';
    }
    else if (barType.includes('none')) {
      return '#00000000';
    }
    else if (barType.includes('deficit')) {
      return '#BD4E12';
    }
  }

  const generateBar = (sortedData) => {
    return sortedData.map((dataObj, i) =>
      Object.keys(dataObj)
      .filter((propName) => {
        return propName !== "year";
      }).slice(0, currentBarIndex + 1)
      .map((valueName) => {
        return (
          <Bar
            dataKey={valueName}
            stackId={'a'}
            fill={mapBarColors(valueName)}
            name={valueName === 'debt' ? `Debt` : valueName === 'deficit' ? `Deficit` : ''}
            legendType={mapLegendType(valueName)}
            isAnimationActive={false}
          />
        )
      })
    );
  }





  return (
    <div style={{ width: '100%', height: '400px' }}>
      <BarChart width={650} height={300} data={totalDebtData.data} layout="vertical" barGap={10} barSize={40}>
        <CartesianGrid horizontal={false} />
        <XAxis type="number" domain={[0, 40]} unit="T" tickFormatter={v => `$${v}`} />
        <YAxis type="category" dataKey="year" reversed={true} />
        <Legend align="left" verticalAlign="top" />
        {generateBar(totalDebtData.data)}
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
