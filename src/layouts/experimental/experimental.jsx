import React, { useEffect, useState } from 'react';
import BarGraph from '../../components/charts/bar/bar';
import {
  uncompressedBarGraphData,
  staggeredData,
} from '../../components/charts/helpers/helpersData';
import { reducer } from '../../components/charts/helpers/helpers';
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

  // const data = [
  //   {
  //     year: '2019',
  //     // top
  //     debt: 21.5,
  //     //bottom
  //     deficit: 0.9,
  //   },
  //   {
  //     year: '2020',
  //     // top
  //     debt: 23.9,
  //     //bottom
  //     deficit: 3.2,
  //   },
  //   {
  //     year: '2021',
  //     // top
  //     debt: 26.5,
  //     //bottom
  //     deficit: 1.5,
  //   },
  //   {
  //     year: '2022',
  //     // top
  //     debt: 29.3,
  //     //bottom
  //     deficit: 1.7,
  //   },
  //   {
  //     year: '2023',
  //     // top
  //     deficit: 1.2,
  //     //bottom
  //     debt: 31.2,
  //   },
  // ];

  const data = [
    {
      year: '2019',
      // top
      debt: 0.75,
      none: 0.25,
      debt2: 0.75,
      none2: 0.25,
      debt3: 0.75,
      none3: 0.25,
      debt4: 0.75,
      none4: 0.25,
      debt5: 0.75,
      none5: 0.25,
      debt6: 0.75,
      none6: 0.25,
      debt7: 0.75,
      none7: 0.25,
      debt8: 0.75,
      none8: 0.25,
      debt9: 0.75,
      none9: 0.25,
      debt10: 0.75,
      none10: 0.25,
      debt11: 0.75,
      none11: 0.25,
      debt12: 0.75,
      none12: 0.25,
      debt13: 0.75,
      none13: 0.25,
      debt14: 0.75,
      none14: 0.25,
      debt15: 0.75,
      none15: 0.25,
      debt16: 0.75,
      none16: 0.25,
      debt17: 0.75,
      none17: 0.25,
      debt18: 0.75,
      none18: 0.25,
      debt19: 0.75,
      none19: 0.25,
      debt20: 0.75,
      none20: 0.25,
      debt21: 0.5625,

      //bottom
      deficit: 0.1875,
      none21: 0.25,
      deficit2: 0.6,
    },
    {
      year: '2020',
      // top
      // debt: 23.9,
      debt: 0.75,
      none: 0.25,
      debt2: 0.75,
      none2: 0.25,
      debt3: 0.75,
      none3: 0.25,
      debt4: 0.75,
      none4: 0.25,
      debt5: 0.75,
      none5: 0.25,
      debt6: 0.75,
      none6: 0.25,
      debt7: 0.75,
      none7: 0.25,
      debt8: 0.75,
      none8: 0.25,
      debt9: 0.75,
      none9: 0.25,
      debt10: 0.75,
      none10: 0.25,
      debt11: 0.75,
      none11: 0.25,
      debt12: 0.75,
      none12: 0.25,
      debt13: 0.75,
      none13: 0.25,
      debt14: 0.75,
      none14: 0.25,
      debt15: 0.75,
      none15: 0.25,
      debt16: 0.75,
      none16: 0.25,
      debt17: 0.75,
      none17: 0.25,
      debt18: 0.75,
      none18: 0.25,
      debt19: 0.75,
      none19: 0.25,
      debt20: 0.75,
      none20: 0.25,
      debt22: 0.75,
      none22: 0.25,
      debt23: 0.75,
      none23: 0.25,
      debt24: 0.75,
      none24: 0.25,
      debt25: 0.65,

      //bottom
      // deficit: 3.2,
      deficit3: 0.1,
      none25: 0.25,
      deficit4: 0.75,
      none26: 0.25,
      deficit5: 0.75,
      none27: 0.25,
      deficit6: 0.75,
    },
    {
      year: '2021',
      // top
      // debt: 26.5,
      debt: 0.75,
      none: 0.25,
      debt2: 0.75,
      none2: 0.25,
      debt3: 0.75,
      none3: 0.25,
      debt4: 0.75,
      none4: 0.25,
      debt5: 0.75,
      none5: 0.25,
      debt6: 0.75,
      none6: 0.25,
      debt7: 0.75,
      none7: 0.25,
      debt8: 0.75,
      none8: 0.25,
      debt9: 0.75,
      none9: 0.25,
      debt10: 0.75,
      none10: 0.25,
      debt11: 0.75,
      none11: 0.25,
      debt12: 0.75,
      none12: 0.25,
      debt13: 0.75,
      none13: 0.25,
      debt14: 0.75,
      none14: 0.25,
      debt15: 0.75,
      none15: 0.25,
      debt16: 0.75,
      none16: 0.25,
      debt17: 0.75,
      none17: 0.25,
      debt18: 0.75,
      none18: 0.25,
      debt19: 0.75,
      none19: 0.25,
      debt20: 0.75,
      none20: 0.25,
      debt22: 0.75,
      none22: 0.25,
      debt23: 0.75,
      none23: 0.25,
      debt24: 0.75,
      none24: 0.25,
      debt26: 0.75,
      none28: 0.25,
      debt27: 0.75,
      none29: 0.25,
      debt28: 0.75,
      none30: 0.25,
      debt29: 0.5,
      //bottom
      // deficit: 1.5,
      deficit7: 0.5,
      none31: 0.25,
      deficit8: 0.75,
      none32: 0.25,
      deficit9: 0.4,
    },
    {
      year: '2022',
      // top
      debt: 29.3,
      //bottom
      deficit: 1.7,
    },
    {
      year: '2023',
      // top
      deficit: 1.2,
      //bottom
      debt: 31.2,
    },
  ];

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
        <h2>FootNote Paragraph</h2>
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
        {/*SK WORK*/}
        {
          <BarChart
            width={650}
            height={400}
            data={data}
            layout="vertical"
            barGap={10}
            barSize={40}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis
              type="number"
              domain={[0, 40]}
              unit="T"
              tickFormatter={v => `$${v}`}
            />
            <YAxis type="category" dataKey="year" reversed="true" />
            {/*<Legend align="left" verticalAlign="top" />*/}

            {/*{Object.keys(data[0]).map((key, index, value) => {*/}
            {/*  console.log(data[0].year, data[0].debt, data[0].deficit);*/}
            {/*  //I think I want a for in loop that cycles through data, for now hard coding to*/}
            {/*  // index 0, to experiment with the year 2019*/}
            {/*  const year = data[0].year;*/}
            {/*  const debtLength = data[0].debt;*/}
            {/*  const defLength = data[0].deficit;*/}
            {/*  const currentDebt = true;*/}
            {/*  const currentDeficit = false;*/}
            {/*  const fakeDataKey = { value: 4 };*/}
            {/*  const fakeTransparentKey = { value2: 1 };*/}

            <Bar
              dataKey="debt"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
            />
            <Bar
              dataKey="none"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
            />
            <Bar
              dataKey="debt2"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
            />
            <Bar
              dataKey="none2"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
            />
            <Bar
              dataKey="debt3"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
            />
            <Bar
              dataKey="none3"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
            />
            <Bar
              dataKey="debt4"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
            />
            <Bar
              dataKey="none4"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
            />
            <Bar
              dataKey="debt5"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
            />
            <Bar
              dataKey="none5"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
            />
            <Bar
              dataKey="debt6"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
            />
            <Bar
              dataKey="none6"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
            />
            <Bar
              dataKey="debt7"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
            />
            <Bar
              dataKey="none7"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
            />
            <Bar
              dataKey="debt8"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
            />
            <Bar
              dataKey="none8"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
            />
            <Bar
              dataKey="debt9"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
            />
            <Bar
              dataKey="none9"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
            />
            <Bar
              dataKey="debt10"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
            />
            <Bar
              dataKey="none10"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
            />
            <Bar
              dataKey="debt11"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
            />
            <Bar
              dataKey="none11"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
            />
            <Bar
              dataKey="debt12"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
            />
            <Bar
              dataKey="none12"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
            />
            <Bar
              dataKey="debt13"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
            />
            <Bar
              dataKey="none13"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
            />
            <Bar
              dataKey="debt14"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
            />
            <Bar
              dataKey="none14"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
            />
            <Bar
              dataKey="debt15"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
            />
            <Bar
              dataKey="none15"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
            />
            <Bar
              dataKey="debt16"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
            />
            <Bar
              dataKey="none16"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
            />
            <Bar
              dataKey="debt17"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
            />
            <Bar
              dataKey="none17"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
            />
            <Bar
              dataKey="debt18"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
            />
            <Bar
              dataKey="none18"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
            />
            <Bar
              dataKey="debt19"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
            />
            <Bar
              dataKey="none19"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
            />
            <Bar
              dataKey="debt20"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
            />
            <Bar
              dataKey="none20"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
            />
            <Bar
              dataKey="debt21"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
            />
            <Bar
              dataKey="deficit"
              stackId="a"
              fill="#BD4E12"
              layout={'horizontal'}
            />
            <Bar
              dataKey="none21"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
            />
            <Bar
              dataKey="deficit2"
              stackId="a"
              fill="#BD4E12"
              layout={'horizontal'}
            />
            <Bar
              dataKey="debt22"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
            />
            <Bar
              dataKey="none22"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
            />
            <Bar
              dataKey="debt23"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
            />
            <Bar
              dataKey="none23"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
            />
            <Bar
              dataKey="debt24"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
            />
            <Bar
              dataKey="none24"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
            />
            <Bar
              dataKey="debt25"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
            />
            <Bar
              dataKey="deficit3"
              stackId="a"
              fill="#BD4E12"
              layout={'horizontal'}
            />
            <Bar
              dataKey="none25"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
            />
            <Bar
              dataKey="deficit4"
              stackId="a"
              fill="#BD4E12"
              layout={'horizontal'}
            />
            <Bar
              dataKey="none26"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
            />
            <Bar
              dataKey="deficit5"
              stackId="a"
              fill="#BD4E12"
              layout={'horizontal'}
            />
            <Bar
              dataKey="none27"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
            />
            <Bar
              dataKey="deficit6"
              stackId="a"
              fill="#BD4E12"
              layout={'horizontal'}
            />
            <Bar
              dataKey="debt26"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
            />
            <Bar
              dataKey="none28"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
            />
            <Bar
              dataKey="debt27"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
            />
            <Bar
              dataKey="none29"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
            />
            <Bar
              dataKey="debt28"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
            />
            <Bar
              dataKey="none30"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
            />
            <Bar
              dataKey="debt29"
              stackId="a"
              fill="#4B1B79"
              layout={'horizontal'}
            />
            <Bar
              dataKey="deficit7"
              stackId="a"
              fill="#BD4E12"
              layout={'horizontal'}
            />
            <Bar
              dataKey="none31"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
            />
            <Bar
              dataKey="deficit8"
              stackId="a"
              fill="#BD4E12"
              layout={'horizontal'}
            />
            <Bar
              dataKey="none32"
              stackId="a"
              fill="#00000000"
              layout={'horizontal'}
            />
            <Bar
              dataKey="deficit9"
              stackId="a"
              fill="#BD4E12"
              layout={'horizontal'}
            />
          </BarChart>
        }
      </SiteLayout>
    </ErrorBoundary>
  );
};

export default ExperimentalPage;
