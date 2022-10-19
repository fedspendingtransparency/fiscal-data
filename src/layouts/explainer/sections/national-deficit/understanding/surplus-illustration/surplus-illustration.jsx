import {deficitExplainerLightSecondary} from "../../national-deficit.module.scss";
import surplus from "../../../../../../images/explainer/national-deficit/surplus.png";
import balancedBudget
  from "../../../../../../images/explainer/national-deficit/balanced-budget.png";
import deficit from "../../../../../../images/explainer/national-deficit/deficit.png";
import React from "react";
import {withWindowSize} from "react-fns";
import GlossaryTerm from "../../../../../../components/glossary-term/glossary-term";
import FolderIllustration from "./folder-illustration/folder-illustration";


const SurplusIllustration = ({glossary, width}) => {
  const balancedBudgetGlossary =
    <GlossaryTerm term={'balanced budget'} page={'Deficit Explainer'} glossary={glossary}>
      balanced budget
    </GlossaryTerm>

  const surplusContent =
    <>
      <img src={surplus} alt="" data-testid={"surplus-image"}/>
      <div>
        <p>
          A <i>surplus</i> occurs when the government collects more money than it spends.
        </p>
        <p>
          The last surplus for the federal government was in 2001.
        </p>
      </div>
    </>;

  const balancedBudgetContent =
    <>
      <img src={balancedBudget} alt="" data-testid={"balanced-budget-image"} />
      <div>
        <p>
          A <i>{balancedBudgetGlossary}</i> occurs when the amount the government spends
          equals the amount the government collects.
        </p>
        <p>
          Sometimes the term balanced budget is used more broadly to refer
          to instances where there is no deficit.
        </p>
      </div>
    </>

  const deficitContent =
    <>
      <img src={deficit} alt="" data-testid={"deficit-image"} />
      <div>
        <p>
          A <i>deficit</i> occurs when the government spends more money than it collects.
        </p>
        <p>
          The federal government has run deficits for the last 20 years.
        </p>
      </div>
    </>

  const tabList = [
    {
      title: 'Surplus',
      content: surplusContent
    },
    {
      title: 'Balanced Budget',
      content: balancedBudgetContent
    },
    {
      title: 'Deficit',
      content: deficitContent
    },
  ]

  return (
    <>
      <FolderIllustration width={width} tabList={tabList} color={deficitExplainerLightSecondary} />
    </>
  );
}

export default withWindowSize(SurplusIllustration);
