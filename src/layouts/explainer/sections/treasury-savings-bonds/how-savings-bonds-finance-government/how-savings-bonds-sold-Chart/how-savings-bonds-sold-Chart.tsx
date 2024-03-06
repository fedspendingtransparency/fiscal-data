import React, { FunctionComponent, useState } from 'react';
import CustomLink from '../../../../../../components/links/custom-link/custom-link';
import ChartContainer from '../../../../explainer-components/chart-container/chart-container';
import { chartStyle  } from '../../purchase-of-savings-bonds/savings-bonds-sold-by-type-chart/savings-bonds-sold-by-type-chart.module.scss';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import CustomTooltip from './chart-tooltip/custom-tooltip'
import ChartTopNotch from './chart-top-notch/chart-top-notch';
import CustomLegend from './chart-legend/custom-legend';
import GlossaryPopoverDefinition from '../../../../../../components/glossary/glossary-term/glossary-popover-definition';
import { calculatePercentage } from '../../../../../../utils/api-utils';

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
  { name: 'Bonds 4', value: 80, security: false, securityType: 'Marketable' },
  { name: 'Bonds 5', value: 211.2, security: false, securityType: 'Marketable' },
  { name: 'Savings Bonds 1', value: 4.4, security: true, securityType: 'Non-Marketable' },
  { name: 'Savings Bonds', value: 2.4, security: true, securityType: 'Non-Marketable' },
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

  const data1WidthPercentage = calculatePercentage(data01);
  const data2WidthPercentage = calculatePercentage(data02);

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
                  activeIndex={6}
                  activeShape={ChartTopNotch}
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
            <CustomLegend onLegendEnter={onLegendEnter} onChartLeave={onChartLeave} primaryColor={color} secondaryColor={color2} />
          </div>
      </ChartContainer>
    </>
  );
};

export default HowSavingsBondsSoldChart;
