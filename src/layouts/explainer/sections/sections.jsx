import React from "react"
import { nationalDeficitDataSources } from "../explainer-helpers/national-deficit/national-deficit-helper"
import nationalDeficitSections from "./national-deficit/national-deficit"
import nationalDebtSections, {
  nationalDebtDataSources,
  nationalDebtDescriptionGenerator,
} from "./national-debt/national-debt"
import federalSpendingSection from "./federal-spending/federal-spending"
import { federalSpendingDataSources } from "../explainer-helpers/federal-spending/federal-spending-helper"
import {
  revenueExplainerPrimary,
  revenueExplainerSecondary,
  revenueExplainerLightSecondary,
} from "../sections/revenue/revenue.module.scss"
import KeyTakeawaysSection from "../explainer-components/key-takeaways/key-takeaways-section"
import { SpendingOverview } from "./federal-spending/overview/spending-overview"
import { SpendingCategories } from "./federal-spending/spending-categories/spending-categories"
import SpendingDifference from "./federal-spending/spending-difference/spending-difference"
import { SpendingTrends } from "./federal-spending/spending-trends/spending-trends"
import { spendingKeyTakeaways } from "../explainer-helpers/federal-spending/federal-spending-helper"
const nationalDeficitSectionIds = [
  "key-takeaways1",
  "understanding1",
  "causes-and-sur1pluses",
  "deficit-vs-deb1t",
  "deficit-by-year1",
  "1learn-more",
]

const mockRevenueSection = [
  {
    index: 0,
    id: nationalDeficitSectionIds[0],
    title: "Key Takeaways",
    component: (glossary, cpiDataByYear) => (
      <KeyTakeawaysSection
        takeaways={spendingKeyTakeaways}
        primaryColor={revenueExplainerPrimary}
        secondaryColor={revenueExplainerLightSecondary}
      />
    ),
  },

  {
    index: 1,
    id: nationalDeficitSectionIds[4],
    title: "Spending Trends Over Time and the U.S. Economy",
    comingSoon: true,
    component: (glossary, cpiDataByYear) => <SpendingTrends />,
  },
]
const explainerSections = {
  "national-debt": nationalDebtSections,
  "national-deficit": nationalDeficitSections,
  "federal-spending": federalSpendingSection,
  "government-revenue": mockRevenueSection,
}
export const explainerDataSources = {
  "national-debt": nationalDebtDataSources,
  "national-deficit": nationalDeficitDataSources,
  "federal-spending": federalSpendingDataSources,
  "government-revenue": federalSpendingDataSources,
}

export const explainerDescriptionGenerators = {
  "national-debt": nationalDebtDescriptionGenerator,
}

export default explainerSections
