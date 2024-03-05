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


const data01 = [
  { name: 'Marketable Securities', value: 391.2, security: false, securityType: 'Marketable' },
  { name: 'Non-Marketable Securities', value: 8.8, security: true, securityType: 'Non-Marketable' },

];
const data02 = [
  { name: 'Bonds 1', value: 5, security: false, securityType: 'Marketable' },
  { name: 'Bonds 2', value: 30, security: false, securityType: 'Marketable' },
  { name: 'Bonds 3', value: 65, security: false, securityType: 'Marketable' },
  { name: 'Bonds 4', value: 100, security: false, securityType: 'Marketable' },
  { name: 'Bonds 5', value: 191.2, security: false, securityType: 'Marketable' },
  { name: 'Savings Bonds 1', value: 3.8, security: true, securityType: 'Non-Marketable' },
  { name: 'Savings Bonds 2', value: 3, security: true, securityType: 'Non-Marketable' },
  { name: 'Other', value: 2, security: true, securityType: 'Non-Marketable' },
];

const color = '#4A0072';
const color2 = '#B04ABD';


const HowSavingsBondsSoldChart: FunctionComponent = ({ glossary, glossaryClickHandler }) => {
  const [activeIndex, setActiveIndex] = useState<string | null>(null);
  const [activeSecurity, setActiveSecurity] = useState<boolean | null>(null);
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

  const calculatePercentage = (data) => {
    if(!Array.isArray(data)){
      console.error('Invalide data, ',data);
      return[];
    }
    const total = data.reduce((acc, curr) => acc + curr.value, 
    0);
    return data.map(item => ({
      ...item,
      percent: Number(((item.value / total) * 100).toFixed(2))
    }));
  };

  const data1WidthPercentage = calculatePercentage(data01);
  const data2WidthPercentage = calculatePercentage(data02);

  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as DataItem;
      return (
        <div style={{ backgroundColor: '#fff', padding: '12px 16px', border: '1px solid #ccc', display: 'flex' }}>
          <span>
          <div style={{ backgroundColor: color2, width: '18px', height:'18px', marginRight: '8px' }}></div>
          </span>
          <span>
          <div style={{ fontWeight: '600', fontSize: '14px'}}>{data.name}</div>
          <div style={{ fontWeight: '400', fontSize: '12px', fontStyle: 'italic'}}>{`${data.securityType}`}</div>
          <div style={{ fontWeight: '400', fontSize: '14px'}}>{`${data.percent}% of National Debt`}</div> 
          </span>

        </div>
      );
    }
    return null;
  };
  

  const lastUpdated = new Date();
  const footer = (
    <p>
      This chart reflects total debt held by the public, which excludes debt held by the government (known as {intragovernmental}). Visit the 
      <CustomLink url="/americas-finance-guide/national-debt/"> National Debt explainer </CustomLink> to learn more about the types of debt or the
      {' '}<CustomLink url="/datasets/monthly-statement-public-debt/summary-of-treasury-securities-outstanding">
      U.S. Treasury Monthly Statement of the Public Debt (MSPD) </CustomLink>{' '} to explore and download this data. 
    </p>
  );
  const onLegendEnter = (security: boolean) => {
    setActiveSecurity(security);
  };

  const onChartLeave = () => {
    setActiveSecurity(null);
  };

  const CustomLegend = () => (
    <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 20 }}>
      <div role='presentation' onMouseEnter={() => onLegendEnter(true)} onMouseLeave={onChartLeave} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
        <div style={{ backgroundColor: color, width: '24px', height:'18px', marginRight: '8px' }}></div> Marketable Security
      </div>
      <div role='presentation' onMouseEnter={() => onLegendEnter(false)} onMouseLeave={onChartLeave} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
        <div style={{ backgroundColor: color2, width: '24px', height:'18px', marginRight: '8px' }}></div> Non-Marketable Security
      </div>
    </div>
  );

  const onPieEnter = (data: DataItem, index: number, dataset: string) => {
    setActiveIndex(`${dataset}-${index}`);
  }
  const onPieLeave = () => {
    setActiveIndex(null);
  }
  const getOpacity = (dataset: string, index: number, entry: DataItem) => {
    return activeIndex === `${dataset}-${index}` || activeIndex === null ? entry.security === activeSecurity ? .4 : 1 : .4;
  }

  return (
    <>
      <ChartContainer title={chartTitle} altText={chartTitle} date={lastUpdated} footer={footer} >
          <div className={chartStyle} data-testid="chartParent">
            <ResponsiveContainer height={485} width="99%">
              <PieChart width={400} height={400} onMouseLeave={onPieLeave}>
                <Pie 
                  data={data1WidthPercentage} 
                  dataKey="percent" 
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
                      <Cell key={`cell-data01-${index}`} fill={entry.security ? color2 : color} opacity={getOpacity('data01', index, entry)} />
                    ))
                  }
                </Pie>
                <Pie 
                  data={data2WidthPercentage} 
                  dataKey="percent" 
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
                      <Cell key={`cell-data02-${index}`} fill={entry.security ? color2 : color} opacity={getOpacity('data02', index, entry)} />
                    ))
                  }
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <CustomLegend />
          </div>
      </ChartContainer>
    </>
  );
};

export default HowSavingsBondsSoldChart;


