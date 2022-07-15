import nationalDebtSections, {
  nationalDebtDataSources,
  nationalDebtDescriptionGenerator,
} from "./national-debt/national-debt"

const explainerSections = {
  'national-debt': nationalDebtSections
}
export const explainerDataSources = {
  'national-debt': nationalDebtDataSources
}

export const explainerDescriptionGenerators = {
  'national-debt': nationalDebtDescriptionGenerator
};

export default explainerSections
