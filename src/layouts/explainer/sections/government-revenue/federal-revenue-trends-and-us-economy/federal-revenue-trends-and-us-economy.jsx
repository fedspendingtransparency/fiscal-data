import React from "react";
import { comingSoon } from "./federal-revenue-trends-and-us-economy.module.scss";
import TotalRevenueChart
  from "./government-revenue-and-us-economy-chart/total-revenue-chart/total-revenue-chart";
import Experimental from "../../../../../components/experimental/experimental";

const FederalRevenueTrendsAndUSEconomy = () => {
  return (
    <div>
        <p className={comingSoon}>
          Coming Soon: A section exploring how revenue trends relate to the U.S.
          economy.
        </p>
      <Experimental featureId={'revenue-trends-section'} exclude={true}>
        <TotalRevenueChart />
      </Experimental>
    </div>
  );
};

export default FederalRevenueTrendsAndUSEconomy;
