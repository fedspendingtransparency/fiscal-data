import React, { useEffect, useState } from 'react';
import { Line } from '@nivo/line';
import { withWindowSize } from 'react-fns';
import { pxToNumber } from '../../../../../../../helpers/styles-helper/styles-helper';
import ChartContainer from '../../../../../explainer-components/chart-container/chart-container';
import {
  breakpointLg,
  fontSize_10,
  fontSize_14,
} from '../../../../../../../variables.module.scss';
import {
  getChartCopy,
  dataHeader,
  chartConfigs,
  getMarkers,
} from './total-revenue-chart-helper';
import { visWithCallout } from '../../../../../explainer.module.scss';
import VisualizationCallout from '../../../../../../../components/visualization-callout/visualization-callout';
import { lineChart, container } from './total-revenue-chart.module.scss';
import { revenueExplainerPrimary } from '../../../revenue.module.scss';
import {
  applyChartScaling,
  applyTextScaling,
} from '../../../../../explainer-helpers/explainer-charting-helper';
import {
  lineChartCustomPoints,
  lineChartCustomSlices,
} from '../../../../federal-spending/spending-trends/total-spending-chart/total-spending-chart-helper';
import { apiPrefix, basicFetch } from '../../../../../../../utils/api-utils';
import { adjustDataForInflation } from '../../../../../../../helpers/inflation-adjust/inflation-adjust';
import simplifyNumber from '../../../../../../../helpers/simplify-number/simplifyNumber';
import numeral from 'numeral';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { getShortForm } from '../../../../../heros/hero-helper';

const callOutDataEndPoint =
  apiPrefix +
  'v1/accounting/mts/mts_table_4?filter=line_code_nbr:eq:830,record_calendar_month:eq:09&sort=record_date&page[size]=1';

const chartDataEndPoint =
  apiPrefix +
  'v1/accounting/mts/mts_table_4?filter=line_code_nbr:eq:830,record_calendar_month:eq:09&sort=record_date';

const TotalRevenueChart = ({ cpiDataByYear, width, beaGDPData, copyPageData }) => {
  const [revenueChartData, setRevenueChartData] = useState([]);
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
  const [lastRevenueValue, setlastRevenueValue] = useState('');
  const [maxRevenueValue, setMaxRevenueValue] = useState(0);
  const [minRevenueValue, setMinRevenueValue] = useState(0);
  const [minGDPValue, setMinGDPValue] = useState(0);
  const [selectedChartView, setSelectedChartView] = useState('totalRevenue');

  const [totalRevenueHeadingValues, setTotalRevenueHeadingValues] = useState(
    {}
  );

  const percentageData = [
    {
      id: 'GDP Percentage',
      color: '#666666',
      data: gdpRatioChartData,
    },
  ];
  const totalData = [
    {
      id: 'GDP',
      color: '#666666',
      data: gdpChartData,
    },
    {
      id: 'Total Revenue',
      color: '#666666',
      data: revenueChartData,
    },
  ];
  const [chartData, setChartData] = useState(totalData);

  const [isMobile, setIsMobile] = useState(true);
  const chartParent = 'totalRevenueChartParent';
  const chartWidth = 550;
  const chartHeight = 490;

  const chartToggleConfig = {
    selectedChartView,
    setSelectedChartView,
    isMobile,
  };

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
    const {
      finalGDPData,
      gdpMinYear,
      gdpMaxYear,
      gdpMinAmount,
      gdpMaxAmount,
      gdpLastAmountActual,
    } = beaGDPData;

    basicFetch(chartDataEndPoint).then(res => {
      if (res.data) {
        let maxAmount;
        let finalRevenueChartData = [];

        res.data.map(revenue => {
          if (parseInt(revenue.record_fiscal_year) <= gdpMaxYear)
            finalRevenueChartData.push({
              x: parseInt(revenue.record_fiscal_year),
              actual: parseInt(revenue.current_fytd_net_rcpt_amt),
              fiscalYear: revenue.record_fiscal_year,
              record_date: revenue.record_date,
            });
        });

        finalRevenueChartData = adjustDataForInflation(
          finalRevenueChartData,
          'actual',
          'fiscalYear',
          cpiDataByYear
        );

        finalRevenueChartData.map(revenue => {
          revenue.y = parseFloat(
            simplifyNumber(revenue.actual, false).slice(0, -2)
          );
        });

        setRevenueChartData(finalRevenueChartData);

        const revenueMaxYear = finalRevenueChartData.reduce((max, spending) =>
          max.x > spending.x ? max : spending
        );

        const revenueMinYear = finalRevenueChartData.reduce((min, spending) =>
          min.x < spending.x ? min : spending
        );
        setMinYear(revenueMinYear.x);

        const revenueMaxAmount = finalRevenueChartData.reduce((max, spending) =>
          max.y > spending.y ? max : spending
        );
        const revenueMinAmount = finalRevenueChartData.reduce((min, spending) =>
          min.y < spending.y ? min : spending
        );

        const revenueLastAmountActual = finalRevenueChartData[finalRevenueChartData.length - 1].actual;

        setlastRevenueValue(revenueLastAmountActual);

        setMinRevenueValue(revenueMinAmount.y);

        const lastUpdatedDateRevenue = new Date(
          finalRevenueChartData[finalRevenueChartData.length - 1].record_date +
            ' 00:00:00'
        );
        setLastUpdatedDate(lastUpdatedDateRevenue);

        let finalGdpRatioChartData = [];
        finalRevenueChartData.map((revenue, idx) => {
          const revenueYear = revenue.fiscalYear;
          const revenueAmount = revenue.y;
          const matchingGDP = finalGDPData
            .filter(g => g.fiscalYear == revenueYear)
            .map(g => g.y);
          const gdpRatio = numeral(revenueAmount / matchingGDP).format('0%');
          finalGdpRatioChartData.push({
            x: revenueYear,
            y: gdpRatio,
          });
        });

        setRatioGdpChartData(finalGdpRatioChartData);

        maxAmount =
          Math.ceil(
            (revenueMaxAmount.x > gdpMaxAmount
              ? revenueMaxAmount
              : gdpMaxAmount) / 5
          ) * 5;
        setMaxAmount(maxAmount);

        setFirstRatio(
          numeral(finalRevenueChartData[0].y / finalGDPData[0].y).format('0%')
        );

        const chartLastRatio = numeral(
          finalRevenueChartData[finalRevenueChartData.length - 1].y /
            finalGDPData[finalGDPData.length - 1].y
        ).format('0%');
        setlastRatio(chartLastRatio);

        const chartLastGDPValue = gdpMaxAmount;

        setlastGDPValue(gdpLastAmountActual);

        setTotalRevenueHeadingValues({
          fiscalYear: revenueMaxYear.x,
          totalRevenue: simplifyNumber(revenueLastAmountActual, false),
          gdp: simplifyNumber(gdpLastAmountActual, false),
          gdpRatio: chartLastRatio,
        });

        setGdpChartData(finalGDPData);
        setMinGDPValue(gdpMinAmount);

        setIsLoading(false);

        applyChartScaling(
          chartParent,
          chartWidth.toString(),
          chartHeight.toString()
        );

        copyPageData({
          fiscalYear: maxYear,
          revenueTotal: getShortForm(revenueLastAmountActual, 2, false),
          revenueRatio: chartLastRatio
        });
      }
    });
  }, []);

  useEffect(() => {
    applyTextScaling(chartParent, chartWidth, width, fontSize_10);
  }, [width, chartToggleConfig]);

  useEffect(() => {
    if (!selectedChartView) return;
    if (selectedChartView === 'percentageGdp') {
      setChartData(percentageData);
    }
    if (
      selectedChartView === 'totalRevenue' &&
      gdpChartData.length &&
      revenueChartData.length
    ) {
      setChartData(totalData);
    }
  }, [selectedChartView, gdpChartData, revenueChartData]);

  const handleGroupOnMouseLeave = () => {
    setTotalRevenueHeadingValues({
      fiscalYear: maxYear,
      totalRevenue: simplifyNumber(lastRevenueValue, false),
      gdp: simplifyNumber(lastGDPValue, false),
      gdpRatio: lastRatio,
    });
  };

  const handleMouseLeave = slice => {
    if (selectedChartView == 'totalRevenue') {
      const revenueData = slice.points[0].data;
      const gdpData = slice.points[1].data;
      if (revenueData && gdpData) {
        setTotalRevenueHeadingValues({
          ...totalRevenueHeadingValues,
          totalRevenue: simplifyNumber(revenueData.actual, false),
          fiscalYear: revenueData.fiscalYear,
          gdp: simplifyNumber(gdpData.actual, false),
        });
      }
    } else if (selectedChartView == 'percentageGdp') {
      const percentData = slice.points[0].data;
      if (percentData) {
        setTotalRevenueHeadingValues({
          ...totalRevenueHeadingValues,
          fiscalYear: percentData.x,
          gdpRatio: percentData.y + '%',
        });
      }
    }
  };

  const {
    title: chartTitle,
    subtitle: chartSubtitle,
    footer: chartFooter,
    altText: chartAltText,
  } = getChartCopy(minYear, maxYear, selectedChartView);

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
            header={dataHeader(chartToggleConfig, totalRevenueHeadingValues)}
            altText={chartAltText}
          >
            <div className={lineChart} data-testid={'totalRevenueChartParent'}>
              <Line
                data={chartData}
                layers={[
                  'grid',
                  'crosshair',
                  'markers',
                  'axes',
                  'areas',
                  'lines',
                  //'points',
                  lineChartCustomPoints,
                  props =>
                    lineChartCustomSlices(
                      props,
                      handleGroupOnMouseLeave,
                      handleMouseLeave
                    ),
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
                enableGridY={false}
                xScale={{
                  type: 'linear',
                  min: minYear,
                  max: maxYear,
                }}
                yScale={{
                  type: 'linear',
                  min: 0,
                  max: 30,
                  stacked: false,
                  reverse: false,
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
                enableSlices={'x'}
                markers={getMarkers(
                  width,
                  selectedChartView,
                  minGDPValue,
                  minRevenueValue
                )}
              />
            </div>
          </ChartContainer>
        </div>
        <VisualizationCallout color={revenueExplainerPrimary}>
          <p>
            Since {callOutYear}, the Revenue-to-GDP ratio has increased from{' '}
            {firstRatio} to {lastRatio}.
          </p>
        </VisualizationCallout>
      </div>
      )}
    </>
  );
};

export default withWindowSize(TotalRevenueChart);
