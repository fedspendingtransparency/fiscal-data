import React from 'react';
import FederalRevenueOverview from './overview/federal-revenue-overview';
import SourcesOfFederalRevenue from './sources-of-federal-revenue/sources-of-federal-revenue';
import FederalRevenueTrendsAndUSEconomy from './federal-revenue-trends-and-us-economy/federal-revenue-trends-and-us-economy';
import FederalRevenueTrendsOverTime from './federal-revenue-trends-over-time/federal-revenue-trends-over-time';
import RevenueKeyTakeaways from './key-takeaways/revenue-key-takeaways';

const governmentRevenueSectionIds = [
  'key-takeaways',
  'federal-revenue-overview',
  'sources-of-federal-revenue',
  'federal-revenue-trends-over-time',
  'federal-revenue-trends-and-the-us-economy',
];

const governmentRevenueSections = [
  {
    index: 0,
    id: governmentRevenueSectionIds[0],
    title: 'Key Takeaways',
    component: cpiData => <RevenueKeyTakeaways />,
  },
  {
    index: 1,
    id: governmentRevenueSectionIds[1],
    title: 'Federal Revenue Overview',
    component: cpiData => <FederalRevenueOverview />,
  },
  {
    index: 2,
    id: governmentRevenueSectionIds[2],
    title: 'Sources of Federal Revenue',
    component: cpiData => <SourcesOfFederalRevenue />,
  },
  {
    index: 3,
    id: governmentRevenueSectionIds[3],
    title: 'Federal Revenue Trends Over Time',
    component: cpiData => <FederalRevenueTrendsOverTime cpiDataByYear={cpiData.cpiDataByYear} />,
  },
  {
    index: 4,
    id: governmentRevenueSectionIds[4],
    title: 'Federal Revenue Trends and the U.S. Economy ',
    component: cpiData => <FederalRevenueTrendsAndUSEconomy cpiDataByYear={cpiDataByYear} />,
  },
];

export default governmentRevenueSections;
