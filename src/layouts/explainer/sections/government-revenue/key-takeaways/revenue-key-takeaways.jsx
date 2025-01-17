import React, { useEffect, useState } from 'react';
import { apiPrefix, basicFetch } from '../../../../../utils/api-utils';
import { faCommentDollar, faHandHoldingDollar, faPiggyBank } from '@fortawesome/free-solid-svg-icons';
import { revenueExplainerPrimary, revenueExplainerLightSecondary } from '../revenue.module.scss';
import KeyTakeawaysSection from '../../../explainer-components/key-takeaways/key-takeaways-section';
import GlossaryPopoverDefinition from '../../../../../components/glossary/glossary-term/glossary-popover-definition';
import reactStringReplace from 'react-string-replace';
const RevenueKeyTakeaways = () => {
  const [latestCompleteFiscalYear, setLatestCompleteFiscalYear] = useState(0);
  const [revenuePercentGDP, setRevenuePercentGDP] = useState(0);
  const [totalGDP, setTotalGDP] = useState('');

  useEffect(() => {
    const endpointURL = 'v1/accounting/mts/mts_table_4?filter=line_code_nbr:eq:830,record_calendar_month:eq:09&sort=-record_date&page%5bsize%5d=1';
    const beaURL =
      'https://apps.bea.gov/api/data/?UserID=F9C35FFF-7425-45B0-B988-9F10E3263E9E&method=GETDATA&datasetname=NIPA&TableName=T10105&frequency=Q&year=X&ResultFormat=JSON';
    basicFetch(`${apiPrefix}${endpointURL}`).then(res => {
      if (res.data[0]) {
        const fiscalYear = res.data[0].record_fiscal_year;
        setLatestCompleteFiscalYear(fiscalYear);
        basicFetch(beaURL).then(bea_res => {
          if (bea_res.BEAAPI.Results.Data) {
            const gdpData = bea_res.BEAAPI.Results.Data.filter(entry => entry.LineDescription === 'Gross domestic product');
            const allQuartersForGivenYear = gdpData.filter(
              entry =>
                entry.TimePeriod.includes(fiscalYear.toString() + 'Q1') ||
                entry.TimePeriod.includes(fiscalYear.toString() + 'Q2') ||
                entry.TimePeriod.includes(fiscalYear.toString() + 'Q3') ||
                entry.TimePeriod.includes((fiscalYear - 1).toString() + 'Q4')
            );

            let totalGDP = 0;
            allQuartersForGivenYear.forEach(quarter => {
              totalGDP += parseFloat(quarter.DataValue.replace(/,/g, ''));
            });
            const totalQuarters =
              allQuartersForGivenYear.find(entry => entry.TimePeriod.includes(fiscalYear.toString() + 'Q2')) &&
              !allQuartersForGivenYear.find(entry => entry.TimePeriod.includes(fiscalYear.toString() + 'Q3'))
                ? 3
                : 4;
            const averageGDP = (totalGDP / totalQuarters) * 1000000;

            setRevenuePercentGDP(Math.round((res.data[0].current_fytd_net_rcpt_amt / averageGDP) * 100));
            setTotalGDP((averageGDP / 1000000000000).toFixed(2));
          }
        });
      }
    });

    const thirdEndpointURL = 'v1/accounting/mts/mts_table_9?filter=line_code_nbr:eq:120,record_calendar_month:eq:09&sort=-record_date&page[size]=1';
    let currentFyAmt;
    basicFetch(`${apiPrefix}${thirdEndpointURL}`).then(res => {
      console.log('res:::  ', res);
      currentFyAmt = res.data[0]['current_fytd_rcpt_outly_amt'];
      console.log('currentFyAmt:::  ', currentFyAmt);

      const beegCurrentFyAmt = [];
      const secondEndpointURL =
        'v1/accounting/mts/mts_table_9?filter=record_type_cd:eq:RSG,record_calendar_month:eq:09&sort=-record_date&page[size]=10';
      basicFetch(`${apiPrefix}${secondEndpointURL}`).then(res => {
        const data = res.data;

        data.forEach((item, index) => {
          console.log('item:::: ', item);
          console.log('classification_desc:::: ', item['classification_desc']);
          console.log('math outcome: ', Number(item['current_fytd_rcpt_outly_amt']) / Number(currentFyAmt));
          beegCurrentFyAmt.push(Number(item['current_fytd_rcpt_outly_amt']) / Number(currentFyAmt));
        });

        console.log('beegCurrentFyAmt: ', beegCurrentFyAmt);
      });
    });
  }, []);
  const firstTakeawayText = `In fiscal year (FY) ${latestCompleteFiscalYear}, the largest source of federal revenue was
  {prior_fiscal_year_largest_source_category} ({prior_fiscal_year_largest_source_total_percent} of total revenue).
  So far in fiscal year {current_fiscal_year}, the largest source of federal revenue is
  {current_fiscal_year_largest_source_category} ({current_fiscal_year_largest_source_total_percent} of total revenue).
  Federal revenue is used to fund a variety of goods, programs, and services to support the American public and
  pay interest on government debt. Revenue is typically measured by fiscal year (FY).`;

  // `The primary sources of revenue for the U.S. government are individual
  // and corporate taxes, and taxes that are dedicated to funding Social Security and Medicare.
  // This revenue is used to fund a variety of goods, programs, and services to support the American
  // public and pay interest incurred from borrowing. Revenue is typically measured by fiscal year (FY).`;

  const firstTakeawayTextWithGlossaryTerm = reactStringReplace(firstTakeawayText, 'fiscal year (FY)', match => {
    return (
      <GlossaryPopoverDefinition term="fiscal year" page="Debt, Revenue & Spending explainer">
        {match}
      </GlossaryPopoverDefinition>
    );
  });

  const takeaways = [
    {
      text: firstTakeawayTextWithGlossaryTerm,
      icon: faHandHoldingDollar,
    },
    {
      text: `In addition to taxes, government revenue also comes from customs duties, leases of
      government-owned land and buildings, the sale of natural resources, various usage and
      licensing fees, and payments to federal agencies like the U.S. Department of the Interior.`,
      icon: faCommentDollar,
    },
    {
      text: `Federal revenue is commonly compared to gross domestic product (GDP).
      This comparison provides a sense of the size of the federal government's earnings
      in relation to the total amount of the entire country's economic output. In fiscal
      year ${latestCompleteFiscalYear}, federal revenue was equal to ${revenuePercentGDP}%
      of total gross domestic product (GDP), or economic activity, of the United States that year
      $${totalGDP} trillion. `,
      icon: faPiggyBank,
    },
  ];

  return <KeyTakeawaysSection takeaways={takeaways} primaryColor={revenueExplainerPrimary} secondaryColor={revenueExplainerLightSecondary} />;
};

export default RevenueKeyTakeaways;
