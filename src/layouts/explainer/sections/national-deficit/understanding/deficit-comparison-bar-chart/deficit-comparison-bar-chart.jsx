import {visWithCallout} from "../../../../explainer.module.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import {Bar} from "@nivo/bar";
import VisualizationCallout
  from "../../../../../../components/visualization-callout/visualization-callout";
import React, {useEffect, useState} from "react";
import ChartContainer from "../../../../explainer-components/chart-container/chart-container";
import {pxToNumber} from "../../../../../../helpers/styles-helper/styles-helper";
import {withWindowSize} from "react-fns";
import {barChart, container} from './deficit-comparison-bar-chart.module.scss';
import {deficitExplainerPrimary} from "../../national-deficit.module.scss";
import {
  breakpointLg,
  fontBodyCopy
} from "../../../../../../variables.module.scss";
import {
  barChartColors,
  desktopHeight,
  mobileHeight,
  layers,
  theme
} from './deficit-comparison-bar-chart-helper';
import {apiPrefix, basicFetch} from "../../../../../../utils/api-utils";
import {nationalDeficitSectionConfigs} from "../../national-deficit";
import CustomLink from "../../../../../../components/links/custom-link/custom-link";
import {getDateWithoutTimeZoneAdjust} from "../../../../../../utils/date-utils";
import Analytics from "../../../../../../utils/analytics/analytics";
import {addInnerChartAriaLabel} from "../../../../explainer-helpers/explainer-charting-helper";
import CustomBar from './custom-bar/customBar';

const DeficitComparisonBarChart = ({sectionId, width}) => {
  const [date, setDate] = useState(new Date ());
  const [lastFiscalYear, setLastFiscalYear] = useState(0);
  const [deficitValue, setDeficitValue] = useState(0);
  const [deficitLabel, setDeficitLabel] = useState("");
  const [deficitChangeValue, setDeficitChangeValue] = useState(0);
  const [deficitChangeLabel, setDeficitChangeLabel] = useState("");
  const [revenueValue, setRevenueValue] = useState(0);
  const [revenueLabel, setRevenueLabel] = useState("");
  const [spendingValue, setSpendingValue] = useState(0);
  const [spendingLabel, setSpendingLabel] = useState("");
  const [data, setData] = useState(null);
  const [debtMarkerDelay, setDebtMarkerDelay] = useState(null);

  const desktop = width >= pxToNumber(breakpointLg);
  const {
    name,
    slug,
    endpoints
  } = nationalDeficitSectionConfigs[sectionId];

  const chartParent = 'chartParentDiv';

  const setAnimationDurations = (data) => {
    if(data && data.length >= 2) {
      const revenue = parseFloat(data[0]['revenue']);
      const deficit = data[0]['deficit'];
      const spending = parseFloat(data[1]['spending']);
      const totalDuration = 6000;
      const total = revenue + deficit + spending;
      const revenue_duration = (revenue / total) * totalDuration;
      const deficit_duration = (deficit / total) * totalDuration;
      const spending_duration = (spending / total) * totalDuration;

      if(!debtMarkerDelay) {
        setDebtMarkerDelay(revenue_duration + deficit_duration + spending_duration + 1250);
      }

      data[0]["revenue_animation_duration"] = revenue_duration;
      data[0]["deficit_animation_duration"] = deficit_duration;
      data[1]["spending_animation_duration"] = spending_duration;
      data[1]["revenue_deficit_animation_duration"] = revenue_duration + deficit_duration;

      return data;
    }
  }

  const chartData = setAnimationDurations(data);

  const mst =
    <CustomLink url={slug} eventNumber='13'>{name}
    </CustomLink>

  const footer =
    <div>
      Visit the {mst} dataset to explore and download
      this data.
      <p>
        Please note: This data visual only includes completed fiscal years. The following
        year will be displayed at the end of the fiscal year.
      </p>
    </div>

  const chartCopy = {
    title: 'U.S. Deficit Compared to Revenue and Spending, FY ',
    altText: 'Bar chart comparing the differences between the U.S. government’s spending and '+
      'revenue, resulting in a deficit for FY ',
    footer: footer
  }

  const dateEndpoint = endpoints[0];
  const deficitEndpoint = endpoints[1];
  const revenueEndpoint = endpoints[2];
  const spendingEndpoint = endpoints[3];
  const deficitChangeEndpoint = endpoints[4];

  useEffect(() => {
    addInnerChartAriaLabel(chartParent);
  }, [data]);

  useEffect(() => {
    basicFetch(`${apiPrefix}${dateEndpoint.path}`)
      .then(response => {
        setDate(getDateWithoutTimeZoneAdjust(response.data[0][dateEndpoint.dateField]));
        setLastFiscalYear(response.data[0][dateEndpoint.valueField]);
      });
  }, []);

  useEffect(() => {
    basicFetch(`${apiPrefix}${deficitEndpoint.path}`)
      .then(response => {
        const value = Math.abs(response.data[0][deficitEndpoint.valueField]);
        setDeficitValue(value);
        setDeficitLabel((value / 1000000000000).toFixed(2));
      });
  }, []);

  useEffect(() => {
    basicFetch(`${apiPrefix}${revenueEndpoint.path}`)
      .then(response => {
        const value = response.data[0][revenueEndpoint.valueField];
        setRevenueValue(value);
        setRevenueLabel((value / 1000000000000).toFixed(2));
      });
  }, []);

  useEffect(() => {
    basicFetch(`${apiPrefix}${spendingEndpoint.path}`)
      .then(response => {
        const value = response.data[0][spendingEndpoint.valueField];
        setSpendingValue(value);
        setSpendingLabel((value / 1000000000000).toFixed(2));

      });
  }, []);

  useEffect(() => {
    basicFetch(`${apiPrefix}${deficitChangeEndpoint.path}`)
      .then(response => {
        const value = Math.abs(response.data[0][deficitChangeEndpoint.valueField]);
        setDeficitChangeValue(value);
      });
  }, []);

  if(!data && deficitValue && revenueValue && spendingValue && deficitChangeValue) {
    const deficitDifference = Math.abs(deficitValue - deficitChangeValue);
    let deficitDifferenceText = '';

    if(deficitDifference >= 1000000000000) {
      deficitDifferenceText =`$${(deficitDifference / 1000000000000).toFixed(2)} trillion`
    } else {
      deficitDifferenceText =`$${(deficitDifference / 1000000000).toFixed()} billion`
    }

    if(deficitValue > deficitChangeValue) {
      setDeficitChangeLabel(
        `an increase of ${deficitDifferenceText}`);
    } else if(deficitValue < deficitChangeValue) {
      setDeficitChangeLabel(
        `a decrease of ${deficitDifferenceText}`);
    } else {
      setDeficitChangeLabel('not changed');
    }

    setData(
      [
        {
          id: 0,
          revenue: revenueValue,
          deficit: deficitValue
        },
        {
          id: 1,
          spending: spendingValue
        }
      ]
    );
  }


  return(
    <div className={visWithCallout}>
      {!data && (
        <div>
          <FontAwesomeIcon icon={faSpinner} spin pulse /> Loading...
        </div>
      )}
      {data && (
        <>
          <div data-testid={'deficitComparisonChart'} className={container}>
            <ChartContainer
              title={`${chartCopy.title}${lastFiscalYear}`}
              altText={`${chartCopy.altText}${lastFiscalYear}.`}
              footer={chartCopy.footer}
              date={date}
            >
              <div className={barChart} data-testid={'chartParentDiv'}>
                <Bar
                  barComponent={CustomBar}
                  width={desktop ? 408 : 304}
                  height={desktop ? desktopHeight : mobileHeight}
                  axisTop={null}
                  axisRight={null}
                  axisLeft={null}
                  axisBottom={null}
                  data={chartData}
                  keys={['revenue', 'deficit', 'spending']}
                  margin={ desktop ?
                    { top: 0, right: 74, bottom: 0, left: 74 } :
                    { top: 0, right: 65, bottom: 0, left: 65 }
                  }
                  padding={desktop ? 0.29 : 0.19}
                  valueScale={{ type: 'linear' }}
                  colors={barChartColors}
                  isInteractive={false}
                  borderColor={fontBodyCopy}
                  enableGridY={true}
                  gridYValues={[0]}
                  enableLabel={false}
                  layers={[...layers]}
                  theme={theme}
                />
              </div>
            </ChartContainer>
          </div>
          <VisualizationCallout color={deficitExplainerPrimary}>
            <p>
              In FY {lastFiscalYear} total government spending was ${spendingLabel} trillion
              and total revenue was ${revenueLabel} trillion, resulting in a deficit of
              ${deficitLabel} trillion, {deficitChangeLabel} from the previous fiscal year.
            </p>
          </VisualizationCallout>
        </>
      )}
    </div>
  )
}

export default withWindowSize(DeficitComparisonBarChart);
