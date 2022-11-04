import React from "react";
import { comingSoon } from "./federal-revenue-trends-and-us-economy.module.scss";
import TotalRevenueChart
  from "./government-revenue-and-us-economy-chart/total-revenue-chart/total-revenue-chart";
import Experimental from "../../../../../components/experimental/experimental";
import useBeaGDP from "../../../../../hooks/useBeaGDP";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const FederalRevenueTrendsAndUSEconomy = ({cpiDataByYear}) => {
  const beaGDPData = useBeaGDP(cpiDataByYear);
  return (
    <div>
      <p className={comingSoon}>
        Coming Soon: A section exploring how revenue trends relate to the U.S.
        economy.
      </p>
      <Experimental featureId={'revenue-trends-section'} >
        {beaGDPData.isGDPLoading && (
          <div>
            <FontAwesomeIcon icon={faSpinner} spin pulse /> Loading...
          </div>
        )}
        {!beaGDPData.isGDPLoading && (
          <TotalRevenueChart
            cpiDataByYear={cpiDataByYear}
            beaGDPData={beaGDPData}
          />
        )}
      </Experimental>
    </div>
  );
};

export default FederalRevenueTrendsAndUSEconomy;
