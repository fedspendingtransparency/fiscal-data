import React, { FunctionComponent, useState } from 'react';
import CustomLink from '../../../../../../components/links/custom-link/custom-link';
import ChartContainer from '../../../../explainer-components/chart-container/chart-container';
import { dataHeader, inflationLabel, inflationToggleContainer, chartStyle, infoTipContainer  } from '../../purchase-of-savings-bonds/savings-bonds-sold-by-type-chart/savings-bonds-sold-by-type-chart.module.scss';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer, Tooltip, TooltipProps, Legend } from 'recharts';
import ChartLegend from '../../purchase-of-savings-bonds/savings-bonds-sold-by-type-chart/chart-legend/chart-legend';
import { chartCopy , savingsBondsMap, mockData, savingsBonds } from '../../purchase-of-savings-bonds/savings-bonds-sold-by-type-chart/savings-bonds-sold-by-type-chart-helper';
// import CustomTooltip from './custom-tooltip/custom-tooltip';
import { getShortForm } from '../../../../../../utils/rounding-utils';
import GlossaryPopoverDefinition from '../../../../../../components/glossary/glossary-term/glossary-popover-definition';

interface DataItem {
  name: string;
  value: number;
  security: boolean;
}
interface CustomTooltipProps extends TooltipProps<number, string> {
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

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as DataItem; 
    return (
      <div style={{ backgroundColor: '#fff', padding: '5px', border: '1px solid #ccc' }}>
        <p>{data.name}</p>
        <p>{`Value: ${data.value}`}</p>

      </div>
    );
  }

  return null;
};

const color = '#4A0072';
const color2 = '#B04ABD';

const HowSavingsBondsSoldChart: FunctionComponent = ({ glossary, glossaryClickHandler }) => {
  const [selectedChartView, setSelectedChartView] = useState('amounts');
  const chartTitle = `Savings Bonds Sold as a Percentage of Total Debt Held by the Public, as of {Month YYYY (as of date for visualization)} `;

  const intragovernmental = (
    <GlossaryPopoverDefinition
      term={'Intragovernmental Holdings'}
      page={'Savings Bond Explainer'}
      glossary={glossary}
      glossaryClickHandler={glossaryClickHandler}
    >
      intragovernmental
    </GlossaryPopoverDefinition>
  );

  const customLegend = [
    {value: 'Marketable Security', type: 'square', id: 'secuirtyTrue', color: color},
    {value: 'Non-Marketable Secuirty', type: 'square', id: 'secuirtyFalse', color: color2}
  ]

  const lastUpdated = new Date();
  const footer = (
    <p>
      This chart reflects total debt held by the public, which excludes debt held by the government (known as {intragovernmental}). Visit the 
      <CustomLink url="/americas-finance-guide/national-debt/"> National Debt explainer </CustomLink> to learn more about the types of debt or the
      {' '}<CustomLink url="/datasets/monthly-statement-public-debt/summary-of-treasury-securities-outstanding">
      U.S. Treasury Monthly Statement of the Public Debt (MSPD) </CustomLink>{' '} to explore and download this data. 
    </p>
  );


  // const customTolltip = (value: number, name: string, props: any) => {
  //   return [props.payload.name]
    
  // }


  return (
    <>
      <ChartContainer title={chartTitle} altText={chartTitle} date={lastUpdated} footer={footer} >
        {selectedChartView === 'amounts' && (
          <div className={chartStyle} data-testid="chartParent">
            <ResponsiveContainer height={377} width="99%">
              <PieChart width={400} height={400}>
                <Pie data={data01} dataKey="value" cx="50%" cy="50%" innerRadius={90} outerRadius={150} startAngle={-270} endAngle={90}>
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
                <Tooltip content={<CustomTooltip />} />
                <Legend align="center" verticalAlign="bottom" layout="horizontal" payload={customLegend} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </ChartContainer>
    </>
  );
};

export default HowSavingsBondsSoldChart;


