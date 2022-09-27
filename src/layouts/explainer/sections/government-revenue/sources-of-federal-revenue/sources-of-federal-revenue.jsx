import React, { useEffect, useState } from "react";
import {
  visWithCallout,
  quoteBoxContent,
} from "../../../explainer.module.scss";
import VisualizationCallout from "../../../../../components/visualization-callout/visualization-callout";
import QuoteBox from "../../../quote-box/quote-box";
import CustomLink from "../../../../../components/links/custom-link/custom-link";
import {
  revenueExplainerPrimary,
  revenueExplainerLightSecondary,
} from "../revenue.module.scss";
import { sourcesContent } from "./sources-of-federal-revenue.module.scss";
import { faMartiniGlassCitrus } from "@fortawesome/free-solid-svg-icons";
import SourcesOfRevenueCircleChart from "./sources-of-revenue-circle-chart/sources-of-revenue-circle-chart";
import { apiPrefix, basicFetch } from "../../../../../utils/api-utils";
import GlossaryTerm from "../../../../../components/glossary-term/glossary-term";
import { getShortForm } from "../../../heros/hero-helper";
import BigNumber from "bignumber.js";

const SourcesOfFederalRevenue = ({ glossary }) => {
  const [currentFiscalYear, setCurrentFiscalYear] = useState(0);
  const [indvPercent, setIndvPercent] = useState(0);
  const [ssPercent, setSSPercent] = useState(0);

  const [amountForCalc, setAmountForCalc] = useState(0);

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
                Math.round(
                  (parseFloat(res.data[0]?.current_fytd_rcpt_outly_amt) /
                    parseFloat(
                      supplementaryRes.data[0]?.current_fytd_rcpt_outly_amt
                    )) *
                    100 *
                    10
                ) / 10
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
                      Math.round(
                        (combinedSocialSecurity /
                          parseFloat(
                            supplementaryRes.data[0]
                              ?.current_fytd_rcpt_outly_amt
                          )) *
                          100 *
                          10
                      ) / 10
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

  useEffect(() => {
    const taxTotalEndpoint = `v1/accounting/mts/mts_table_9?filter=record_type_cd:eq:RSG,sequence_number_cd:in:(1.1,1.2)&sort=-record_date&page[size]=2`;
    basicFetch(`${apiPrefix}${taxTotalEndpoint}`).then(res => {
      const { data } = res;
      if (data) {
        const totalAmount = data
          .map(dp => new BigNumber(dp.current_fytd_rcpt_outly_amt).toNumber())
          .reduce((a, b) => {
            return BigNumber(a).toNumber() + BigNumber(b).toNumber();
          }, 0);
        const amount = getShortForm(totalAmount, 2, true);
        setAmountForCalc(totalAmount);
        setTotalTaxAmount(amount);
      }
    });

    const totalPercentEndpoint = `v1/accounting/mts/mts_table_9?filter=line_code_nbr:eq:120&sort=-record_date&page[size]=1`;
    basicFetch(`${apiPrefix}${totalPercentEndpoint}`).then(res => {
      const { data } = res;
      if (data) {
        const total = Math.round(data[0]?.current_fytd_rcpt_outly_amt);
        const percent =
          BigNumber(amountForCalc).toNumber() / BigNumber(total).toNumber();
        setPercentageTaxAmount(`${Math.round(percent * 100)}%`);
      }
    });
  }, [currentFiscalYear]);

  const irsGov = (
    <CustomLink
      url={"https://www.irs.gov/newsroom/historical-highlights-of-the-irs"}
    >
      IRS.gov
    </CustomLink>
  );

  const excise = (
    <GlossaryTerm
      term={"Excise"}
      page={"Revenue Explainer & AFG Overview Page"}
      glossary={glossary}
    >
      excise
    </GlossaryTerm>
  );

  const trustFunds = (
    <GlossaryTerm
      term={"Trust fund"}
      page={"Revenue Explainer"}
      glossary={glossary}
    >
      trust funds
    </GlossaryTerm>
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
