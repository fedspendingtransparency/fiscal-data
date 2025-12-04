import React, { useEffect, useState } from 'react';
import ChartContainer from '../../../../explainer-components/chart-container/chart-container';
import { pxToNumber } from '../../../../../../helpers/styles-helper/styles-helper';
import { breakpointLg, fontSize_14 } from '../../../../../../variables.module.scss';
import { withWindowSize } from 'react-fns';
import {
  container,
  corpRect,
  customsRect,
  estateRect,
  exciseRect,
  indvRect,
  legendColumn,
  legendContainer,
  legendElement,
  legendText,
  lineChart,
  miscRect,
  socialSecRect,
} from './revenue-trends-line-chart.module.scss';
import { Line } from '@nivo/line';
import { fontSize_16 } from '../../../../explainer.module.scss';
import { apiPrefix, basicFetch } from '../../../../../../utils/api-utils';
import { adjustDataForInflation } from '../../../../../../helpers/inflation-adjust/inflation-adjust';
import { colors, sum } from './revenue-trends-line-chart-helpers';
import { getDateWithoutTimeZoneAdjust } from '../../../../../../utils/date-utils';
import { useTooltip } from '@nivo/tooltip';
import Analytics from '../../../../../../utils/analytics/analytics';
import {
  addInnerChartAriaLabel,
  applyChartScaling,
  formatCurrency,
  getChartTheme,
  nivoCommonLineChartProps,
} from '../../../../explainer-helpers/explainer-charting-helper';
import CustomTooltip from './custom-tooltip/custom-tooltip';
import { explainerCitationsMap } from '../../../../explainer-helpers/explainer-helpers';
import LoadingIndicator from '../../../../../../components/loading-indicator/loading-indicator';

let gaTimerRevenueTrends;
let ga4Timer;

const RevenueTrendsLineChart = ({ width, cpiDataByYear }) => {
  const [chartData, setChartData] = useState([]);
  const [lastChartYear, setLastChartYear] = useState(0);
  const [firstChartYear, setFirstChartYear] = useState(0);
  const [lastUpdatedDate, setLastUpdatedDate] = useState(new Date());
  const [chartYears, setChartYears] = useState([]);
  const [totalRevByYear, setTotalRevByYear] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [revenueScaleMax, setRevenueScaleMax] = useState(null);

  const chartParent = 'chartParentTrends';
  const chartWidth = 515;
  const chartHeight = 500;

  useEffect(() => {
    applyChartScaling(chartParent, chartWidth.toString(), chartHeight.toString());
    addInnerChartAriaLabel(chartParent);
  }, [isLoading]);

  useEffect(() => {
    const endPointURL = 'v1/accounting/mts/mts_table_9?filter=record_type_cd:eq:RSG,record_calendar_month:eq:09&page[size]=1000&sort=-record_date';
    basicFetch(`${apiPrefix}${endPointURL}`).then(res => {
      if (res.data) {
        console.log('First res of the first order  ', res.data);
        setLastChartYear(res.data[0].record_fiscal_year);
        setFirstChartYear(res.data[res.data.length - 1].record_fiscal_year);
        const chartDate = new Date(res.data[0].record_date);
        setLastUpdatedDate(getDateWithoutTimeZoneAdjust(chartDate));
        const completeData = [];
        const filteredData = [];
        res.data = adjustDataForInflation(res.data, 'current_fytd_rcpt_outly_amt', 'record_date', cpiDataByYear);
        const incomeTax = {
          name: 'Individual Income Taxes',
          data: res.data.filter(record => {
            return record.line_code_nbr === '20';
          }),
        };
        filteredData.push(incomeTax);
        const combinedSocSecData = [];
        const socialSecurityData = res.data.filter(record => {
          console.log(res.data);
          return record.line_code_nbr === '50' || record.line_code_nbr === '60' || record.line_code_nbr === '70';
        });
        const socSecYears = [...new Set(socialSecurityData.map(entry => entry.record_fiscal_year))];
        console.log(socSecYears);
        setChartYears(socSecYears);
        socSecYears.forEach(year => {
          const forAGivenYear = socialSecurityData.filter(entry => entry.record_fiscal_year === year);
          const sumOfRevenueForYear = forAGivenYear.map(element => element.current_fytd_rcpt_outly_amt).reduce(sum);
          combinedSocSecData.push({
            record_fiscal_year: year,
            current_fytd_rcpt_outly_amt: sumOfRevenueForYear,
          });
        });
        const socialSecurityMedicare = {
          name: 'Social Security and Medicare Taxes',
          data: combinedSocSecData,
        };
        filteredData.push(socialSecurityMedicare);
        const corpTax = {
          name: 'Corporate Income Taxes',
          data: res.data.filter(record => {
            return record.line_code_nbr === '30';
          }),
        };
        filteredData.push(corpTax);
        const misc = {
          name: 'Miscellaneous Income',
          data: res.data.filter(record => {
            return record.line_code_nbr === '110';
          }),
        };
        filteredData.push(misc);
        const exciseTax = {
          name: 'Excise Taxes',
          data: res.data.filter(record => {
            return record.line_code_nbr === '80';
          }),
        };
        filteredData.push(exciseTax);
        const customsDuties = {
          name: 'Customs Duties',
          data: res.data.filter(record => {
            return record.line_code_nbr === '100';
          }),
        };
        filteredData.push(customsDuties);
        const estateTax = {
          name: 'Estate & Gift Taxes',
          data: res.data.filter(record => {
            return record.line_code_nbr === '90';
          }),
        };
        filteredData.push(estateTax);
        filteredData.forEach(category => {
          const dataObject = {
            id: category.name,
            color: colors.find(entry => category.name === entry.name).value,
            data: category.data.map(entry => ({
              x: entry.record_fiscal_year,
              y: parseFloat((entry.current_fytd_rcpt_outly_amt / 1000000000000).toFixed(2)),
              raw: entry.current_fytd_rcpt_outly_amt,
            })),
          };
          completeData.push(dataObject);
        });
        const revenueSums = [];
        socSecYears.forEach(year => {
          revenueSums.push({
            year: year,
            sum: completeData
              .map(array => {
                return array.data.find(element => element.x === year).y;
              })
              .reduce((prev, a) => prev + a, 0),
          });
        });
        setRevenueScaleMax(Math.ceil(Math.max(...revenueSums.map(element => element.sum))));
        const sumRevPerYear = [];
        for (let i = 0; i < completeData[0].data.length; i++) {
          const sumYear = completeData.map(entry => entry.data[i].raw).reduce(sum);
          sumRevPerYear.push({
            year: completeData[0].data[i].x,
            value: sumYear,
          });
        }
        setTotalRevByYear(sumRevPerYear);
        setChartData(completeData);
        setIsLoading(false);
      }
    });
  }, []);

  const handleChartMouseEnter = () => {
    gaTimerRevenueTrends = setTimeout(() => {
      Analytics.event({
        category: 'Explainers',
        action: 'Chart Hover',
        label: 'Revenue - Federal Revenue Trends Over Time',
      });
    }, 3000);
    ga4Timer = setTimeout(() => {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'chart-hover-federal-rev-trends',
      });
    }, 3000);
  };

  const handleChartMouseLeave = () => {
    clearTimeout(gaTimerRevenueTrends);
    clearTimeout(ga4Timer);
  };

  const CustomSlices = ({ enableSlices, setCurrentSlice, sliceTooltip, slices }) => {
    const { showTooltipFromEvent, hideTooltip } = useTooltip();

    return (
      <g
        onMouseLeave={() => {
          hideTooltip();
        }}
      >
        {slices.map((slice, index) => (
          <rect
            x={slice.x0}
            y={slice.y0}
            tabIndex={0}
            key={index}
            width={slice.width}
            height={slice.height}
            strokeWidth={0}
            data-testid={'slice'}
            strokeOpacity={0.75}
            fillOpacity={0}
            onMouseEnter={() => setCurrentSlice(slice)}
            onFocus={event => {
              showTooltipFromEvent(
                React.createElement(sliceTooltip, {
                  slice,
                  axis: enableSlices,
                }),
                event,
                'right'
              );
            }}
            onMouseMove={event => {
              showTooltipFromEvent(
                React.createElement(sliceTooltip, {
                  slice,
                  axis: enableSlices,
                }),
                event,
                'right'
              );
            }}
            onMouseLeave={() => {
              setCurrentSlice(null);
            }}
          />
        ))}
      </g>
    );
  };

  const { bls, mtsReceipts } = explainerCitationsMap['government-revenue'];

  const footer = (
    <div>
      <p>
        Visit the {mtsReceipts} dataset to explore and download this data. The inflation data is sourced from the {bls}.
      </p>
      <p></p>
    </div>
  );

  return (
    <>
      {!isLoading ? (
        <div data-testid="revenueTrendsLineChart" className={container}>
          <ChartContainer
            title={`Federal Revenue Trends Over Time, FY 2015-${lastChartYear}`}
            subTitle={`Inflation Adjusted - ${lastChartYear} Dollars`}
            altText={`Area chart showing federal revenue totals by revenue category from ${firstChartYear} - ${lastChartYear}`}
            footer={footer}
            date={lastUpdatedDate}
            customFooterSpacing={width < pxToNumber(breakpointLg) ? { fontSize: fontSize_14 } : {}}
            customTitleStyles={width < pxToNumber(breakpointLg) ? { fontSize: fontSize_16, color: '#666666' } : {}}
            customSubTitleStyles={width < pxToNumber(breakpointLg) ? { fontSize: fontSize_14 } : {}}
          >
            <div
              className={lineChart}
              role="presentation"
              data-testid="chartParentTrends"
              onMouseEnter={handleChartMouseEnter}
              onMouseLeave={handleChartMouseLeave}
            >
              <Line
                {...nivoCommonLineChartProps}
                data={chartData}
                layers={['grid', 'markers', 'axes', 'areas', 'lines', 'points', CustomSlices, 'crosshair', 'mesh', 'legends']}
                colors={d => d.color}
                width={515}
                height={500}
                margin={{ top: 20, right: 50, bottom: 60, left: 40 }}
                xScale={{
                  type: 'linear',
                  min: 2015,
                  max: lastChartYear,
                }}
                yScale={{
                  type: 'linear',
                  min: 0,
                  max: revenueScaleMax,
                  stacked: true,
                  reverse: false,
                }}
                theme={getChartTheme(width)}
                enableArea={true}
                areaOpacity={1}
                yFormat=" >-.2f"
                axisBottom={{
                  orient: 'bottom',
                  tickSize: 6,
                  tickPadding: 5,
                  tickRotation: 0,
                  tickValues: (() => {
                    const start = 2016;
                    const end = lastChartYear;
                    const ticks = [];
                    for (let y = start; y <= end; y += 2) {
                      ticks.push(y);
                    }
                    const MAX_TICKS = 6;

                    if (ticks.length <= MAX_TICKS) {
                      return ticks;
                    }
                    const ratio = Math.ceil(ticks.length / MAX_TICKS);
                    return ticks.filter((_, i) => i % ratio === 0);
                  })(),
                }}
                axisLeft={{
                  format: formatCurrency,
                  orient: 'left',
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  tickValues: 6,
                }}
                pointLabelYOffset={-12}
                sliceTooltip={slice => CustomTooltip(slice, totalRevByYear)}
              />
              <div className={legendContainer}>
                <div className={legendColumn}>
                  <div className={legendElement}>
                    <div className={estateRect} />
                    <div className={legendText}> Estate & Gift Taxes </div>
                  </div>
                  <div className={legendElement}>
                    <div className={customsRect} />
                    <div className={legendText}> Customs Duties </div>
                  </div>
                  <div className={legendElement}>
                    <div className={exciseRect} />
                    <div className={legendText}> Excise Taxes </div>
                  </div>
                  <div className={legendElement}>
                    <div className={miscRect} />
                    <div className={legendText}> Miscellaneous Income </div>
                  </div>
                </div>
                <div className={legendColumn}>
                  <div className={legendElement}>
                    <div className={corpRect} />
                    <div className={legendText}> Corporate Income Taxes </div>
                  </div>
                  <div className={legendElement}>
                    <div className={socialSecRect} />
                    <div className={legendText}>Social Security and Medicare Taxes</div>
                  </div>
                  <div className={legendElement}>
                    <div className={indvRect} />
                    <div className={legendText}>Individual Income Taxes</div>
                  </div>
                </div>
              </div>
            </div>
          </ChartContainer>
        </div>
      ) : (
        <LoadingIndicator />
      )}
    </>
  );
};

export default withWindowSize(RevenueTrendsLineChart);
