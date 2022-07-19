import {faChartColumn, faCoins, faHandHoldingDollar} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import KeyTakeaways from "../../../explainer-components/key-takeaways";
import {
  deficitExplainerPrimary,
  deficitExplainerLightSecondary}
  from "../national-deficit.module.scss";

const DeficitKeyTakeaways = () => {
  const takeaways = [
    {
      text: 'A budget deficit occurs when the money going out exceeds the ' +
        'money coming in for a given period. On this page, we calculate the ' +
        'deficit by the government’s fiscal year.',
      icon: faChartColumn
    },
    {
      text: 'In the last 50 years, the federal government budget has run a ' +
        'surplus five times, most recently in 2001.',
      icon: faCoins
    },
    {
      text: 'To pay for government programs while operating under a deficit, ' +
        'the federal government borrows money by selling U.S. Treasury bonds, ' +
        'bills, and other securities. The national debt is the accumulation of ' +
        'this borrowing along with associated interest owed to investors who ' +
        'purchased these securities.',
      icon: faHandHoldingDollar
    }
  ]

  return (
    <>
      <KeyTakeaways takeaways={takeaways}
                    primaryColor={deficitExplainerPrimary}
                    secondaryColor={deficitExplainerLightSecondary}
      />
    </>
  )
};

export default DeficitKeyTakeaways;
