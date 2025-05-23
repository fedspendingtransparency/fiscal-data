import React, { ReactElement, useEffect, useState } from 'react';
import { apiPrefix, basicFetch } from '../../../../../utils/api-utils';
import { chartContainer, chartTitle, deficitChart } from '../deficit-chart/deficit-chart.module.scss';
import { deficitExplainerPrimary } from '../../national-deficit/national-deficit.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import ChartLegend from '../chart-components/chart-legend';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { trillionAxisFormatter } from '../chart-helper';
import { debtExplainerPrimary } from '../../../explainer.module.scss';
import CustomTooltip from '../chart-components/custom-tooltip/custom-tooltip';
import { useIsMounted } from '../../../../../utils/useIsMounted';

const AFGDebtChart = (): ReactElement => {
  const isMounted = useIsMounted();
  const [focusedYear, setFocusedYear] = useState(null);
  const [currentFY, setCurrentFY] = useState();
  const [finalChartData, setFinalChartData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [chartFocus, setChartFocus] = useState(false);
  const [customTooltipData, setCustomTooltipData] = useState(null);

  const debtEndpointUrl = '/v1/debt/mspd/mspd_table_1?filter=security_type_desc:eq:Total%20Public%20Debt%20Outstanding&sort=-record_date';
  const deficitEndpointUrl = '/v1/accounting/mts/mts_table_5?filter=line_code_nbr:eq:5694&sort=-record_date';
  const tickCountXAxis = 5;

  const legendItems = [
    { title: 'Debt', color: debtExplainerPrimary },
    { title: 'Deficit', color: deficitExplainerPrimary },
    { title: '= $1T', color: '#666666', shape: 'rectangle' },
  ];

  const ariaLabel =
    'A chart demonstrating the total debt as it accumulated to ' +
    currentFY +
    ' over the four prior years. The chart presents the total debt for each year in purple bars divided into $1T tabs, ' +
    'and the deficit for each year as an orange highlight against the yearly purple bars in order to represent the ' +
    'relationship between the two concepts.';
  const mapBarColors = barType => {
    if (barType.includes('debt')) {
      return debtExplainerPrimary;
    } else if (barType.includes('none')) {
      return '#00000000';
    } else if (barType.includes('deficit')) {
      return deficitExplainerPrimary;
    }
  };

  const generateBar = sortedData => {
    return sortedData.map(yearlyData => {
      const dataYear = yearlyData.year;
      const opacity = focusedYear === dataYear || focusedYear === null ? 1 : 0.5;
      const length =
        Object.keys(yearlyData).filter(propName => {
          return propName !== 'year' && propName !== 'tooltip';
        }).length - 1;
      return Object.keys(yearlyData)
        .filter(propName => {
          return propName !== 'year' && propName !== 'tooltip';
        })
        .map((valueName, index) => {
          const barName = valueName === 'debt' ? `Debt` : valueName === 'deficit' ? `Deficit` : '';
          if (index === length) {
            return (
              <Bar
                dataKey={valueName}
                stackId="debtBar"
                fill={mapBarColors(valueName)}
                fillOpacity={opacity}
                strokeWidth={0}
                name={barName}
                barSize={16}
                tabIndex={0}
                style={{
                  outline: 'none',
                }}
                onFocus={() => {
                  setFocusedYear(yearlyData.year);
                  setCustomTooltipData([
                    {
                      dataKey: valueName,
                      hide: false,
                      name: valueName,
                      payload: yearlyData,
                    },
                  ]);
                }}
              />
            );
          }
          return (
            <Bar
              dataKey={valueName}
              stackId="debtBar"
              fill={mapBarColors(valueName)}
              fillOpacity={opacity}
              strokeWidth={0}
              name={barName}
              barSize={16}
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
            const barSize = 0.75;
            const barGap = 0.225;
            const yearlyDebtData = [
              fytdDebtData,
              ...debtData.filter(x => x.record_calendar_month === '09' && x.record_fiscal_year >= curFY - 4 && x.record_fiscal_year < curFY),
            ];
            const yearlyDeficitData = [
              fytdDeficitData,
              ...deficitData.filter(x => x.record_calendar_month === '09' && x.record_fiscal_year >= curFY - 4 && x.record_fiscal_year < curFY),
            ];
            yearlyDebtData.forEach(year => {
              let deficitVal = Math.abs(
                yearlyDeficitData.filter(x => x.record_fiscal_year === year.record_fiscal_year)[0].current_fytd_net_outly_amt
              );
              let debtVal = year.total_mil_amt * 1000000 - deficitVal;
              const bars = {};
              bars[`tooltip`] = [
                { title: 'Debt', value: debtVal, color: debtExplainerPrimary },
                { title: 'Deficit', value: deficitVal, color: deficitExplainerPrimary },
                { title: 'Total Debt', value: year.total_mil_amt * 1000000 },
              ];
              let index = 0;
              while (debtVal > 1e12) {
                bars[`none${year.record_fiscal_year}${index}`] = index % 10 === 0 && index !== 0 ? barGap * 2 : barGap;
                bars[`debt${year.record_fiscal_year}${index}`] = barSize;
                debtVal -= 1e12;
                index++;
              }
              const remainingDebt = debtVal / 1e12;
              const startingDeficit = (1e12 - debtVal) / 1e12;
              bars[`none${year.record_fiscal_year}${index}`] = index % 10 === 0 ? barGap * 2 : barGap;
              bars[`debt${year.record_fiscal_year}${index}`] = remainingDebt * barSize;
              index++;
              bars[`deficit${year.record_fiscal_year}${index}`] = startingDeficit * barSize;
              bars[`none${year.record_fiscal_year}${index}`] = index % 10 === 0 ? barGap * 2 : barGap;
              deficitVal = deficitVal - startingDeficit * 1e12;
              index++;
              while (deficitVal > 1e12) {
                bars[`deficit${year.record_fiscal_year}${index}`] = barSize;
                bars[`none${year.record_fiscal_year}${index}`] = index % 10 === 0 ? barGap * 2 : barGap;
                deficitVal -= 1e12;
                index++;
              }
              bars[`deficit${year.record_fiscal_year}${index}`] = (deficitVal / 1e12) * barSize;

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
