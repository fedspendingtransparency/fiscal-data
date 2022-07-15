import nationalDebtSections, { nationalDebtDataSources } from "./national-debt/national-debt"
import nationalDeficitSections from "./national-deficit/national-deficit";

const explainerSections = {
  'national-debt': nationalDebtSections,
  'national-deficit': nationalDeficitSections

}
export const explainerDataSources = {
  'national-debt': nationalDebtDataSources,
  'national-deficit': nationalDebtDataSources
}

export default explainerSections
