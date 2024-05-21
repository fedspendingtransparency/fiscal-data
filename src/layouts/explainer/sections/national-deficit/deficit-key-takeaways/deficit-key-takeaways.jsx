import React, { useEffect } from 'react';
import KeyTakeawaysSection from '../../../explainer-components/key-takeaways/key-takeaways-section';
import reactStringReplace from 'react-string-replace';
import CustomLink from '../../../../../components/links/custom-link/custom-link';
import { faChartColumn, faCoins, faHandHoldingDollar } from '@fortawesome/free-solid-svg-icons';
import { deficitExplainerLightSecondary, deficitExplainerPrimary } from '../national-deficit.module.scss';
import { apiPrefix, basicFetch } from '../../../../../utils/api-utils';

const DeficitKeyTakeaways = () => {
  const thirdTakeawayText = `To pay for government programs while operating under a deficit, the federal
    government borrows money by selling U.S. Treasury bonds, bills, and other securities.
    The national debt is the accumulation of this borrowing along with associated interest
    owed to investors who purchased these securities.`;

  const thirdTakeawayTextWithGlossaryTerm = reactStringReplace(thirdTakeawayText, 'national debt', (match, index) => {
    return (
      <CustomLink url="/americas-finance-guide/national-debt/" key={index} id="National Debt">
        {match}
      </CustomLink>
    );
  });
  useEffect(() => {
    const endpointUrl =
      'v1/accounting/mts/mts_table_5?fields=current_fytd_net_outly_amt,record_date,record_calendar_month,record_fiscal_year&filter=line_code_nbr:eq:5694,record_calendar_month:eq:09&sort=record_date&page[size]=200';
    basicFetch(`${apiPrefix}${endpointUrl}`).then(res => {
      console.log(res.data);
    });
  });
  const deficitKeyTakeaways = [
    {
      text: `A budget deficit occurs when the money going out exceeds the money coming in for a
    given period. On this page, we calculate the deficit by the government’s fiscal year.`,
      icon: faChartColumn,
    },
    {
      text: `In the last 50 years, the federal government budget has run a surplus five times,
      most recently in 2001`,
      icon: faCoins,
    },
    {
      text: thirdTakeawayTextWithGlossaryTerm,
      icon: faHandHoldingDollar,
    },
  ];

  return (
    <KeyTakeawaysSection takeaways={deficitKeyTakeaways} primaryColor={deficitExplainerPrimary} secondaryColor={deficitExplainerLightSecondary} />
  );
};

export default DeficitKeyTakeaways;
