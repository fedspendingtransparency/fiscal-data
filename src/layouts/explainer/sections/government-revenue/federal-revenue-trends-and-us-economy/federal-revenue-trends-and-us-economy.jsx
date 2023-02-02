import React, {useState} from "react";
import TotalRevenueChart
  from "./government-revenue-and-us-economy-chart/total-revenue-chart/total-revenue-chart";
import useBeaGDP from "../../../../../hooks/useBeaGDP";
import { faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import CustomLink from "../../../../../components/links/custom-link/custom-link";
import QuoteBox from "../../../quote-box/quote-box";
import {revenueExplainerPrimary, revenueExplainerLightSecondary}
  from "../revenue.module.scss";
import {quoteBoxContent} from "../../../explainer.module.scss";
import {section} from "./federal-revenue-trends-and-us-economy.module.scss";


const FederalRevenueTrendsAndUSEconomy = ({cpiDataByYear}) => {
  const beaGDPData = useBeaGDP(cpiDataByYear, true);

  const [fiscalYear, setFiscalYear] = useState(2022);
  const [revenueRatio, setRevenueRatio] = useState('');
  const [revenueTotal, setRevenueTotal] = useState('');

  const callBackDataToPage  = (data) =>{
    setFiscalYear(data.fiscalYear);
    setRevenueRatio(data.revenueRatio);
    setRevenueTotal(data.revenueTotal);
  }


  const gps = (
    <CustomLink
      url={'https://www.gps.gov/policy/funding/'}
      eventNumber={'22'}
    >
      GPS.gov
    </CustomLink>
  );

  return (
    <div className={section}>
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
      <QuoteBox icon={faMapLocationDot}
                primaryColor={revenueExplainerPrimary}
                secondaryColor={revenueExplainerLightSecondary}
      >
        <p className={quoteBoxContent}>
          Free GPS (Global Positioning System) service enjoyed throughout the world is funded
          by general U.S. tax revenues.
          <br />
          <span style={{ fontSize: "16px" }}>Source: {gps}</span>
        </p>
      </QuoteBox>
    </div>
  );
};

export default FederalRevenueTrendsAndUSEconomy;
