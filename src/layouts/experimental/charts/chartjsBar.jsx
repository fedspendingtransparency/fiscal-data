/* istanbul ignore file */
import React from 'react';
import { Bar } from "react-chartjs-2";
import ChartDataLabels from 'chartjs-plugin-datalabels';

const ChartJSBar = () => {
  const options = {
    indexAxis: 'y',
    elements: {
      bar: {
        borderWidth: 2,
      }
    },
    responsive: true,
    scales: {
      x: {
        grid: {
          display: false,
          lineWidth: 0,
        },
        border: {
          display: false,
        },
        ticks: {
          display: false,
        }
      },
      y: {
        grid: {
          display: false,
          lineWidth: 0,
        },
        border: {
          display: false,
        }
      }
    },
    layout: {
      padding: {
        right: 25,
      }
    },

    plugins: {
      tooltip: {
        enabled: false,
      },
      legend: {
        display: false,
      },
      datalabels: {
        display: true,
        color: "#15366a",
        align: 'end',
        anchor: 'end',
      }
    },
  }


  const plugins = [{
    datalabels: {
      align: 'end',
      anchor: 'end',
      color: "#15366a",
    }
  }];

  const labels = ['U.S. Investors', 'Federal Reserve', 'Social Security', 'Department of Defense'];
  const data = {
    labels: labels,
    datasets: [
      {
        backgroundColor: ["#15366a"],
        borderColor: ["#15366a"],
        data: [15, 5, 9, 10],
        borderWidth: 0,
      },
    ]
  }

  return (
    <>
      <div style={{height: '300px', width: '400px'}}>
        <div style={{height: '100%', width: '90%', position: 'relative'}}>
          <Bar
               data={data}
               options={options}
               plugins={[ChartDataLabels]}
               // style={{marginRight: '1rem'}}
          />
        </div>
      </div>
    </>
  );
};

export default ChartJSBar;
