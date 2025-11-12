import React, { FunctionComponent } from 'react';
import KeyTakeawaysSection from '../../../explainer-components/key-takeaways/key-takeaways-section';

import { faHandshakeAlt, faHourglassHalf, faLineChart } from '@fortawesome/free-solid-svg-icons';
import { treasurySavingsBondsExplainerSecondary, treasurySavingsBondsExplainerLightSecondary } from '../../../../../variables.module.scss';

const SavingBondsKeyTakeaway: FunctionComponent = () => {
  const savingBondsKeyTakeaways = [
    {
      text: `Savings bonds are simple, safe, and affordable loans to the federal government
      that can be purchased by individual investors. These loans help finance the government and offer benefits to the purchaser.`,
      icon: faHandshakeAlt,
    },
    {
      text: `The level of investment in savings bonds has varied over the course of American history.
      In some cases, the government has developed public campaigns to promote savings bond purchases in an effort to fund activities such as the country’s participation in World War II.
      At other times, sales of savings bonds have increased or decreased in tandem with changes in interest rates or inflation.`,
      icon: faLineChart,
    },
    {
      text: ` Savings bonds earn interest until they reach "maturity," which is generally 20-30 years, depending on the type purchased.
      If a bond is held past its maturity, the federal government remains responsible for the debt. However,
      savings bonds that are held past their maturity date do not continue to earn interest and may actually lose value due to inflation.`,
      icon: faHourglassHalf,
    },
  ];

  return (
    <KeyTakeawaysSection
      takeaways={savingBondsKeyTakeaways}
      primaryColor={treasurySavingsBondsExplainerSecondary}
      secondaryColor={treasurySavingsBondsExplainerLightSecondary}
    />
  );
};

export default SavingBondsKeyTakeaway;
