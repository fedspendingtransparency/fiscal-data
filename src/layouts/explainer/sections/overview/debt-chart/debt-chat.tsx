import React, { ReactElement, useEffect, useState } from 'react';
import { apiPrefix, basicFetch } from '../../../../../utils/api-utils';
import { spendingExplainerPrimary } from '../../federal-spending/federal-spending.module.scss';
import { revenueExplainerPrimary } from '../../government-revenue/revenue.module.scss';
import { chartContainer, chartTitle, deficitChart, surplusPrimary } from '../deficit-chart/deficit-chart.module.scss';
import { deficitExplainerPrimary } from '../../national-deficit/national-deficit.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import ChartLegend from '../chart-components/chart-legend';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { trillionAxisFormatter } from '../chart-helper';
import CustomDotNoAnimation from '../deficit-chart/custom-dot/custom-dot';
import CustomTooltip from '../deficit-chart/custom-tooltip/custom-tooltip';
import { debtExplainerPrimary } from '../../../explainer.module.scss';
import { rectangle } from '../../national-debt/growing-national-debt/debt-accordion/visualizing-the-debt-accordion.module.scss';

const AFGDebtChart = (): ReactElement => {
  const [focusedYear, setFocusedYear] = useState(null);
  const [currentFY, setCurrentFY] = useState();
  const [finalChartData, setFinalChartData] = useState(null);
  // const [legendItems, setLegendItems] = useState(null);
  const [isLoading, setLoading] = useState(true);

  const debtEndpointUrl = '/v1/debt/mspd/mspd_table_1?filter=security_type_desc:eq:Total%20Public%20Debt%20Outstanding&sort=-record_date';
  const currentFYEndpointUrl = '/v1/accounting/mts/mts_table_5?filter=line_code_nbr:eq:5694&sort=-record_date';
  const tickCountXAxis = 5;

  const legendItems = [
    { title: 'Debt', color: debtExplainerPrimary },
    { title: 'Deficit', color: deficitExplainerPrimary },
    { title: '= $1T', color: '#666666', shape: 'rectangle' },
  ];

  const ariaLabel =
    'A chart demonstrating the yearly deficit or surplus caused by gaps between revenue and spending. ' +
    'Spending and revenue are represented on the graph as two different colored dots corresponding to the total in trillions of ' +
    'USD for each respective category. The deficit/surplus is then represented as a line connecting the two dots, exhibiting how ' +
    'the deficit/surplus is calculated as the difference between revenue and spending. ';
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
    console.log(sortedData);
    return sortedData.map((dataObj, i) =>
      Object.keys(dataObj)
        .filter(propName => {
          return propName !== 'year';
        })
        .map(valueName => {
          return (
            <Bar
              dataKey={valueName}
              stackId="a"
              fill={mapBarColors(valueName)}
              strokeWidth={0}
              name={valueName === 'debt' ? `Debt` : valueName === 'deficit' ? `Deficit` : ''}
              barSize={16}
            />
          );
        })
    );
  };

  const getChartData = async () => {
    const chart_data = [];
    let curFY;
    await basicFetch(`${apiPrefix}${currentFYEndpointUrl}`).then(async result => {
      if (result) {
        console.log(result);
        curFY = result.data[0].record_fiscal_year;
        setCurrentFY(curFY);
        await basicFetch(`${apiPrefix}${debtEndpointUrl}`)?.then(async res => {
          if (res) {
            console.log(res);
            const data = res.data;
            const fytdData = data.filter(x => x.record_fiscal_year === curFY)[0];
            //todo find programmatic way to calculate values
            const barSize = 0.75;
            const barGap = 0.225;
            const yearlyData = [
              fytdData,
              ...data.filter(x => x.record_calendar_month === '09' && x.record_fiscal_year >= curFY - 4 && x.record_fiscal_year < curFY),
            ];
            yearlyData.forEach(year => {
              let debtVal = year.total_mil_amt * 1000000;
              const bars = {};
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
              let deficitVal = 2.2 * 1e12;
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
        setFinalChartData(res);
        setLoading(false);
      });
    }
  }, []);

  return (
    <div className={deficitChart} data-testid="AFGDebtChart" role="figure" aria-label={ariaLabel}>
      <div className={chartTitle}>{`Total Debt: FYTD ${currentFY} and Last 4 Years in Trillions of USD`}</div>
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
            onMouseLeave={() => setFocusedYear(null)}
            onBlur={() => setFocusedYear(null)}
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
                  domain={[0, 40]}
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
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default AFGDebtChart;
