import React, { FunctionComponent, useState } from 'react';
import CustomLink from '../../../../../../components/links/custom-link/custom-link';
import ChartContainer from '../../../../explainer-components/chart-container/chart-container';
import { chartStyle  } from '../../purchase-of-savings-bonds/savings-bonds-sold-by-type-chart/savings-bonds-sold-by-type-chart.module.scss';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import CustomTooltip from './chart-tooltip/custom-tooltip'
import ChartTopNotch from './chart-top-notch/chart-top-notch';
import CustomLegend from './chart-legend/custom-legend';
import { chartCopy} from './how-savings-bonds-sold-chart-helper';
import GlossaryPopoverDefinition from '../../../../../../components/glossary/glossary-term/glossary-popover-definition';
import { calculatePercentage } from '../../../../../../utils/api-utils';

interface DataItem {
  name: string;
  value: number;
  security: boolean;
  securityType: string;
}

const color = '#4A0072';
const color2 = '#B04ABD';

const mockDataTwo = [
  { name: 'Bonds 1', value: 2.5, securityType: 'Marketable' },
  { name: 'Bonds 1', value: 2.5, securityType: 'Marketable' },
  { name: 'Bonds 2', value: 30, securityType: 'Marketable' },
  { name: 'Bonds 3', value: 65, securityType: 'Marketable' },
  { name: 'Bonds 4', value: 80, securityType: 'Marketable' },
  { name: 'Bonds 5', value: 211.2, securityType: 'Marketable' },
  { name: 'Savings Bonds 1', value: 4.4, securityType: 'Nonmarketable' },
  { name: 'Savings Bonds', value: 2.4,  securityType: 'Nonmarketable' },
  { name: 'Other', value: 2,  securityType: 'Nonmarketable' },
];


interface HowSavingsBondsSoldChartProps {
  glossary: any; 
  glossaryClickHandler: (term: string) => void;
}

const HowSavingsBondsSoldChart: FunctionComponent<HowSavingsBondsSoldChartProps> = ({
  glossary,
  glossaryClickHandler,
}) => {

  const [activeIndex, setActiveIndex] = useState<string | null>(null);
  const [activeSecurity, setActiveSecurity] = useState<boolean | null>(null);
  const [activeSecurityType, setActiveSecurityType] = useState<string | null>(null);

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

  const aggregateData = mockDataTwo.reduce((acc, cur) => {
    const type = cur.securityType === 'Nonmarketable' ? 'Non-Marketable' : 'Marketable';
    if (!acc[type]) acc[type] = { value: 0, securityType: type };
    acc[type].value += cur.value;
    return acc;
  }, {});


  const aggregatedDataforPie = Object.values(aggregateData)

  const data1WidthPercentage = calculatePercentage(aggregatedDataforPie);
  const data2WidthPercentage = calculatePercentage(mockDataTwo);

  const lastUpdated = new Date();
  const footer = (
    <p>
      This chart reflects total debt held by the public, which excludes debt held by the government (known as {intragovernmental}). Visit the 
      <CustomLink url="/americas-finance-guide/national-debt/"> National Debt explainer </CustomLink> to learn more about the types of debt or the
      {' '}<CustomLink url="/datasets/monthly-statement-public-debt/summary-of-treasury-securities-outstanding">
      U.S. Treasury Monthly Statement of the Public Debt (MSPD) </CustomLink>{' '} to explore and download this data. 
    </p>
  );
  const onLegendEnter = (security: string) => {
    setActiveSecurityType(security);
  };

  const onChartLeave = () => {
    setActiveSecurityType(null);
  };

  const onPieEnter = (data: DataItem, index: number, dataset: string) => {
    setActiveIndex(`${dataset}-${index}`);
  }
  const onPieLeave = () => {
    setActiveIndex(null);
  }
  const getOpacity = (dataset: string, index: number, entry: DataItem) => {
    const isActiveType = entry.securityType === activeSecurityType;
    return activeIndex === `${dataset}-${index}` || activeIndex === null ? isActiveType ? .4 : 1 : .4;
  }

  return (
    <>
      <ChartContainer title={chartCopy.title} altText={chartCopy.altText} date={lastUpdated} footer={footer} >
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
                    aggregatedDataforPie.map((entry, index) => (
                      <Cell 
                        key={`cell-data01-${index}`} 
                        fill={entry.securityType === 'Non-Marketable' ? color2 : color} 
                        opacity={getOpacity('data01', index, entry)} 
                      />
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
                  innerRadius={171} 
                  outerRadius={200} 
                  startAngle={-270} 
                  endAngle={90} 
                  onMouseEnter={(data, index) => onPieEnter(data, index, 'data02')}
                >
                  {
                    mockDataTwo.map((entry, index) => (
                      <Cell 
                        key={`cell-data02-${index}`} 
                        fill={entry.securityType === 'Nonmarketable' ? color2 : color} 
                        opacity={getOpacity('data02', index, entry)} 
                      />
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
