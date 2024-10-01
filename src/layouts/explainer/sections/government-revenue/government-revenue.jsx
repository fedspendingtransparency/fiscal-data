import React from 'react';
import FederalRevenueOverview from './overview/federal-revenue-overview';
import SourcesOfFederalRevenue from './sources-of-federal-revenue/sources-of-federal-revenue';
import FederalRevenueTrendsAndUSEconomy from './federal-revenue-trends-and-us-economy/federal-revenue-trends-and-us-economy';
import FederalRevenueTrendsOverTime from './federal-revenue-trends-over-time/federal-revenue-trends-over-time';
import RevenueKeyTakeaways from './key-takeaways/revenue-key-takeaways';
import Analytics from '../../../../utils/analytics/analytics';

const governmentRevenueSectionIds = [
  'key-takeaways',
  'federal-revenue-overview',
  'sources-of-federal-revenue',
  'federal-revenue-trends-over-time',
  'federal-revenue-trends-and-the-us-economy',
];

export const analyticsClickHandler = (eventLabel) => {
  Analytics.event({
    category: 'Explainers',
    action: 'Revenue Citation Click',
    label: eventLabel ? eventLabel: `Revenue`,
  });
};

const governmentRevenueSections = [
  {
    index: 0,
    id: governmentRevenueSectionIds[0],
    title: 'Key Takeaways',
    component: cpiData => <RevenueKeyTakeaways />,
    onClick: () => analyticsClickHandler(),
  },
  {
    index: 1,
    id: governmentRevenueSectionIds[1],
    title: 'Federal Revenue Overview',
    component: cpiData => <FederalRevenueOverview />,
    onClick: () => analyticsClickHandler(),
  },
  {
    index: 2,
    id: governmentRevenueSectionIds[2],
    title: 'Sources of Federal Revenue',
    component: cpiData => <SourcesOfFederalRevenue />,
    onClick: () => analyticsClickHandler(),
  },
  {
    index: 3,
    id: governmentRevenueSectionIds[3],
    title: 'Federal Revenue Trends Over Time',
    component: cpiData => <FederalRevenueTrendsOverTime cpiDataByYear={cpiData.cpiDataByYear} />,
    onClick: () => analyticsClickHandler(),
  },
  {
    index: 4,
    id: governmentRevenueSectionIds[4],
    title: 'Federal Revenue Trends and the U.S. Economy',
    component: cpiData => <FederalRevenueTrendsAndUSEconomy cpiDataByYear={cpiData.cpiDataByYear} />,
    onClick: () => analyticsClickHandler(),
  },
];

export default governmentRevenueSections;
