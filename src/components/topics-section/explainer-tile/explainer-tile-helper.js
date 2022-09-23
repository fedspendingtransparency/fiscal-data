import React, { useEffect, useState } from "react";
import { apiPrefix, basicFetch } from "../../../utils/api-utils";
import { getShortForm } from "../../../layouts/explainer/heros/hero-helper";

export const SpendingBodyGenerator = () => {
  const fields =
    "fields=current_fytd_net_outly_amt,record_fiscal_year,record_date";
  const filter = "filter=line_code_nbr:eq:5691";
  const sort = "sort=-record_date";
  const pagination = "page[size]=1";
  const endpointUrl = `v1/accounting/mts/mts_table_5?${fields}&${filter}&${sort}&${pagination}`;
  const spendingUrl = `${apiPrefix}${endpointUrl}`;
  const [amount, setAmount] = useState("0");
  const [year, setYear] = useState("null");

  useEffect(() => {
    basicFetch(`${spendingUrl}`).then(res => {
      if (res.data) {
        const data = res.data[0];
        setAmount(data.current_fytd_net_outly_amt);
        setYear(data.record_fiscal_year);
      }
    });
  }, []);

  return (
    <>
      The U.S. government has spent ${getShortForm(amount, 2, false)} in fiscal
      year {year} to ensure the well-being of the people of the United States.
      Learn more about spending categories, types of spending, and spending
      trends over time.
    </>
  );
};

export const pageTileMap = {
  debt: {
    title: "What is the national debt?",
    body:
      "The national debt enables the federal government to pay for important programs and " +
      "services for the American public. Explore debt concepts, the latest values, and trends " +
      "over time.",
    altText:
      "Hands raised in the air holding various objects, including a calculator, a pencil, " +
      "money, and magnifying glass",
    desktopImage: "homepage_debt_1200x630",
    mobileImage: "homepage_debt_1200x630",
    path: "/americas-finance-guide/national-debt/",
  },
  spending: {
    title: "How much has the U.S. government spent this year?",
    body:
      "The U.S. government has spent {$XX.X trillion (total spending)} in fiscal " +
      "year {YYYY (current fiscal year)} to ensure the well-being of the people of the " +
      "United States. Learn more about spending categories, types of spending, and " +
      "spending trends over time.",
    bodyGenerator: SpendingBodyGenerator,
    altText:
      "The US Treasury building is placed next to a row of homes. A pair of hands " +
      "exchange money in the foreground.",
    desktopImage: "homepage_spending_1200x630",
    mobileImage: "homepage_spending_1200x630",
    path: "/americas-finance-guide/federal-spending/",
  },
  deficit: {
    title: "What is the national deficit?",
    body:
      "A national deficit occurs when the money going out exceeds the money coming in for a " +
      "given period of time. Learn more about the U.S. deficit and how it has changed over time.",
    altText:
      "A hand holding a gold coin beside a variety of symbols, including a pie chart, bar " +
      "graph, and lit lightbulb.",
    desktopImage: "deficit_homepage",
    mobileImage: "deficit_homepage",
    path: "/americas-finance-guide/national-deficit/",
  },
  revenue: {
    title: "How much revenue has the U.S. government collected this year? ",
    body:
      "The U.S. government has collected {$XX.X trillion (total revenue)} in fiscal year {YYYY (current fiscal year)} in order to pay for the goods and services provided to United States citizens and businesses. Learn more about revenue sources, trends over time, and how revenue compares to GDP.",
    altText:
      "U.S. Capitol dome surrounded in circle by hand holding plant, hand holding money, hand holding gold coin, woman looking at check, and man looking at building.",
    desktopImage: "Revenue-HomePage-1200x630",
    mobileImage: "Revenue-HomePage-1200x630",
    path: "americas-finance-guide/government-revenue",
  },
  "americas-finance-guide": {
    title: "Your Guide to America’s Finances",
    body:
      "Here you’ll find information on spending, revenue, the deficit, and debt. The Guide represents a series of interactive visualizations exploring each category and how it has changed over time.",
    altText:
      "Illustration of finance icons: dollar bill, bag of money, etc. with the text ‘Answer all your questions about federal government finance.’ overlaid.",
    desktopImage: "AFG-Overview_1200x630",
    mobileImage: "afg-feature-homepage-mobile",
    path: "americas-finance-guide",
    mainFeature: true
  },
};
