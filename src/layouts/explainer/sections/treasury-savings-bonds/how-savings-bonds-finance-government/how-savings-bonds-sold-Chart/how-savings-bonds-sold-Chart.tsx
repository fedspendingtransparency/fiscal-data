import React, { FunctionComponent, useState } from 'react';
import CustomLink from '../../../../../../components/links/custom-link/custom-link';
import ChartContainer from '../../../../explainer-components/chart-container/chart-container';
import { dataHeader, inflationLabel, inflationToggleContainer, chartStyle, infoTipContainer  } from '../../purchase-of-savings-bonds/savings-bonds-sold-by-type-chart/savings-bonds-sold-by-type-chart.module.scss';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer, Tooltip, TooltipProps, LegendProps, Legend } from 'recharts';
import ChartLegend from '../../purchase-of-savings-bonds/savings-bonds-sold-by-type-chart/chart-legend/chart-legend';
// import { data01, data02 } from './how-savings-bonds-sold-Chart-helper'
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


const data01 = [
  { name: 'Group A', value: 391.2, security: false  },
  { name: 'Group B', value: 8.8, security: true  },

];
const data02 = [
  { name: 'B3', value: 5, security: false },
  { name: 'B2', value: 30, security: false },
  { name: 'B1', value: 65, security: false },
  { name: 'A2', value: 100, security: false },
  { name: 'A1', value: 191.2, security: false },
  { name: 'B5', value: 3.8, security: true  },
  { name: 'B4', value: 3, security: true  },
  { name: 'C1', value: 2, security: true  },
];

const color = '#4A0072';
const color2 = '#B04ABD';
const colors = { true: '#4A0072', false: '#B04ABD' };

const HowSavingsBondsSoldChart: FunctionComponent = ({ glossary, glossaryClickHandler }) => {
  const [activeIndex, setActiveIndex] = useState<string | null>(null);
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
    {value: 'Marketable Security', type: 'rect', id: 'secuirtyTrue', color: color},
    {value: 'Non-Marketable Secuirty', type: 'rect', id: 'secuirtyFalse', color: color2}
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

  const onPieEnter = (data: DataItem, index: number, dataset: string) => {
    setActiveIndex(`${dataset}-${index}`);
  }
  const onPieLeave = () => {
    setActiveIndex(null);
  }
  const getOpacity = (dataset: string, index: number) => {
    return activeIndex === `${dataset}-${index}` || activeIndex === null ? 1 : .4;
  }

  return (
    <>
      <ChartContainer title={chartTitle} altText={chartTitle} date={lastUpdated} footer={footer} >
          <div className={chartStyle} data-testid="chartParent">
            <ResponsiveContainer height={485} width="99%">
              <PieChart width={400} height={400} onMouseLeave={onPieLeave}>
                <Pie 
                  data={data01} 
                  dataKey="value" 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={100} 
                  outerRadius={170} 
                  startAngle={-270} 
                  endAngle={90} 
                  onMouseEnter={(data, index) => onPieEnter(data, index, 'data01')}
                >
                  {
                    data01.map((entry, index) => (
                      <Cell key={`cell-data01-${index}`} fill={entry.security ? color2 : color} opacity={getOpacity('data01', index)} />
                    ))
                  }
                </Pie>
                <Pie 
                  data={data02} 
                  dataKey="value" 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={170} 
                  outerRadius={200} 
                  startAngle={-270} 
                  endAngle={90} 
                  onMouseEnter={(data, index) => onPieEnter(data, index, 'data02')}
                >
                  {
                    data02.map((entry, index) => (
                      <Cell key={`cell-data02-${index}`} fill={entry.security ? color2 : color} opacity={getOpacity('data02', index)} />
                    ))
                  }
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend align="center" verticalAlign="bottom" layout="horizontal" payload={customLegend} />
              </PieChart>
            </ResponsiveContainer>
          </div>
      </ChartContainer>
    </>
  );
};

export default HowSavingsBondsSoldChart;


