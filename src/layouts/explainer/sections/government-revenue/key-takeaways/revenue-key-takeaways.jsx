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
    const hasBEAFYComplete = (fy, beaData) => {
      const rows = (beaData || []).filter(data => data.LineDescription === 'Gross domestic product');
      return rows.some(row => String(row.TimePeriod) === `${fy}Q3`);
    };

    basicFetch(`${apiPrefix}${revenueConstants.PRIOR_FY}`).then(async res => {
      if (!res?.data?.[0]) return;

      const candidateFY = Number(res.data[0].record_fiscal_year);
      const bea = await basicFetch(revenueConstants.BEA_URL);
      const beaData = bea?.BEAAPI?.Results?.Data || [];
      const fyToDisplay = hasBEAFYComplete(candidateFY, beaData) ? candidateFY : candidateFY - 1;
      setLatestCompleteFiscalYear(fyToDisplay);

      const gdpRows = (beaData || []).filter(d => d.LineDescription === 'Gross domestic product');
      const quarters = gdpRows.filter(entry =>
        [`${fyToDisplay - 1}Q4`, `${fyToDisplay}Q1`, `${fyToDisplay}Q2`, `${fyToDisplay}Q3`].some(tag => String(entry.TimePeriod) === tag)
      );

      let totalGDP = 0;
      quarters.forEach(q => {
        totalGDP += parseFloat(String(q.DataValue).replace(/,/g, ''));
      });
      const averageGDP = (totalGDP / Math.max(quarters.length, 1)) * 1000000;

      setRevenuePercentGDP(Math.round((res.data[0].current_fytd_net_rcpt_amt / averageGDP) * 100));
      setTotalGDP((averageGDP / 1000000000000).toFixed(2));
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
        setCurrentFY(res.data[0]['record_fiscal_year']);
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
