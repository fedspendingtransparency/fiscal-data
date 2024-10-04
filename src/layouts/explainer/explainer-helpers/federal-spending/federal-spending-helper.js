import React from 'react';
import CustomLink from '../../../../components/links/custom-link/custom-link';
import { analyticsClickHandler } from '../../sections/federal-spending/federal-spending';
import Analytics from '../../../../utils/analytics/analytics';
import { analyticsEventHandler } from '../explainer-helpers';

export const analyticsSpendingEventHandler = (eventLabel = 'Spending', eventAction = 'Spending Citation Click') => {
  analyticsEventHandler(eventLabel, eventAction);
};
