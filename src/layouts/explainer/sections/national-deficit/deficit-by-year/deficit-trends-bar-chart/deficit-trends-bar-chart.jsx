import { Bar } from '@nivo/bar';
import { deficitExplainerPrimary } from "../../national-deficit.module.scss";
import React, {useEffect, useState} from "react";
import {barChart, headerTitle, subHeader} from "./deficit-trends-bar-chart.module.scss";
import ChartContainer from "../../../../explainer-components/chart-container/chart-container";
import {container} from "./deficit-trends-bar-chart.module.scss";
import {pxToNumber} from "../../../../../../helpers/styles-helper/styles-helper";
import {breakpointLg, fontSize_12, fontSize_16} from "../../../../../../variables.module.scss";
import {withWindowSize} from "react-fns";
import CustomLink from "../../../../../../components/links/custom-link/custom-link";
import {apiPrefix, basicFetch} from '../../../../../../utils/api-utils';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import {preAPIData, generateTickValues, endpointUrl} from "./deficit-trends-bar-chart-helpers";
import {getDateWithoutTimeZoneAdjust} from "../../../../../../utils/date-utils";

const DeficitTrendsBarChart = ({ width }) => {

  const desktop = width >= pxToNumber(breakpointLg);
  const [date, setDate] = useState(new Date ());
  const [chartData, setChartData] = useState([]);
  const [tickValuesX, setTickValuesX] = useState([]);
  const [tickValuesY, setTickValuesY] = useState([]);
  const [mostRecentFiscalYear, setMostRecentFiscalYear] = useState('');
  const [mostRecentDeficit, setMostRecentDeficit] = useState('');
  const [maxValue, setMaxValue] = useState('');
  const [minValue, setMinValue] = useState('');
  const [headerYear, setHeaderYear] = useState('');
  const [headerDeficit, setHeaderDeficit] = useState('');

  const applyChartScaling = () => {
    // rewrite some element attribs after render to ensure Chart scales with container
    // which doesn't seem to happen naturally when nivo has a flex container
    const svgChart = document.querySelector('[data-testid="chartParent"] svg');
    if (svgChart) {
      svgChart.setAttribute('viewBox', '0 0 495 388');
      svgChart.setAttribute('height', '100%');
      svgChart.setAttribute('width', '100%');
    }
  };

  const formatCurrency = v => {
    if (parseFloat(v) < 0) {
      return `-$${Math.abs(v)} T`;
    }
    else {
      return `$${v} T`;
    }
  };

  const getChartData = () => {
    const apiData = [];
    basicFetch(`${apiPrefix}${endpointUrl}`)
    .then((result) => {
      result.data.forEach((entry) => {
        apiData.push({
          "year": entry.record_fiscal_year,
          "deficit": (Math.abs(parseFloat(entry.current_fytd_net_outly_amt)) / 1000000000000).toFixed(1)
        })
      })
      setDate(getDateWithoutTimeZoneAdjust(new Date(result.data[result.data.length -1].record_date)));
      const newData = preAPIData.concat(apiData);
      const latestYear = newData[newData.length - 1].year;
      const latestDeficit = newData[newData.length - 1].deficit;
      setMostRecentFiscalYear(latestYear);
      setHeaderYear(latestYear);
      setMostRecentDeficit(latestDeficit);
      setHeaderDeficit(latestDeficit);
      setChartData(newData);
    });
  }

  const chartChangeOnMouseEnter = (data, event) => {
    event.target.style.fill = '#555555';
    setHeaderYear(data.data.year);
    setHeaderDeficit(data.data.deficit);
  }

  const chartChangeOnMouseLeave = (data, event, chartData) => {
    if (data.formattedValue === chartData[chartData.length -1].deficit) {
      event.target.style.fill = '#666666';
    }
    else {
      event.target.style.fill = deficitExplainerPrimary;
    }
  }

  const resetHeaderValues = () => {
    setHeaderYear(mostRecentFiscalYear);
    setHeaderDeficit(mostRecentDeficit);
  }

  useEffect(() => {
    applyChartScaling();
    getChartData();
  }, []);


  useEffect(() => {
    const tickValues = generateTickValues(chartData);
    setMinValue(tickValues[1][0]);
    setMaxValue(tickValues[1][tickValues[1].length - 1]);
    setTickValuesX(tickValues[0]);
    setTickValuesY(tickValues[1]);
  }, [chartData])

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
    </div>

  const header =
    <>
      <div>
        <div className={headerTitle}>{headerYear}</div>
        <span className={subHeader}>Fiscal Year</span>
      </div>
    <div>
      <div className={headerTitle}>${headerDeficit} T</div>
      <span className={subHeader}>Total Deficit</span>
    </div>
    </>

  const chartTheme = {
    fontSize:  width < pxToNumber(breakpointLg) ? fontSize_12 : fontSize_16,
    fontColor: '#666666',
  }

  return (
    <>
      { chartData !== [] ? (
        <div data-testid={'deficitTrendsBarChart'} className={container}>
          <ChartContainer
            title={`Federal Deficit Trends Over Time, 2001-${mostRecentFiscalYear}`}
            altText={'Bar graph that shows the federal deficit trend from 2001 to '
            + `${mostRecentFiscalYear}. Over the years, the data fluctuates `
            + 'with a spiked increase starting in 2019.'}
            header={header}
            footer={footer}
            date={date}
          >
            <div className={barChart} onMouseLeave={resetHeaderValues} data-testid={'chartParent'}>
              <Bar
                data={chartData}
                theme={chartTheme}
                layers={['grid', 'axes', 'bars']}
                width={ 495 }
                height={ 388 }
                keys={[
                  'deficit'
                ]}
                indexBy="year"
                margin={desktop ?
                  {top: 15, right: 0, bottom: 20, left: 50} :
                  {top: 10, right: 0, bottom: 20, left: 50}
                }
                padding={desktop ? 0.47 : 0.35}
                valueScale={{type: 'linear'}}
                indexScale={{type: 'band', round: true}}
                colors={(bar) => bar.data.year === mostRecentFiscalYear ? '#666666' : deficitExplainerPrimary}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                  tickSize: 0,
                  tickPadding: 5,
                  tickRotation: 0,
                  tickValues: tickValuesX
                }}
                axisLeft={{
                  format: formatCurrency,
                  tickSize: 0,
                  tickPadding: 5,
                  tickRotation: 0,
                  tickValues: tickValuesY
                }}
                minValue={minValue}
                maxValue={maxValue}
                enableGridX={true}
                gridXValues={tickValuesX}
                enableGridY={true}
                gridYValues={tickValuesY}
                enableLabel={false}
                isInteractive={true}
                onMouseEnter={(data, event) => {chartChangeOnMouseEnter(data, event)}}
                onMouseLeave={(data, event) => {chartChangeOnMouseLeave(data, event, chartData)}}
                tooltip={() => (
                  <></>
                )}
              />
            </div>
          </ChartContainer>
        </div>
      ) : (
        <div>
          <FontAwesomeIcon icon={faSpinner} spin pulse /> Loading...
        </div>
      )
      }
    </>
  )
};

export default withWindowSize(DeficitTrendsBarChart);
