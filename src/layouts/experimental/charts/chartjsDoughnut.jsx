import React from 'react';
import { Doughnut, Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import interestRate from "./interest-exchange-rates.png";
const ChartJSDoughnut = () => {
  const data = {
    // labels: ['Red', 'Blue'],
    datasets: [
      {
        // label: ["test", ""],
        backgroundColor: ["#48699c","#f1f1f1",],
        data: [15, 5],
        borderWidth: 0,
        weight: 3,
        cutout: '70%',
      }
    ]
  }

  const options = {
    plugins: {
      // tooltip: {
      //   enabled: false,
      // },
      legend: {
        display: false,
      },
    }
  };

  const chartHeight = 130;
  const chartWidth = 130;

  const imageHeight = 55;
  const imageWidth = 49;
  const imageTop = (chartHeight / 2) - (imageHeight / 2);
  const imageLeft = (chartWidth / 2) - (imageWidth / 2);

  return (
    <>
      <div style={{height: `${chartHeight}px`, width: `${chartWidth}px`}}>
        <div style={{height: '100%', width: '100%', position: 'relative'}}>
          <div
            style={{height: '100%', width: '100%', position: 'absolute', top: '0px', left: '0px'}}
          >
            <Doughnut data={data} options={options} />
          </div>
          <img
            src={interestRate}
            alt={''}
            style={{
              height: imageHeight,
              width: imageWidth,
              position: 'absolute',
              top: imageTop,
              left: imageLeft,
          }}
          />
        </div>
      </div>
    </>
  );
};

export default ChartJSDoughnut;


