import interestExpenseSections, { interestExpenseDataSources, interestExpenseDescriptionGenerator } from './interest-expense/interest-expense';
import stateLocalGovernmentSeriesSections, {
  stateLocalGovernmentSeriesDataSources,
} from './state-and-local-government-series/state-and-local-government-series';

export const insightsSections = {
  'interest-expense': interestExpenseSections,
  'state-and-local-government-series': stateLocalGovernmentSeriesSections,
};

export const insightsDataSources = {
  'interest-expense': interestExpenseDataSources,
  'state-and-local-government-series': stateLocalGovernmentSeriesDataSources,
};

export const insightsDescriptionGenerators = {
  'interest-expense': interestExpenseDescriptionGenerator,
};

export default insightsSections;
