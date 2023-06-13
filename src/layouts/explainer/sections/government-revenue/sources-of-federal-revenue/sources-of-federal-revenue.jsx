import React, { useEffect, useState } from "react";
import {
  visWithCallout,
  quoteBoxContent,
} from "../../../explainer.module.scss";
import QuoteBox from "../../../quote-box/quote-box";
import CustomLink from "../../../../../components/links/custom-link/custom-link";
import {
  revenueExplainerPrimary,
  revenueExplainerLightSecondary,
} from "../revenue.module.scss";
import { sourcesContent } from "./sources-of-federal-revenue.module.scss";
import { faMartiniGlassCitrus } from "@fortawesome/free-solid-svg-icons";
import SourcesOfRevenueCircleChart
  from "./sources-of-revenue-circle-chart/sources-of-revenue-circle-chart";
import { apiPrefix, basicFetch } from "../../../../../utils/api-utils";
import GlossaryPopoverDefinition from "../../../../../components/glossary/glossary-term/glossary-popover-definition";
import Accordion from "../../../../../components/accordion/accordion";
import {revenueAccordion} from "../revenue.module.scss";
const SourcesOfFederalRevenue = ({ glossary, glossaryClickHandler }) => {
  const [currentFiscalYear, setCurrentFiscalYear] = useState(0);
  const [indvPercent, setIndvPercent] = useState('');
  const [ssPercent, setSSPercent] = useState('');

  useEffect(() => {
    const endpointURL =
      "v1/accounting/mts/mts_table_9?filter=record_type_cd:eq:RSG," +
      "sequence_number_cd:eq:1.1&sort=-record_date&page%5bsize%5d=1";
    const supplementaryEndpointURL =
      "v1/accounting/mts/mts_table_9?" +
      "filter=line_code_nbr:eq:120&sort=-record_date&page[size]=1";
    const socialSecurityEndpointURL =
      "v1/accounting/mts/mts_table_9?filter=line_code_nbr:in:(50,60,70)&sort=-record_date&page[size]=3";
    basicFetch(`${apiPrefix}${endpointURL}`).then(res => {
      if (res.data[0]) {
        setCurrentFiscalYear(res.data[0].record_fiscal_year);
        basicFetch(`${apiPrefix}${supplementaryEndpointURL}`).then(
          supplementaryRes => {
            if (supplementaryRes.data[0]) {
              setIndvPercent(
                (Math.round(
                  (parseFloat(res.data[0]?.current_fytd_rcpt_outly_amt) /
                    parseFloat(
                      supplementaryRes.data[0]?.current_fytd_rcpt_outly_amt
                    )) *
                    100 *
                    10
                ) / 10).toFixed()
              );
              basicFetch(`${apiPrefix}${socialSecurityEndpointURL}`).then(
                socSecRes => {
                  if (socSecRes.data[0]) {
                    let combinedSocialSecurity = 0;
                    socSecRes.data.forEach(entry => {
                      combinedSocialSecurity += parseFloat(
                        entry.current_fytd_rcpt_outly_amt
                      );
                    });
                    setSSPercent(
                      (Math.round(
                        (combinedSocialSecurity /
                          parseFloat(
                            supplementaryRes.data[0]
                              ?.current_fytd_rcpt_outly_amt
                          )) *
                          100 *
                          10
                      ) / 10).toFixed()
                    );
                  }
                }
              );
            }
          }
        );
      }
    });
  }, []);

  const irsGov = (
    <CustomLink
      url={"https://www.irs.gov/newsroom/historical-highlights-of-the-irs"}
      eventNumber={'14'}
    >
      IRS.gov
    </CustomLink>
  );

  const excise = (
    <GlossaryPopoverDefinition
      term={"Excise"}
      page={"Revenue Explainer"}
      glossary={glossary}
      glossaryClickHandler={glossaryClickHandler}
    >
      excise
    </GlossaryPopoverDefinition>
  );

  const trustFunds = (
    <GlossaryPopoverDefinition
      term={"Trust funds"}
      page={"Revenue Explainer"}
      glossary={glossary}
      glossaryClickHandler={glossaryClickHandler}
    >
      trust funds
    </GlossaryPopoverDefinition>
  );

  const federalReserveAct = (
    <CustomLink url={'https://www.federalreserve.gov/aboutthefed/section7.htm'} >
      Federal Reserve Act, Section 7(a)(1-3)
    </CustomLink>
  );

  return (
    <div className={sourcesContent}>
      <p>
        Most of the revenue the U.S. government collects comes from
        contributions from individual taxpayers, small businesses, and
        corporations through taxes. Additional sources of tax revenue consist of{" "}
        {excise} tax, estate tax, and other taxes and fees. So far in FY{" "}
        {currentFiscalYear}, individual income taxes have accounted for{" "}
        {indvPercent}% of total revenue while Social Security and Medicare taxes
        made up another {ssPercent}%.
      </p>
      <p>
        Government revenue also comes from payments to federal agencies like the
        U.S. Department of the Interior. Have you visited a national park
        recently? Did you know your national park entry is included in
        government revenue? Other agencies generate revenue from leases, the
        sale of natural resources, and various usage and licensing fees.
      </p>
      <div className={visWithCallout}>
        <SourcesOfRevenueCircleChart />
      </div>
      <div className={revenueAccordion}>
        <Accordion
          title={'Why does the Federal Reserve send money to the federal government?'}
          openEventNumber={"13"}
          explainerGAEvent={"Revenue"}
          ga4ID={"source-rev"}
        >
          The Federal Reserve Act of 1913, the law that created the Federal Reserve System and
          established it as the central bank of the United States, requires that any excess
          earnings generated by 12 Federal Reserve Banks be paid to the federal government.
          In practice, Federal Reserve banks pay for their operating expenses, pay a dividend
          to stockholders (U.S. commercial banks), set aside money in a surplus fund (capped at
          $6.8 billion), and the remainder is “transferred…to the Secretary of the Treasury for
          deposit in the general fund of the Treasury.” [<i>See</i> {federalReserveAct}]
        </Accordion>
      </div>
      <h5>Social Security and Medicare Taxes</h5>
      <p>
        Unlike personal income taxes, which support a variety of programs, these
        taxes are only used to fund Social Security and Medicare. These funds
        are collected from your paycheck, and in most cases, matched by your
        employer, and then divided into separate {trustFunds} that support each
        of those programs.
      </p>
      <p>
        Social Security has two trust fund accounts: the Old Age and Survivors
        Insurance Trust Fund (OASI) and the Disability Trust Fund (DI). The
        funds in these accounts are responsible for providing workers and their
        families with retirement, disability, and survivor's insurance benefits.
      </p>
      <p>
        Medicare also has two accounts: the Hospital Insurance Trust Fund (HI),
        also known as Medicare Part A, and the Supplementary Medicare Insurance
        Trust Fund (SMI). These funds pay for hospital, home health, skilled
        nursing, and hospice care for the elderly and disabled.
      </p>
      <QuoteBox
        icon={faMartiniGlassCitrus}
        primaryColor={revenueExplainerPrimary}
        secondaryColor={revenueExplainerLightSecondary}
        customTopMargin={'-1rem'}
      >
        <p className={quoteBoxContent}>
          From 1868 until 1913, 90% of all federal revenue came from taxes on
          liquor, beer, wine, and tobacco.
          <br />
          <span style={{ fontSize: "16px" }}>Source: {irsGov}</span>
        </p>
      </QuoteBox>
    </div>
  );
};

export default SourcesOfFederalRevenue;
