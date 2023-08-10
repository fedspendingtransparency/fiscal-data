import React, { useEffect, useState } from "react";
import { apiPrefix, basicFetch } from "../../../utils/api-utils";
import { getShortForm } from "../../../utils/rounding-utils";
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
      The U.S. government has spent ${getShortForm(amount, false)} in fiscal
      year {year} to ensure the well-being of the people of the United States.
      Learn more about spending categories, types of spending, and spending
      trends over time.
    </>
  );
};

export const RevenueBodyGenerator = () => {
  const [currentRevenue, setCurrentRevenue] = useState(null);
  const [recordFiscalYear, setRecordFiscalYear] = useState(null);
  // eslint-disable-next-line max-len
  const revUrl = `v1/accounting/mts/mts_table_4?fields=current_fytd_net_rcpt_amt,prior_fytd_net_rcpt_amt,record_calendar_month,record_calendar_year,record_fiscal_year,record_date&filter=line_code_nbr:eq:830&sort=-record_date&page[size]=1`;
  useEffect(() => {
    basicFetch(`${apiPrefix}${revUrl}`).then(res => {
      if (res.data) {
        const data = res.data[0];
        const currentTotalRevenue = data.current_fytd_net_rcpt_amt || 0;
        setCurrentRevenue(currentTotalRevenue);
        setRecordFiscalYear(data.record_fiscal_year);
      }
    });
  }, []);

  return (
    <>
      The U.S. government has collected $
      {getShortForm(currentRevenue, false)} in fiscal year {recordFiscalYear}{" "}
      in order to pay for the goods and services provided to United States
      citizens and businesses. Learn more about revenue sources, trends over
      time, and how revenue compares to GDP.
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
    analyticsName: "National Debt",
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
    analyticsName: "Federal Spending",
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
    analyticsName: "National Deficit",
  },
  revenue: {
    title: "How much has the U.S. government collected this year?",
    bodyGenerator: RevenueBodyGenerator,
    body:
      "The U.S. government has collected {$XX.X trillion (total revenue)} in fiscal year {YYYY (current fiscal year)} " +
      "in order to pay for the goods and services provided to United States citizens and businesses. Learn more about revenue " +
      "sources, trends over time, and how revenue compares to GDP.",
    altText:
      "U.S. Capitol dome surrounded in circle by hand holding plant, hand holding money, hand holding gold coin, woman looking " +
      "at check, and man looking at building.",
    desktopImage: "Revenue-HomePage-1200x630",
    mobileImage: "Revenue-HomePage-1200x630",
    path: "/americas-finance-guide/government-revenue/",
    analyticsName: "Government Revenue",
  },
  "americas-finance-guide": {
    title: "Your Guide to America’s Finances",
    titleIcon: "AFG-icon",
    body:
      "Your Guide to America's Finances is an overview of U.S. government finances where you’ll find information on money " +
      "coming in (revenue), money going out (spending), the deficit, and debt. Your Guide presents a series of pages exploring " +
      "each topic through educational content and interactive visualizations, providing a comprehensive overview of the trillions " +
      "of dollars collected and spent by the federal government each year.",
    altText:
      "Illustration of finance icons: dollar bill, bag of money, etc. with the text ‘Answer all your questions about federal " +
      "government finance.’ overlaid.",
    desktopImage: "AFG-Overview_1200x630",
    mobileImage: "afg-feature-homepage-mobile",
    path: "/americas-finance-guide/",
    mainFeature: true,
    analyticsName: "America's Finance Guide",
  },
  "currency-exchange-rates": {
    title: "Currency Exchange Rates Converter Tool",
    body: "Fiscal Data’s Currency Exchange Rates Converter tool enables you to get accurate and reliable foreign " +
      "exchange rates based on trusted U.S. Treasury data.",
    altText: "A dollar sign floats above two rotating arrows, implying movement between a Euro coin and Dollar " +
      "coin. Text reads CURRENCY EXCHANGE RATES CONVERTER.",
    desktopImage: "currency_exchange_rates_converter_1200x600",
    mobileImage: "currency_exchange_rates_converter_1200x600",
    path: "/currency-exchange-rates-converter/",
    analyticsName: "Currency Exchange Rates Converter",
  },
};
