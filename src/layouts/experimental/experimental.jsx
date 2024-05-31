import React, { useEffect, useState } from 'react';
import BarGraph from '../../components/charts/bar/bar';
import ReLineGraph from './charts/rechartLineGraph';
import { staggeredData, uncompressedBarGraphData } from '../../components/charts/helpers/helpersData';
import { reducer } from '../../components/charts/helpers/helpers';
import SiteLayout from '../../components/siteLayout/siteLayout';
import { barDiv, fallback, linkDiv } from './experimental.module.scss';
import CustomLink from '../../components/links/custom-link/custom-link';
import VisualizationCallout from '../../components/visualization-callout/visualization-callout';
import InsightsDownload from '../../components/insights-download/insights-download';
import AFGDeficitPOC from './charts/afgOverviewDeficitChartPOC';
import { ErrorBoundary } from 'react-error-boundary';
import ContentUnavailable from '../../components/site-header/banner-content/banner-content';
import AnnouncementBanner from '../../components/announcement-banner/announcement-banner';
import GenerateEmbedPage from './embeding/generate-embed';

const fallbackComponent = () => {
  return <div className={fallback}>Something went wrong. Please refresh the page to try again.</div>;
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
    let reducedData = reducer(uncompressedBarGraphData, graphIndex, valueKeys).slice();
    // Normalize data to billions as the figures in the legend and labels look big and ugly.
    reducedData.forEach(d => (d.current_month_dfct_sur_amt = (d.current_month_dfct_sur_amt / 1000000000).toFixed(2)));
    setGraphData(reducedData);
    reducedData = reducer(staggeredData, 'year', ['value', 'value2']).slice();
    setGraph2Data(reducedData);
  }, []);

  return (
    <ErrorBoundary FallbackComponent={fallbackComponent}>
      <AnnouncementBanner>
        <ContentUnavailable />
      </AnnouncementBanner>
      <SiteLayout>
        <h2>FootNote Paragraph</h2>
        <GenerateEmbedPage />
        <iframe src="http://localhost:8000/embed-chart" width="500" height="400" frameBorder="0" title="savings bonds chart" scrolling="no" />
        <p>
          empus purus ac Curabitur eleifend rutrum est, sit amet vehicula urna eleifend ut. Nulla facilisi. Ut tempus orci nibh, vitae tristique erat
          finibus egestas. Nullam ut nisl fringilla, condimentum ex eu, suscipit tortor. In ultrices justo lorem. Donec a scelerisque quam.
        </p>
        <br />
        <br />
        <h3> ReCharts Composed Chart </h3>
        <AFGDeficitPOC />
        <br />
        <br />
        <h3> ReCharts Line </h3>
        <ReLineGraph />
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
        <InsightsDownload downloadLink={'/data/insights-data/who-owns-debt/Top10_Owners_of_US_Debt.csv'} dataDate={'Oct 2022'} />
        <div className={barDiv}>
          <BarGraph
            graphData={graph2Data}
            graphIndex={'year'}
            valueKeys={['value']}
            colors={d => (Number(d.value) >= 0 ? 'rgb(1, 118, 198)' : 'rgb(242, 108, 98)')}
          />
        </div>
        <h2>Two graphs at once, no axes</h2>
        <div className={barDiv}>
          <span> The following graphs are color coded even as they cross the x-axis and stack at the end. </span>
          <BarGraph graphData={graph2Data} graphIndex={'year'} valueKeys={['value', 'value2']} colors={['rgb(1, 118, 198)', 'rgb(242, 108, 98)']} />
        </div>
        <h2>Graph with incomplete/invalid data</h2>
        <div className={barDiv}>
          <span> The following placeholder avoids a page error by checking the params on deciding not to render a broken chart </span>
          <BarGraph graphData={[]} graphIndex={17} valueKeys={{}} />
        </div>
        <h2>Custom Link Component</h2>
        <div className={linkDiv}>
          <CustomLink url="/">This should open the homepage in the same tab</CustomLink>
          <CustomLink url="/" external>
            This should open the homepage in a new tab (since the "external" prop is passed in)
          </CustomLink>
          <CustomLink url="https://example.com">
            This link should open https://example.com/ in a new tab even without the "external" prop since the url starts with http(s)
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
      </SiteLayout>
    </ErrorBoundary>
  );
};

export default ExperimentalPage;
