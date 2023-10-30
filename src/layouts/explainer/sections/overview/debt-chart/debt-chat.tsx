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
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { trillionAxisFormatter } from '../chart-helper';
import CustomDotNoAnimation from '../deficit-chart/custom-dot/custom-dot';
import CustomTooltip from '../deficit-chart/custom-tooltip/custom-tooltip';
import { debtExplainerPrimary } from '../../../explainer.module.scss';
import { rectangle } from '../../national-debt/growing-national-debt/debt-accordion/visualizing-the-debt-accordion.module.scss';
import { totalDebtData } from '../../../../experimental/experimental-helper';

const AFGDebtChart = (): ReactElement => {
  const [focusedYear, setFocusedYear] = useState(null);
  const [currentFY, setCurrentFY] = useState();
  const [finalChartData, setFinalChartData] = useState(null);
  // const [legendItems, setLegendItems] = useState(null);
  const [isLoading, setLoading] = useState(true);

  const debtEndpointUrl = '/v1/debt/mspd/mspd_table_1?filter=security_type_desc:eq:Total%20Public%20Debt%20Outstanding&sort=-record_date';
  const currentFYEndpointUrl = '/v1/accounting/mts/mts_table_5?filter=line_code_nbr:eq:5694&sort=-record_date&page[size]=1';

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
    return sortedData.map((dataObj, i) =>
      Object.keys(dataObj)
        .filter(propName => {
          return propName !== 'year';
        })
        .map(valueName => {
          return (
            <Bar
              dataKey={valueName}
              stackId={'a'}
              fill={mapBarColors(valueName)}
              name={valueName === 'debt' ? `Debt` : valueName === 'deficit' ? `Deficit` : ''}
              barSize={16}
            />
          );
        })
    );
  };
  const getChartData = async () => {
    if (currentFY) {
      const chart_data = [];

      await basicFetch(`${apiPrefix}${debtEndpointUrl}`)?.then(async res => {
        console.log(res);
      });
      return chart_data;
    }
  };

  useEffect(() => {
    if (!finalChartData && currentFY) {
      getChartData().then(res => {
        setFinalChartData(res);
        setLoading(false);
      });
    }
  }, [currentFY]);

  useEffect(() => {
    basicFetch(`${apiPrefix}${currentFYEndpointUrl}`).then(result => {
      if (result?.data) {
        setCurrentFY(result.data[0].record_fiscal_year);
      }
    });
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
            onMouseLeave={() => setFocusedYear(null)}
            onBlur={() => setFocusedYear(null)}
            role="presentation"
          >
            <ResponsiveContainer height={164} width="99%">
              <BarChart
                data={totalDebtData.data}
                layout="vertical"
                barGap={30}
                barSize={30}
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
                {generateBar(totalDebtData.data)}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default AFGDebtChart;
