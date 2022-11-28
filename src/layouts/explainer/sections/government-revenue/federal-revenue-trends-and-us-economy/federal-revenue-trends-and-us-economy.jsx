import React, {useState} from "react";
import { comingSoon } from "./federal-revenue-trends-and-us-economy.module.scss";
import TotalRevenueChart
  from "./government-revenue-and-us-economy-chart/total-revenue-chart/total-revenue-chart";
import Experimental from "../../../../../components/experimental/experimental";
import useBeaGDP from "../../../../../hooks/useBeaGDP";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';


const FederalRevenueTrendsAndUSEconomy = ({cpiDataByYear}) => {
  const beaGDPData = useBeaGDP(cpiDataByYear);

  const [fiscalYear, setFiscalYear] = useState(2022);
  const [revenueRatio, setRevenueRatio] = useState('');
  const [revenueTotal, setRevenueTotal] = useState('');

  const callBackDataToPage  = (data) =>{
    setFiscalYear(data.fiscalYear);
    setRevenueRatio(data.revenueRatio);
    setRevenueTotal(data.revenueTotal);
  }

  return (
    <div>
      <p>
        In fiscal year {fiscalYear}, federal revenue was
        equal to {revenueRatio} of total gross domestic product (GDP), or economic
        activity, of the United States that year ${revenueTotal}.
      </p>
      <p>
        Why do we compare federal revenue to gross domestic product? The
        comparison serves as a rough gauge of the size of the federal
        government's footprint related to size of the country's economic
        activity. Since federal taxes are based on a percentage of income for
        people and businesses, as people and businesses earn more the federal
        revenue from taxes increases.
      </p>
        {!beaGDPData.isGDPLoading && (
          <TotalRevenueChart
            cpiDataByYear={cpiDataByYear}
            beaGDPData={beaGDPData}
            copyPageData={callBackDataToPage}
          />
        )}
    </div>
  );
};

export default FederalRevenueTrendsAndUSEconomy;
