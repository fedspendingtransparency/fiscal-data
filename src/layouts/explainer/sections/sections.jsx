import { nationalDeficitDataSources } from "../explainer-helpers/national-deficit/national-deficit-helper"
import nationalDeficitSections from "./national-deficit/national-deficit"
import nationalDebtSections, {
  nationalDebtDataSources,
  nationalDebtDescriptionGenerator,
} from "./national-debt/national-debt"
import federalSpendingSection from "./federal-spending/federal-spending"
import { federalSpendingDataSources } from "../explainer-helpers/federal-spending/federal-spending-helper"

const explainerSections = {
  "national-debt": nationalDebtSections,
  "national-deficit": nationalDeficitSections,
  "federal-spending": federalSpendingSection,
  "americas-finance-guide": federalSpendingSection,
}
export const explainerDataSources = {
  "national-debt": nationalDebtDataSources,
  "national-deficit": nationalDeficitDataSources,
  "federal-spending": federalSpendingDataSources,
  "americas-finance-guide": federalSpendingDataSources,
}

export const explainerDescriptionGenerators = {
  "national-debt": nationalDebtDescriptionGenerator,
}

export default explainerSections
