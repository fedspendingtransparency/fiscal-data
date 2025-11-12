import React, { ReactElement, useEffect, useState } from 'react';
import { apiPrefix, basicFetch } from '../../../../../utils/api-utils';
import { chartContainer, chartTitle, deficitChart } from '../deficit-chart/deficit-chart.module.scss';
import ChartLegend from '../chart-components/chart-legend';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { trillionAxisFormatter } from '../chart-helper';
import { debtExplainerPrimary, deficitExplainerPrimary } from '../../../../../variables.module.scss';
import CustomTooltip from '../chart-components/custom-tooltip/custom-tooltip';
import { useIsMounted } from '../../../../../utils/useIsMounted';
import { debtEndpointUrl, deficitEndpointUrl, legendItems, tickCountXAxis } from './debt-chart-helper';
import CustomBarShape from './custom-bar-shape/custom-bar-shape';
import LoadingIndicator from '../../../../../components/loading-indicator/loading-indicator';

const AFGDebtChart = (): ReactElement => {
  const isMounted = useIsMounted();
  const [focusedYear, setFocusedYear] = useState<string | number>(null);
  const [currentFY, setCurrentFY] = useState<string>(null);
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

  const generateBar = sortedData => {
    return sortedData.map(yearlyData => {
      const dataYear = yearlyData.year;
      const handleFocus = () => {
        setFocusedYear(yearlyData.year);
        setCustomTooltipData([
          {
            hide: false,
            payload: yearlyData,
          },
        ]);
      };

      return (
        <g tabIndex={0} onFocus={handleFocus} key={`debt-${dataYear}`} data-testid="debtBar">
          <Bar
            dataKey={`debt${dataYear}`}
            stackId="debtBar"
            barSize={16}
            isAnimationActive={false}
            shape={props => <CustomBarShape {...props} focusedYear={focusedYear} handleFocus={handleFocus} />}
          />
        </g>
      );
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
    <figure className={deficitChart} data-testid="AFGDebtChart" role="figure" aria-label={ariaLabel}>
      <div className={chartTitle}>National Debt: Last 5 Years in Trillions of USD</div>
      {isLoading && <LoadingIndicator />}
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
    </figure>
  );
};

export default AFGDebtChart;
