import React, {useEffect, useState} from "react";
import VisualizationCallout
  from "../../../../../components/visualization-callout/visualization-callout";
import { visWithCallout } from "../../../explainer.module.scss";
import Accordion from "../../../../../components/accordion/accordion";
import {
  spendingCategoriesContent
} from "./spending-categories.module.scss";
import {
  spendingAccordion,
  spendingExplainerPrimary
} from "../federal-spending.module.scss";
import HowMuchDoesTheGovtSpend from "../how-much-does-the-govt-spend/how-much-does-the-govt-spend";
import {apiPrefix, basicFetch} from "../../../../../utils/api-utils";

import CustomLink from "../../../../../components/links/custom-link/custom-link"
export const SpendingCategories = () => {
  const [latestCompleteFiscalYear, setLatestCompleteFiscalYear] = useState(null);

  useEffect(() => {
    const endpointUrl = 'v1/accounting/mts/mts_table_9?filter=record_type_cd:eq:F'
      + '&sort=-record_date,-current_fytd_rcpt_outly_amt&page[size]=19';
    basicFetch(`${apiPrefix}${endpointUrl}`)
      .then((res) => {
        if (res.data) {
          setLatestCompleteFiscalYear(res.data[0].record_fiscal_year);
        }
      });
  }, [])

  const spendingExplorer = (
    <CustomLink url={"https://www.usaspending.gov/explorer"}
                eventNumber="14"
    >
      Spending Explorer
    </CustomLink>
  )
  const agencyProfile = (
    <CustomLink url={"https://www.usaspending.gov/agency"}
                eventNumber="34"
    >
      Agency Profile
    </CustomLink>
  )

  return (
    <div className={spendingCategoriesContent}>
      <p>
        The federal budget is divided into approximately 20 categories, known as
        budget functions. These categories organize federal spending into topics
        based on their purpose (e.g., National Defense, Transportation, and
        Health).
      </p>
      <h5>What does the government buy?</h5>
      <p>
        The government buys a variety of products and services used to serve the
        public - everything from military aircraft, construction and highway
        maintenance equipment, buildings, and livestock, to research, education,
        and training. The chart below shows the top 10 categories and agencies
        for federal spending in FY {latestCompleteFiscalYear}.
      </p>
      <div className={visWithCallout}>
        <HowMuchDoesTheGovtSpend />
        <VisualizationCallout color={spendingExplainerPrimary}>
          <p>
            For more details on U.S. government spending by category and agency,
            visit USAspending.gov’s {spendingExplorer} and {agencyProfile}{" "}
            pages.
          </p>
        </VisualizationCallout>
      </div>
      <div className={spendingAccordion}>
        <Accordion title="What does the future of Social Security and Medicare look like?"
                   openEventNumber="16"
                   explainerGAEvent="Spending"
                   ga4ID={"social-sec"}
        >
          Each year, the Social Security and Medicare Boards of Trustees publish
          their{" "}
          {
            <CustomLink href={"https://www.ssa.gov/oact/TRSUM/"}
                        eventNumber="24"
            >
              Annual Reports on the Financial Status of Social Security and
              Medicare.
            </CustomLink>
          }{" "}
          The Boards’ projections indicate that spending will continue to
          increase. As the average age of Americans increases, more funding is
          needed to support entitlement programs like Social Security, Medicare,
          and retirement and disability services for both military and civil
          servants{" "}
        </Accordion>
      </div>
    </div>
  )
}
