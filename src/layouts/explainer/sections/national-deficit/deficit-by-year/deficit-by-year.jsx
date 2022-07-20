import {deficitExplainerPrimary} from "../national-deficit.module.scss";
import {visWithCallout} from "../../../explainer.module.scss";
import VisualizationCallout
  from "../../../../../components/visualization-callout/visualization-callout";
import React from "react";
import {ChartPlaceholder} from "../national-deficit";
import CustomLink from "../../../../../components/links/custom-link/custom-link";

const DeficitByYear = () => {
  const federalCovidResponseLink =
    <CustomLink url={'https://www.usaspending.gov/disaster/covid-19?publicLaw=all'}>
      the federal response to COVID-19
    </CustomLink>

  return (
    <>
      <p>
        Since 2001, the federal government’s budget has run a deficit each year. Beginning in 2016,
        increases in spending on Social Security, health care, and interest on federal debt have
        outpaced the growth of federal revenue.
      </p>
      <p>
        From FY 2019 to FY 2021, federal spending increased by about 50 percent in response to the
        COVID-19 pandemic. Visit USAspending.gov to learn more about {federalCovidResponseLink}.
      </p>
      <div className={visWithCallout} >
        <ChartPlaceholder />
        <VisualizationCallout color={deficitExplainerPrimary}>
          <p>
            The federal deficit was XX% greater/less in FY 2001 than in FY YYYY (latest complete
            fiscal year).
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
