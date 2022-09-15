import React, {useEffect, useState} from "react";
import {apiPrefix, basicFetch} from "../../../../../utils/api-utils";
import {faCommentDollar, faHandHoldingDollar, faPiggyBank} from "@fortawesome/free-solid-svg-icons";
import {
  revenueExplainerPrimary,
  revenueLightSecondary
} from "../revenue.module.scss";
import KeyTakeawaysSection from "../../../explainer-components/key-takeaways/key-takeaways-section";
import {getShortForm} from "../../../heros/hero-helper";

const RevenueKeyTakeaways = ({glossary}) => {

  const [latestCompleteFiscalYear, setLatestCompleteFiscalYear] = useState(0);
  const [revenuePercentGDP, setRevenuePercentGDP] = useState(0);



  useEffect(() => {
    const endpointURL = 'v1/accounting/mts/mts_table_4?filter=line_code_nbr:eq:830'
      + ',record_calendar_month:eq:09&sort=-record_date&page%5bsize%5d=1';
    const beaURL = 'https://apps.bea.gov/api/data/'
      + '?UserID=F9C35FFF-7425-45B0-B988-9F10E3263E9E&method='
      + 'GETDATA&datasetname=NIPA&TableName=T10105&frequency=Q&year=X&ResultFormat=JSON'
    basicFetch(`${apiPrefix}${endpointURL}`)
    .then((res) => {
      if (res.data[0]) {
        const fiscalYear = res.data[0].record_fiscal_year;
        setLatestCompleteFiscalYear(fiscalYear);
        basicFetch(beaURL)
        .then((bea_res) => {
          if (bea_res.BEAAPI.Results.Data) {
            const gdpData = bea_res.BEAAPI.Results.Data
            .filter(entry => entry.LineDescription === 'Gross domestic product');
            const allQuartersForGivenYear = gdpData.filter(entry => (
              entry.TimePeriod.includes(fiscalYear.toString() + 'Q1') ||
              entry.TimePeriod.includes(fiscalYear.toString() + 'Q2') ||
              entry.TimePeriod.includes(fiscalYear.toString() + 'Q3') ||
              entry.TimePeriod.includes((fiscalYear - 1).toString() + 'Q4')));

            let totalGDP = 0;
            allQuartersForGivenYear.forEach(quarter => {
              totalGDP += parseFloat(quarter.DataValue.replace(/,/g, ''));
            });
            const averageGDP = ((totalGDP / 4) * 1000000);
            setRevenuePercentGDP(Math.round((res.data[0].current_fytd_net_rcpt_amt / averageGDP) * 100));
          }
        })
      }
    });
  });

  const takeaways = [
    {
      text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. `,
      icon: faHandHoldingDollar,
    },
    {
      text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. `,
      icon: faCommentDollar,
    },
    {
      text: `Federal revenue is commonly compared to gross domestic product (GDP).
    This comparison provides a sense of the size of the federal government's earnings
    in relation to the total amount of the entire country's economic output. In fiscal
    year ${latestCompleteFiscalYear}, federal revenue was equal to ${revenuePercentGDP}%
    of total gross domestic product (GDP), or economic activity, of the United States that year
    {$X.XX trillion}. `,
      icon: faPiggyBank,
    },
  ];

  return (
    <KeyTakeawaysSection
      takeaways={takeaways}
      primaryColor={revenueExplainerPrimary}
      secondaryColor={revenueLightSecondary}
      glossary={glossary}
    />
  );

}

export default RevenueKeyTakeaways;
