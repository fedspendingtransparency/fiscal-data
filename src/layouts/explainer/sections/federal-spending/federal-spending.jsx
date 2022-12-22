import React from "react";
import SpendingKeyTakeaways from "./key-takeaways/spending-key-takeaways";
import {SpendingOverview} from "./overview/spending-overview";
import {SpendingCategories} from "./spending-categories/spending-categories";
import SpendingDifference from "./spending-difference/spending-difference";
import {SpendingTrends} from "./spending-trends/spending-trends";


export const federalSpendingSectionIds = [
  "key-takeaways",
  "federal-spending-overview",
  "spending-categories",
  "the-difference-between-mandatory-discretionary-and-supplemental-spending",
  "spending-trends-over-time-and-the-us-economy",
]


const federalSpendingSection = [
  {
    index: 0,
    id: federalSpendingSectionIds[0],
    title: "Key Takeaways",
    component: (glossary, cpiDataByYear) => (
      <SpendingKeyTakeaways
        glossary={glossary}
      />
    ),
  },
  {
    index: 1,
    id: federalSpendingSectionIds[1],
    title: "Federal Spending Overview",
    component: (glossary, cpiDataByYear) => (
      <SpendingOverview glossary={glossary} />
    ),
  },
  {
    index: 2,
    id: federalSpendingSectionIds[2],
    title: "Spending Categories",
    component: (glossary, cpiDataByYear) => (
      <SpendingCategories />
    ),
  },
  {
    index: 3,
    id: federalSpendingSectionIds[3],
    title:
      "The Difference Between Mandatory, Discretionary, and Supplemental Spending",
    component: (glossary, cpiDataByYear) => (
      <SpendingDifference glossary={glossary} />
    ),
  },
  {
    index: 4,
    id: federalSpendingSectionIds[4],
    title: "Spending Trends Over Time and the U.S. Economy",
    component: (glossary, cpiDataByYear) => (
      <SpendingTrends cpiDataByYear={cpiDataByYear} />
    ),
  },
]

export default federalSpendingSection;
