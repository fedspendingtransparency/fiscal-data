import { textContent } from "../../national-deficit/understanding/understanding-deficit.module.scss";
import { visWithCallout } from "../../../explainer.module.scss";
import VisualizationCallout from "../../../../../components/visualization-callout/visualization-callout";
import React, { useEffect, useState } from "react";
import { revenueExplainerPrimary } from "../revenue.module.scss";
import RevenueTrendsLineChart from "./revenue-trends-line-chart/revenue-trends-line-chart";
import { apiPrefix, basicFetch } from "../../../../../utils/api-utils";
import { adjustDataForInflation } from "../../../../../helpers/inflation-adjust/inflation-adjust";
import { getShortForm } from "../../../../../utils/rounding-utils";

const FederalRevenueTrendsOverTime = ({ cpiDataByYear }) => {
  const [firstChartYear, setFirstChartYear] = useState(0);
  const [firstRevenue, setFirstRevenue] = useState("");
  const [lastChartYear, setLastChartYear] = useState(0);
  const [lastRevenue, setLastRevenue] = useState("");
  const [revenueTag, setRevenueTag] = useState("");
  const [highestCollectionYear, setHighestCollectionYear] = useState("");
  useEffect(() => {
    const endpointURLFirst =
      "v1/accounting/mts/mts_table_4?filter=line_code_nbr:eq:830," +
      "record_calendar_month:eq:09&sort=record_date&page[size]=1";
    basicFetch(`${apiPrefix}${endpointURLFirst}`).then(res => {
      if (res.data[0]) {
        const endpointURLLast =
          "v1/accounting/mts/mts_table_4?filter=line_code_nbr:eq:830," +
          "record_calendar_month:eq:09&sort=-record_date&page[size]=1";
        basicFetch(`${apiPrefix}${endpointURLLast}`).then(resLast => {
          if (resLast.data[0]) {
            let concatData = res.data.concat(resLast.data);
            concatData = adjustDataForInflation(
              concatData,
              "current_fytd_net_rcpt_amt",
              "record_date",
              cpiDataByYear
            );
            setFirstChartYear(concatData[0].record_fiscal_year);
            setFirstRevenue(
              getShortForm(concatData[0].current_fytd_net_rcpt_amt)
            );
            setLastChartYear(concatData[1].record_fiscal_year);
            setLastRevenue(
              getShortForm(concatData[1].current_fytd_net_rcpt_amt)
            );
            if (
              parseFloat(concatData[1].current_fytd_net_rcpt_amt) >
              parseFloat(res.data[0].current_fytd_net_rcpt_amt)
            ) {
              setRevenueTag("increased");
            } else {
              setRevenueTag("decreased");
            }
          }
        });
      }
    });

    const highestTotalEndpoint = `v1/accounting/mts/mts_table_4?filter=line_code_nbr:eq:830,record_calendar_month:eq:09&sort=record_date`;
    basicFetch(`${apiPrefix}${highestTotalEndpoint}`)
      .then(res => {
        if (res) {
          const highest = res.data
            .sort(
              (a, b) =>
                b.current_fytd_net_rcpt_amt - a.current_fytd_net_rcpt_amt
            )
            .map(item => {
              return {
                amount: item.current_fytd_net_rcpt_amt,
                year: item.record_fiscal_year,
              };
            })[0]?.year;
          setHighestCollectionYear(highest);
        }
      })
      .catch(err => console.log(err, "THE ERROR WHEN FETCHING"));
  }, []);

  return (
    <div>
      <div className={visWithCallout}>
        <div className={textContent} data-testid={"textContent"}>
          <p>
            The majority of federal revenue comes from individual and corporate
            income taxes as well as social insurance taxes (such as the Social
            Security taxes described above). As shown in the chart below,
            federal revenue increases during periods of higher earnings for
            individuals and corporations because more income is collected in
            taxes. Revenue also increases during periods with higher tax rates.
            Alternatively, when individuals or corporations make less money or
            the tax rate is lowered, the government earns less revenue.
            In {highestCollectionYear}, the U.S. government collected the highest
            total revenue in its history.
          </p>
          If the U.S. government increases tariffs on imports from a particular
          country or countries, it could increase revenues, depending on the
          level of trade the U.S. continues to do with those countries. However,
          if tariffs increase and U.S. consumers import fewer goods as a result
          of the higher prices, then revenue from customs duties could decrease
          overall.
        </div>
        <VisualizationCallout
          color={revenueExplainerPrimary}
          customTopMargin={"2.8%"}
        >
          <p>
            Individual income tax has remained the top source of income for the
            U.S. government since {firstChartYear}.
          </p>
        </VisualizationCallout>
      </div>
      <p>
        The chart below shows how federal revenue has changed over time, broken
        out by the various source categories.
      </p>
      <div className={visWithCallout}>
        <RevenueTrendsLineChart cpiDataByYear={cpiDataByYear} />
        <VisualizationCallout color={revenueExplainerPrimary}>
          <p>
            Total revenue has {revenueTag} from ${firstRevenue} in{" "}
            {firstChartYear} to ${lastRevenue} in {lastChartYear}.
          </p>
        </VisualizationCallout>
      </div>
    </div>
  );
};

export default FederalRevenueTrendsOverTime;
