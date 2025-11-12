import React from 'react';
import KeyTakeawaysSection from '../../../explainer-components/key-takeaways/key-takeaways-section';
import reactStringReplace from 'react-string-replace';
import CustomLink from '../../../../../components/links/custom-link/custom-link';
import { faChartColumn, faCoins, faHandHoldingDollar } from '@fortawesome/free-solid-svg-icons';
import { deficitExplainerLightSecondary, deficitExplainerPrimary } from '../../../../../variables.module.scss';

import useFetchSurplusCount from '../understanding/deficit-surplus-count-helper';
import { numberToWord } from '../../../explainer-helpers/national-deficit/national-deficit-helper';

const DeficitKeyTakeaways = () => {
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 50;
  const surplus = numberToWord(useFetchSurplusCount(startYear));

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

  const deficitKeyTakeaways = [
    {
      text: `A budget deficit occurs when the money going out exceeds the money coming in for a
    given period. On this page, we calculate the deficit by the government’s fiscal year.`,
      icon: faChartColumn,
    },
    {
      text: `In the last 50 years, the federal government budget has run a surplus ${surplus} times,
      most recently in 2001.`,
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
