import React from "react";
import { comingSoon } from "./spending-trends.module.scss"
import Experimental from "../../../../../components/experimental/experimental";
import SpendingTrendsChart from "./spending-trends-chart/spending-trends-chart";
export const SpendingTrends = () => {
  return (
    <div>
      <p className={comingSoon}>
        Coming Soon: A section exploring changes
        in spending trends over time, and how GDP factors into those trends.
      </p>
      {/*<Experimental featureId={'spending-trends-chart'}>*/}
        <SpendingTrendsChart />
      {/*</Experimental>*/}
    </div>
  );
}

