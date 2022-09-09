import React from "react";
import { quoteBoxContent } from "../../../explainer.module.scss";
import QuoteBox from "../../../quote-box/quote-box";
import CustomLink from "../../../../../components/links/custom-link/custom-link";
import {revenueExplainerPrimary, revenueExplainerLightSecondary} from "../revenue.module.scss";
import { faMapLocationDot } from "@fortawesome/free-solid-svg-icons";
import {ChartPlaceholder} from
    "../../../explainer-helpers/federal-spending/federal-spending-helper";
// This section will be filled out more post-mvp

const FederalRevenueTrendsAndUSEconomy = () => {

  const irsGov = <CustomLink url={'https://www.gps.gov/policy/funding/'}>GPS.gov</CustomLink>;

  return(
    <div>
      <div>
        Coming Soon
        <ChartPlaceholder />
      </div>
      <QuoteBox
        icon={faMapLocationDot}
        primaryColor={revenueExplainerPrimary}
        secondaryColor={revenueExplainerLightSecondary}
      >
        <p className={quoteBoxContent}>
          Free GPS (Global Positioning System) service enjoyed throughout the world is funded by general U.S. tax revenues.
          <br/>
          <span>
          Source: {irsGov}
        </span>
        </p>
      </QuoteBox>
    </div>
  );
}

export default FederalRevenueTrendsAndUSEconomy;
