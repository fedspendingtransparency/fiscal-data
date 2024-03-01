// import React, { FunctionComponent } from 'react';
// import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';
// import ChartContainer from '../../../../explainer-components/chart-container/chart-container';
// import { chartCopy } from './how-savings-bonds-sold-Chart-helper';
// import CustomLink from '../../../../../../components/links/custom-link/custom-link';
// import { Chart } from 'react-chartjs-2';



// const HowSavingsBondsSoldChart: FunctionComponent = () => {



//   return (
//     <>
//       <ChartContainer>

//       </ChartContainer>
//           <div  data-testid="chartParent">
//             <ResponsiveContainer height={377} width="99%">
//               <PieChart width={400} height={400}>
//                 <Pie data={data01} dataKey="value" cx="50%" cy="50%" innerRadius={30} outerRadius={70} fill="#8884d8" />
//                 <Pie data={data02} dataKey="value" cx="50%" cy="50%" innerRadius={70} outerRadius={90} fill="#82ca9d" label />
//               </PieChart>
//             </ResponsiveContainer>
//             {/* <ChartLegend lines={savingsBonds} lineMap={savingsBondsMap} setHiddenFields={setHiddenFields} hiddenFields={hiddenFields} /> */}
//           </div>
//       </ChartContainer>
//     </>
//   );
// }

// export default HowSavingsBondsSoldChart;


import React, { FunctionComponent, useState } from 'react';
import CustomLink from '../../../../../../components/links/custom-link/custom-link';
import ChartContainer from '../../../../explainer-components/chart-container/chart-container';
import { dataHeader, inflationLabel, inflationToggleContainer, chartStyle, infoTipContainer  } from '../../purchase-of-savings-bonds/savings-bonds-sold-by-type-chart/savings-bonds-sold-by-type-chart.module.scss';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import ChartLegend from '../../purchase-of-savings-bonds/savings-bonds-sold-by-type-chart/chart-legend/chart-legend';
import { chartCopy , savingsBondsMap, mockData, savingsBonds } from '../../purchase-of-savings-bonds/savings-bonds-sold-by-type-chart/savings-bonds-sold-by-type-chart-helper';
// import CustomTooltip from './custom-tooltip/custom-tooltip';
import CustomTooltip from '../../purchase-of-savings-bonds/savings-bonds-sold-by-type-chart/custom-tooltip/custom-tooltip';
import { getShortForm } from '../../../../../../utils/rounding-utils';

interface DataItem {
  name: string;
  value: number;
  security: boolean;
}
const data01: DataItem[] = [
  { name: 'Group A', value: 400, security: false  },
  { name: 'Group B', value: 24, security: true  },

];
const data02: DataItem[] = [
  { name: 'A1', value: 160, security: false },
  { name: 'A2', value: 300, security: false },
  { name: 'B1', value: 160, security: false },
  { name: 'B2', value: 180, security: false },
  { name: 'B3', value: 160, security: false },
  { name: 'B4', value: 10, security: true  },
  { name: 'B5', value: 10, security: true  },
  { name: 'C1', value: 8, security: true  },
  { name: 'C2', value: 15,security: true  },
  { name: 'D1', value: 15, security: true },
];
const color = '#4A0072';
const color2 = '#B04ABD';

const HowSavingsBondsSoldChart: FunctionComponent = () => {
  const [selectedChartView, setSelectedChartView] = useState('amounts');

  const lastUpdated = new Date();
  const footer = (
    <p>
      Visit the <CustomLink url="/datasets/securities-issued-in-treasurydirect/sales">Securities Issued in TreasuryDirect</CustomLink> dataset for
      data since 2001 and the{' '}
      <CustomLink url="https://www.treasurydirect.gov/research-center/history-of-savings-bond/savings-bond-sales/">
        Historical Savings Bonds Sales by Type
      </CustomLink>{' '}
      for data before 2001 to explore this data.
    </p>
  );


  const sortedByDate = (savingsBonds, data) => {
    const sorted = [];
    data.forEach(year => {
      savingsBonds.forEach(bondType => {
        if (!!year[bondType] && !sorted.includes(bondType)) {
          sorted.push(bondType);
        }
      });
    });
    return sorted;
  };

  const customTolltip = (value: number, name: string, props: any) => {
    
  }


  return (
    <>
      <ChartContainer title={chartCopy.title} altText={chartCopy.altText} date={lastUpdated} footer={footer} >
        {selectedChartView === 'amounts' && (
          <div className={chartStyle} data-testid="chartParent">
            <ResponsiveContainer height={377} width="99%">
              <PieChart width={400} height={400}>
                <Pie data={data01} dataKey="value" cx="50%" cy="50%" innerRadius={100} outerRadius={150} startAngle={-270} endAngle={90}>
                  {
                    data01.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.security ? color2 : color} />
                    ))
                  }
                </Pie>
                <Pie data={data02} dataKey="value" cx="50%" cy="50%" innerRadius={150} outerRadius={180} startAngle={-270} endAngle={90}>
                  {
                    data02.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.security ? color2 : color} />
                    ))
                  }
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </ChartContainer>
    </>
  );
};

export default HowSavingsBondsSoldChart;


