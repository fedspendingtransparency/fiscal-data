import { Bar } from '@nivo/bar';
import { deficitExplainerPrimary } from "../../national-deficit.module.scss";
import React from "react";
import {barChart, headerTitle, subHeader} from "./deficit-trends-bar-chart.module.scss";
import ChartContainer from "../../../../explainer-components/chart-container/chart-container";
import {container} from "./deficit-trends-bar-chart.module.scss";
import {pxToNumber} from "../../../../../../helpers/styles-helper/styles-helper";
import {breakpointLg, fontSize_12, fontSize_16} from "../../../../../../variables.module.scss";
import {withWindowSize} from "react-fns";
import CustomLink from "../../../../../../components/links/custom-link/custom-link";
import {format} from "date-fns";

const DeficitTrendsBarChart = ({ width }) => {

  const desktop = width >= pxToNumber(breakpointLg);

  const formatCurrency = v => {
    if (parseFloat(v) < 0) {
      return `-$${Math.abs(v)} T`;
    }
    else {
      return `$${v} T`;
    }
  };

  const date = new Date();
  const name = 'Monthly Treasury Statement (MTS)';
  const slug = `https://fiscaldata.treasury.gov/datasets/monthly-treasury-statement/summary-of-
  receipts-and-outlays-of-the-u-s-government`;
  const footer =
    <div>
      Visit the <CustomLink url={slug}>{name}</CustomLink> dataset to explore and
      download this data.
      <p>
        Please note: This data visual only includes completed fiscal years.
      </p>
      Last Updated: {format(date, 'MMMM d, yyyy')}
    </div>

  const header =
    <>
      <div>
        <div className={headerTitle}>2021</div>
        <span className={subHeader}>Fiscal Year</span>
      </div>
    <div>
      <div className={headerTitle}>$2.8 T</div>
      <span className={subHeader}>Total Deficit</span>
    </div>
    </>

  const chartTheme = {
    fontSize:  width < pxToNumber(breakpointLg) ? fontSize_12 : fontSize_16,
    fontColor: '#666666',
  }

  const data = [
    {
      "year": "2000",
      "deficit": ""
    },
    {
      "year": "2001",
      "deficit": "-0.4"
    },
    {
      "year": "2002",
      "deficit": "0.2"
    },
    {
      "year": "2003",
      "deficit": "0.3"
    },
    {
      "year": "2004",
      "deficit": "0.35"
    },
    {
      "year": "2005",
      "deficit": "0.48"
    },
    {
      "year": "2006",
      "deficit": "0.4"
    },
    {
      "year": "2007",
      "deficit": "0.3"
    },
    {
      "year": "2008",
      "deficit": "1.5"
    },
    {
      "year": "2009",
      "deficit": "0.75"
    },
    {
      "year": "2010",
      "deficit": "0.5"
    },
    {
      "year": "2011",
      "deficit": "0.36"
    },
    {
      "year": "2012",
      "deficit": "0.42"
    },
    {
      "year": "2013",
      "deficit": "0.45"
    },
    {
      "year": "2014",
      "deficit": "0.62"
    },
    {
      "year": "2015",
      "deficit": "0.75"
    },
    {
      "year": "2016",
      "deficit": "1.1"
    },
    {
      "year": "2017",
      "deficit": "1.5"
    },
    {
      "year": "2018",
      "deficit": "1.9"
    },
    {
      "year": "2019",
      "deficit": "2"
    },
    {
      "year": "2020",
      "deficit": "3.1",
    },
    {
      "year": "2021",
      "deficit": "2.8",
    },
  ]

  return (
    <>
      <div data-testid={'deficitTrendsBarChart'} className={container}>
        <ChartContainer
          title={'Federal Deficit Trends Over Time, 2001-2021'}
          altText={'Alt Text'}
          header={header}
          footer={footer}
        >
          <div className={barChart}>
            <Bar
              data={data}
              theme={chartTheme}
              width={desktop ? 490 : 315}
              height={desktop ? 388 : 241}
              keys={[
                'deficit'
              ]}
              indexBy="year"
              margin={ desktop ?
                { top: 15, right: 0, bottom: 20, left: 55 } :
                { top: 10, right: 0, bottom: 20, left: 50 }
              }
              padding={desktop ? 0.47 : 0.35}
              valueScale={{type: 'linear'}}
              indexScale={{type: 'band', round: true}}
              colors={(bar) => bar.data.year === "2021" ? '#666666' : deficitExplainerPrimary}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 0,
                tickPadding: 5,
                tickRotation: 0,
                tickValues: ['2000', '2005', '2010', '2015', '2020']
              }}
              axisLeft={{
                format: formatCurrency,
                tickSize: 0,
                tickPadding: 5,
                tickRotation: 0,
                tickValues: ['-0.5', '0', '0.5' ,'1', '1.5', '2', '2.5', '3', '3.5']
              }}
              minValue={'-0.5'}
              maxValue={'3.5'}
              enableGridX={true}
              gridXValues={['2000', '2005', '2010', '2015', '2020']}
              enableGridY={true}
              gridYValues={['-0.5', '0', '0.5' ,'1', '1.5', '2', '2.5', '3', '3.5']}
              enableLabel={false}
              isInteractive={false}
              role="application"
              ariaLabel="Deficit trends chart"
            />
          </div>
        </ChartContainer>
      </div>
    </>
  )
}

export default withWindowSize(DeficitTrendsBarChart);
