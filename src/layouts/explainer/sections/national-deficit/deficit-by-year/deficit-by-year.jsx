import {deficitExplainerPrimary} from "../national-deficit.module.scss";
import {visWithCallout} from "../../../explainer.module.scss";
import VisualizationCallout
  from "../../../../../components/visualization-callout/visualization-callout";
import React, {useEffect, useState} from "react";
import CustomLink from "../../../../../components/links/custom-link/custom-link";
import  DeficitTrendsBarChart  from "./deficit-trends-bar-chart/deficit-trends-bar-chart";
import {apiPrefix, basicFetch} from "../../../../../utils/api-utils";
import {
  deficit2001Full,
  endpointUrl,
  getDeficitDiffPercentage
} from "./deficit-trends-bar-chart/deficit-trends-bar-chart-helpers";

const DeficitByYear = () => {

  const [latestFiscalYear, setLatestFiscalYear] = useState('');
  const [defDifPercent, setDefDifPercent] = useState('');
  const [difBool, setDifBool] = useState('');

  const getCalloutData = () => {
    basicFetch(`${apiPrefix}${endpointUrl}`)
    .then((result) => {
      const latestDeficit = parseFloat(result.data[result.data.length - 1].current_fytd_net_outly_amt);
      const latestFiscalYear = result.data[result.data.length - 1].record_fiscal_year;
      const difResult = getDeficitDiffPercentage(latestDeficit);
      setDefDifPercent(difResult);
      if (latestDeficit < deficit2001Full) {
        setDifBool('less');
      }
      else {
        setDifBool('greater');
      }
      setLatestFiscalYear(latestFiscalYear);
    });
  }

  useEffect(() => {
    getCalloutData();
  }, [])

  const federalCovidResponseLink =
    <CustomLink url={'https://www.usaspending.gov/disaster/covid-19?publicLaw=all'}>
      the federal response to COVID-19
    </CustomLink>

  return (
    <>
      <div data-testid={'textContent'}>
        <p>
          Since 2001, the federal government’s budget has run a deficit each year. Starting in
          2016, increases in spending on Social Security, health care, and interest on federal
          debt have outpaced the growth of federal revenue.
        </p>
        <p>
          From FY 2019 to FY 2021, federal spending increased by about 50 percent in response to
          the COVID-19 pandemic. Visit USAspending.gov to learn more
          about {federalCovidResponseLink}.
        </p>
      </div>
      <div className={visWithCallout} >
        <DeficitTrendsBarChart />
        <VisualizationCallout color={deficitExplainerPrimary}>
          <p>
            The federal deficit was {defDifPercent}% {difBool} in FY 2001 than in FY {latestFiscalYear}.
          </p>
          <p>
            The last surplus for the federal government was in 2001.
          </p>
        </VisualizationCallout>
      </div>
    </>
  )
};

export default DeficitByYear;
