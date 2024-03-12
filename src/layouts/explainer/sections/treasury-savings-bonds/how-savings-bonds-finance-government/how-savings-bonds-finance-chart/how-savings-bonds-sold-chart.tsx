import React, { FunctionComponent, useState, useEffect } from 'react';
import CustomLink from '../../../../../../components/links/custom-link/custom-link';
import ChartContainer from '../../../../explainer-components/chart-container/chart-container';
import { chartStyle, chartContainer  } from '../../purchase-of-savings-bonds/savings-bonds-sold-by-type-chart/savings-bonds-sold-by-type-chart.module.scss';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import CustomTooltip from './chart-tooltip/custom-tooltip'
import ChartTopNotch from './chart-top-notch/chart-top-notch';
import CustomLegend from './chart-legend/custom-legend';
import { mockDataTwo, chartCopy } from './how-savings-bonds-sold-chart-helper';
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

const HowSavingsBondsSoldChart: FunctionComponent = () => {

  const [activeIndex, setActiveIndex] = useState<string | null>(null);
  const [activeSecurityType, setActiveSecurityType] = useState<string | null>(null);
  const [chartHeight, setChartHeight] = useState<number>(400);
  const [chartWidth, setChartWidth] = useState<number>(400);

  const intragovernmental = (
    <GlossaryPopoverDefinition
      term={'Intragovernmental Holdings'}
      page={'Savings Bond Explainer'}
    >
      intragovernmental
    </GlossaryPopoverDefinition>
  );

  const aggregateData = mockDataTwo.reduce((accumulator, cur) => {
    const key = cur.securityType === 'Marketable' ? 'Marketable' : 'Nonmarketable';
    if (!accumulator[key]) {
      accumulator[key] = { name: key, value: 0, securityType: key };
    }
    accumulator[key].value += cur.value;
    return accumulator;
  }, {});
  

  const consolidateData = mockDataTwo.reduce((accumulator, value) => {
    if(!accumulator[value.name]) {
      accumulator[value.name] = {...value};
    } else {
      accumulator[value.name].value += value.value;
    }
    return accumulator;
  }, {})

  const consolidateDataArray = Object.values(consolidateData)
  const aggregatedDataforPie = Object.values(aggregateData)

  const data1WidthPercentage = calculatePercentage(aggregatedDataforPie);
  const data2WidthPercentage = calculatePercentage(consolidateDataArray);

  const lastUpdated = new Date();
  const footer = (
    <p>
      This chart reflects total debt held by the public, which excludes debt held by the government (known as {intragovernmental}). Visit the {' '}
      <CustomLink url="/americas-finance-guide/national-debt/">National Debt explainer</CustomLink> to learn more about the types of debt or the{' '}
      <CustomLink url="/datasets/monthly-statement-public-debt/summary-of-treasury-securities-outstanding">
        U.S. Treasury Monthly Statement of the Public Debt (MSPD)
      </CustomLink>{' '} to explore and download this data. 
    </p>
  );
  const onLegendEnter = (security: string) => {
    setActiveSecurityType(security);
  };

  const updateChartHeight = () => {
    const screenWidth = window.innerWidth;
    if (screenWidth < 480) {
      setChartHeight(360);
      setChartWidth(335)
    } else if (screenWidth >= 480 && screenWidth < 768) {
      setChartHeight(382);
      setChartWidth(382);
    }else  {
      setChartHeight(400);
      setChartWidth(400);
    }
  }
  useEffect(() => {
    window.addEventListener('resize', updateChartHeight);
    updateChartHeight();
    return () => window.removeEventListener('resize', updateChartHeight);
  }, [])


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
            <div className={chartContainer}>
            <PieChart width={chartWidth} height={chartHeight} onMouseLeave={onPieLeave}>
                <Pie 
                  data={data1WidthPercentage} 
                  dataKey="percent" 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={'40%'} 
                  outerRadius={'74.5%'} 
                  startAngle={-270} 
                  endAngle={90} 
                  onMouseEnter={(data, index) => onPieEnter(data, index, 'data01')}
                >
                  {
                    aggregatedDataforPie.map((entry, index) => (
                      <Cell 
                        key={`cell-data01-${index}`} 
                        fill={entry.securityType === 'Nonmarketable' ? color2 : color} 
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
                  innerRadius={'75%'} 
                  outerRadius={'90%'} 
                  startAngle={-270} 
                  endAngle={90} 
                  onMouseEnter={(data, index) => onPieEnter(data, index, 'data02')}
                >
                  {
                    consolidateDataArray.map((entry, index) => (
                      <Cell 
                        key={`cell-data02-${index}`} 
                        fill={entry.securityType === 'Nonmarketable' ?  color2 : color} 
                        opacity={getOpacity('data02', index, entry)} 
                      />
                    ))
                  }
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </div>
            <CustomLegend onLegendEnter={onLegendEnter} onChartLeave={onChartLeave} primaryColor={color} secondaryColor={color2} />
          </div>
      </ChartContainer>
    </>
  );
};

export default HowSavingsBondsSoldChart;
