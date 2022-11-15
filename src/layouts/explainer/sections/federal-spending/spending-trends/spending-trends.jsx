import React from "react";
import { comingSoon } from "./spending-trends.module.scss"
import Experimental from "../../../../../components/experimental/experimental";
import TotalSpendingChart from "./total-spending-chart/total-spending-chart";
export const SpendingTrends = ({cpiDataByYear}) => {
  return (
    <div>
      <p>
        The federal government spent $XX.X T in FY YYYY (latest complete fiscal year).
        This means federal spending was equal to XX% of the total gross domestic product (GDP), or economic activity, of the United States that year.
        One of the reasons federal spending is compared to GDP is to give a reference point for the size of the federal government spending compared
        with economic activity throughout the entire country.
      </p>
      <p>
        How has spending changed over time? The chart below shows you how spending has changed over the last # years and presents total spending compared to GDP.
      </p>
      <Experimental featureId={'spending-trends-chart'}>
        <TotalSpendingChart cpiDataByYear={cpiDataByYear} />
      </Experimental>
    </div>
  );
}

