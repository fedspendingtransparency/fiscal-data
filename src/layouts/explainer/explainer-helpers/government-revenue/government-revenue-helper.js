import { analyticsEventHandler } from '../explainer-helpers';

export const analyticsRevenueEventHandler = (eventLabel = 'Revenue', eventAction = 'Revenue Citation Click') => {
  analyticsEventHandler(eventLabel, eventAction);
};
