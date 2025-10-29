import React, { useEffect, useState } from 'react';
import { apiPrefix, basicFetch } from '../../../../../utils/api-utils';
import { faCommentDollar, faHandHoldingDollar, faPiggyBank } from '@fortawesome/free-solid-svg-icons';
import { revenueExplainerLightSecondary, revenueExplainerPrimary } from '../revenue.module.scss';
import KeyTakeawaysSection from '../../../explainer-components/key-takeaways/key-takeaways-section';
import GlossaryPopoverDefinition from '../../../../../components/glossary/glossary-term/glossary-popover-definition';
import reactStringReplace from 'react-string-replace';
import revenueConstants from '../constants';

const RevenueKeyTakeaways = () => {
  const [latestCompleteFiscalYear, setLatestCompleteFiscalYear] = useState(0);
  const [revenuePercentGDP, setRevenuePercentGDP] = useState(0);
  const [totalGDP, setTotalGDP] = useState('');
  const [priorFYLargestSource, setPriorFYLargestSource] = useState('');
  const [priorFYLargestSourceTotPercent, setPriorFYLargestSourceTotPercent] = useState(0);
  const [currentFY, setCurrentFY] = useState(0);
  const [currentFYLargestSource, setCurrentFYLargestSource] = useState('');
  const [currentFYLargestSourceTotPercent, setCurrentFYLargestSourceTotPercent] = useState(0);

  useEffect(() => {
    basicFetch(`${apiPrefix}${revenueConstants.PRIOR_FY}`).then(res => {
      if (res.data[0]) {
        const fiscalYear = res.data[0].record_fiscal_year;
        setLatestCompleteFiscalYear(fiscalYear);
        basicFetch(revenueConstants.BEA_URL).then(bea_res => {
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

    // previous FY content
    basicFetch(`${apiPrefix}${revenueConstants.PRIOR_SINGLE_FYTD_RCPT_OUTLY_AMT}`).then(res => {
      const currentFyAmt = res.data[0]['current_fytd_rcpt_outly_amt'];

      basicFetch(`${apiPrefix}${revenueConstants.PRIOR_MULTI_FYTD_RCPT_OUTLY_AMT}`).then(res => {
        const data = res.data;

        // sorting to get the highest current_fytd_rcpt_outly_amt that will provide us the highest %:
        data.sort((a, b) => Number(b['current_fytd_rcpt_outly_amt']) - Number(a['current_fytd_rcpt_outly_amt']));

        setPriorFYLargestSource(data[0]['classification_desc']);

        // take the first index and use with currentFyAmt
        const percentOfTot = (Number(data[0]['current_fytd_rcpt_outly_amt']) / Number(currentFyAmt)) * 100;
        setPriorFYLargestSourceTotPercent(Math.abs(percentOfTot).toFixed(1));
      });
    });

    // current FY content
    basicFetch(`${apiPrefix}${revenueConstants.CURRENT_SINGLE_FYTD_RCPT_OUTLY_AMT}`).then(res => {
      const currentFyAmt = res.data[0]['current_fytd_rcpt_outly_amt'];

      basicFetch(`${apiPrefix}${revenueConstants.CURRENT_MULTI_FYTD_RCPT_OUTLY_AMT}`).then(res => {
        const data = res.data;

        // sorting to get the highest current_fytd_rcpt_outly_amt that will provide us the highest %:
        data.sort((a, b) => Number(b['current_fytd_rcpt_outly_amt']) - Number(a['current_fytd_rcpt_outly_amt']));

        setCurrentFYLargestSource(data[0]['classification_desc']);

        // take the first index and use with currentFyAmt
        const percentOfTot = (Number(data[0]['current_fytd_rcpt_outly_amt']) / Number(currentFyAmt)) * 100;
        setCurrentFYLargestSourceTotPercent(Math.abs(percentOfTot).toFixed(1));
      });

      basicFetch(`${apiPrefix}${revenueConstants.CURRENT_FY}`).then(res => {
        const latestRow = res.data?.[0];
        if (!latestRow) return;

        const apiFY = Number(res.data?.[0]?.record_fiscal_year);
        const now = new Date();

        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();
        let derivedFY = apiFY;
        const isPostSeptember = currentMonth >= 9;
        //Check to see if the current year is the same as api and its past september.
        //This will help even if no data is dropped.
        const isCurrentYearJustCompleted = apiFY === currentYear && isPostSeptember;
        if (isCurrentYearJustCompleted) {
          derivedFY = apiFY + 1;
        }
        setCurrentFY(derivedFY);
      });
    });
  }, []);

  const firstTakeawayText = `In fiscal year (FY)  ${latestCompleteFiscalYear}, the largest source of federal revenue was
  ${priorFYLargestSource} (${priorFYLargestSourceTotPercent}% of total revenue).
  So far in fiscal year ${currentFY}, the largest source of federal revenue is
  ${currentFYLargestSource} (${currentFYLargestSourceTotPercent}% of total revenue).
  Federal revenue is used to fund a variety of goods, programs, and services to support the American public and
  pay interest on government debt. Revenue is typically measured by fiscal year (FY).`;

  const firstTakeawayTextWithGlossaryTerm = reactStringReplace(firstTakeawayText, 'fiscal year (FY)', (match, index) => {
    if (index === 1) {
      return (
        <GlossaryPopoverDefinition term="fiscal year" page="Debt, Revenue & Spending explainer" key={index}>
          {match}
        </GlossaryPopoverDefinition>
      );
    } else return match;
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
