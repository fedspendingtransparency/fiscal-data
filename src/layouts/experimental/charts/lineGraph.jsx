/* istanbul ignore file */
import React, { useState } from 'react';
import { Line } from '@nivo/line';
import { Tooltip } from '@nivo/tooltip';

const LineGraph = () => {
  const [mouseHover, setMouseHover] = useState(null);

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
  const handleMouseMove = event => {
    const chartElement = event.currentTarget;
    const rect = chartElement.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    setMouseHover(mouseX);
  };
  const chartTheme = {
    axis: {
      domain: {
        line: {
          strokeWidth: 1,
          stroke: '#666666'
        }
      }
    },
    crosshair: {
      line: {
        stroke: '#555555',
        strokeWidth: 2,
      }
    }
  };
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1, paddingLeft: '20px' }}>
        <ul></ul>
      </div>
      <div
        style={{ flex: 3, position: 'relative' }}
        onMouseMove={handleMouseMove}
        role="presentation"
      >
        <Line
          data={data}
          margin={{ top: 50, right: 50, bottom: 100, left: 100 }}
          xScale={{ type: 'linear' }}
          yScale={{ type: 'linear', min: 'auto', max: 'auto', reverse: false }}
          curve="monotoneX"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            legend: 'X-axis Label',
            legendPosition: 'middle',
            legendOffset: 36,
          }}
          axisLeft={{
            legend: 'Y-axis Label',
            legendPosition: 'middle',
            legendOffset: -60,
          }}
          width={600}
          height={400}
          enableGridX={false}
          enableGridY={true}
          pointSize={0}
          theme={chartTheme}
          lineWidth={2}
          layers={[
            'grid',
            'markers',
            'axes',
            'areas',
            'lines',
            'slice',
            'annotations',
            'crosshair',
            'mesh',
            'legends',
            'tooltip',
          ]}
          enableCrosshair={true}
          isInteractive={true}
          enableSlices={'x'}
          tooltip={({ point }) => (
            <div style={{ background: 'white', padding: '5px', border: '1px solid gray'}}>
              <div>X: {point.data.x}</div>
              <div>Y: {point.data.y}</div>
            </div>
          )
        }
        />
        {mouseHover !== null && (
          <div
            style={{
              position: 'absolute',
              left: mouseHover - 1,
              top: '50px',
              width: '0px',
              height: '250px',
              zIndex: 1,
              background: 'transparent',
              border: '2px dashed gray',
            }}
          />
        )}
      </div>
    </div>
  );
};
export default LineGraph;
