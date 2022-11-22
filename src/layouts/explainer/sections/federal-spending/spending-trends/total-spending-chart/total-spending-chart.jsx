import React, { useEffect, useState } from 'react';
import ChartContainer from '../../../../explainer-components/chart-container/chart-container';
import { Line } from '@nivo/line';
import { pxToNumber } from '../../../../../../helpers/styles-helper/styles-helper';
import {
  breakpointLg,
  fontSize_10,
  fontSize_14,
} from '../../../../../../variables.module.scss';
import { withWindowSize } from 'react-fns';
import {
  getChartCopy,
  dataHeader,
  chartConfigs,
  getMarkers,
  lineChartCustomSlices,
  lineChartCustomPoints
} from './total-spending-chart-helper';
import { visWithCallout } from '../../../../explainer.module.scss';
import VisualizationCallout from '../../../../../../components/visualization-callout/visualization-callout';
import { spendingExplainerPrimary } from '../../federal-spending.module.scss';
import { lineChart, container } from './total-spending-chart.module.scss';
import { apiPrefix, basicFetch } from '../../../../../../utils/api-utils';
import numeral from 'numeral';
import simplifyNumber from '../../../../../../helpers/simplify-number/simplifyNumber';
import { adjustDataForInflation } from '../../../../../../helpers/inflation-adjust/inflation-adjust';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import {getShortForm} from "../../../../heros/hero-helper";

const callOutDataEndPoint =
  apiPrefix +
  'v1/accounting/mts/mts_table_5?fields=current_fytd_net_outly_amt,record_date,record_fiscal_year&filter=line_code_nbr:eq:5691,record_calendar_month:eq:09&sort=record_date&page[size]=1';

const chartDataEndPoint =
  apiPrefix +
  'v1/accounting/mts/mts_table_5?fields=current_fytd_net_outly_amt,record_date,record_fiscal_year&filter=line_code_nbr:eq:5691,record_calendar_month:eq:09&sort=record_date';

const gdpEndPoint =
  'https://apps.bea.gov/api/data/?UserID=F9C35FFF-7425-45B0-B988-9F10E3263E9E&method=GETDATA&datasetname=NIPA&TableName=T10105&frequency=Q&year=X&ResultFormat=JSON';

const TotalSpendingChart = ({ width, cpiDataByYear, copyPageData }) => {
  const [spendingChartData, setSpendingChartData] = useState([]);
  const [gdpChartData, setGdpChartData] = useState([]);
  const [gdpRatioChartData, setRatioGdpChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [minYear, setMinYear] = useState(2015);
  const [maxYear, setMaxYear] = useState(2022);
  const [maxAmount, setMaxAmount] = useState(0);
  const [callOutYear, setCallOutYear] = useState('');
  const [firstRatio, setFirstRatio] = useState('');
  const [lastRatio, setlastRatio] = useState('');
  const [lastUpdatedDate, setLastUpdatedDate] = useState(new Date());
  const [lastGDPValue, setlastGDPValue] = useState('');
  const [lastSpendingValue, setlastSpendingValue] = useState('');
  const [maxSpendingValue, setMaxSpendingValue] = useState(0);
  const [minSpendingValue, setMinSpendingValue] = useState(0);
  const [minGDPValue, setMinGDPValue] = useState(0);
  const [selectedChartView, setSelectedChartView] = useState('totalSpending');
  const [isMobile, setIsMobile] = useState(true);

  const [totalSpendingHeadingValues, setTotalSpendingHeadingValues] = useState(
    {}
  );

  const totalData = [
    {
      id: 'GDP',
      color: '#666666',
      data: gdpChartData,
    },
    {
      id: 'Total Spending',
      color: '#666666',
      data: spendingChartData,
    },
  ];

  const percentageData = [
    {
      id: 'GDP Percentage',
      color: '#666666',
      data: gdpRatioChartData,
    },
  ];

  const [chartData, setChartData] = useState(totalData);

  const applyTextScaling = () => {
    const svgChart = document.querySelector('[data-testid="chartParent"] svg');
    if (svgChart) {
      if (width < pxToNumber(breakpointLg)) {
        const containerWidth = document.querySelector(
          '[data-testid="chartParent"]'
        ).offsetWidth;
        const ratio = 550 / containerWidth;
        const textElements = document.querySelectorAll(
          '[data-testid="chartParent"] text'
        );
        [...textElements].forEach(text => {
          text.style.fontSize = `${parseFloat(fontSize_10) * ratio - 0.06}rem`;
        });
      }
    }
  };

  const applyChartScaling = () => {
    // rewrite some element attribs after render to ensure Chart scales with container
    // which doesn't seem to happen naturally when nivo has a flex container
    const svgChart = document.querySelector('[data-testid="chartParent"] svg');
    if (svgChart) {
      svgChart.setAttribute('viewBox', '0 0 550 400');
      svgChart.setAttribute('height', '100%');
      svgChart.setAttribute('width', '100%');
    }
  };

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
        let spendingMinYear;
        let spendingMaxYear;
        let maxAmount;
        let finalSpendingChartData = [];

        res.data.map(t => {
          finalSpendingChartData.push({
            x: parseInt(t.record_fiscal_year),

            actual: t.current_fytd_net_outly_amt,
            fiscalYear: t.record_fiscal_year,
            record_date: t.record_date,
          });
        });

        spendingMinYear = finalSpendingChartData[0].x;
        spendingMaxYear =
          finalSpendingChartData[finalSpendingChartData.length - 1].x;

        setMinYear(spendingMinYear);
        let lastUpdatedDateGDP = new Date();

        //ToDo: This can be moved to a custom Hook, and since GDP data is updated monthly we can think about consuming a flat file via Gatsby
        basicFetch(gdpEndPoint).then(bea_res => {
          if (bea_res.BEAAPI.Results.Notes) {
            const extractedDateGDP = bea_res.BEAAPI.Results?.Notes[0]?.NoteText.slice(
              bea_res.BEAAPI.Results.Notes[0].NoteText.indexOf('LastRevised: ')
            );
            lastUpdatedDateGDP = extractedDateGDP
              ? new Date(extractedDateGDP)
              : new Date();
          }
          if (bea_res.BEAAPI.Results.Data) {
            let finalGDPChartData = [];
            let total = 0;
            bea_res.BEAAPI.Results.Data.map(entry => {
              if (
                entry.LineDescription === 'Gross domestic product' &&
                parseInt(entry.TimePeriod.slice(0, -2)) >= spendingMinYear - 1
              ) {
                const quarter = entry.TimePeriod.slice(4);
                const year = parseInt(entry.TimePeriod.slice(0, -2));
                const fiscalYear = quarter === 'Q4' ? year + 1 : year;
                const amount = parseInt(
                  String(entry.DataValue.replace(/,/g, '') + '000000')
                );
                if (fiscalYear === year) {
                  total += amount;
                } else {
                  total = amount;
                }

                if (quarter === 'Q3' && fiscalYear >= 2015) {
                  finalGDPChartData.push({
                    x: fiscalYear,
                    y: total / 4,
                    actual: total / 4,
                    fiscalYear: String(fiscalYear),
                  });
                }
              }
            });

            finalGDPChartData = adjustDataForInflation(
              finalGDPChartData,
              'actual',
              'fiscalYear',
              cpiDataByYear
            );

            finalGDPChartData.map(gdp => {
              gdp.y = parseFloat(
                simplifyNumber(gdp.actual, false).slice(0, -2)
              );
            });

            const gdpMaxYear =
              finalGDPChartData[finalGDPChartData.length - 1].x;
            setMaxYear(Math.min(gdpMaxYear, spendingMaxYear));

            finalSpendingChartData = finalSpendingChartData.filter(
              s => s.x <= gdpMaxYear
            );

            const lastUpdatedDateSpending = new Date(
              finalSpendingChartData[finalSpendingChartData.length - 1]
                .record_date + ' 00:00:00'
            );
            setLastUpdatedDate(lastUpdatedDateSpending);

            finalSpendingChartData = adjustDataForInflation(
              finalSpendingChartData,
              'actual',
              'fiscalYear',
              cpiDataByYear
            );

            finalSpendingChartData.map(spending => {
              spending.y = parseFloat(
                simplifyNumber(spending.actual, false).slice(0, -2)
              );
            });

            setSpendingChartData(finalSpendingChartData);

            const gdpMaxAmount = finalGDPChartData.reduce((max, gdp) =>
              max > gdp.y ? max : gdp.y
            );
            const gdpMinAmount = finalGDPChartData.reduce((min, gdp) =>
              min < gdp.y ? min : gdp.y
            );
            const spendingMaxAmount = finalSpendingChartData.reduce(
              (max, spending) => (max > spending.y ? max : spending.y)
            );
            const spendingMinAmount = finalSpendingChartData.reduce(
              (min, spending) => (min < spending.y ? min : spending.y)
            );

            setMaxSpendingValue(spendingMaxAmount);
            setMinSpendingValue(spendingMinAmount);
            setMinGDPValue(gdpMinAmount);

            setGdpChartData(finalGDPChartData);

            const finalGdpRatioChartData = [];
            finalSpendingChartData.map((spending, idx) => {
              const spendingYear = spending.fiscalYear;
              const spendingAmount = spending.y;
              const gdpAmount = finalGDPChartData[idx].y;
              const gdpRatio = numeral(spendingAmount / gdpAmount).format('0%');
              finalGdpRatioChartData.push({
                x: spendingYear,
                y: gdpRatio,
              });
            });

            setRatioGdpChartData(finalGdpRatioChartData);

            maxAmount =
              Math.ceil(
                (spendingMaxAmount > gdpMaxAmount
                  ? spendingMaxAmount
                  : gdpMaxAmount) / 5
              ) * 5;
            setMaxAmount(maxAmount);

            setFirstRatio(
              numeral(
                finalSpendingChartData[0].y / finalGDPChartData[0].y
              ).format('0%')
            );

            const chartLastRatio = numeral(
              finalSpendingChartData[finalSpendingChartData.length - 1].y /
                finalGDPChartData[finalGDPChartData.length - 1].y
            ).format('0%');

            const chartLastSpendingValue =
              finalSpendingChartData[finalSpendingChartData.length - 1].actual;
            const chartLastGDPValue =
              finalGDPChartData[finalGDPChartData.length - 1].actual;

            setlastRatio(chartLastRatio);
            setlastSpendingValue(chartLastSpendingValue);
            setlastGDPValue(chartLastGDPValue);
            setTotalSpendingHeadingValues({
              fiscalYear: spendingMaxYear,
              totalSpending: simplifyNumber(chartLastSpendingValue, false),
              gdp: simplifyNumber(chartLastGDPValue, false),
              gdpRatio: chartLastRatio,
            });
            setIsLoading(false);
            applyChartScaling();

            copyPageData({
              fiscalYear: maxYear,
              totalSpending: getShortForm(chartLastSpendingValue, 2, false),
              percentOfGDP: chartLastRatio,
              numOfYearsInChart: (maxYear - minYear) + 1
            })
          }
        });
      }
    });
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

  const chartToggleConfig = {
    selectedChartView,
    setSelectedChartView,
    isMobile,
  };

  useEffect(() => {
    applyTextScaling();
  }, [width, chartToggleConfig]);

  useEffect(() => {
    if (!selectedChartView) return;
    if (selectedChartView === 'percentageGdp') {
      setChartData(percentageData);
    }
    if (
      selectedChartView === 'totalSpending' &&
      gdpChartData.length &&
      spendingChartData.length
    ) {
      setChartData(totalData);
    }
  }, [selectedChartView, gdpChartData, spendingChartData]);

  const handleGroupOnMouseLeave = () => {
    setTotalSpendingHeadingValues({
      fiscalYear: maxYear,
      totalSpending: simplifyNumber(lastSpendingValue, false),
      gdp: simplifyNumber(lastGDPValue, false),
      gdpRatio: lastRatio,
    });
  }
  const handleMouseLeave = (slice) => {
    if (selectedChartView == 'totalSpending') {
      const spendingData = slice.points[0].data;
      const gdpData = slice.points[1].data;
      if (spendingData && gdpData) {
        setTotalSpendingHeadingValues({
          ...totalSpendingHeadingValues,
          totalSpending: simplifyNumber(spendingData.actual, false),
          fiscalYear: spendingData.fiscalYear,
          gdp: simplifyNumber(gdpData.actual, false),
        });
      }
    } else if (selectedChartView == 'percentageGdp') {
      const percentData = slice.points[0].data;
      if (percentData) {
        setTotalSpendingHeadingValues({
          ...totalSpendingHeadingValues,
          fiscalYear: percentData.x,
          gdpRatio: percentData.y + '%',
        });
      }
    }
  }


  const {title: chartTitle, subtitle: chartSubtitle, footer: chartFooter, altText: chartAltText} = getChartCopy(minYear, maxYear, selectedChartView);
  return (
    <>
      {isLoading && (
        <div>
          <FontAwesomeIcon icon={faSpinner} spin pulse /> Loading...
        </div>
      )}
      {!isLoading && chartToggleConfig && (
        <div className={visWithCallout}>
          <div className={container}>

            <ChartContainer
              title={chartTitle}
              subTitle={chartSubtitle}
              footer={chartFooter}
              date={lastUpdatedDate}
              header={dataHeader(chartToggleConfig, totalSpendingHeadingValues)}
              altText={chartAltText}
              customHeaderStyles={{ marginTop: '0.5rem', marginBottom: '0' }}
            >
              <div className={lineChart} data-testid={'chartParent'}>
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
                    lineChartCustomPoints,
                    (props) => lineChartCustomSlices(props, handleGroupOnMouseLeave, handleMouseLeave ),
                    'mesh',
                    'legends',
                  ]}
                  theme={{
                    ...chartConfigs.theme,
                    fontSize:
                      width < pxToNumber(breakpointLg)
                        ? fontSize_10
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
                  width={550}
                  height={400}
                  margin={
                    width < pxToNumber(breakpointLg)
                      ? { top: 25, right: 25, bottom: 30, left: 55 }
                      : { top: 20, right: 15, bottom: 35, left: 50 }
                  }
                  enablePoints={true}
                  pointSize={0}
                  enableGridX={false}
                  enableGridY={false}
                  xScale={{
                    type: 'linear',
                    min: minYear,
                    max: maxYear,
                  }}
                  yScale={{
                    type: 'linear',
                    min: 0,
                    max: selectedChartView === 'percentageGdp' ? 50 : maxAmount,
                    stacked: false,
                    reverse: false,
                  }}
                  axisTop={null}
                  axisRight={null}
                  axisBottom={chartConfigs.axisBottom}
                  axisLeft={
                    selectedChartView === 'percentageGdp'
                      ? chartConfigs.axisLeftPercent
                      : chartConfigs.axisLeftSpending
                  }
                  useMesh={true}
                  isInteractive={true}
                  enableCrosshair={true}
                  crosshairType={'x'}
                  animate={false}
                  sliceTooltip={() => null}
                  tooltip={() => null}
                  enableSlices={'x'}
                  markers={getMarkers(
                    width,
                    selectedChartView,
                    minGDPValue,
                    minSpendingValue
                  )}
                >
                </Line>
              </div>
            </ChartContainer>
          </div>
          <VisualizationCallout color={spendingExplainerPrimary}>
            <p>
              Since {callOutYear}, the Spending to GDP ratio has increased from{' '}
              {firstRatio} to {lastRatio}.
            </p>
          </VisualizationCallout>
        </div>
      )}
    </>
  );
};

export default withWindowSize(TotalSpendingChart);
