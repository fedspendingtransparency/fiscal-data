import React, { useEffect, useState } from 'react';
import BarGraph from '../../components/charts/bar/bar';
import LineGraphAnimation from './charts/lineGraphAnimation';
import { uncompressedBarGraphData, staggeredData } from '../../components/charts/helpers/helpersData';
import { reducer } from "../../components/charts/helpers/helpers";
import SiteLayout from '../../components/siteLayout/siteLayout';
import { barDiv, linkDiv, fallback } from './experimental.module.scss';
import CustomLink from '../../components/links/custom-link/custom-link';
import VisualizationCallout from '../../components/visualization-callout/visualization-callout';
import InsightsDownload from '../../components/insights-download/insights-download';
import AFGDeficitPOC from './charts/afgOverviewDeficitChartPOC';
import { ErrorBoundary } from 'react-error-boundary';
import {
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Label,
  Customized,
} from 'recharts';
import { TotalDebtData } from './experimental-helper';
const fallbackComponent = () => {
  return (
    <div className={fallback}>
      Something went wrong. Please refresh the page to try again.
    </div>
  );
};

/**
 * This page exists primarily for testing functionality that does not have a spot on the site at the time of development.
 * The content on this page should be regularly cleaned up.
 * @returns {*}
 * @constructor
 */
const ExperimentalPage = () => {
  const [graphData, setGraphData] = useState([]);
  const [graph2Data, setGraph2Data] = useState([]);
  const graphIndex = 'record_calendar_year';
  const valueKeys = ['current_month_dfct_sur_amt'];

  useEffect(() => {
    let reducedData = reducer(
      uncompressedBarGraphData,
      graphIndex,
      valueKeys
    ).slice();
    // Normalize data to billions as the figures in the legend and labels look big and ugly.
    reducedData.forEach(
      d =>
        (d.current_month_dfct_sur_amt = (
          d.current_month_dfct_sur_amt / 1000000000
        ).toFixed(2))
    );
    setGraphData(reducedData);
    reducedData = reducer(staggeredData, 'year', ['value', 'value2']).slice();
    setGraph2Data(reducedData);
  }, []);

  return (
    <ErrorBoundary FallbackComponent={fallbackComponent}>
      <SiteLayout>
        <LineGraphAnimation />
        <h2>
          FootNote Paragraph
        </h2>
        <p>
          empus purus ac Curabitur eleifend rutrum est, sit amet vehicula urna
          eleifend ut. Nulla facilisi. Ut tempus orci nibh, vitae tristique erat
          finibus egestas. Nullam ut nisl fringilla, condimentum ex eu, suscipit
          tortor. In ultrices justo lorem. Donec a scelerisque quam.
        </p>
        <br />
        <h3> ReCharts Composed Chart </h3>
        <AFGDeficitPOC />
        <h2>Basic Bar Graph, with labels visible on bars</h2>
        <BarGraph
          divClass={barDiv}
          graphData={graphData}
          graphIndex={graphIndex}
          valueKeys={valueKeys}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Year',
            legendPosition: 'middle',
            legendOffset: 36,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Deficit/Surplus (in Billions)',
            legendPosition: 'middle',
            legendOffset: -50,
          }}
          margin={{ left: 60, bottom: 50 }}
          enableLabel={true}
          labelTextColor={'#ffffff'}
        />
        <h2>Bar Graph with Negative Values, no axes</h2>
        <InsightsDownload
          downloadLink={
            '/data/insights-data/who-owns-debt/Top10_Owners_of_US_Debt.csv'
          }
          dataDate={'Oct 2022'}
        />
        <div className={barDiv}>
          <BarGraph
            graphData={graph2Data}
            graphIndex={'year'}
            valueKeys={['value']}
            colors={d =>
              Number(d.value) >= 0 ? 'rgb(1, 118, 198)' : 'rgb(242, 108, 98)'
            }
          />
        </div>
        <h2>Two graphs at once, no axes</h2>
        <div className={barDiv}>
          <span>
            {' '}
            The following graphs are color coded even as they cross the x-axis
            and stack at the end.{' '}
          </span>
          <BarGraph
            graphData={graph2Data}
            graphIndex={'year'}
            valueKeys={['value', 'value2']}
            colors={['rgb(1, 118, 198)', 'rgb(242, 108, 98)']}
          />
        </div>
        <h2>Graph with incomplete/invalid data</h2>
        <div className={barDiv}>
          <span>
            {' '}
            The following placeholder avoids a page error by checking the params
            on deciding not to render a broken chart{' '}
          </span>
          <BarGraph graphData={[]} graphIndex={17} valueKeys={{}} />
        </div>
        <h2>Custom Link Component</h2>
        <div className={linkDiv}>
          <CustomLink url="/">
            This should open the homepage in the same tab
          </CustomLink>
          <CustomLink url="/" external>
            This should open the homepage in a new tab (since the "external"
            prop is passed in)
          </CustomLink>
          <CustomLink url="https://example.com">
            This link should open https://example.com/ in a new tab even without
            the "external" prop since the url starts with http(s)
          </CustomLink>
        </div>
        <div>
          <div
            style={{
              height: 500,
              margin: '32px 0',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#fff',
              backgroundColor: '#555',
            }}
          >
            A smaller graph
          </div>
          <VisualizationCallout children={'Example Text.'} />
        </div>
        <div
          style={{
            height: 500,
          }}
        />{' '}
        <h3>Total Debt: Last 4 Years and FYTD 2023 in Trillions of USD</h3>
        {
          <BarChart
            width={650}
            height={300}
            data={TotalDebtData.data}
            layout="vertical"
            barGap={30}
            barSize={30}
          >
            <CartesianGrid horizontal={false} />
            <XAxis
              type="number"
              domain={[0, 40]}
              unit="T"
              tickFormatter={v => `$${v}`}
            />
            <YAxis type="category" dataKey="year" reversed="true" />
            <Legend align="left" verticalAlign="top" />

            <Bar
              name="Debt"
              dataKey="debt"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
              legendType="circle"
            />
            <Bar
              dataKey="none"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="debt2"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="none2"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="debt3"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="none3"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="debt4"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="none4"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="debt5"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="none5"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="debt6"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="none6"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="debt7"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="none7"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="debt8"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="none8"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="debt9"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="none9"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="debt10"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="none10"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="debt11"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="none11"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="debt12"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="none12"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="debt13"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="none13"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="debt14"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="none14"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="debt15"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="none15"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="debt16"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="none16"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="debt17"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="none17"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="debt18"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="none18"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="debt19"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="none19"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="debt20"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="none20"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="debt21"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="deficit"
              stackId="a"
              fill="#BD4E12"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="none21"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="deficit2"
              stackId="a"
              fill="#BD4E12"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="debt22"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="none22"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="debt23"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="none23"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="debt24"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="none24"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="debt25"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="deficit3"
              stackId="a"
              fill="#BD4E12"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="none25"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="deficit4"
              stackId="a"
              fill="#BD4E12"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="none26"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="deficit5"
              stackId="a"
              fill="#BD4E12"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="none27"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="deficit6"
              stackId="a"
              fill="#BD4E12"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="debt26"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="none28"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="debt27"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="none29"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="debt28"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="none30"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="debt29"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="deficit7"
              stackId="a"
              fill="#BD4E12"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="none31"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="deficit8"
              stackId="a"
              fill="#BD4E12"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="none32"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="deficit9"
              stackId="a"
              fill="#BD4E12"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="debt30"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="none33"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="debt31"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="none34"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="debt32"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="none35"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="debt33"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="deficit10"
              stackId="a"
              fill="#BD4E12"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="none36"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="deficit11"
              stackId="a"
              fill="#BD4E12"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="debt34"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="none37"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="debt35"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="deficit12"
              stackId="a"
              fill="#BD4E12"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="none38"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="deficit13"
              stackId="a"
              fill="#BD4E12"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              dataKey="none39"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
              legendType="none"
            />
            <Bar
              name="Deficit"
              dataKey="deficit14"
              stackId="a"
              fill="#BD4E12"
              layout={'horizontal'}
              legendType="circle"
            />
            <Bar
              name="$1T"
              dataKey="null"
              stackId="a"
              fill="#555555"
              legendType="square"
            />
          </BarChart>
        }
      </SiteLayout>
    </ErrorBoundary>
  );
};

export default ExperimentalPage;
