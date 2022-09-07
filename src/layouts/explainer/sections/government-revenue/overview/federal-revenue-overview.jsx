import React from "react";
import VisualizationCallout
  from "../../../../../components/visualization-callout/visualization-callout";
import {revenueExplainerPrimary} from "../../../explainer-helpers/explainer-helpers.module.scss";
import {visWithCallout} from "../../../explainer.module.scss";



const FederalRevenueOverview = () => {

  return(
    <div className={visWithCallout}>
      <div>
        <p>
          Where does federal revenue come from? If you lived or worked in the United States
          in YYYY (latest complete fiscal year, your tax contributions are likely part of
          the $X.XX trillion collected in revenue. The federal government also collects
          revenue from services like admission to national parks and customs duties. This
          revenue is used to pay for goods and services provided to United States citizens
          and businesses.
        </p>
        <p>
          In FY YYYY (latest complete fiscal year), the federal government spent
          $X.XX trillion. Since the government spent more/less than it collected,
          the deficit/surplus for YYYY (latest complete fiscal year) was $X.XX trillion.
        </p>
      </div>
      <VisualizationCallout color={revenueExplainerPrimary} textWithCallout={true}>
        <p>
          Callout Placeholder
        </p>
      </VisualizationCallout>
    </div>
  );
}

export default FederalRevenueOverview;
