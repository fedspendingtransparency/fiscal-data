import React, { FunctionComponent, useState, useEffect } from 'react';
import CustomLink from '../../../../../../components/links/custom-link/custom-link';
import ChartContainer from '../../../../explainer-components/chart-container/chart-container';
import { chartStyle  } from '../../purchase-of-savings-bonds/savings-bonds-sold-by-type-chart/savings-bonds-sold-by-type-chart.module.scss';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import CustomTooltip from './chart-tooltip/custom-tooltip'
import ChartTopNotch from './chart-top-notch/chart-top-notch';
import CustomLegend from './chart-legend/custom-legend';
import { fyEndpoint } from './how-savings-bonds-sold-chart-helper';
import GlossaryPopoverDefinition from '../../../../../../components/glossary/glossary-term/glossary-popover-definition';
import { calculatePercentage } from '../../../../../../utils/api-utils';
import { basicFetch, apiPrefix } from '../../../../../../utils/api-utils';
import { getDateWithoutTimeZoneAdjust } from '../../../../../../utils/date-utils';
import { monthFullNames } from '../../../../../../utils/api-utils';

interface ChartDataItem {
  name: string;
  value: number;
  percent: number;
  securityType: string;
}

const color = '#4A0072';
const color2 = '#B04ABD';

interface HowSavingsBondsSoldChartProps {
  glossary: any; 
  glossaryClickHandler: (term: string) => void;
  chartData: ChartDataItem[];
}


const HowSavingsBondsSoldChart: FunctionComponent<HowSavingsBondsSoldChartProps> = ({
  glossary,
  glossaryClickHandler,
  chartData,
}) => {

  const [activeIndex, setActiveIndex] = useState<string | null>(null);
  const [activeSecurityType, setActiveSecurityType] = useState<string | null>(null);
  const [savingBondsIndex, setSavingBondsIndex] = useState<string | null>(null);
  const [savingBondPercentage, setSavingBondPercentage] = useState<string | null>(null);
  const [nonMarketablePercent, setNonMarketablePercent] = useState<number | null>(null);
  const [animationDone, setAnimationDone] = useState<boolean>(false);
  const [historyChartDate, setHistoryChartDate] = useState<Date>(new Date());

useEffect(() => {
  const timer = setTimeout(() => {
    setAnimationDone(true);
  },2000)
  return () => clearTimeout(timer);
},);

useEffect(() => {
  basicFetch(`${apiPrefix}${fyEndpoint}`).then(res => {
    if (res.data) {
      const data = res.data[0];
      setHistoryChartDate(getDateWithoutTimeZoneAdjust(data.record_date));
    }
  });
}, []);

  const monthYear = historyChartDate ? `${monthFullNames[historyChartDate.getMonth()]} ${historyChartDate.getFullYear()}` : ""
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
  useEffect(() => {
    let nonMarkPercent = 0;
  
    chartData.forEach(item => {
      if (item.securityType === 'Nonmarketable') {
        nonMarkPercent += item.percent;
      }
      setNonMarketablePercent(parseFloat(nonMarkPercent.toFixed(1)));
    });


  }, [chartData, monthYear]);
  
  const aggregateData = chartData.reduce((accumulator, cur) => {
    const key = cur.securityType === 'Marketable' ? 'Marketable' : 'Nonmarketable';
    if (!accumulator[key]) {
      accumulator[key] = { name: key, value: 0, securityType: key };
    }
    accumulator[key].value += cur.value;
    return accumulator;
  }, {});

  const consolidateData = chartData.reduce((accumulator, value) => {
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

  const savingsBondCallOut = data2WidthPercentage.map((item, index) => {
    if (item.name === 'United States Savings Securities'){
      item.name = 'Savings Bonds';
      if (savingBondsIndex === null){
        setSavingBondsIndex(`data02-${index}`);
        setSavingBondPercentage(item.percent);
      }
    }    
    return item;
  });
  const actualActiveIndex = savingBondsIndex && savingBondsIndex.startsWith('data02') ? parseInt(savingBondsIndex.split('-')[1], 10) : undefined;

  const footer = (
    <p>
      This chart reflects total debt held by the public, which excludes debt held by the government (known as {intragovernmental}). Visit the 
      {' '}<CustomLink url="/americas-finance-guide/national-debt/">National Debt explainer</CustomLink> to learn more about the types of debt or the
      {' '}<CustomLink url="/datasets/monthly-statement-public-debt/summary-of-treasury-securities-outstanding">
      U.S. Treasury Monthly Statement of the Public Debt (MSPD)</CustomLink>{' '} to explore and download this data. 
    </p>
  );

  const chartCopy = {
  title: `Savings Bonds Sold as a Percentage of Total Debt Held by the Public, as of ${monthYear}` ,
  altText:
     `A pie chart showing the percentage of U.S. debt held by the public that is marketable versus non-marketable. As of  
    ${monthYear} , non-marketable securities make up ${nonMarketablePercent} percent, and savings bonds make up  ${savingBondPercentage} 
    percent of the debt held by the public.`,
};
  const onLegendEnter = (security: string) => {
    setActiveSecurityType(security);
  };

  const onChartLeave = () => {
    setActiveSecurityType(null);
  };

  const onPieEnter = (data: ChartDataItem, index: number, dataset: string) => {
    setActiveIndex(`${dataset}-${index}`);
  }
  const onPieLeave = () => {
    setActiveIndex(null);
  }
  const getOpacity = (dataset: string, index: number, entry: ChartDataItem) => {
    const isActiveType = entry.securityType === activeSecurityType;
    return activeIndex === `${dataset}-${index}` || activeIndex === null ? isActiveType ? .4 : 1 : .4;
  }

  return (
    <>
      <ChartContainer title={chartCopy.title} altText={chartCopy.altText} date={historyChartDate} footer={footer} >
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
                        fill={entry.securityType === 'Nonmarketable' ? color2 : color} 
                        opacity={getOpacity('data01', index, entry)} 
                      />
                    ))
                  }
                </Pie>
                <Pie 
                  activeIndex={actualActiveIndex}
                  activeShape={animationDone ? ChartTopNotch : null}
                  data={savingsBondCallOut} 
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
            </ResponsiveContainer>
            <CustomLegend onLegendEnter={onLegendEnter} onChartLeave={onChartLeave} primaryColor={color} secondaryColor={color2} />
          </div>
      </ChartContainer>
    </>
  );
};

export default HowSavingsBondsSoldChart;
