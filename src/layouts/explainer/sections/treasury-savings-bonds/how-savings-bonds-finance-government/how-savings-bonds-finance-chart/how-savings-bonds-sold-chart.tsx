import React, { FunctionComponent, useState, useEffect, KeyboardEvent, useRef } from 'react';
import CustomLink from '../../../../../../components/links/custom-link/custom-link';
import ChartContainer from '../../../../explainer-components/chart-container/chart-container';
import {
  chartStyle,
  chartContainer,
} from '../../purchase-of-savings-bonds/savings-bonds-sold-by-type-chart/savings-bonds-sold-by-type-chart.module.scss';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import CustomTooltip from './chart-tooltip/custom-tooltip';
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
  chartData: ChartDataItem[];
}

const HowSavingsBondsSoldChart: FunctionComponent<HowSavingsBondsSoldChartProps> = ({ chartData }) => {
  const [savingBondsIndex, setSavingBondsIndex] = useState<string | null>(null);
  const [savingBondPercentage, setSavingBondPercentage] = useState<string | null>(null);
  const [nonMarketablePercent, setNonMarketablePercent] = useState<number | null>(null);
  const [animationDone, setAnimationDone] = useState<boolean>(false);
  const [focusedSlice, setFocusedSlice] = useState<number | null>(null);
  const [tooltipData, setTooltipData] = useState<ChartDataItem | null>(null);
  const [tooltipVisible, setTooltipVisible] = useState<boolean>(false);
  const [historyChartDate, setHistoryChartDate] = useState<Date>(new Date());
  const [activeIndex, setActiveIndex] = useState<string | null>(null);
  const [activeSecurityType, setActiveSecurityType] = useState<string | null>(null);
  const [chartHeight, setChartHeight] = useState<number>(400);
  const [chartWidth, setChartWidth] = useState<number>(400);
  const [activeSliceIndex, setActiveSliceIndex] = useState<number | null>(null); // State for active slice animation

  const pieRef = useRef(null); // Reference to the pie chart for event handling
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationDone(true);
    }, 2000);
    return () => clearTimeout(timer);
  });
  useEffect(() => {
    basicFetch(`${apiPrefix}${fyEndpoint}`).then(res => {
      if (res.data) {
        const data = res.data[0];
        setHistoryChartDate(getDateWithoutTimeZoneAdjust(data.record_date));
      }
    });
  }, []);

  const monthYear = historyChartDate ? `${monthFullNames[historyChartDate.getMonth()]} ${historyChartDate.getFullYear()}` : '';

  const intragovernmental = (
    <GlossaryPopoverDefinition term="Intragovernmental Holdings" page="Savings Bond Explainer">
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

    nonMarkPercent = parseFloat(nonMarkPercent.toFixed(1));
  }, [chartData]);

  const aggregateData = chartData.reduce((accumulator, cur) => {
    const key = cur.securityType === 'Marketable' ? 'Marketable' : 'Nonmarketable';
    if (!accumulator[key]) {
      accumulator[key] = { name: key, value: 0, securityType: key };
    }
    accumulator[key].value += cur.value;
    return accumulator;
  }, {});

  const consolidatedData = chartData.reduce((accumulator, value) => {
    if (!accumulator[value.name]) {
      accumulator[value.name] = { ...value };
    } else {
      accumulator[value.name].value += value.value;
    }
    return accumulator;
  }, {});

  const consolidatedDataArray = Object.values(consolidatedData);
  const aggregatedDataforPie = Object.values(aggregateData);

  const data1WidthPercentage = calculatePercentage(aggregatedDataforPie);
  const data2WidthPercentage = calculatePercentage(consolidatedDataArray);

  const savingsBondCallOut = data2WidthPercentage.map((item, index) => {
    if (item.name === 'United States Savings Securities') {
      item.name = 'Savings Bonds';
    }
    return item;
  });

  const footer = (
    <p>
      This chart reflects total debt held by the public, which excludes debt held by the government (known as {intragovernmental}). Visit the{' '}
      <CustomLink url="/americas-finance-guide/national-debt/">National Debt explainer</CustomLink> to learn more about the types of debt or the{' '}
      <CustomLink url="/datasets/monthly-statement-public-debt/summary-of-treasury-securities-outstanding">
        U.S. Treasury Monthly Statement of the Public Debt (MSPD)
      </CustomLink>{' '}
      dataset to explore and download this data.
    </p>
  );

  const chartCopy = {
    title: `Savings Bonds Sold as a Percentage of Total Debt Held by the Public, as of ${monthYear}`,
    altText: `A pie chart showing the percentage of U.S. debt held by the public that is marketable versus non-marketable. As of
    ${monthYear} , non-marketable securities make up ${nonMarketablePercent} percent, and savings bonds make up  ${savingBondPercentage}
    percent of the debt held by the public.`,
  };

  const handleKeyDown = (event: KeyboardEvent<SVGElement>) => {
    const { key } = event;
    if (focusedSlice !== null) {
      let newFocusedSlice = focusedSlice;
      if (key === 'ArrowRight' || key === 'ArrowDown') {
        newFocusedSlice = (focusedSlice + 1) % chartData.length;
      } else if (key === 'ArrowLeft' || key === 'ArrowUp') {
        newFocusedSlice = (focusedSlice - 1 + chartData.length) % chartData.length;
      }
      setFocusedSlice(newFocusedSlice);
      setTooltipData(chartData[newFocusedSlice]);
      setTooltipVisible(true);
      setActiveSliceIndex(newFocusedSlice); // Update active slice for animation
    }
  };

  const handleFocus = (index: number) => {
    setFocusedSlice(index);
    setTooltipData(chartData[index]);
    setTooltipVisible(true);
    setActiveSliceIndex(index); // Update active slice for animation

    // Simulate mouse enter for the focused element
    if (pieRef.current) {
      const event = new MouseEvent('mouseenter', {
        bubbles: true,
        cancelable: true,
      });
      const cells = pieRef.current.querySelectorAll('.recharts-sector');
      if (cells[index]) {
        cells[index].dispatchEvent(event);
      }
    }
  };

  const handleBlur = () => {
    setFocusedSlice(null);
    setTooltipVisible(false);
    setActiveSliceIndex(null); // Clear active slice for animation
  };

  useEffect(() => {
    const handleKeyDownGlobal = (event: KeyboardEvent) => handleKeyDown(event as KeyboardEvent<SVGElement>);
    window.addEventListener('keydown', handleKeyDownGlobal);
    return () => window.removeEventListener('keydown', handleKeyDownGlobal);
  }, [focusedSlice]);

  const getOpacity = (index: number) => (focusedSlice === index ? 0.4 : 1);

  return (
    <>
      <ChartContainer title={chartCopy.title} altText={chartCopy.altText} date={historyChartDate} footer={footer}>
        <div className={chartStyle} data-testid="chartParent">
          <div className={chartContainer} ref={pieRef}>
            <ResponsiveContainer width="100%" height={chartHeight}>
              <PieChart
                width={chartWidth}
                height={chartHeight}
                onMouseLeave={handleBlur}
                role="img"
                aria-labelledby="chart-title"
                tabIndex={0}
                onKeyDown={handleKeyDown}
              >
                <Pie
                  data={data1WidthPercentage}
                  dataKey="percent"
                  cx="50%"
                  cy="50%"
                  innerRadius="40%"
                  outerRadius="74.5%"
                  startAngle={-270}
                  endAngle={90}
                  activeIndex={activeSliceIndex}
                  activeShape={ChartTopNotch}
                  isAnimationActive
                >
                  {aggregatedDataforPie.map((entry, index) => (
                    <Cell
                      key={`cell-data01-${index}`}
                      fill={entry.securityType === 'Nonmarketable' ? color2 : color}
                      opacity={getOpacity(index)}
                      tabIndex={0}
                      aria-label={`${entry.name}: ${entry.percent}%`}
                      onFocus={() => handleFocus(index)}
                      onBlur={handleBlur}
                    />
                  ))}
                </Pie>
                <Pie
                  data={savingsBondCallOut}
                  dataKey="percent"
                  cx="50%"
                  cy="50%"
                  innerRadius="75%"
                  outerRadius="90%"
                  startAngle={-270}
                  endAngle={90}
                  activeIndex={activeSliceIndex}
                  activeShape={ChartTopNotch}
                  isAnimationActive
                >
                  {consolidatedDataArray.map((entry, index) => (
                    <Cell
                      key={`cell-data02-${index}`}
                      fill={entry.securityType === 'Nonmarketable' ? color2 : color}
                      opacity={getOpacity(index)}
                      tabIndex={0}
                      aria-label={`${entry.name}: ${entry.percent}%`}
                      onFocus={() => handleFocus(index)}
                      onBlur={handleBlur}
                    />
                  ))}
                </Pie>
                {tooltipVisible && tooltipData && (
                  <Tooltip
                    content={<CustomTooltip payload={[tooltipData]} />}
                    isAnimationActive={false}
                    position={{ x: chartWidth / 2, y: chartHeight / 2 }}
                  />
                )}
              </PieChart>
            </ResponsiveContainer>
          </div>
          <CustomLegend onLegendEnter={() => {}} onChartLeave={() => {}} primaryColor={color} secondaryColor={color2} />
        </div>
      </ChartContainer>
    </>
  );
};

export default HowSavingsBondsSoldChart;
