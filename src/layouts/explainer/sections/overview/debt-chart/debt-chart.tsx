import React, { ReactElement, useEffect, useState } from 'react';
import { apiPrefix, basicFetch } from '../../../../../utils/api-utils';
import { chartContainer, chartTitle, deficitChart } from '../deficit-chart/deficit-chart.module.scss';
import { deficitExplainerPrimary } from '../../national-deficit/national-deficit.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import ChartLegend from '../chart-components/chart-legend';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { trillionAxisFormatter } from '../chart-helper';
import { debtExplainerPrimary } from '../../../explainer.module.scss';
import CustomTooltip from '../chart-components/custom-tooltip/custom-tooltip';
import { useIsMounted } from '../../../../../utils/useIsMounted';
import { debtEndpointUrl, deficitEndpointUrl, getOpacity, legendItems, mapBarColors, tickCountXAxis } from './debt-chart-helper';

const AFGDebtChart = (): ReactElement => {
  const isMounted = useIsMounted();
  const [focusedYear, setFocusedYear] = useState(null);
  const [currentFY, setCurrentFY] = useState();
  const [finalChartData, setFinalChartData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [chartFocus, setChartFocus] = useState(false);
  const [customTooltipData, setCustomTooltipData] = useState(null);

  const ariaLabel =
    'A chart demonstrating the total debt as it accumulated to ' +
    currentFY +
    ' over the four prior years. The chart presents the total debt for each year in purple bars divided into $1T tabs, ' +
    'and the deficit for each year as an orange highlight against the yearly purple bars in order to represent the ' +
    'relationship between the two concepts.';

  const CustomBarShape = props => {
    const { height, width, y, x, fill, payload, dataKey, year } = props;
    const barType = dataKey.includes('debt') ? 'debt' : 'deficit';
    const debtVal = props[`debt${year}`];
    const debtRemainder = debtVal % 1;
    const debtIndexRemainder = (debtVal + (1 - debtRemainder)) % 10;
    let countDown = payload[dataKey];

    const splitWidth = (width / countDown).toFixed(1);
    const totalWidth = splitWidth * 10;
    const bar = (1 / 13.3) * totalWidth;
    const gapWidth = 0.3 * bar;
    if (width > 0) {
      let xVal = x;
      if (barType === 'debt') xVal = xVal + gapWidth;
      const firstBar = bar * (1 - debtRemainder);
      const axisGap = debtIndexRemainder % 10 === 0 ? gapWidth : 0;
      const allBars = [];

      if (barType === 'deficit') {
        allBars.push({ x: xVal, width: firstBar });
        xVal = xVal + firstBar + axisGap + gapWidth;
      }
      console.log(year, splitWidth, bar, gapWidth, barType);
      let barCount = barType === 'debt' ? 0 : debtIndexRemainder;
      if (barType !== 'debt') countDown = countDown - (1 - debtRemainder);
      while (countDown >= 1) {
        countDown = countDown - 1;
        if (barType === 'debt') barCount = barCount + 1;
        const debtAxisGap = barCount !== 1 && barCount % 10 === 0 ? gapWidth : 0;
        const deficitAxisGap = barCount % 10 === 0 ? gapWidth : 0;
        const axisGap = barType === 'debt' ? debtAxisGap : deficitAxisGap;
        if (barType === 'deficit') barCount = barCount + 1;
        allBars.push({ x: xVal, width: bar });
        xVal = xVal + bar + gapWidth + axisGap;
      }
      allBars.push({ x: xVal, width: bar * countDown });

      return (
        <>
          {allBars.map(val => (
            <rect
              {...props}
              y={y}
              height={height}
              width={val.width}
              x={val.x}
              strokeWidth={0}
              fill={fill}
              fillOpacity={1}
              opacity={getOpacity(focusedYear, year)}
            />
          ))}
        </>
      );
    }
  };

  // const CustomDeficitBarShape = props => {
  //   const { height, width, y, fill, payload, x, dataKey, year } = props;
  //   const debtVal = props[`debt${year}`];
  //   const debtRemainder = debtVal % 1;
  //   let countDown = payload[dataKey];
  //
  //   const splitWidth = (width / countDown).toFixed(1);
  //   const totalWidth = splitWidth * 10;
  //   const bar = (1 / 13.3) * totalWidth;
  //   const gapWidth = 0.3 * bar;
  //   if (width > 0) {
  //     let xVal = x;
  //     // const barWidth = Number(((width - gap * 2) / debtVal - gap).toFixed(1));
  //     const allBars = [];
  //     const firstBar = bar * (1 - debtRemainder);
  //     const debtIndexRemainder = (debtVal + (1 - debtRemainder)) % 10;
  //     allBars.push({ x: xVal, width: firstBar });
  //     let barCount = debtIndexRemainder;
  //     const axisGap = barCount % 10 === 0 ? gapWidth : 0;
  //
  //     xVal = xVal + firstBar + gapWidth + axisGap;
  //
  //     countDown = countDown - (1 - debtRemainder);
  //     while (countDown >= 1) {
  //       countDown = countDown - 1;
  //       const axisGap = barCount % 10 === 0 ? gapWidth : 0;
  //       barCount = barCount + 1;
  //       allBars.push({ x: xVal, width: bar });
  //       xVal = xVal + bar + gapWidth + axisGap;
  //     }
  //
  //     allBars.push({ x: xVal, width: bar * countDown });
  //     return (
  //       <>
  //         {allBars.map(val => (
  //           <rect
  //             {...props}
  //             y={y}
  //             height={height}
  //             width={val.width}
  //             x={val.x}
  //             strokeWidth={0}
  //             fill={fill}
  //             fillOpacity={1}
  //             opacity={getOpacity(focusedYear, year)}
  //           />
  //         ))}
  //       </>
  //     );
  //   }
  // };

  const generateBar = sortedData => {
    return sortedData.map(yearlyData => {
      const dataYear = yearlyData.year;
      const opacity = focusedYear === dataYear || focusedYear === null ? 1 : 0.5;
      const chartData = Object.keys(yearlyData).filter(propName => {
        return propName !== 'year' && propName !== 'tooltip';
      });
      const length = chartData.length - 1;
      return chartData.map((valueName, index) => {
        const barName = valueName === 'debt' ? `Debt` : valueName === 'deficit' ? `Deficit` : '';
        return (
          <Bar
            key={`${barName}-${index}`}
            dataKey={valueName}
            stackId="debtBar"
            fill={mapBarColors(valueName)}
            fillOpacity={opacity}
            strokeWidth={0}
            name={barName}
            barSize={16}
            shape={<CustomBarShape />}
            tabIndex={0}
            // onFocus={() => {
            //   setFocusedYear(yearlyData.year);
            //   setCustomTooltipData([
            //     {
            //       dataKey: valueName,
            //       hide: false,
            //       name: valueName,
            //       payload: yearlyData,
            //     },
            //   ]);
            // }}
          />
        );
      });
    });
  };

  const getChartData = async () => {
    const chart_data = [];
    let curFY;
    await basicFetch(`${apiPrefix}${deficitEndpointUrl}`).then(async deficitRes => {
      if (deficitRes) {
        curFY = deficitRes.data[0].record_fiscal_year;
        if (isMounted.current) setCurrentFY(curFY);
        await basicFetch(`${apiPrefix}${debtEndpointUrl}`)?.then(async debtRes => {
          if (debtRes) {
            const debtData = debtRes.data;
            const deficitData = deficitRes.data;
            const fytdDeficitData = deficitData.filter(x => x.record_fiscal_year === curFY)[0];
            const latestMonth = fytdDeficitData.record_calendar_month;
            const fytdDebtData = debtData.filter(x => x.record_fiscal_year === curFY && x.record_calendar_month === latestMonth)[0];
            const yearlyDebtData = [
              fytdDebtData,
              ...debtData.filter(x => x.record_calendar_month === '09' && x.record_fiscal_year >= curFY - 4 && x.record_fiscal_year < curFY),
            ];
            const yearlyDeficitData = [
              fytdDeficitData,
              ...deficitData.filter(x => x.record_calendar_month === '09' && x.record_fiscal_year >= curFY - 4 && x.record_fiscal_year < curFY),
            ];
            yearlyDebtData.forEach(year => {
              const deficitVal = Math.abs(
                yearlyDeficitData.filter(x => x.record_fiscal_year === year.record_fiscal_year)[0].current_fytd_net_outly_amt
              );
              const debtVal = year.total_mil_amt * 1000000 - deficitVal;
              const bars = {};
              bars[`tooltip`] = [
                { title: 'Debt', value: debtVal, color: debtExplainerPrimary },
                { title: 'Deficit', value: deficitVal, color: deficitExplainerPrimary },
                { title: 'Total Debt', value: year.total_mil_amt * 1000000 },
              ];
              bars[`debt${year.record_fiscal_year}`] = debtVal / 1e12;
              bars[`deficit${year.record_fiscal_year}`] = deficitVal / 1e12;
              bars['year'] = year.record_fiscal_year;
              chart_data.push(bars);
            });
          }
        });
      }
    });
    return chart_data;
  };

  useEffect(() => {
    if (!finalChartData) {
      getChartData().then(res => {
        if (isMounted.current) setFinalChartData(res);
        if (isMounted.current) setLoading(false);
      });
    }
  }, []);

  return (
    <div className={deficitChart} data-testid="AFGDebtChart" role="figure" aria-label={ariaLabel}>
      <div className={chartTitle}>National Debt: Last 5 Years in Trillions of USD</div>
      {isLoading && (
        <div>
          <FontAwesomeIcon icon={faSpinner as IconProp} spin pulse /> Loading...
        </div>
      )}
      {!isLoading && (
        <>
          <ChartLegend legendItems={legendItems} mobileDotSpacing={false} />
          <div
            className={chartContainer}
            data-testid="chartContainer"
            onMouseEnter={() => setChartFocus(true)}
            onMouseLeave={() => {
              setFocusedYear(null);
              setChartFocus(false);
              setCustomTooltipData(null);
            }}
            onFocus={() => setChartFocus(true)}
            onBlur={() => {
              setFocusedYear(null);
              setChartFocus(false);
              setCustomTooltipData(null);
            }}
            role="presentation"
          >
            <ResponsiveContainer height={164} width="99%">
              <BarChart
                data={finalChartData}
                layout="vertical"
                margin={{
                  top: 6,
                  right: 14,
                  bottom: 0,
                  left: -18,
                }}
              >
                <CartesianGrid horizontal={false} />
                <XAxis
                  tickMargin={6}
                  type="number"
                  tickFormatter={(value, index) => trillionAxisFormatter(value, index, tickCountXAxis)}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                  tickCount={tickCountXAxis}
                  ticks={[0, 10, 20, 30, 40]}
                />
                <YAxis
                  dataKey="year"
                  type="category"
                  allowDuplicatedCategory={false}
                  axisLine={false}
                  tickLine={false}
                  tickCount={5}
                  tickMargin={8}
                />
                {generateBar(finalChartData)}
                <Tooltip
                  wrapperStyle={{ visibility: 'visible' }}
                  content={<CustomTooltip setFocused={setFocusedYear} labelByYear curFY={currentFY} customData={customTooltipData} />}
                  cursor={{ fillOpacity: 0 }}
                  shared={false}
                  isAnimationActive={false}
                  active={chartFocus}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default AFGDebtChart;
