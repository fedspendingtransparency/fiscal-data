/* istanbul ignore file */
import React from 'react';
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import {
  spendingExplainerLightSecondary,
  spendingExplainerPrimary
} from "../../explainer/sections/federal-spending/federal-spending.module.scss";
import {
  revenueExplainerLightSecondary,
  revenueExplainerPrimary
} from "../../explainer/sections/government-revenue/revenue.module.scss";
import {
  deficitExplainerLightSecondary, deficitExplainerPrimary
} from "../../explainer/sections/national-deficit/national-deficit.module.scss";

// This will register plugins for all charts
ChartJS.register(
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
);

const ChartJSLine = () => {


  const options = {
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#666666',
          callback: function(val, index) {
            return index % 3 === 0 ? this.getLabelForValue(val) : '';
          },
        },
        border: {
          color: '#666666'
        },

      },
      y: {
        grid: {
          display: false,
        },
        border: {
          color: '#666666'
        },
        ticks: {
          color: '#666666',
          callback: (value, index, ticks) => {
            return '$' + value;
          }
        },
      }
    },
    layout: {
      padding: {
        left: 25,
        right: 25,
      }
    },

    plugins: {
      tooltip: {
        enabled: true,
      },
    },
  }

  const common = {
      pointStyle: false,
      borderWidth: 2,
  }

  // This could be further extended to draw a dashed hover line on the chart
  const tooltipLine = {
    id: 'tooltipLine',
    beforeDraw: chart => {
      if(chart.tooltip._active && chart.tooltip._active.length) {
        const ctx = chart.ctx;
        ctx.save();
        const activePoint = chart.tooltip._active[0];
        console.log(activePoint.element.x);
        ctx.beginPath();
        ctx.setLineDash([]);
        ctx.moveTo(activePoint.element.x, 0);
        ctx.lineTo(activePoint.element.x, 100);
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      }
    }
  }


  const data = {
    labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    datasets: [
      {
        ...common,
        label: 'Spending \'22',
        data: [2,5,8,15,18,22],
        fill: false,
        borderColor: spendingExplainerPrimary,
      },
      {
        ...common,
        label: 'Revenue \'22',
        data: [4,7,12,13,16,19],
        fill: '-1',
        borderColor: revenueExplainerPrimary,
        backgroundColor: deficitExplainerPrimary,
      },
      {
        ...common,
        label: 'Spending \'21',
        data: [1,3,5,8,15,18,22,23,24,25, 26, 28,],
        fill: false,
        borderColor: spendingExplainerLightSecondary,
      },
      {
        ...common,
        label: 'Revenue \'21',
        data: [1,2,3,5,8,12,13,15,18,22,25,26,],
        fill: '-1',
        borderColor: revenueExplainerLightSecondary,
        backgroundColor: deficitExplainerLightSecondary,
      }
    ]
  }

  return(
    <>
      <div style={{height: '300px', width: '600px'}}>
        <div style={{height: '100%', width: '100%', position: 'relative'}}>
          <Line data={data} options={options} plugins={[tooltipLine]} />
        </div>
      </div>
    </>
  )
}

export default ChartJSLine;
