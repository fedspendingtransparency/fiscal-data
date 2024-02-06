import React, { FunctionComponent } from 'react';
import KeyTakeawaysSection from '../../../explainer-components/key-takeaways/key-takeaways-section';

import { faHandshakeAlt, faHourglassHalf, faLineChart } from '@fortawesome/free-solid-svg-icons';
import { treasurySavingsBondsExplainerSecondary, treasurySavingsBondsExplainerLightSecondary } from '../treasury-savings-bonds.module.scss';

const SavingBondsKeyTakeaway: FunctionComponent = () => {

  const savingBondsKeyTakeaways = [
    {
      text: `Savings bonds are simple, safe, and affordable loans to the federal government 
      that can be purchased by individuals and investors. These loans help the government 
      finance its operations and offer benefits to the purchaser. `,
      icon: faHandshakeAlt,
    },
    {
      text: `Savings bond sales have varied over time. Occasionally, the government develops 
      special campaigns to help fund specific financial activities such as U.S. participation 
      in World War II. At other times, sales have increased or decreased alongside changes in 
      interest rates or inflation. `,
      icon: faLineChart,
    },
    {
      text: ` Savings bonds earn interest until they reach "maturity," which is generally 
      20-30 years, depending on the type purchased. If a bond is held past its maturity, 
      the federal government remains responsible for this debt. However, savings bonds 
      that are held past their maturity date and no longer earn interest may lose value 
      due to inflation.`,
      icon: faHourglassHalf,
    },
  ];

  return (
    <KeyTakeawaysSection takeaways={savingBondsKeyTakeaways} primaryColor={treasurySavingsBondsExplainerSecondary} secondaryColor={treasurySavingsBondsExplainerLightSecondary} />
  );
};

export default SavingBondsKeyTakeaway;
