/* istanbul ignore file */
import React, { useState } from 'react'; 
import { ResponsiveLine } from '@nivo/line';

const data = [
  {
    id: 'Line 1',
    data: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 2 },
      { x: 3, y: 3 },
      { x: 4, y: 3 },
      { x: 5, y: 6 },
      { x: 6, y: 5 },
      { x: 7, y: 6 },
      { x: 8, y: 4 },
      { x: 9, y: 3 },
      { x: 10, y: 2 },
    ],
  },
  {
    id: 'Line 2',
    data: [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 3 },
      { x: 3, y: 4 },
      { x: 4, y: 5 },
      { x: 5, y: 7 },
      { x: 6, y: 8 },
      { x: 7, y: 8 },
      { x: 8, y: 8 },
      { x: 9, y: 9 },
      { x: 10, y: 1 },
    ],
  },
  {
    id: 'Line 3',
    data: [
      { x: 0, y: 1 },
      { x: 1, y: 0 },
      { x: 2, y: 1 },
      { x: 3, y: 2 },
      { x: 4, y: 3 },
      { x: 5, y: 4 },
      { x: 6, y: 5 },
      { x: 7, y: 6 },
      { x: 8, y: 7 },
      { x: 9, y: 9 },
      { x: 10, y: 11 },
    ],
  },
];


const LineGraph = () => {
  const [mouseHover, setMouseHover] = useState(null);

  return (
    <div style={{ height: '400px', position: 'relative', width: '600px' }}>
      <ResponsiveLine
        data={data}
        margin={{ top: 50, right: 50, bottom: 100, left: 100 }}
        xScale={{ type: 'linear' }}
        yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
        axisBottom={{
          legend: 'X to the Power of Axis',
          legendOffset: 36,
          legendPosition: 'middle',
        }}
        axisLeft={{
          legend: 'Y to the Power of Axis',
          legendOffset: -40,
          legendPosition: 'middle',
        }}
        enableGridX={false}
        enableGridY={true}
        enablePoints={false}
        enableSlices={'x'}
        onMouseEnter={(slice) => setMouseHover(slice.slicePoints[0].x)}
        onMouseLeave={() => setMouseHover(null)}
      />
      {mouseHover !== null && (
        <div
          style={{
            position: 'absolute',
            left: `${mouseHover * 100}%`,
            top: '50px',
            height: '100%',
            width: '2px',
            background: 'red',
          }}
        />
      )}
    </div>
  );
};

export default LineGraph;

