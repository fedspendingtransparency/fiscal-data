import {textContent} from "../../national-deficit/understanding/understanding-deficit.module.scss";
import {visWithCallout} from "../../../explainer.module.scss";
import VisualizationCallout
  from "../../../../../components/visualization-callout/visualization-callout";
import React, {useEffect, useState} from "react";
import {revenueExplainerPrimary} from "../revenue.module.scss";
import RevenueTrendsLineChart from "./revenue-trends-line-chart/revenue-trends-line-chart";
import {apiPrefix, basicFetch} from "../../../../../utils/api-utils";

const FederalRevenueTrendsOverTime = () => {

  const [firstChartYear, setFirstChartYear] = useState(0);

  useEffect(() => {
    const endpointURL = 'v1/accounting/mts/mts_table_4?filter=line_code_nbr:eq:830,'
      + 'record_calendar_month:eq:09&sort=record_date&page[size]=1';
    basicFetch(`${apiPrefix}${endpointURL}`)
      .then((res) => {
        if (res.data[0]) {
          setFirstChartYear(res.data[0].record_fiscal_year);
        }
      })
  }, [])

  return(
    <div>
      <div className={visWithCallout}>
        <div className={textContent} data-testid={'textContent'}>
          <p>
            The majority of federal revenue comes from individual and
            corporate income taxes as well as social insurance taxes.
            As shown in the chart below, federal revenue increases during
            periods of higher earnings for individuals and
            corporations because more income is collected in taxes.
            Revenue also increases during periods with higher tax rates. Alternatively,
            when individuals or corporations make less money or the tax rate is lowered,
            the government earns less revenue.
          </p>
            If the U.S. government increases tariffs on imports from
            a particular country or countries,
            it could increase revenues, depending on the level of trade the U.S.
            continues to do with those countries.
            However, if tariffs increase and U.S. consumers import
            fewer goods as a result of the higher prices,
            then revenue from customs duties could decrease overall.
        </div>
          <VisualizationCallout color={revenueExplainerPrimary} customTopMargin={'2.8%'}>
            <p>
              Individual income tax has remained the top source of income for the U.S.
              government since {firstChartYear}
            </p>
          </VisualizationCallout>
      </div>
      <p>
        The chart below shows how federal revenue has changed over time, broken out by the
        various source categories.
      </p>
      <div className={visWithCallout}>
        <RevenueTrendsLineChart />
        <VisualizationCallout color={revenueExplainerPrimary}>
          <p>
            Total revenue has (increased/decreased) from
            ($XX.X T) in (YYYY (first available year in the chart)} to
            ($XX.X T) in (YYYY (latest complete fiscal year)).
          </p>
        </VisualizationCallout>
      </div>
    </div>
  );
}

export default FederalRevenueTrendsOverTime;
