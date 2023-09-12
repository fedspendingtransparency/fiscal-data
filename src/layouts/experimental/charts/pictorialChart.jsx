/* istanbul ignore file */
import React, {useState, useEffect} from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

const data = [
  {
    year: '2019',
    // top
    debt: 0.75,
    none: 0.25,
    debt2: 0.75,
    none2: 0.25,
    debt3: 0.75,
    none3: 0.25,
    debt4: 0.75,
    none4: 0.25,
    debt5: 0.75,
    none5: 0.25,
    debt6: 0.75,
    none6: 0.25,
    debt7: 0.75,
    none7: 0.25,
    debt8: 0.75,
    none8: 0.25,
    debt9: 0.75,
    none9: 0.25,
    debt10: 0.75,
    none10: 0.25,
    debt11: 0.75,
    none11: 0.25,
    debt12: 0.75,
    none12: 0.25,
    debt13: 0.75,
    none13: 0.25,
    debt14: 0.75,
    none14: 0.25,
    debt15: 0.75,
    none15: 0.25,
    debt16: 0.75,
    none16: 0.25,
    debt17: 0.75,
    none17: 0.25,
    debt18: 0.75,
    none18: 0.25,
    debt19: 0.75,
    none19: 0.25,
    debt20: 0.75,
    none20: 0.25,
    debt21: 0.5625,

    //bottom
    deficit: 0.1875,
    none21: 0.25,
    deficit2: 0.6,
  },
  {
    year: '2020',
    // top
    // debt: 23.9,
    debt: 0.75,
    none: 0.25,
    debt2: 0.75,
    none2: 0.25,
    debt3: 0.75,
    none3: 0.25,
    debt4: 0.75,
    none4: 0.25,
    debt5: 0.75,
    none5: 0.25,
    debt6: 0.75,
    none6: 0.25,
    debt7: 0.75,
    none7: 0.25,
    debt8: 0.75,
    none8: 0.25,
    debt9: 0.75,
    none9: 0.25,
    debt10: 0.75,
    none10: 0.25,
    debt11: 0.75,
    none11: 0.25,
    debt12: 0.75,
    none12: 0.25,
    debt13: 0.75,
    none13: 0.25,
    debt14: 0.75,
    none14: 0.25,
    debt15: 0.75,
    none15: 0.25,
    debt16: 0.75,
    none16: 0.25,
    debt17: 0.75,
    none17: 0.25,
    debt18: 0.75,
    none18: 0.25,
    debt19: 0.75,
    none19: 0.25,
    debt20: 0.75,
    none20: 0.25,
    debt22: 0.75,
    none22: 0.25,
    debt23: 0.75,
    none23: 0.25,
    debt24: 0.75,
    none24: 0.25,
    debt25: 0.65,

    //bottom
    // deficit: 3.2,
    deficit3: 0.1,
    none25: 0.25,
    deficit4: 0.75,
    none26: 0.25,
    deficit5: 0.75,
    none27: 0.25,
    deficit6: 0.75,
  },
  {
    year: '2021',
    // top
    // debt: 26.5,
    debt: 0.75,
    none: 0.25,
    debt2: 0.75,
    none2: 0.25,
    debt3: 0.75,
    none3: 0.25,
    debt4: 0.75,
    none4: 0.25,
    debt5: 0.75,
    none5: 0.25,
    debt6: 0.75,
    none6: 0.25,
    debt7: 0.75,
    none7: 0.25,
    debt8: 0.75,
    none8: 0.25,
    debt9: 0.75,
    none9: 0.25,
    debt10: 0.75,
    none10: 0.25,
    debt11: 0.75,
    none11: 0.25,
    debt12: 0.75,
    none12: 0.25,
    debt13: 0.75,
    none13: 0.25,
    debt14: 0.75,
    none14: 0.25,
    debt15: 0.75,
    none15: 0.25,
    debt16: 0.75,
    none16: 0.25,
    debt17: 0.75,
    none17: 0.25,
    debt18: 0.75,
    none18: 0.25,
    debt19: 0.75,
    none19: 0.25,
    debt20: 0.75,
    none20: 0.25,
    debt22: 0.75,
    none22: 0.25,
    debt23: 0.75,
    none23: 0.25,
    debt24: 0.75,
    none24: 0.25,
    debt26: 0.75,
    none28: 0.25,
    debt27: 0.75,
    none29: 0.25,
    debt28: 0.75,
    none30: 0.25,
    debt29: 0.5,
    //bottom
    // deficit: 1.5,
    deficit7: 0.5,
    none31: 0.25,
    deficit8: 0.75,
    none32: 0.25,
    deficit9: 0.4,
  },
];

const PictorialChart = () => {
  const [currentBarIndex, setCurrentBarIndex] = useState(0);
  const [animationFinished, setAnimationFinished] = useState(false);

  useEffect(() => {
    const animationTimer = setTimeout(() => {
      const maxBarIndex = data.reduce((max, yearData) => {
        const keys = Object.keys(yearData).filter(key => key !== 'year');
        return keys.length > max ? keys.length : max;
      }, 0);

      if (currentBarIndex < maxBarIndex) {
        setCurrentBarIndex(prevIndex => prevIndex + 1);
      } else {
        setAnimationFinished(true);
      }
    }, 20); 

    return () => clearTimeout(animationTimer);
  }, [currentBarIndex]);

  const bars = data.map(yearData => {
    const keys = Object.keys(yearData).filter(key => key !== 'year');
    const renderedBars = keys
      .slice(0, currentBarIndex + 1)
      .map(key => (
        <Bar
          key={key}
          dataKey={key}
          stackId="a"
          fill={key.includes('deficit') ? '#BD4E12' : key.includes('debt') ? '#4B1B79' : "white"}
          layout={'horizontal'}
        />
      ));

    return (
      <div key={yearData.year}>
        <BarChart
          width={650}
          height={80}
          data={[yearData]}
          layout="vertical"
          barGap={10}
          barSize={40}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" domain={[0, 40]} unit="T" tickFormatter={v => `$${v}`} />
          <YAxis type="category" dataKey="year" reversed={true} />
          <Tooltip />
          {renderedBars}
        </BarChart>
      </div>
    );
  });

  return (
    <div style={{ width: '100%', height: '400px' }}>
      {animationFinished ? (
        <BarChart
          width={650}
          height={400}
          data={data}
          layout="vertical"
          barGap={10}
          barSize={40}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" domain={[0, 40]} unit="T" tickFormatter={v => `$${v}`} />
          <YAxis type="category" dataKey="year" reversed={true} />
          <Tooltip />
          <Bar dataKey="debt" stackId="a" fill="#4B1B79" layout={'horizontal'} />
          <Bar dataKey="none" stackId="a" fill="white" layout={'horizontal'} />
          <Bar dataKey="debt" stackId="a" fill="#4B1B79" layout={'horizontal'} />
          <Bar dataKey="none" stackId="a" fill="white" layout={'horizontal'} />
          <Bar dataKey="debt" stackId="a" fill="#4B1B79" layout={'horizontal'} />
          <Bar dataKey="none" stackId="a" fill="white" layout={'horizontal'} />
          {/* add addtional static bars */}
        </BarChart>
      ) : (
        bars
      )}
    </div>
  );
};

export default PictorialChart;
