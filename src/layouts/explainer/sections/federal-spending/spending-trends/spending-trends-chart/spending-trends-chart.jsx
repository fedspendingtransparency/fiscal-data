import React from "react";
import ChartContainer from "../../../../explainer-components/chart-container/chart-container";
import {Line} from "@nivo/line";
import {pxToNumber} from "../../../../../../helpers/styles-helper/styles-helper";
import {
  breakpointLg,
  fontSize_10,
  fontSize_14,
  semiBoldWeight
} from "../../../../../../variables.module.scss";
import {withWindowSize} from "react-fns";
import {
  chartCopy,
  dataHeader,
  layers,
  chartTheme
} from "./spending-trends-chart-helper";
import {visWithCallout} from "../../../../explainer.module.scss";
import VisualizationCallout
  from "../../../../../../components/visualization-callout/visualization-callout";
import {revenueExplainerPrimary} from "../../../government-revenue/revenue.module.scss";
import {getShortForm} from "../../../../heros/hero-helper";
import {spendingExplainerPrimary} from "../../federal-spending.module.scss";

const SpendingTrendsChart = ({width}) => {


  const data = [
    {
      "id": "GDP",
      "color": "#666666",
      "data": [
        {
          "x": 2015,
          "y": 11
        },
        {
          "x": 2016,
          "y": 13
        },
        {
          "x": 2017,
          "y": 15
        },
        {
          "x": 2018,
          "y": 14
        },
        {
          "x": 2019,
          "y": 18
        },
        {
          "x": 2020,
          "y": 21
        },
        {
          "x": 2021,
          "y": 24
        }
      ]
    },
    {
      "id": "Total Spending",
      "color": "#666666",
      "data": [
        {
          "x": 2015,
          "y": 2
        },
        {
          "x": 2016,
          "y": 3
        },
        {
          "x": 2017,
          "y": 4
        },
        {
          "x": 2018,
          "y": 6
        },
        {
          "x": 2019,
          "y": 4
        },
        {
          "x": 2020,
          "y": 7
        },
        {
          "x": 2021,
          "y": 8
        }
      ]
    }
  ];



  const formatCurrency = v => {
    if (parseFloat(v) < 0) {
      return `$${Math.abs(v)} T`;
    }
    else if (parseFloat(v) > 0){
      return `$${v} T`;
    }
    else {
      return `$${v}`;
    }
  };

  return (
    <>
      <div className={visWithCallout}>
      <ChartContainer
        title={chartCopy.title}
        subTitle={chartCopy.subtitle}
        footer={chartCopy.footer}
        date={new Date()}
        header={dataHeader()}
      >
        <div style={{display: 'flex', flexDirection: 'column'}}>

          <Line
            data={data}
            layers={layers}
            theme={{
              ...chartTheme,
              fontSize:  width < pxToNumber(breakpointLg) ? fontSize_10 : fontSize_14,
            }}
            colors={d => d.color}
            width={ 515 }
            height={ 450 }
            margin={{top: 50, right: 50, bottom: 50, left: 50}}
            enablePoints={true}
            pointSize={6}
            enableGridX={false}
            enableGridY={false}
            xScale={{
              type: "point",
              min: 2015,
              max: 2021
            }}
            yScale={{
              type: "linear",
              min: 0,
              max: 25,
              stacked: false,
              reverse: false
            }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              orient: "bottom",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
            }}
            axisLeft={{
              format: formatCurrency,
              orient: "left",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              tickValues: 6,
            }}
            useMesh={true}
            isInteractive={true}
            enableSlices={'x'}
            enableCrosshair={true}
            animate={false}
            pointLabelYOffset={-12}
            sliceTooltip={slice => null}
            markers={[
              {
                axis: 'y',
                value: '24',
                legend: 'GDP',
                lineStyle: {strokeWidth: 0},
                textStyle: {
                  fontSize: width < pxToNumber(breakpointLg) ? fontSize_10 : fontSize_14,
                  fontWeight: semiBoldWeight,
                  fill: '#666666'
                },
                legendPosition: 'top-right'
              },
              {
                axis: 'y',
                value: '8',
                legend: 'Total Spending',
                lineStyle: {strokeWidth: 0},
                textStyle: {
                  fontSize: width < pxToNumber(breakpointLg) ? fontSize_10 : fontSize_14,
                  fill: '#666666',
                  fontWeight: semiBoldWeight
                }
              }
            ]}
          >
          </Line>
        </div>
      </ChartContainer>
        <VisualizationCallout color={spendingExplainerPrimary}>
          <p>
            Since 2015, the Spending to GDP ratio has increased from XX% to XX%.
          </p>
        </VisualizationCallout>
      </div>
    </>
  );
}

export default withWindowSize(SpendingTrendsChart);

