/* istanbul ignore file */
import React, {useState, useEffect} from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
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
  {
    year: '2022',
    // top
    debt: 29.3,
    //bottom
    deficit: 1.7,
  },
  {
    year: '2023',
    // top
    deficit: 1.2,
    //bottom
    debt: 31.2,
  },
];

const PictorialChart = () => {

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <BarChart
        width={650}
        height={400}
        data={data}
        layout="vertical"
        barGap={10}
        barSize={40}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis
          type="number"
          domain={[0, 40]}
          unit="T"
          tickFormatter={v => `$${v}`}
        />
        <YAxis type="category" dataKey="year" reversed="true" />

        <Bar
          dataKey="debt"
          stackId="a"
          fill="#4B1B79"
          layout={'horizontal'}
        />
        <Bar
          dataKey="none"
          stackId="a"
          fill="#00000000"
          layout={'horizontal'}
        />
        <Bar
          dataKey="debt2"
          stackId="a"
          fill="#4B1B79"
          layout={'horizontal'}
        />
        <Bar
          dataKey="none2"
          stackId="a"
          fill="#00000000"
          layout={'horizontal'}
        />
        <Bar
          dataKey="debt3"
          stackId="a"
          fill="#4B1B79"
          layout={'horizontal'}
        />
        <Bar
          dataKey="none3"
          stackId="a"
          fill="#00000000"
          layout={'horizontal'}
        />
        <Bar
          dataKey="debt4"
          stackId="a"
          fill="#4B1B79"
          layout={'horizontal'}
        />
        <Bar
          dataKey="none4"
          stackId="a"
          fill="#00000000"
          layout={'horizontal'}
        />
        <Bar
          dataKey="debt5"
          stackId="a"
          fill="#4B1B79"
          layout={'horizontal'}
        />
        <Bar
          dataKey="none5"
          stackId="a"
          fill="#00000000"
          layout={'horizontal'}
        />
        <Bar
          dataKey="debt6"
          stackId="a"
          fill="#4B1B79"
          layout={'horizontal'}
        />
        <Bar
          dataKey="none6"
          stackId="a"
          fill="#00000000"
          layout={'horizontal'}
        />
        <Bar
          dataKey="debt7"
          stackId="a"
          fill="#4B1B79"
          layout={'horizontal'}
        />
        <Bar
          dataKey="none7"
          stackId="a"
          fill="#00000000"
          layout={'horizontal'}
        />
        <Bar
          dataKey="debt8"
          stackId="a"
          fill="#4B1B79"
          layout={'horizontal'}
        />
        <Bar
          dataKey="none8"
          stackId="a"
          fill="#00000000"
          layout={'horizontal'}
        />
        <Bar
          dataKey="debt9"
          stackId="a"
          fill="#4B1B79"
          layout={'horizontal'}
        />
        <Bar
          dataKey="none9"
          stackId="a"
          fill="#00000000"
          layout={'horizontal'}
        />
        <Bar
          dataKey="debt10"
          stackId="a"
          fill="#4B1B79"
          layout={'horizontal'}
        />
        <Bar
          dataKey="none10"
          stackId="a"
          fill="#00000000"
          layout={'horizontal'}
        />
        <Bar
          dataKey="debt11"
          stackId="a"
          fill="#4B1B79"
          layout={'horizontal'}
        />
        <Bar
          dataKey="none11"
          stackId="a"
          fill="#00000000"
          layout={'horizontal'}
        />
        <Bar
          dataKey="debt12"
          stackId="a"
          fill="#4B1B79"
          layout={'horizontal'}
        />
        <Bar
          dataKey="none12"
          stackId="a"
          fill="#00000000"
          layout={'horizontal'}
        />
        <Bar
          dataKey="debt13"
          stackId="a"
          fill="#4B1B79"
          layout={'horizontal'}
        />
        <Bar
          dataKey="none13"
          stackId="a"
          fill="#00000000"
          layout={'horizontal'}
        />
        <Bar
          dataKey="debt14"
          stackId="a"
          fill="#4B1B79"
          layout={'horizontal'}
        />
        <Bar
          dataKey="none14"
          stackId="a"
          fill="#00000000"
          layout={'horizontal'}
        />
        <Bar
          dataKey="debt15"
          stackId="a"
          fill="#4B1B79"
          layout={'horizontal'}
        />
        <Bar
          dataKey="none15"
          stackId="a"
          fill="#00000000"
          layout={'horizontal'}
        />
        <Bar
          dataKey="debt16"
          stackId="a"
          fill="#4B1B79"
          layout={'horizontal'}
        />
        <Bar
          dataKey="none16"
          stackId="a"
          fill="#00000000"
          layout={'horizontal'}
        />
        <Bar
          dataKey="debt17"
          stackId="a"
          fill="#4B1B79"
          layout={'horizontal'}
        />
        <Bar
          dataKey="none17"
          stackId="a"
          fill="#00000000"
          layout={'horizontal'}
        />
        <Bar
          dataKey="debt18"
          stackId="a"
          fill="#4B1B79"
          layout={'horizontal'}
        />
        <Bar
          dataKey="none18"
          stackId="a"
          fill="#00000000"
          layout={'horizontal'}
        />
        <Bar
          dataKey="debt19"
          stackId="a"
          fill="#4B1B79"
          layout={'horizontal'}
        />
        <Bar
          dataKey="none19"
          stackId="a"
          fill="#00000000"
          layout={'horizontal'}
        />
        <Bar
          dataKey="debt20"
          stackId="a"
          fill="#4B1B79"
          layout={'horizontal'}
        />
        <Bar
          dataKey="none20"
          stackId="a"
          fill="#00000000"
          layout={'horizontal'}
        />
        <Bar
          dataKey="debt21"
          stackId="a"
          fill="#4B1B79"
          layout={'horizontal'}
        />
        <Bar
          dataKey="deficit"
          stackId="a"
          fill="#BD4E12"
          layout={'horizontal'}
        />
        <Bar
          dataKey="none21"
          stackId="a"
          fill="#00000000"
          layout={'horizontal'}
        />
        <Bar
          dataKey="deficit2"
          stackId="a"
          fill="#BD4E12"
          layout={'horizontal'}
        />
        <Bar
          dataKey="debt22"
          stackId="a"
          fill="#4B1B79"
          layout={'horizontal'}
        />
        <Bar
          dataKey="none22"
          stackId="a"
          fill="#00000000"
          layout={'horizontal'}
        />
        <Bar
          dataKey="debt23"
          stackId="a"
          fill="#4B1B79"
          layout={'horizontal'}
        />
        <Bar
          dataKey="none23"
          stackId="a"
          fill="#00000000"
          layout={'horizontal'}
        />
        <Bar
          dataKey="debt24"
          stackId="a"
          fill="#4B1B79"
          layout={'horizontal'}
        />
        <Bar
          dataKey="none24"
          stackId="a"
          fill="#00000000"
          layout={'horizontal'}
        />
        <Bar
          dataKey="debt25"
          stackId="a"
          fill="#4B1B79"
          layout={'horizontal'}
        />
        <Bar
          dataKey="deficit3"
          stackId="a"
          fill="#BD4E12"
          layout={'horizontal'}
        />
        <Bar
          dataKey="none25"
          stackId="a"
          fill="#00000000"
          layout={'horizontal'}
        />
        <Bar
          dataKey="deficit4"
          stackId="a"
          fill="#BD4E12"
          layout={'horizontal'}
        />
        <Bar
          dataKey="none26"
          stackId="a"
          fill="#00000000"
          layout={'horizontal'}
        />
        <Bar
          dataKey="deficit5"
          stackId="a"
          fill="#BD4E12"
          layout={'horizontal'}
        />
        <Bar
          dataKey="none27"
          stackId="a"
          fill="#00000000"
          layout={'horizontal'}
        />
        <Bar
          dataKey="deficit6"
          stackId="a"
          fill="#BD4E12"
          layout={'horizontal'}
        />
        <Bar
          dataKey="debt26"
          stackId="a"
          fill="#4B1B79"
          layout={'horizontal'}
        />
        <Bar
          dataKey="none28"
          stackId="a"
          fill="#00000000"
          layout={'horizontal'}
        />
        <Bar
          dataKey="debt27"
          stackId="a"
          fill="#4B1B79"
          layout={'horizontal'}
        />
        <Bar
          dataKey="none29"
          stackId="a"
          fill="#00000000"
          layout={'horizontal'}
        />
        <Bar
          dataKey="debt28"
          stackId="a"
          fill="#4B1B79"
          layout={'horizontal'}
        />
        <Bar
          dataKey="none30"
          stackId="a"
          fill="#00000000"
          layout={'horizontal'}
        />
        <Bar
          dataKey="debt29"
          stackId="a"
          fill="#4B1B79"
          layout={'horizontal'}
        />
        <Bar
          dataKey="deficit7"
          stackId="a"
          fill="#BD4E12"
          layout={'horizontal'}
        />
        <Bar
          dataKey="none31"
          stackId="a"
          fill="#00000000"
          layout={'horizontal'}
        />
        <Bar
          dataKey="deficit8"
          stackId="a"
          fill="#BD4E12"
          layout={'horizontal'}
        />
        <Bar
          dataKey="none32"
          stackId="a"
          fill="#00000000"
          layout={'horizontal'}
        />
        <Bar
          dataKey="deficit9"
          stackId="a"
          fill="#BD4E12"
          layout={'horizontal'}
        />
      </BarChart>
    </div>
  );
};

export default PictorialChart;
