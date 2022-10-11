import {deficitExplainerPrimary} from "../national-deficit.module.scss";
import React from "react";
import {visWithCallout} from "../../../explainer.module.scss";
import VisualizationCallout
  from "../../../../../components/visualization-callout/visualization-callout";
import CustomLink from "../../../../../components/links/custom-link/custom-link";
import  DeficitTrendsBarChart  from "./deficit-trends-bar-chart/deficit-trends-bar-chart";

const DeficitByYear = () => {

  const federalCovidResponseLink =
    <CustomLink url={'https://www.usaspending.gov/disaster/covid-19?publicLaw=all'} eventNumber='17'>
      in response to the COVID-19 pandemic
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
          From FY 2019 to FY 2021, federal spending increased by about 50 percent {federalCovidResponseLink}.
        </p>
      </div>
      <div className={visWithCallout} >
        <DeficitTrendsBarChart />
        <VisualizationCallout color={deficitExplainerPrimary}>
          <p>
            The last surplus for the federal government was in 2001.
          </p>
        </VisualizationCallout>
      </div>
    </>
  )
};

export default DeficitByYear;
