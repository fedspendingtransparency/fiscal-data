import React from "react";
import CustomLink from "../../../../../components/links/custom-link/custom-link";
import GlossaryPopoverDefinition from "../../../../../components/glossary/glossary-term/glossary-popover-definition";

const DeficitAndSurplusCauses = ({glossary, glossaryClickHandler}) => {
  const federalCovidResponseLink =
    <CustomLink
    url={'https://www.usaspending.gov/disaster/covid-19?publicLaw=all'}
    eventNumber='14'
    >
      the federal response to COVID-19
    </CustomLink>

  const spendingLink =
    <CustomLink
      url={'/americas-finance-guide/federal-spending/'}
    >
      spending
    </CustomLink>

  const revenueLink =
    <CustomLink
      url={'/americas-finance-guide/government-revenue/'}
    >
      revenue
    </CustomLink>

  const gdp =
    <GlossaryPopoverDefinition term={'gross domestic product (GDP)'}
                               page={'Deficit Explainer'}
                               glossary={glossary}
                               glossaryClickHandler={glossaryClickHandler}
    >
      gross domestic product (GDP)
    </GlossaryPopoverDefinition>

  return (
    <div data-testid={'textContent'}>
      <p>
        The size of the national deficit or surplus is largely influenced by the health of the
        economy and spending and revenue policies set by Congress and the President. The health of
        the economy is often evaluated by the growth in the country’s {gdp}, fluctuations in the
        nation’s employment rates, and the stability of prices. Simply put, when the country’s
        people and businesses are making less money, the amount collected by the government also
        decreases. Similarly, when the economy is doing well and people and businesses are earning
        more money, the government collects more. On the spending side, the increase or decrease of
        spending also impacts the budget, creating deficits or surpluses.
      </p>
      <p>
        Legislation increasing {spendingLink} on Social Security, health care, and defense
        that outpace {revenueLink} can increase the deficit.
        While revenue increased during the COVID-19 pandemic,
        from approximately $3.5 trillion in 2019 to $4 trillion in 2021, increased government
        spending related to widespread unemployment and health care caused spikes in the deficit.
        Visit USAspending.gov to learn more about {federalCovidResponseLink}.
      </p>
    </div>
  )
};

export default DeficitAndSurplusCauses;
