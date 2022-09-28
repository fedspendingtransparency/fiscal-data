import React from "react";
import { quoteBoxContent } from "../../../explainer.module.scss";
import QuoteBox from "../../../quote-box/quote-box";
import CustomLink from "../../../../../components/links/custom-link/custom-link";
import {
  revenueExplainerPrimary,
  revenueExplainerLightSecondary,
} from "../revenue.module.scss";
import { faMapLocationDot } from "@fortawesome/free-solid-svg-icons";
import { comingSoon } from "./federal-revenue-trends-and-us-economy.module.scss";
// This section will be filled out more post-mvp

const FederalRevenueTrendsAndUSEconomy = () => {
  return (
    <div>
      <div>
        <p className={comingSoon}>
          Coming Soon: A section exploring how revenue trends relate to the U.S.
          economy.
        </p>
      </div>
    </div>
  );
};

export default FederalRevenueTrendsAndUSEconomy;
