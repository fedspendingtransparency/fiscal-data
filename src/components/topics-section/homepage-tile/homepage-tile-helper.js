import React, { useEffect, useState } from 'react';
import { apiPrefix, basicFetch } from '../../../utils/api-utils';
import { getShortForm } from '../../../utils/rounding-utils';

export const SpendingBodyGenerator = () => {
  const fields = 'fields=current_fytd_net_outly_amt,record_fiscal_year,record_date';
  const filter = 'filter=line_code_nbr:eq:5691';
  const sort = 'sort=-record_date';
  const pagination = 'page[size]=1';
  const endpointUrl = `v1/accounting/mts/mts_table_5?${fields}&${filter}&${sort}&${pagination}`;
  const spendingUrl = `${apiPrefix}${endpointUrl}`;
  const [amount, setAmount] = useState('0');
  const [year, setYear] = useState('null');

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
      The U.S. government has spent ${getShortForm(amount, false)} in fiscal year {year} to ensure the well-being of the people of the United States.
      Learn more about spending categories, types of spending, and spending trends over time.
    </>
  );
};

export const RevenueBodyGenerator = () => {
  const [currentRevenue, setCurrentRevenue] = useState(null);
  const [recordFiscalYear, setRecordFiscalYear] = useState(null);
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
      The U.S. government has collected ${getShortForm(currentRevenue, false)} in fiscal year {recordFiscalYear} in order to pay for the goods and
      services provided to United States citizens and businesses. Learn more about revenue sources, trends over time, and how revenue compares to GDP.
    </>
  );
};

export const SavingsBondsBodyGenerator = () => {
  const [currentFiscalYear, setCurrentFiscalYear] = useState(null);
  const [savingsBondsAmount, setSavingsBondsAmount] = useState(null);
  const sbUrl = `v1/accounting/od/securities_sales?filter=security_type_desc:eq:Savings%20Bond`;

  const sumSavingsBondsAmount = data => {
    return data.reduce((n, { net_sales_amt }) => n + parseInt(net_sales_amt), 0);
  };

  useEffect(() => {
    basicFetch(`${apiPrefix}${sbUrl}&sort=-record_date&page[size]=1`).then(res => {
      if (res.data) {
        const currentFY = res.data[0].record_fiscal_year;
        setCurrentFiscalYear(currentFY);
        const currentFYReqUrl = `${apiPrefix}${sbUrl},record_fiscal_year:eq:${currentFY}`;
        basicFetch(`${currentFYReqUrl}`).then(res2 => {
          if (res2.data) {
            const currentTotalSavingsBonds = sumSavingsBondsAmount(res2.data);
            setSavingsBondsAmount(currentTotalSavingsBonds);
          }
        });
      }
    });
  }, []);

  return (
    <>
      In FY {currentFiscalYear}, U.S. citizens have invested ${getShortForm(savingsBondsAmount, false)} in savings bonds. Discover how savings bonds
      help finance the federal government and the benefits these bonds offer to citizens who choose to invest in them.
    </>
  );
};
export const pageTileMap = {
  debt: {
    title: 'What is the national debt?',
    body:
      'The national debt enables the federal government to pay for important programs and ' +
      'services for the American public. Explore debt concepts, the latest values, and trends ' +
      'over time.',
    altText: 'Hands raised in the air holding various objects, including a calculator, a pencil, money, and magnifying glass',
    desktopImage: 'homepage_debt_1200x630',
    mobileImage: 'homepage_debt_1200x630',
    path: '/americas-finance-guide/national-debt/',
    analyticsName: 'National Debt',
  },
  spending: {
    title: 'How much has the U.S. government spent this year?',
    body:
      'The U.S. government has spent {$XX.X trillion (total spending)} in fiscal ' +
      'year {YYYY (current fiscal year)} to ensure the well-being of the people of the ' +
      'United States. Learn more about spending categories, types of spending, and ' +
      'spending trends over time.',
    bodyGenerator: SpendingBodyGenerator,
    altText: 'The US Treasury building is placed next to a row of homes. A pair of hands exchange money in the foreground.',
    desktopImage: 'homepage_spending_1200x630',
    mobileImage: 'homepage_spending_1200x630',
    path: '/americas-finance-guide/federal-spending/',
    analyticsName: 'Federal Spending',
  },
  deficit: {
    title: 'What is the national deficit?',
    body:
      'A national deficit occurs when the money going out exceeds the money coming in for a ' +
      'given period of time. Learn more about the U.S. deficit and how it has changed over time.',
    altText: 'A hand holding a gold coin beside a variety of symbols, including a pie chart, bar graph, and lit lightbulb.',
    desktopImage: 'deficit_homepage',
    mobileImage: 'deficit_homepage',
    path: '/americas-finance-guide/national-deficit/',
    analyticsName: 'National Deficit',
  },
  revenue: {
    title: 'How much has the U.S. government collected this year?',
    bodyGenerator: RevenueBodyGenerator,
    body:
      'The U.S. government has collected {$XX.X trillion (total revenue)} in fiscal year {YYYY (current fiscal year)} ' +
      'in order to pay for the goods and services provided to United States citizens and businesses. Learn more about revenue ' +
      'sources, trends over time, and how revenue compares to GDP.',
    altText:
      'U.S. Capitol dome surrounded in circle by hand holding plant, hand holding money, hand holding gold coin, woman looking ' +
      'at check, and man looking at building.',
    desktopImage: 'Revenue-HomePage-1200x630',
    mobileImage: 'Revenue-HomePage-1200x630',
    path: '/americas-finance-guide/government-revenue/',
    analyticsName: 'Government Revenue',
  },
  'americas-finance-guide': {
    title: 'Your Guide to America’s Finances',
    titleIcon: 'AFG-icon',
    body:
      "Your Guide to America's Finances is an overview of U.S. government finances where you’ll find information on money " +
      'coming in (revenue), money going out (spending), the deficit, and debt. Your Guide presents a series of pages exploring ' +
      'each topic through educational content and interactive visualizations, providing a comprehensive overview of the trillions ' +
      'of dollars collected and spent by the federal government each year.',
    altText:
      'Illustration of finance icons: dollar bill, bag of money, etc. with the text ‘Answer all your questions about federal ' +
      'government finance.’ overlaid.',
    desktopImage: 'AFG-Overview_1200x630',
    mobileImage: 'afg-feature-homepage-mobile',
    path: '/americas-finance-guide/',
    mainFeature: true,
    analyticsName: "America's Finance Guide",
  },
  'currency-exchange-rates': {
    title: 'Currency Exchange Rates Converter Tool',
    body:
      'Fiscal Data’s Currency Exchange Rates Converter tool enables you to get accurate and reliable foreign ' +
      'exchange rates based on trusted U.S. Treasury data.',
    altText:
      'A dollar sign floats above two rotating arrows, implying movement between a Euro coin and Dollar ' +
      'coin. Text reads CURRENCY EXCHANGE RATES CONVERTER.',
    desktopImage: 'currency_exchange_rates_converter_1200x600',
    mobileImage: 'currency_exchange_rates_converter_1200x600',
    path: '/currency-exchange-rates-converter/',
    analyticsName: 'Currency Exchange Rates Converter',
  },
  'interest-expense': {
    title: 'Discover Interest Expense Trends Over Time',
    body:
      'Interest expense is the interest the government pays on its outstanding loans (Treasury securities). ' +
      'Learn more and explore trends on interest expense and average interest rates on the national debt.',
    altText:
      'Illustration with images including a calculator, stacked coins, and a magnifying glass on top of a ' +
      'flattened set of charts with the text ‘Fiscal Data Insight’ above ‘Interest Expense’ and the Fiscal Data logo ' +
      'in the bottom right corner.',
    desktopImage: 'Interest-Expense-Social-Share-Magnifying-Class-and-Calculator_1200x630',
    mobileImage: 'Interest-Expense-Social-Share-Magnifying-Class-and-Calculator_1200x630',
    path: '/interest-expense-avg-interest-rates/',
    analyticsName: 'Interest Expense',
  },
  'state-and-local-government-series': {
    title: 'Explore How State and Local Governments invest in U.S. Treasury Securities',
    body:
      'State and Local Government Series (SLGS) are non-marketable securities that help state and local ' +
      'governments meet their financing needs. Learn more and explore monthly trends in outstanding SLGS securities. ',
    altText:
      'Illustration with images including three buildings with the text, “Why do we invest in ' +
      'State and Local Government Series Securities? Fiscal Data Explains”, and the Fiscal Data logo in the bottom right corner. ',
    desktopImage: 'State-and-local-government-series-1200_630',
    mobileImage: 'State-and-local-government-series-1200_630',
    path: '/state-and-local-government-series/',
    analyticsName: 'State and Local Government Series',
  },
  'savings-bonds': {
    title: 'Explore U.S. Treasury Savings Bonds',
    bodyGenerator: SavingsBondsBodyGenerator,
    body:
      'In {YYYY (latest complete FY)}, U.S. citizens invested {$XXX million (total savings bonds purchased in latest ' +
      'complete FY)} in savings bonds. Discover how savings bonds help finance the federal government and the benefits ' +
      'these bonds offer to citizens who choose to invest in them.',
    altText: 'Savings bonds, including Series H and Series EE, surrounding the text “Fiscal Data Explains: Savings Bonds.”',
    desktopImage: 'Savings-Bonds-Homepage-Tile_1200x630',
    mobileImage: 'Savings-Bonds-Homepage-Tile_1200x630',
    path: '/treasury-savings-bonds/',
    analyticsName: 'Treasury Savings Bonds',
  },
};
