import { Bar } from '@nivo/bar';
import { deficitExplainerPrimary } from "../../national-deficit.module.scss";
import React, {useEffect, useState} from "react";
import {barChart, headerTitle, subHeader} from "./deficit-trends-bar-chart.module.scss";
import ChartContainer from "../../../../explainer-components/chart-container/chart-container";
import {container} from "./deficit-trends-bar-chart.module.scss";
import {pxToNumber} from "../../../../../../helpers/styles-helper/styles-helper";
import {breakpointLg, fontSize_12, fontSize_16, fontBodyCopy, fontTitle} from "../../../../../../variables.module.scss";
import {withWindowSize} from "react-fns";
import CustomLink from "../../../../../../components/links/custom-link/custom-link";
import {apiPrefix, basicFetch} from '../../../../../../utils/api-utils';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import {preAPIData, generateTickValues, endpointUrl} from "./deficit-trends-bar-chart-helpers";
import {getDateWithoutTimeZoneAdjust} from "../../../../../../utils/date-utils";
import useGAEventTracking from '../../../../../../hooks/useGAEventTracking';
import Analytics from '../../../../../../utils/analytics/analytics';
import {
  addInnerChartAriaLabel,
  applyChartScaling,
  applyTextScaling,
} from '../../../../explainer-helpers/explainer-charting-helper';
import CustomBar from './custom-bar/custom-bar';
import { useInView } from 'react-intersection-observer';

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
  const [lastBar, setLastBar] = useState();

  const formatCurrency = v => {
    if (parseFloat(v) < 0) {
      return `-$${Math.abs(v)} T`;
    }
    else {
      return `$${v} T`;
    }
  };

  const chartConfigs = {
    parent: 'deficitTrendsChartParent',
    width: 495,
    height: 388,
    fontSize: desktop ? fontSize_16 : fontSize_12,
    theme: {
      fontSize: fontSize_16,
      fontFamily: 'Source Sans Pro',
      textColor: fontBodyCopy,
    },
    axisBottom:{
      tickSize: 0,
      tickPadding: 5,
      tickRotation: 0,
      tickValues: tickValuesX
    },
    axisLeft:{
      format: formatCurrency,
      tickSize: 0,
      tickPadding: 5,
      tickRotation: 0,
      tickValues: tickValuesY
    },
    highlightColor: fontTitle,
    animationDuration: 7500,
  }

  const startingYear = '2001';

  const setAnimationDurations = (data, totalValues, totalDuration) => {
    if (data) {
      let delay = 100;
      data.forEach(value => {
        const duration = Math.abs((value.deficit / totalValues) * totalDuration) + 500;
        value["duration"] = duration;
        value["delay"] = delay;
        delay += duration;
      })
    }
    return data;
  }

  const getChartData = () => {
    const apiData = [];
    basicFetch(`${apiPrefix}${endpointUrl}`)
    .then((result) => {
      const lastEntry = result.data[result.data.length - 1];
      let deficitSum = 0;
      result.data.forEach((entry) => {
        const barColor = entry.record_fiscal_year === lastEntry.record_fiscal_year ? chartConfigs.highlightColor : deficitExplainerPrimary;
        const deficitValue = (Math.abs(parseFloat(entry.current_fytd_net_outly_amt)) / 1000000000000);
        deficitSum += deficitValue;
        apiData.push({
          "year": entry.record_fiscal_year,
          "deficit": deficitValue.toFixed(2),
          "deficitColor": barColor,
        })
      })
      preAPIData.forEach(entry => {
        deficitSum += Math.abs(entry.deficit);
      })
      setDate(getDateWithoutTimeZoneAdjust(new Date(result.data[result.data.length -1].record_date)));
      const newData = setAnimationDurations(preAPIData.concat(apiData), deficitSum, chartConfigs.animationDuration);
      const latestYear = newData[newData.length - 1].year;
      const latestDeficit = newData[newData.length - 1].deficit;
      setMostRecentFiscalYear(latestYear);
      setHeaderYear(latestYear);
      setMostRecentDeficit(latestDeficit);
      setHeaderDeficit(latestDeficit);
      setChartData(newData);
    });
  }

  const resetHeaderValues = () => {
    setHeaderYear(mostRecentFiscalYear);
    setHeaderDeficit(mostRecentDeficit);

    if (lastBar)
      lastBar.style.fill = chartConfigs.highlightColor;
  }

  const onBarMouseEnter = (data, event) => {
    if (data && event && data.data.year >= startingYear) {
      const barSVGs = Array.from(event.target.parentNode.parentNode.children);
      const currentBarElement = event.target.parentNode.children[0];
      currentBarElement.style.fill = chartConfigs.highlightColor;
      const lastBarElement = barSVGs[barSVGs.length - 1].children[0];
      if (currentBarElement !== lastBarElement) {
        lastBarElement.style.fill = deficitExplainerPrimary;
      }
      setLastBar(lastBarElement);
      setHeaderYear(data.data.year);
      setHeaderDeficit(data.data.deficit);
    }
  }

  const onBarMouseLeave = (data, event) => {
    if (event.target) {
      event.target.parentNode.children[0].style.fill = deficitExplainerPrimary;
    }
  }

  const handleGoogleAnalyticsMouseEnter = () =>{
    const gaEvent = getGAEvent("30");
    gaTimerChart = setTimeout(() =>{
      gaEvent && Analytics.event({
        category: gaEvent.eventCategory.replace("Fiscal Data - ", ""),
        action: gaEvent.eventAction,
        label: gaEvent.eventLabel,
      });
    }, 3000);
  }

  const handleGoogleAnalyticsMouseLeave = () =>{
    clearTimeout(gaTimerChart);
  }

  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
    delay: 1000,
  });


  useEffect(() => {
    //Run animation for header values
    chartData.map((element) => {
      if (inView && element.year >= startingYear) {
        setTimeout(() => {
          setHeaderYear(element.year);
          setHeaderDeficit(element.deficit);
        }, element.delay)
      }
    })
  }, [inView])

  useEffect(() => {
    applyChartScaling(chartConfigs.parent, chartConfigs.width, chartConfigs.height);
    addInnerChartAriaLabel(chartConfigs.parent);
    getChartData();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      applyTextScaling(chartConfigs.parent, chartConfigs.width, width, chartConfigs.fontSize);
    })
  }, [width, chartData]);

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
      Visit the <CustomLink url={slug} eventNumber="18">{name}</CustomLink> dataset to explore and
      download this data.
      <p>Please note: This data visual only includes completed fiscal years.</p>
    </div>

  const header =
    <>
      <div>
        <div className={headerTitle} data-testid="deficitFiscalYearHeader">{headerYear}</div>
        <span className={subHeader}>Fiscal Year</span>
      </div>
      <div>
        <div className={headerTitle} data-testid="deficitTotalHeader">${headerDeficit} T</div>
        <span className={subHeader}>Total Deficit</span>
      </div>
    </>


  return (
    <>
      { chartData !== [] ? (
        <div className={container}
          onMouseEnter={handleGoogleAnalyticsMouseEnter}
          onMouseLeave={handleGoogleAnalyticsMouseLeave}
          role={'presentation'}
        >
          <ChartContainer
            title={`Federal Deficit Trends Over Time, FY ${startingYear}-${mostRecentFiscalYear}`}
            altText={`Bar graph that shows the federal deficit trend from ${startingYear} to `
            + `${mostRecentFiscalYear}. Over the years, the data fluctuates with a spiked increase starting in 2019.`}
            header={header}
            footer={footer}
            date={date}
          >
            <div className={barChart}
                 onMouseLeave={resetHeaderValues}
                 data-testid={'deficitTrendsChartParent'}
                 role={'presentation'}
                 ref={ref}
            >
              <Bar
                barComponent={CustomBar}
                width={chartConfigs.width}
                height={chartConfigs.height}
                data={chartData}
                keys={['deficit']}
                indexBy="year"
                margin={{top: desktop ? 15 : 10, right: 0, bottom: 25, left: 55}}
                padding={desktop ? 0.30 : 0.35}
                colors={({id, data}) =>  String(data[`${id}Color`])}
                axisBottom={chartConfigs.axisBottom}
                axisLeft={chartConfigs.axisLeft}
                enableGridX={true}
                theme={chartConfigs.theme}
                layers={['grid', 'axes', 'bars']}
                minValue={minValue}
                maxValue={maxValue}
                gridXValues={tickValuesX}
                gridYValues={tickValuesY}
                onMouseEnter={(data, event) => {onBarMouseEnter(data, event)}}
                onMouseLeave={(data, event) => {onBarMouseLeave(data, event)}}
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
