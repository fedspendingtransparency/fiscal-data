import React from "react";
import { comingSoon } from "./federal-revenue-trends-and-us-economy.module.scss";
import TotalRevenueChart
  from "./government-revenue-and-us-economy-chart/total-revenue-chart/total-revenue-chart";
// This section will be filled out more post-mvp

const FederalRevenueTrendsAndUSEconomy = () => {
  return (
    <div>
        <p className={comingSoon}>
          Coming Soon: A section exploring how revenue trends relate to the U.S.
          economy.
        </p>
        <TotalRevenueChart />
    </div>
  );
};

export default FederalRevenueTrendsAndUSEconomy;
