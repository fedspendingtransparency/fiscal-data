import React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts";
import { totalDebtData } from "./experimental-helper";

const PictoralChart = () => {
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

  const mapLegendType = (barType) => {
    if (barType === 'debt') {
      return 'circle';
    }
    else if (barType === 'deficit') {
      return 'circle';
    }
    else {
      return 'none';
    }
  }

  const generateBar = (sortedData) => {
    return sortedData.map((dataObj, i) =>
      Object.keys(dataObj)
      .filter((propName) => {
        return propName !== "year";
      })
      .map((valueName) => {
        return (
          <Bar
            dataKey={valueName}
            stackId={'a'}
            fill={mapBarColors(valueName)}
            name={valueName === 'debt' ? `Debt` : valueName === 'deficit' ? `Deficit` : ''}
            legendType={mapLegendType(valueName)}
          />
        )
      })
    );
  }
  return (
    <div style={{ width: '100%', height: '400px' }}>
          <BarChart
            width={650}
            height={300}
            data={totalDebtData.data}
            layout="vertical"
            barGap={30}
            barSize={30}
          >
            <CartesianGrid horizontal={false} />
            <XAxis
              type="number"
              domain={[0, 40]}
              unit="T"
              tickFormatter={v => `$${v}`}
            />
            <YAxis type="category" dataKey="year" reversed="true" />
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

export default PictoralChart;