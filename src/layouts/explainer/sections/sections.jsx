import nationalDeficitSections,
{ nationalDeficitDataSources } from "./national-deficit/national-deficit";
import nationalDebtSections, {
  nationalDebtDataSources,
  nationalDebtDescriptionGenerator,
} from "./national-debt/national-debt"

const explainerSections = {
  'national-debt': nationalDebtSections,
  'national-deficit': nationalDeficitSections

}
export const explainerDataSources = {
  'national-debt': nationalDebtDataSources,
  'national-deficit': nationalDeficitDataSources
}

export const explainerDescriptionGenerators = {
  'national-debt': nationalDebtDescriptionGenerator
};

export default explainerSections
