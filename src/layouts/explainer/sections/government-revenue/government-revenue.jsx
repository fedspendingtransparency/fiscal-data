import React from "react";
import FederalRevenueOverview from "./overview/federal-revenue-overview";
import SourcesOfFederalRevenue from "./sources-of-federal-revenue/sources-of-federal-revenue";
import FederalRevenueTrendsAndUSEconomy
  from "./federal-revenue-trends-and-us-economy/federal-revenue-trends-and-us-economy";
import FederalRevenueTrendsOverTime
  from "./federal-revenue-trends-over-time/federal-revenue-trends-over-time";
import RevenueKeyTakeaways from "./key-takeaways/revenue-key-takeaways";



const governmentRevenueSectionIds = [
  "key-takeaways",
  "federal-revenue-overview",
  "sources-of-federal-revenue",
  "federal-revenue-trends-over-time",
  "federal-revenue-trends-and-the-us-economy"
]


const governmentRevenueSections = [
  {
    index: 0,
    id: governmentRevenueSectionIds[0],
    title: "Key Takeaways",
    component: (glossary, glossaryClickHandler, cpiDataByYear) => (
      <RevenueKeyTakeaways
        glossary={glossary}
        glossaryClickHandler={glossaryClickHandler}
      />
    ),
  },
  {
    index: 1,
    id: governmentRevenueSectionIds[1],
    title: "Federal Revenue Overview",
    component: (glossary, glossaryClickHandler, cpiDataByYear) => <FederalRevenueOverview />
  },
  {
    index: 2,
    id: governmentRevenueSectionIds[2],
    title: "Sources of Federal Revenue",
    component: (glossary, glossaryClickHandler, cpiDataByYear) =>
      <SourcesOfFederalRevenue glossary={glossary} glossaryClickHandler={glossaryClickHandler} />
  },
  {
    index: 3,
    id: governmentRevenueSectionIds[3],
    title: "Federal Revenue Trends Over Time",
    component: (glossary, glossaryClickHandler, cpiDataByYear) => <FederalRevenueTrendsOverTime cpiDataByYear={cpiDataByYear} />
  },
  {
    index: 4,
    id: governmentRevenueSectionIds[4],
    title: "Federal Revenue Trends and the U.S. Economy ",
    component: (glossary, glossaryClickHandler, cpiDataByYear) => <FederalRevenueTrendsAndUSEconomy cpiDataByYear={cpiDataByYear} />
  },
]

export default governmentRevenueSections;
