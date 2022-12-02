import React, { useEffect, useState } from 'react';
import BarGraph from '../../components/charts/bar/bar';
import { uncompressedBarGraphData, staggeredData } from '../../components/charts/helpers/helpersData';
import { reducer } from "../../components/charts/helpers/helpers";
import SiteLayout from '../../components/siteLayout/siteLayout';
import { barDiv, linkDiv } from './experimental.module.scss';
import CustomLink from '../../components/links/custom-link/custom-link';
import VisualizationCallout from "../../components/visualization-callout/visualization-callout";
import InsightsDownload from "../../components/insights-download/insights-download";

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
    reducedData.forEach(d => d.current_month_dfct_sur_amt = (d.current_month_dfct_sur_amt / 1000000000).toFixed(2));
    setGraphData(reducedData);
    reducedData = reducer(staggeredData, 'year', ['value', 'value2']).slice();
    setGraph2Data(reducedData);
  }, []);

  return (
    <SiteLayout>
      <h2>
        Basic Bar Graph, with labels visible on bars
      </h2>
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
            legendOffset: 36
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Deficit/Surplus (in Billions)',
            legendPosition: 'middle',
            legendOffset: -50
          }}
          margin={{left: 60, bottom: 50}}
          enableLabel={true}
          labelTextColor={'#ffffff'}
        />
      <h2>
        Bar Graph with Negative Values, no axes
      </h2>
      <InsightsDownload downloadLink={'https://people.sc.fsu.edu/~jburkardt/data/csv/example.csv'} />
      <div className={barDiv}>
        <BarGraph
          graphData={graph2Data}
          graphIndex={'year'}
          valueKeys={['value']}
          colors={(d) => Number(d.value) >= 0 ? 'rgb(1, 118, 198)' : 'rgb(242, 108, 98)'}
        />
      </div>

      <h2>
        Two graphs at once, no axes
      </h2>
      <div className={barDiv}>
        <span> The following graphs are color coded even as they cross the x-axis and stack at the end. </span>
          <BarGraph
            graphData={graph2Data}
            graphIndex={'year'}
            valueKeys={['value', 'value2']}
            colors={['rgb(1, 118, 198)', 'rgb(242, 108, 98)']}
          />
      </div>

      <h2>
        Graph with incomplete/invalid data
      </h2>
      <div className={barDiv}>
        <span> The following placeholder avoids a page error by checking the params on deciding not to render a broken chart </span>
          <BarGraph
            graphData={[]}
            graphIndex={17}
            valueKeys={{}}
          />
      </div>
      <h2>
        Custom Link Component
      </h2>
      <div className={linkDiv}>
        <CustomLink url="/">This should open the homepage in the same tab</CustomLink>
        <CustomLink url="/" external>This should open the homepage in a new tab (since the "external" prop is passed in)</CustomLink>
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
            backgroundColor: '#555'
          }}
        >
          A smaller graph
        </div>
        <VisualizationCallout children={'Example Text.'}/>
      </div>
    </SiteLayout>
  )
};

export default ExperimentalPage;
