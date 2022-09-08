import {visWithCallout, quoteBoxContent} from "../../../explainer.module.scss";
import VisualizationCallout
  from "../../../../../components/visualization-callout/visualization-callout";
import React from "react";
import QuoteBox from "../../../quote-box/quote-box"
import CustomLink from "../../../../../components/links/custom-link/custom-link";
import {ChartPlaceholder} from
    "../../../explainer-helpers/federal-spending/federal-spending-helper";
import {revenueExplainerPrimary, revenueExplainerLightSecondary} from "../revenue.module.scss";
import {sourcesContent} from "./sources-of-federal-revenue.module.scss";
import { faMartiniGlassCitrus } from "@fortawesome/free-solid-svg-icons"


const SourcesOfFederalRevenue = () => {
  const irsGov = <CustomLink url={'https://www.irs.gov/newsroom/historical-highlights-of-the-irs'}>irs.gov</CustomLink>;
  return (
    <div className={sourcesContent}>
      <p>
        Most of the revenue the U.S. government collects comes from contributions from individual
        taxpayers, small businesses, and corporations through taxes. Additional sources of tax
        revenue consist of excise tax, estate tax, and other taxes and fees. So far in FY YYYY
        (current fiscal year), individual income taxes have accounted for XX.X% of total revenue
        while Social Security and Medicare taxes made up another XX.X%.
      </p>
      <p>
        Government revenue also comes from payments to federal agencies like the U.S. Department of
        the Interior. Have you visited a national park recently? Did you know your national park
        entry is included in government revenue? Other agencies generate revenue from leases, the
        sale of natural resources, and various usage and licensing fees.
      </p>
      <div className={visWithCallout}>
        <ChartPlaceholder />
        <VisualizationCallout color={revenueExplainerPrimary}>
          <p>
            In FY YYYY (current fiscal year-to-date), the combined contribution of individual and
            corporate income taxes is $XX.X B, making up XX% of total revenue.
          </p>
        </VisualizationCallout>
      </div>
      <h5>Social Security and Medicare Taxes</h5>
      <p>
        Unlike personal income taxes, which support a variety of programs, these taxes are only
        used to fund Social Security and Medicare. These funds are collected from your paycheck,
        and in most cases, matched by your employer, and then divided into separate trust funds
        that support each of those programs.
      </p>
      <p>
        Social Security has two trust fund accounts: the Old Age and Survivors Insurance Trust Fund
        (OASI) and the Disability Trust Fund (DI). The funds in these accounts are responsible for
        providing workers and their families with retirement, disability, and survivor's insurance
        benefits.
      </p>
      <p>
        Medicare also has two accounts: the Hospital Insurance Trust Fund (HI), also known as
        Medicare Part A, and the Supplementary Medicare Insurance Trust Fund (SMI). These funds pay
        for hospital, home health, skilled nursing, and hospice care for the elderly and disabled.
      </p>
      <QuoteBox
        icon={faMartiniGlassCitrus}
        primaryColor={revenueExplainerPrimary}
        secondaryColor={revenueExplainerLightSecondary}
      >
        <p className={quoteBoxContent}>
        From 1868 until 1913, 90% of all federal revenue came from taxes on liquor, beer, wine, and tobacco.
        <br/>
        <span>
          Source: {irsGov}
        </span>
        </p>
      </QuoteBox>
    </div>
  );
}

export default SourcesOfFederalRevenue;
