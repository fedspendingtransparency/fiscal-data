import React, { useEffect, useState } from 'react';
import { Line } from '@nivo/line';
import { withWindowSize } from 'react-fns';
import { pxToNumber } from '../../../../../helpers/styles-helper/styles-helper';
import ChartContainer from '../../../explainer-components/chart-container/chart-container';
import {
  breakpointLg,
  fontSize_10,
  fontSize_14,
} from '../../../../../variables.module.scss';
import {
  getChartCopy,
  dataHeader,
  chartConfigs,
  getMarkers,
} from './debt-over-last-100y-linechart-helper';
import { visWithCallout } from '../../../explainer.module.scss';
import VisualizationCallout from '../../../../../components/visualization-callout/visualization-callout';
import { lineChart, container } from './debt-over-last-100y-linechart.module.scss';
import {
  applyChartScaling,
  applyTextScaling,
} from '../../../explainer-helpers/explainer-charting-helper';
import {
  lineChartCustomPoints,
  lineChartCustomSlices,
} from '../../federal-spending/spending-trends/total-spending-chart/total-spending-chart-helper';
import { apiPrefix, basicFetch } from '../../../../../utils/api-utils';
import { adjustDataForInflation } from '../../../../../helpers/inflation-adjust/inflation-adjust';
import simplifyNumber from '../../../../../helpers/simplify-number/simplifyNumber';
import numeral from 'numeral';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const callOutDataEndPoint =
  apiPrefix +
  'v1/accounting/mts/mts_table_4?filter=line_code_nbr:eq:830,record_calendar_month:eq:09&sort=record_date&page[size]=1';

const chartDataEndPoint =
  apiPrefix +
  'v2/accounting/od/debt_outstanding?sort=-record_date&page[size]=101';

const DebtOverLast100y = ({ cpiDataByYear, width }) => {
  const [debtChartData, setDebtChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [minYear, setMinYear] = useState(2015);
  const [maxYear, setMaxYear] = useState(2022);
  const [maxAmount, setMaxAmount] = useState(0);
  const [callOutYear, setCallOutYear] = useState('');
  const [lastUpdatedDate, setLastUpdatedDate] = useState(new Date());
  const [lastDebtValue, setlastDebtValue] = useState('');
  const [firstDebtValue, setFirstDebtValue] = useState('');
  // const [maxDebtValue, setMaxDebtValue] = useState(0);
  // const [minDebtValue, setMinDebtValue] = useState(0);
  const [chartData, setChartData] = useState(null);
  const [isMobile, setIsMobile] = useState(true);
  const [totalDebtHeadingValues, setTotalDebtHeadingValues] = useState({});
  
  
  const chartParent = 'totalDebtChartParent';
  const chartWidth = 550;
  const chartHeight = 490;

  
  useEffect(() => {
    applyChartScaling(
      chartParent,
      chartWidth.toString(),
      chartHeight.toString()
    );
  }, []);

  const breakpoint = {
    desktop: 1015,
    tablet: 600,
  };

  useEffect(() => {
    if (window.innerWidth < breakpoint.desktop) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }, [width]);

  useEffect(() => {
    basicFetch(callOutDataEndPoint).then(res => {
      if (res.data) {
        setCallOutYear(res.data[0].record_fiscal_year);
      }
    });
  }, []);

  useEffect(() => {


    basicFetch(chartDataEndPoint).then(res => {
      if (res.data) {
        res.data = adjustDataForInflation(
          res.data,
          'debt_outstanding_amt',
          'record_date',
          cpiDataByYear
        );

        let maxAmount;
        let finalDebtChartData = [];

        res.data.map(debt => {
          finalDebtChartData.push({
            x: parseInt(debt.record_fiscal_year),            
            // y: parseFloat(
            //   simplifyNumber(debt.debt_outstanding_amt, false).slice(0, -2)
            // ),
            y: parseInt(debt.debt_outstanding_amt),
            actual: parseInt(debt.debt_outstanding_amt),
            fiscalYear: debt.record_fiscal_year,
            record_date: debt.record_date,
          });
        });
                
        setDebtChartData(finalDebtChartData);

        const debtMaxYear = finalDebtChartData.reduce((max, spending) =>
          max.x > spending.x ? max : spending
        );

        const debtMinYear = finalDebtChartData.reduce((min, spending) =>
          min.x < spending.x ? min : spending
        );
        setMinYear(debtMinYear.x);
        setMaxYear(debtMaxYear.x);

        const debtMaxAmount = finalDebtChartData.reduce((max, spending) =>
          max.y > spending.y ? max : spending
        );
        const debtMinAmount = finalDebtChartData.reduce((min, spending) =>
          min.y < spending.y ? min : spending
        );
        setMaxAmount(debtMaxAmount.y);
       

        const debtLastAmountActual = finalDebtChartData[0].y;
        const debtFirstAmountActual = finalDebtChartData[finalDebtChartData.length-1].y;

        
        setlastDebtValue(simplifyNumber(debtLastAmountActual, true));
        setFirstDebtValue(simplifyNumber(debtFirstAmountActual, true));

        const lastUpdatedDateDebt = new Date(
          finalDebtChartData[0].record_date +
            ' 00:00:00'
        );
        setLastUpdatedDate(lastUpdatedDateDebt);
          
        setTotalDebtHeadingValues({
          fiscalYear: debtMaxYear.x,
          totalDebt: simplifyNumber(debtLastAmountActual, false),        
        });

        const totalData = [    
          {
            id: 'Total Debt',
            color: '#4a0072',
            data: finalDebtChartData,
          },
        ];
        setChartData(totalData);
        setIsLoading(false);

        applyChartScaling(
          chartParent,
          chartWidth.toString(),
          chartHeight.toString()
        );
      }
    });
  }, []);

  useEffect(() => {
    applyTextScaling(chartParent, chartWidth, width, fontSize_10);
  }, [width]);

  const handleGroupOnMouseLeave = () => {
    setTotalDebtHeadingValues({
      fiscalYear: maxYear,
      totalDebt: simplifyNumber(lastDebtValue, false)
    });
  };

  const handleMouseLeave = slice => {
    const debtData = slice.points[0].data;
      const gdpData = slice.points[1].data;
      if (debtData && gdpData) {
        setTotalDebtHeadingValues({
          ...totalDebtHeadingValues,
          totalDebt: simplifyNumber(debtData.actual, false)
        });
      }
  };

  const {
    title: chartTitle,
    subtitle: chartSubtitle,
    footer: chartFooter,
    altText: chartAltText,
  } = getChartCopy(minYear, maxYear);
 
  return (
    <>
      {isLoading && (
        <div>
          <FontAwesomeIcon icon={faSpinner} spin pulse /> Loading...
        </div>
      )}
      {!isLoading && (
      <div className={visWithCallout}>
        <div className={container}>
          <ChartContainer
            title={chartTitle}
            subTitle={chartSubtitle}
            footer={chartFooter}
            date={lastUpdatedDate}
            header={dataHeader(totalDebtHeadingValues)}
            altText={chartAltText}
          >
            <div className={lineChart} data-testid={'totalDebtChartParent'}>
              <Line
                data={chartData}
                layers={[
                  'grid',
                  'crosshair',
                  'markers',
                  'axes',
                  'areas',
                  'lines',
                  'points',
                  'slices',
                  //lineChartCustomPoints,
                  // props =>
                  //   lineChartCustomSlices(
                  //     props,
                  //     handleGroupOnMouseLeave,
                  //     handleMouseLeave
                  //   ),
                  'mesh',
                  'legends',
                ]}
                theme={{
                  ...chartConfigs.theme,
                  fontSize:
                    width < pxToNumber(breakpointLg)
                      ? fontSize_14
                      : fontSize_14,
                  marker: {
                    fontSize:
                      width < pxToNumber(breakpointLg)
                        ? fontSize_10
                        : fontSize_14,
                  },
                  crosshair: {
                    line: {
                      stroke: '#555555',
                      strokeWidth: 2,
                    },
                  },
                }}
                colors={d => d.color}
                width={chartWidth}
                height={chartHeight}
                margin={
                  width < pxToNumber(breakpointLg)
                    ? { top: 25, right: 25, bottom: 30, left: 55 }
                    : { top: 20, right: 15, bottom: 35, left: 50 }
                }
                enablePoints={true}
                pointSize={0}
                enableGridX={false}
                enableGridY={true}
                yFormat=" >-$.2r"
                xScale={{
                  type: 'linear',
                  min: 1922,
                  max: 2022,
                }}
                yScale={{
                  type: 'linear',
                  min: 0,
                  max: maxAmount,
                  stacked: true,
                  //reverse: false,
                }}
                axisTop={null}
                axisRight={null}
                axisBottom={chartConfigs.axisBottom}
                axisLeft={chartConfigs.axisLeft}
                useMesh={true}
                isInteractive={true}
                enableCrosshair={true}
                crosshairType={'x'}
                animate={false}
                sliceTooltip={() => null}
                tooltip={() => null}
                //enableSlices={'x'}
                enableArea={true}
                areaOpacity={1}
                markers={getMarkers( width )}
              />
            </div>
          </ChartContainer>
        </div>
        <VisualizationCallout color={''}>
          <p>
            Over the past 100 years, the U.S. federal debt has increased from {firstDebtValue} in {minYear} to {lastDebtValue} in {maxYear}.
          </p>
        </VisualizationCallout>
      </div>
      )}
    </>
  );
};

export default withWindowSize(DebtOverLast100y);
