import { nationalDeficitDataSources } from '../explainer-helpers/national-deficit/national-deficit-helper';
import nationalDeficitSections from './national-deficit/national-deficit';
import nationalDebtSections, { nationalDebtDataSources, nationalDebtDescriptionGenerator } from './national-debt/national-debt';
import federalSpendingSection from './federal-spending/federal-spending';
import { federalSpendingDataSources } from '../explainer-helpers/federal-spending/federal-spending-helper';
import governmentRevenueSections from './government-revenue/government-revenue';
import { governmentRevenueDataSources } from '../explainer-helpers/government-revenue/government-revenue-helper';
import treasurySavingsBondsSections from './treasury-savings-bonds/treasury-savings-bonds';
import { treasurySavingsbondsDataSources } from '../explainer-helpers/treasury-savings-bonds/treasury-savings-bonds-helper';

const explainerSections = {
  'national-debt': nationalDebtSections,
  'national-deficit': nationalDeficitSections,
  'federal-spending': federalSpendingSection,
  'government-revenue': governmentRevenueSections,
  'treasury-savings-bonds': treasurySavingsBondsSections,
};
export const explainerDataSources = {
  'national-debt': nationalDebtDataSources,
  'national-deficit': nationalDeficitDataSources,
  'federal-spending': federalSpendingDataSources,
  'government-revenue': governmentRevenueDataSources,
  'treasury-savings-bonds': treasurySavingsbondsDataSources,
};

export const explainerDescriptionGenerators = {
  'national-debt': nationalDebtDescriptionGenerator,
};

export default explainerSections;
