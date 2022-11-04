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
  chartCopy,
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
  getMarkers,
} from '../../../../federal-spending/spending-trends/total-spending-chart/total-spending-chart-helper';
import useBeaGDP from '../../../../../../../hooks/useBeaGDP';
import { apiPrefix, basicFetch } from '../../../../../../../utils/api-utils';
import { adjustDataForInflation } from '../../../../../../../helpers/inflation-adjust/inflation-adjust';
import simplifyNumber from '../../../../../../../helpers/simplify-number/simplifyNumber';
import numeral from 'numeral';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const callOutDataEndPoint =
  apiPrefix +
  'v1/accounting/mts/mts_table_4?filter=line_code_nbr:eq:830,record_calendar_month:eq:09&sort=-record_date';

const chartDataEndPoint =
  apiPrefix +
  'v1/accounting/mts/mts_table_5?fields=current_fytd_net_outly_amt,record_date,record_fiscal_year&filter=line_code_nbr:eq:5691,record_calendar_month:eq:09&sort=record_date';

const TotalRevenueChart = ({ cpiDataByYear, width, beaGDPData }) => {
  //console.log(beaGDPData)
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

  const mockPercentageData = [
    {
      id: 'GDP Percentage',
      color: '#666666',
      data: [
        {
          x: '2015',
          y: '20%',
        },
        {
          x: '2016',
          y: '21%',
        },
        {
          x: '2017',
          y: '21%',
        },
        {
          x: '2018',
          y: '20%',
        },
        {
          x: '2019',
          y: '21%',
        },
        {
          x: '2020',
          y: '31%',
        },
        {
          x: '2021',
          y: '30%',
        },
        {
          x: '2022',
          y: '25%',
        },
      ],
    },
  ];
  const totalData = [
    {
      id: 'GDP',
      color: '#666666',
      data: [
        {
          x: 2015,
          y: 11,
        },
        {
          x: 2016,
          y: 13,
        },
        {
          x: 2017,
          y: 15,
        },
        {
          x: 2018,
          y: 14,
        },
        {
          x: 2019,
          y: 18,
        },
        {
          x: 2020,
          y: 21,
        },
        {
          x: 2021,
          y: 22,
        },
      ],
    },
    {
      id: 'Total Revenue',
      color: '#666666',
      data: [
        {
          x: 2015,
          y: 2,
        },
        {
          x: 2016,
          y: 3,
        },
        {
          x: 2017,
          y: 4,
        },
        {
          x: 2018,
          y: 6,
        },
        {
          x: 2019,
          y: 4,
        },
        {
          x: 2020,
          y: 7,
        },
        {
          x: 2021,
          y: 8,
        },
      ],
    },
  ];
  const [selectedChartView, setSelectedChartView] = useState('totalRevenue');
  const [chartData, setChartData] = useState(totalData);

  const [isMobile, setIsMobile] = useState(true);
  const chartParent = 'totalRevenueChartParent';
  const chartWidth = 550;
  const chartHeight = 490;

  const handleGroupOnMouseLeave = () => {
    setTotalRevenueHeadingValues({
      fiscalYear: 2022,
      totalRevenue: 25,
      gdp: 8.5,
      gdpRatio: 39,
    });
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
    const {
      finalGDPData,
      gdpMinYear,
      gdpMaxYear,
      gdpMinAmount,
      gdpMaxAmount,
      gdpMaxAmountActual
    } = beaGDPData;
   

    basicFetch(chartDataEndPoint).then(res => {
      
      if (res.data) {
        
        let maxAmount;
        let finalRevenueChartData = [];

        res.data.map(revenue => {
          if (parseInt(revenue.record_fiscal_year) <= gdpMaxYear)
            finalRevenueChartData.push({
              x: parseInt(revenue.record_fiscal_year),
              actual: parseInt(revenue.current_fytd_net_outly_amt),
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
          const matchingGDP = finalGDPData.filter(
            g => g.fiscalYear == revenueYear
          );
          const gdpAmount = matchingGDP.y;
          const gdpRatio = numeral(revenueAmount / gdpAmount).format('0%');
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

        const chartLastRevenueValue = revenueMaxAmount.actual;

        console.log(revenueMaxAmount)
        const chartLastGDPValue = gdpMaxAmount;

        
         setlastRevenueValue(chartLastRevenueValue);
         setlastGDPValue(gdpMaxAmountActual);

        setTotalRevenueHeadingValues({
          fiscalYear: revenueMaxYear.x,
          totalRevenue: simplifyNumber(chartLastRevenueValue, false),
          gdp: simplifyNumber(gdpMaxAmountActual, false),
          gdpRatio: chartLastRatio,
        });

        setGdpChartData(finalGDPData);
        setMinGDPValue(gdpMinAmount);

        setIsLoading(false);

        console.log(finalRevenueChartData, finalGDPData, gdpMinYear, gdpMaxYear, gdpMinAmount, gdpMaxAmount);
        if (window.innerWidth < breakpoint.desktop) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }, [width]);

  const chartToggleConfig = {
    selectedChartView,
    setSelectedChartView,
      }
    });
    isMobile,
  };;

  // useEffect(() => {
  //   //applyChartScaling(chartParent, chartWidth.toString(), chartHeight.toString());
  // }, []);

  useEffect(() => {
    applyTextScaling(chartParent, chartWidth, width, fontSize_10);
  }, [width, chartToggleConfig]);

  useEffect(() => {
    if (!selectedChartView) return;
    if (selectedChartView === 'percentageGdp') {
      setChartData(mockPercentageData);
    }
    if (selectedChartView === 'totalRevenue' && chartData.length) {
      setChartData(totalData);
    }
  }, [selectedChartView]);

  const handleGroupOnMouseLeave = () => {
    setTotalRevenueHeadingValues({
      fiscalYear: maxYear,
      totalRevenue: simplifyNumber(lastRevenueValue, false),
      gdp: simplifyNumber(lastGDPValue, false),
      gdpRatio: lastRatio,
    });
  };;

  const handleMouseLeave = (slice) => {
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
    altTex: chartAltText,
  } = getChartCopy(minYear, maxYear);

  return (
    <>
      {isLoading && (
        <div>
          <FontAwesomeIcon icon={faSpinner} spin pulse /> Loading...
        </div>
      )}
      <div className={visWithCallout}>
        <div className={container}>
          <ChartContainer
            title={chartCopy.title}
            subTitle={chartCopy.subtitle}
            footer={chartCopy.footer}
            date={new Date()}
            header={dataHeader(chartToggleConfig, totalRevenueHeadingValues)}
            altText={chartCopy.altText}
          >
            <div className={lineChart} data-testid={chartParent}>
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
                }}
                colors={d => d.color}
                width={chartWidth}
                height={chartHeight}
                margin={
                  width < pxToNumber(breakpointLg)
                    ? { top: 25, right: 25, bottom: 35, left: 65 }
                    : { top: 25, right: 15, bottom: 45, left: 50 }
                }
                enablePoints={true}
                pointSize={0}
                enableGridX={false}
                enableGridY={false}
                xScale={{
                  type: 'linear',
                  min: 2015,
                  max: 2021,
                }}
                yScale={{
                  type: 'linear',
                  min: 0,
                  max: selectedChartView === 'percentageGdp' ? 50 : 25,
                  stacked: false,
                  reverse: false,
                }}
                axisTop={null}
                axisRight={null}
                axisBottom={chartConfigs.axisBottom}
                axisLeft={chartConfigs.axisLeft}
                useMesh={true}
                isInteractive={true}
                enableCrosshair={false}
                crosshairType={'x'}
                animate={false}
                tooltip={() => null}
                markers={getMarkers(width, selectedChartView)}
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
    </>
  );
};

export default withWindowSize(TotalRevenueChart);
