/* istanbul ignore file */
import React, { useState, useEffect } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { lineGraph, tooltip } from '../experimental.module.scss';

const data = [
  {
    id: 'Line 1',
    data: [
      { x: 2013, y: 0 },
      { x: 2014, y: 0 },
      { x: 2015, y: 2 },
      { x: 2016, y: 3 },
      { x: 2017, y: 3 },
      { x: 2018, y: 6 },
      { x: 2019, y: 5 },
      { x: 2020, y: 6 },
      { x: 2021, y: 4 },
      { x: 2022, y: 3 },
      { x: 2023, y: 2 },
    ],
  },
  {
    id: 'Line 2',
    data: [
      { x: 2013, y: 0 },
      { x: 2014, y: 1 },
      { x: 2015, y: 3 },
      { x: 2016, y: 4 },
      { x: 2017, y: 5 },
      { x: 2018, y: 7 },
      { x: 2019, y: 8 },
      { x: 2020, y: 8 },
      { x: 2021, y: 8 },
      { x: 2022, y: 9 },
      { x: 2023, y: 1 },
    ],
  },
  {
    id: 'Line 3',
    data: [
      { x: 2013, y: 1 },
      { x: 2014, y: 0 },
      { x: 2015, y: 1 },
      { x: 2016, y: 2 },
      { x: 2017, y: 3 },
      { x: 2018, y: 4 },
      { x: 2019, y: 5 },
      { x: 2020, y: 6 },
      { x: 2021, y: 7 },
      { x: 2022, y: 9 },
      { x: 2023, y: 11 },
    ],
  },
];

const LineGraph = () => {
  const [mouseHover, setMouseHover] = useState(null);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    if (mouseHover !== null) {
      fadeIn();
    } else {
      fadeOut();
    }
  }, [mouseHover]);

  const fadeIn = () => {
    setOpacity(1);
  };
  const fadeOut = () => {
    setOpacity(0);
  };

  return (
    <div
      style={{ height: '400px', position: 'relative', width: '600px', opacity: mouseHover !== null ? 0 : 1, transition: 'opacity 3s ease-in-out' }}
      role="presentation"
      onMouseEnter={fadeIn}
      onMouseLeave={fadeOut}
    >
      <ResponsiveLine
        data={data}
        margin={{ top: 50, right: 50, bottom: 100, left: 100 }}
        xScale={{ type: 'linear', min: 'auto', max: 'auto' }}
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
        animate={true}
        enableGridX={false}
        enableGridY={true}
        enablePoints={false}
        crosshairType="x"
        onMouseEnter={slice => {
          setMouseHover(slice.slicePoints[0].x);
        }}
        onMouseLeave={() => {
          setMouseHover(null);
        }}
        sliceTooltip={({ slice }) => {
          return (
            <div
              className={tooltip}
              style={{
                background: 'white',
                padding: '10px',
                border: '1px solid #ccc',
                opacity: opacity,
                transition: 'opacity 3s ease-in-out',
              }}
            >
              <div>
                <div
                  style={{
                    width: '120px',
                    height: '100px',
                    backgroundColor: 'white',
                    display: 'inline-block',
                  }}
                >
                  <div style={{ fontSize: 24 }}>Year: {slice.points[0].data.x}</div>
                  {slice.points.map(point => (
                    <div key={point.seriesId}>
                      <div
                        style={{
                          height: '10px',
                          width: '10px',
                          backgroundColor: point.serieColor,
                          display: 'inline-block',
                          borderRadius: '50%',
                          marginRight: '5px',
                        }}
                      />
                      {point.seriesId} : {point.data.y}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
};

export default LineGraph;
