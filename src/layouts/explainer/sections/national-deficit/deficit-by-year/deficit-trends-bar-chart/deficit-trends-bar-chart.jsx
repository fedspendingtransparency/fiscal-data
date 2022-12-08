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
import useGAEventTracking from '../../../../../../hooks/useGAEventTracking';
import Analytics from '../../../../../../utils/analytics/analytics';

let gaTimerChart;

export const DeficitTrendsBarChart = ({ width }) => {
  const {getGAEvent} = useGAEventTracking(null, "Deficit");

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
  const [gaChartTime, setGaChartTime] = useState(0);
  const [lastBar, setLastBar] = useState();
  const [numOfBars, setNumOfBars] = useState(0);

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

  const barHighlightColor = '#555555';

  const formatCurrency = v => {
    if (parseFloat(v) < 0) {
      return `-$${Math.abs(v)} T`;
    }
    else {
      return `$${v} T`;
    }
  };

  const calcDeficit = (value) => {
    if(value.toString().split(".")[1].length < 2) {}
  }

  const getChartData = () => {
    const apiData = [];
    // Counts pre api data bars
    let barCounter = 14;
    basicFetch(`${apiPrefix}${endpointUrl}`)
    .then((result) => {
      result.data.forEach((entry) => {
        if(entry.record_fiscal_year === '2022') {
          apiData.push({
            "year": entry.record_fiscal_year,
            "deficit": (Math.abs(parseFloat(entry.current_fytd_net_outly_amt)) / 1000000000000).toFixed(2),
            "deficitColor": barHighlightColor,
            "decoyDeficit": ((3.5 - Math.abs(parseFloat(entry.current_fytd_net_outly_amt)) / 1000000000000)).toFixed(2),
            "decoyDeficitColor": "hsl(0, 0%, 100%, 0.0)"
          })
        }
        apiData.push({
          "year": entry.record_fiscal_year,
          "deficit": (Math.abs(parseFloat(entry.current_fytd_net_outly_amt)) / 1000000000000).toFixed(2),
          "deficitColor": deficitExplainerPrimary,
          "decoyDeficit": ((3.5 - Math.abs(parseFloat(entry.current_fytd_net_outly_amt)) / 1000000000000)).toFixed(2),
          "decoyDeficitColor": "hsl(0, 0%, 100%, 0.0)"
        })
        barCounter += 1;
      })
      setNumOfBars(barCounter);
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

  const chartChangeOnMouseEnter = (data, event, chartData) => {
    const barSVGs = Array.from(event.target.parentNode.parentNode.children);
    if (data.id !== 'decoyDeficit') {
      if (data.data.year === chartData[chartData.length - 1].year) {
        event.target.style.fill = barHighlightColor;
        setLastBar(event.target.parentNode.parentNode.children[(barSVGs.length - 1) - numOfBars].firstChild);
        setHeaderYear(data.data.year);
        setHeaderDeficit(data.data.deficit);
      }
      else {
        event.target.style.fill = barHighlightColor;
        event.target.parentNode.parentNode.children[(barSVGs.length - 1) - numOfBars].firstChild.style.fill = deficitExplainerPrimary;
        setLastBar(event.target.parentNode.parentNode.children[(barSVGs.length - 1) - numOfBars].firstChild);
        setHeaderYear(data.data.year);
        setHeaderDeficit(data.data.deficit);
      }
    }
    else if (data.id === 'decoyDeficit') {
      if (data.data.year === chartData[chartData.length - 1].year) {
        const parentG = event.target.parentNode;
        const realBar = barSVGs.find((element) => element === parentG);
        const indexOfRealBar = barSVGs.indexOf(realBar) - numOfBars;
        event.target.parentNode.parentNode.children[indexOfRealBar].firstChild.style.fill = barHighlightColor;
        setLastBar(event.target.parentNode.parentNode.children[(barSVGs.length - 1) - numOfBars].firstChild);
        const matchedBar = chartData.find((element) => element.year === data.data.year);
        setHeaderYear(matchedBar.year);
        setHeaderDeficit(matchedBar.deficit);
      }
      else {
        const parentG = event.target.parentNode;
        const realBar = barSVGs.find((element) => element === parentG);
        const indexOfRealBar = barSVGs.indexOf(realBar) - 22;
        event.target.parentNode.parentNode.children[indexOfRealBar].firstChild.style.fill = barHighlightColor;
        event.target.parentNode.parentNode.children[(barSVGs.length - 1) - 22].firstChild.style.fill = deficitExplainerPrimary;
        const matchedBar = chartData.find((element) => element.year === data.data.year);
        setHeaderYear(matchedBar.year);
        setHeaderDeficit(matchedBar.deficit);
      }
    }
  }

  const chartChangeOnMouseLeave = (data, event) => {
    if (data.id !== 'decoyDeficit') {
        event.target.style.fill = deficitExplainerPrimary;
    }
    else if (data.id === 'decoyDeficit') {
      const parentG = event.target.parentNode;
      const barSVGs = Array.from(event.target.parentNode.parentNode.children);
      const realBar = barSVGs.find((element) => element === parentG);
      const indexOfRealBar = barSVGs.indexOf(realBar) - 22;
      event.target.parentNode.parentNode.children[indexOfRealBar].firstChild.style.fill = deficitExplainerPrimary;
    }
  }

  const resetHeaderValues = () => {
    setHeaderYear(mostRecentFiscalYear);
    setHeaderDeficit(mostRecentDeficit);

    if(lastBar)
      lastBar.style.fill = barHighlightColor;
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


  const handleMouseChartEnter = () =>{
    const gaEvent = getGAEvent("30");
    gaTimerChart = setTimeout(() =>{
      gaEvent && Analytics.event({
        category: gaEvent.eventCategory.replace("Fiscal Data - ", ""),
        action: gaEvent.eventAction,
        label: gaEvent.eventLabel,
      });
    }, 3000);
  }

  const handleMouseChartLeave = () =>{
    clearTimeout(gaTimerChart);
  }



  const name = 'Monthly Treasury Statement (MTS)';
  const slug = `https://fiscaldata.treasury.gov/datasets/monthly-treasury-statement/summary-of-
  receipts-and-outlays-of-the-u-s-government`;
  const footer =
    <div>
      Visit the <CustomLink url={slug} eventNumber='18'>{name}</CustomLink> dataset to explore and
      download this data.
      <p>
        Please note: This data visual only includes completed fiscal years.
      </p>
    </div>

  const header =
    <>
      <div>
        <div className={headerTitle} data-testid={'deficitFiscalYearHeader'}>{headerYear}</div>
        <span className={subHeader}>Fiscal Year</span>
      </div>
    <div>
      <div className={headerTitle} data-testid={'deficitTotalHeader'}>${headerDeficit} T</div>
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
        <div data-testid={'deficitTrendsBarChart'} className={container}
        onMouseEnter={handleMouseChartEnter}
        onMouseLeave={handleMouseChartLeave}>
          <ChartContainer
            title={`Federal Deficit Trends Over Time, FY 2001-${mostRecentFiscalYear}`}
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
                  'deficit',
                  'decoyDeficit'
                ]}
                indexBy="year"
                margin={desktop ?
                  {top: 15, right: 0, bottom: 20, left: 50} :
                  {top: 10, right: 0, bottom: 20, left: 50}
                }
                padding={desktop ? 0.30 : 0.35}
                valueScale={{type: 'linear'}}
                indexScale={{type: 'band', round: true}}
                colors={({id, data}) =>  String(data[`${id}Color`])}
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
                animate={false}
                enableLabel={false}
                isInteractive={true}
                onMouseEnter={(data, event) => {chartChangeOnMouseEnter(data, event, chartData)}}
                onMouseLeave={(data, event) => {chartChangeOnMouseLeave(data, event)}}
                groupMode={"stacked"}
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
