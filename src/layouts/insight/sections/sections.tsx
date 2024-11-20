import interestExpenseSections, { interestExpenseDataSources, interestExpenseDescriptionGenerator } from './interest-expense/interest-expense';

export const insightsSections = {
  'interest-expense': interestExpenseSections,
};

export const insightsDataSources = {
  'interest-expense': interestExpenseDataSources,
};

export const insightsDescriptionGenerators = {
  'interest-expense': interestExpenseDescriptionGenerator,
};

export default insightsSections;
