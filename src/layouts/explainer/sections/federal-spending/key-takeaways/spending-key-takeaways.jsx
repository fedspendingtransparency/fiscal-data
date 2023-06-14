import React, {useEffect, useState} from "react";
import {apiPrefix, basicFetch} from "../../../../../utils/api-utils";
import {faCommentDollar, faHandHoldingDollar, faPiggyBank} from "@fortawesome/free-solid-svg-icons";
import {
  spendingExplainerPrimary,
  spendingExplainerLightSecondary,
} from "../federal-spending.module.scss";
import KeyTakeawaysSection from "../../../explainer-components/key-takeaways/key-takeaways-section";
import {getShortForm} from "../../../../../utils/rounding-utils";


const SpendingKeyTakeaways = ({glossary, glossaryClickHandler}) => {
  const [latestCompleteFiscalYear, setLatestCompleteFiscalYear] = useState(0);
  const [priorYearSpendingShort, setPriorYearSpendingShort] = useState("");
  const [spendingRevComparison, setSpendingRevComparison] = useState("");
  const [deficitLabel, setDeficitLabel] = useState("");
  const [spendingGDPSimple, setSpendingGDPSimple] = useState(0);

  useEffect(() => {
    const endpointUrl = 'v1/accounting/mts/mts_table_5?fields=current_fytd_net_outly_amt,'+
      'prior_fytd_net_outly_amt,record_date,record_calendar_month,record_calendar_year,'+
      'record_fiscal_year&filter=line_code_nbr:eq:5691,record_calendar_month:eq:09&sort='+
      '-record_date&page[size]=1';
    const beaEndpointUrl = 'https://apps.bea.gov/api/data/?UserID=F9C35FFF-7425-45B0-B988-'+
      '9F10E3263E9E&method=GETDATA&datasetname=NIPA&TableName=T10105&frequency=Q&year='+
      'X&ResultFormat=JSON';

    basicFetch(`${apiPrefix}${endpointUrl}`)
      .then((res) => {
        if (res.data) {
          const fiscalYear = res.data[0].record_fiscal_year;
          const priorYearSpending = res.data[0].current_fytd_net_outly_amt;
          setLatestCompleteFiscalYear(fiscalYear);
          setPriorYearSpendingShort(
            getShortForm(priorYearSpending.toString(), false));

          basicFetch(`${beaEndpointUrl}`)
            .then((bea_res) => {
              if (bea_res.BEAAPI.Results.Data) {
                const gdpData = bea_res.BEAAPI.Results.Data
                  .filter(entry => entry.LineDescription === 'Gross domestic product');
                const averagedGDPByYear = [];
                const allQuartersForGivenYear = gdpData.filter(entry => (
                  entry.TimePeriod.includes(fiscalYear.toString() + 'Q1') ||
                  entry.TimePeriod.includes(fiscalYear.toString() + 'Q2') ||
                  entry.TimePeriod.includes(fiscalYear.toString() + 'Q3') ||
                  entry.TimePeriod.includes((fiscalYear - 1).toString() + 'Q4')));

                let totalGDP = 0;
                allQuartersForGivenYear.forEach(quarter => {
                  totalGDP += parseFloat(quarter.DataValue.replace(/,/g, ''));
                })
                averagedGDPByYear.push({
                  // Correct BEA data to display in trillions
                  average: ((parseInt(String(totalGDP) + '000000')) / 4),
                  year: fiscalYear
                })
                setSpendingGDPSimple(
                  Math.round((priorYearSpending / averagedGDPByYear[0].average) * 10));
              }
            });
        }
      });
  }, [])

  useEffect(() => {
    const endpointUrl = 'v1/accounting/mts/mts_table_5?fields=current_fytd_net_outly_amt,' +
      'record_date,record_calendar_month,record_fiscal_year&filter=line_code_nbr:eq:5694,'+
      'record_calendar_month:eq:09&sort=-record_date&page[size]=1';

    basicFetch(`${apiPrefix}${endpointUrl}`)
      .then((res) => {
        if (res.data) {
          const priorSpending = res.data[0].current_fytd_net_outly_amt;
          setSpendingRevComparison(priorSpending < 0 ? 'more' : 'less');
          setDeficitLabel(priorSpending < 0 ? 'deficit' : 'surplus');
        }
      });
  }, [])

   const takeaways =  [
      {
        text: `The federal government spends money on a variety of goods, programs, and
        services to support the American public and pay interest incurred from borrowing. In
        fiscal year (FY) ${latestCompleteFiscalYear}, the government spent
        $${priorYearSpendingShort}, which was ${spendingRevComparison} than it collected (revenue),
        resulting in a ${deficitLabel}. `,
        icon: faHandHoldingDollar,
        hasGlossaryTerm: true,
        glossaryString: "fiscal year (FY)",
        glossaryTerm: "fiscal year",
        page: "Debt & Spending explainer",
      },
      {
        text: `The U.S. Constitution gives Congress the ability to create a federal budget –
        in other words, to determine how much money the government can spend over the course of the
        upcoming fiscal year.  Congress’s budget is then approved by the President. Every year,
        Congress decides the amount and the type of discretionary spending, as well as provides
        resources for mandatory spending.`,
        icon: faCommentDollar,
        hasGlossaryTerm: true,
        glossaryRegex: /\b(discretionary|mandatory)\b/g,
        page: "Spending Explainer",
      },
      {
        text: `Money for federal spending primarily comes from government tax collection and
        borrowing. In FY ${latestCompleteFiscalYear} government spending equated to roughly
        $${spendingGDPSimple} out of every $10 of the goods produced and services provided in the
        United States.`,
        icon: faPiggyBank,
        page: "Spending Explainer",
      }
    ];

  return (
    <KeyTakeawaysSection
      takeaways={takeaways}
      primaryColor={spendingExplainerPrimary}
      secondaryColor={spendingExplainerLightSecondary}
      glossary={glossary}
      glossaryClickHandler={glossaryClickHandler}
    />
);
}

export default SpendingKeyTakeaways;
