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
} from '../../../../federal-spending/spending-trends/total-spending-chart/total-spending-chart-helper';
import { ConnectableObservable } from 'rxjs';

const TotalRevenueChart = ({ width }) => {
  const [totalRevenueHeadingValues, setTotalRevenueHeadingValues] = useState({
    fiscalYear: 2022,
    totalRevenue: 25,
    gdp: 8.5,
    gdpRatio: 39,
  });

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

  const handleMouseLeave = slice => {
    const spendingData = slice.points[0].data;
    const gdpData = slice.points[1].data;
    if (spendingData && gdpData) {
      setTotalRevenueHeadingValues({
        ...totalRevenueHeadingValues,
        totalRevenue: spendingData.y,
        fiscalYear: spendingData.x,
        gdp: gdpData.y,
      });
    }
  };

  return (
    <>
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
              ></Line>
            </div>
          </ChartContainer>
        </div>
        <VisualizationCallout color={revenueExplainerPrimary}>
          <p>
            Since 2015, the Revenue-to-GDP ratio has increased from XX% to XX%.
          </p>
        </VisualizationCallout>
      </div>
    </>
  );
};

export default withWindowSize(TotalRevenueChart);
