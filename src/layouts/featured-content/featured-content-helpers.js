import Analytics from '../../utils/analytics/analytics';

export { featuredContentRegistry, getFeaturedContentPage } from '../../transform/featured-content-pages-config';

export const analyticsEventHandler = (pageName, eventLabel, eventAction = 'Citation Click') => {
  Analytics.event({
    category: pageName,
    action: eventAction,
    label: eventLabel,
  });
};
