import React, {useState} from "react";
import TotalSpendingChart from "./total-spending-chart/total-spending-chart";
import useBeaGDP from "../../../../../hooks/useBeaGDP";
export const SpendingTrends = ({cpiDataByYear}) => {
  const beaGDPData = useBeaGDP(cpiDataByYear, true);

  const [spendingTotal, setSpendingTotal] = useState(null);
  const [fiscalYear, setFiscalYear] = useState(null);
  const [spendingPercent, setSpendingPercent] = useState(null);
  const [numYears, setNumYears] = useState(null);

  const callBackDataToPage = (data) => {
    setFiscalYear(data.fiscalYear);
    setSpendingTotal(data.totalSpending);
    setSpendingPercent(data.percentOfGDP);
    setNumYears(data.numOfYearsInChart);
  };

  return (
    <div>
      <p>
        The federal government spent ${spendingTotal} in FY {fiscalYear}.
        This means federal spending was equal to {spendingPercent} of the
        total gross domestic product (GDP), or economic activity, of the United States that year.
        One of the reasons federal spending is compared to GDP is to give a reference point for
        the size of the federal government spending compared
        with economic activity throughout the entire country.
      </p>
      <p>
        How has spending changed over time? The chart below shows you how spending has
        changed over the last {numYears} years and presents total spending compared to GDP.
      </p>
      {!beaGDPData.isGDPLoading && (
        <TotalSpendingChart
          cpiDataByYear={cpiDataByYear}
          beaGDPData={beaGDPData}
          copyPageData={callBackDataToPage}
        />
      )}
    </div>
  );
}

