import { BASE_URL } from 'gatsby-env-variables';
import Analytics from '../../utils/analytics/analytics';
import CustomLink from '../../components/links/custom-link/custom-link';
import React from 'react';

const envBaseUrl = BASE_URL || '';

export const storyOfDataTransparency = {
  title: 'The Story of Data Transparency',
  colors: {
    primary: '#263A73',
    secondary: '#cfd8f3',
  },
  image: {
    imageRefDesktop: 'story-of-data-transparency',
    imageRefMobile: 'story-of-data-transparency',
    altText: 'The Story of Data Transparency',
  },
  socialShare: {
    title: 'The Story of Data Transparency',
    description:
      'U.S. Government financial transparency was established in the Constitution. ' +
      'Learn more about how transparency has evolved to get us where we are today.',
    body:
      'Curious how federal financial transparency has changed since America’s founding? Check out this new piece from @FiscalService ' +
      'Fiscal Data! #DataTransparency #OpenData ',
    emailSubject: 'The Story of Federal Financial Data Transparency',
    emailBody:
      "Check out Fiscal Data's new feature on how federal financial transparency has grown and evolved " +
      'over time! This short piece highlights the roots of financial transparency and the ways that Fiscal ' +
      'Data has continued to advance government transparency. ',
    url: envBaseUrl + '/featured-content/story-of-data-transparency/',
    image: envBaseUrl + '/featured-content-images/story-of-data-transparency.png',
  },
  links: {
    exploreMore: [
      {
        text: 'Government Spending Open Data | USAspending',
        url: 'https://www.usaspending.gov/featured-content/data-you-can-trust/the-story-of-spending-transparency',
        external: true,
      },
      {
        text: "Preserving America's Story | USAspending",
        url: 'https://www.usaspending.gov/featured-content/spending-stories/preserving-americas-story',
        external: true,
      },
      {
        text: 'Understanding the National Debt',
        url: '/americas-finance-guide/national-debt/',
      },
      {
        text: 'National Deficit',
        url: '/americas-finance-guide/national-deficit/',
      },
    ],
    discoverDatasets: [
      {
        text: 'Combined Statement',
        url: '/datasets/combined-statement',
      },
      {
        text: 'Account of Receipts and Expenditures',
        url: '/datasets/account-of-receipts-and-expenditures',
      },
      {
        text: 'Monthly Treasury Statement (MTS)',
        url: '/datasets/monthly-treasury-statement/summary-of-receipts-by-source-and-outlays-by-function-of-the-u-s-government',
      },
      {
        text: 'Historical Debt Outstanding',
        url: '/datasets/historical-debt-outstanding/historical-debt-outstanding',
      },
    ],
  },
};

export const historicDataNowAvailable = {
  title: 'Historic Data Now Available',
  colors: {
    primary: '#263A73',
    secondary: '#cfd8f3',
  },
  image: {
    imageRefDesktop: 'historic-data-now-available',
    imageRefMobile: 'historic-data-now-available',
    altText: 'Historic Data Now Available',
  },
  socialShare: {
    title: 'Historic Data Now Available',
    description:
      'Discover newly released federal receipts and expenditure data, now available on Fiscal Data. ' +
      'For the first time, access centuries of federal financial information in one modern, accessible platform.',
    body:
      'Explore 230 years of U.S. federal finances! New data from 1793 is now available from @FiscalService Fiscal Data. Dive into historical ' +
      'receipts and expenditures, analyze trends, and understand the financial foundations of America. Visit now! #FiscalHistory #OpenData ' +
      '#USFinances',
    emailSubject: 'Historic Data Now Available on Fiscal Data',
    emailBody:
      'Explore 230 years of U.S. federal finances using the newly released data on Fiscal Data. Dive into historical receipts and expenditures, ' +
      'analyze trends, and understand the financial foundations of America. Learn more about this historic release! ',
    url: envBaseUrl + '/featured-content/historic-data-announcement/',
    image: envBaseUrl + '/featured-content-images/historic-data-now-available.png',
  },
  links: {
    exploreMore: [
      {
        text: 'Federal Spending',
        url: '/americas-finance-guide/federal-spending/',
      },
      {
        text: 'Government Revenue',
        url: '/americas-finance-guide/government-revenue/',
      },
    ],
    discoverDatasets: [
      {
        text: 'Account of Receipts and Expenditures',
        url: '/datasets/account-of-receipts-and-expenditures',
      },
      {
        text: 'Combined Statement',
        url: '/datasets/combined-statement',
      },
      {
        text: 'Monthly Treasury Statement (MTS)',
        url: '/datasets/monthly-treasury-statement/summary-of-receipts-by-source-and-outlays-by-function-of-the-u-s-government',
      },
    ],
  },
};

export const historicGovtSpending = {
  title: 'See Historic Government Spending',
  colors: {
    primary: '#263A73',
    secondary: '#cfd8f3',
  },
  image: {
    imageRefDesktop: 'historic-government-spending',
    imageRefMobile: 'historic-government-spending',
    altText: 'See Historic Government Spending',
  },
  socialShare: {
    title: 'See Historic Government Spending',
    description:
      'Explore early U.S. government spending in this new short piece from @FiscalService Fiscal Data highlighting ' +
      'early expenses from the Department of War and the Louisiana Purchase #DataTransparency #GovernmentSpending',
    body:
      'Ever wondered how the early U.S. government spent money? Explore historic spending in early financial reports, ' +
      'now on @FiscalService Fiscal Data! #DataTransparency #OpenData ',
    emailSubject: 'See Historic Government Spending on Fiscal Data',
    emailBody:
      'Ever been curious about how the early U.S. government spent money? This short piece on Fiscal Data explores ' +
      'some early financial reports highlighting historic spending of the early government, including expenses for ' +
      'the Department of War and public debt from the Louisiana Purchase.',
    url: envBaseUrl + '/featured-content/historic-govt-spending/',
    image: envBaseUrl + '/featured-content-images/historic-government-spending.png',
  },

  links: {
    exploreMore: [
      {
        text: 'Government Spending Open Data | USAspending',
        url: 'https://www.usaspending.gov/featured-content/spending-stories/preserving-americas-story',
        external: true,
      },
      {
        text: 'Federal Spending',
        url: '/americas-finance-guide/federal-spending/',
      },
      {
        text: 'Government Revenue',
        url: '/americas-finance-guide/government-revenue/',
      },
      {
        text: 'National Deficit',
        url: '/americas-finance-guide/national-deficit/',
      },
    ],
    discoverDatasets: [
      {
        text: 'Combined Statement',
        url: '/datasets/combined-statement',
      },
      {
        text: 'Account of Receipts and Expenditures',
        url: '/datasets/account-of-receipts-and-expenditures',
      },
      {
        text: 'Monthly Treasury Statement (MTS)',
        url: '/datasets/monthly-treasury-statement/summary-of-receipts-by-source-and-outlays-by-function-of-the-u-s-government',
      },
      {
        text: 'Historical Debt Outstanding',
        url: '/datasets/historical-debt-outstanding/historical-debt-outstanding',
      },
    ],
  },
};

export const gettingStarted = {
  title: 'Getting Started on Fiscal Data',
  colors: {
    primary: '#263A73',
    secondary: '#cfd8f3',
  },
  image: {
    imageRefDesktop: 'getting-started-on-fiscal-data',
    imageRefMobile: 'getting-started-on-fiscal-data',
    altText: 'Getting Started on Fiscal Data',
  },
  socialShare: {
    title: 'Getting Started on Fiscal Data',
    description:
      'Be a part of federal financial transparency! Check out this quick guide to exploring and analyzing ' +
      'open data for U.S. government finances on Fiscal Data.',
    body: "Check out @FiscalService Fiscal Data's new page to help you get started exploring federal financial data! " + '#FiscalData #OpenData ',
    emailSubject: 'Getting Started on Fiscal Data',
    emailBody:
      "Check out Fiscal Data's guide to help you get started exploring federal financial data. This short piece " +
      "helps you understand how to find the data you're looking for so you can review and analyze the numbers yourself. ",
    url: envBaseUrl + '/featured-content/getting-started/',
    image: envBaseUrl + '/featured-content-images/getting-started-on-fiscal-data.png',
  },
  links: {
    exploreMore: [
      {
        text: 'Understanding the National Debt',
        url: '/americas-finance-guide/national-debt/',
      },
      {
        text: 'Federal Spending',
        url: '/americas-finance-guide/federal-spending/',
      },
      {
        text: 'Treasury Savings Bonds Explained',
        url: '/treasury-savings-bonds/',
      },
      {
        text: 'About Us',
        url: '/about-us/',
      },
    ],
    discoverDatasets: [
      {
        text: 'Debt to the Penny',
        url: '/datasets/debt-to-the-penny',
      },
      {
        text: 'Treasury Reporting Rates of Exchange',
        url: '/datasets/treasury-reporting-rates-exchange',
      },
      {
        text: 'Monthly Statement of the Public Debt (MSPD)',
        url: '/datasets/monthly-statement-public-debt',
      },
      {
        text: 'U.S. Treasury-Owned Gold',
        url: '/datasets/status-report-government-gold-reserve',
      },
    ],
  },
};

const featuredContentPages = {
  'story-of-data-transparency': storyOfDataTransparency,
  'historic-data-announcement': historicDataNowAvailable,
  'historic-govt-spending': historicGovtSpending,
  'getting-started': gettingStarted,
};

export const getFeaturedContentPage = pageName => featuredContentPages[pageName];

export const analyticsEventHandler = (pageName, eventLabel, eventAction = 'Citation Click') => {
  Analytics.event({
    category: pageName,
    action: eventAction,
    label: eventLabel,
  });
};

const featuredContentCitations = page => {
  return {
    accountsOfReceiptsAndExpendituresDataset: (
      <CustomLink
        url="/datasets/account-of-receipts-and-expenditures"
        id="Account of the Receipts and Expenditures"
        onClick={() => analyticsEventHandler(page, 'Account of the Receipts and Expenditures')}
      >
        Account of the Receipts and Expenditures
      </CustomLink>
    ),
    federalFundingAccountabilityAct: (
      <CustomLink
        url="https://www.govinfo.gov/content/pkg/PLAW-109publ282/pdf/PLAW-109publ282.pdf"
        id="Federal Funding Accountability Act (FFATA)"
        onClick={() => analyticsEventHandler(page, 'Federal Funding Accountability Act (FFATA)')}
      >
        Federal Funding Accountability Act (FFATA)
      </CustomLink>
    ),
    digitalAccountabilityAndTransparencyAct: (
      <CustomLink
        url="https://www.congress.gov/113/bills/s994/BILLS-113s994enr.pdf"
        id="Digital Accountability and Transparency Act of 2014 (DATA Act)"
        onClick={() => analyticsEventHandler(page, 'Digital Accountability and Transparency Act of 2014 (DATA Act)')}
      >
        Digital Accountability and Transparency Act of 2014 (DATA Act)
      </CustomLink>
    ),
    usaSpending: (
      <CustomLink url="https://www.usaspending.gov" id="USAspending.gov" onClick={() => analyticsEventHandler(page, 'USAspending.gov')}>
        USAspending.gov
      </CustomLink>
    ),
    combinedStatementDataset: (
      <CustomLink
        url="/datasets/combined-statement"
        id="Combined Statement of Receipts, Outlays, and Balances"
        onClick={() => analyticsEventHandler(page, 'Combined Statement of Receipts, Outlays, and Balances')}
      >
        Combined Statement of Receipts, Outlays, and Balances
      </CustomLink>
    ),
    monthlyTreasuryStatementDataset: (
      <CustomLink
        url="/datasets/monthly-treasury-statement/summary-of-receipts-outlays-and-the-deficit-surplus-of-the-u-s-government"
        id="Monthly Treasury Statement"
        onClick={() => analyticsEventHandler(page, 'Monthly Treasury Statement')}
      >
        Monthly Treasury Statement
      </CustomLink>
    ),
    historicalDebtOutstandingDataset: (
      <CustomLink
        url="datasets/historical-debt-outstanding/historical-debt-outstanding"
        id="Historical Debt Outstanding"
        onClick={() => analyticsEventHandler(page, 'Historical Debt Outstanding')}
      >
        Historical Debt Outstanding
      </CustomLink>
    ),
    debtLink: (
      <CustomLink url="/americas-finance-guide/national-debt/" id="National Debt" onClick={() => analyticsEventHandler(page, 'National Debt')}>
        debt
      </CustomLink>
    ),
    spendingLink: (
      <CustomLink
        url="/americas-finance-guide/federal-spending"
        id="Federal Spending"
        onClick={() => analyticsEventHandler(page, 'Federal Spending')}
      >
        spending
      </CustomLink>
    ),
    revenueLink: (
      <CustomLink
        url="/americas-finance-guide/government-revenue"
        id="Government Revenue"
        onClick={() => analyticsEventHandler(page, 'Government Revenue')}
      >
        revenue
      </CustomLink>
    ),
    deficitLink: (
      <CustomLink
        url="/americas-finance-guide/national-deficit"
        id="National Deficit"
        onClick={() => analyticsEventHandler('National Deficit', 'Debt Citation Click')}
      >
        deficit
      </CustomLink>
    ),
    datasetSearchLink: (
      <CustomLink url="/datasets/" id="Dataset Search" onClick={() => analyticsEventHandler(page, 'Dataset Search')}>
        Dataset Search
      </CustomLink>
    ),
    federalSpendingLink: (
      <CustomLink
        url="/americas-finance-guide/federal-spending/"
        id="Federal Spending"
        onClick={() => analyticsEventHandler(page, 'Federal Spending')}
      >
        federal spending
      </CustomLink>
    ),
    savingsBondsLink: (
      <CustomLink url="/treasury-savings-bonds/" id="Treasury Savings Bonds" onClick={() => analyticsEventHandler(page, 'Treasury Savings Bonds')}>
        savings bonds
      </CustomLink>
    ),
    interestExpenseInsightLink: (
      <CustomLink
        url="/interest-expense-avg-interest-rates/"
        id="Interest Expense and Average Interest Rates"
        onClick={() => analyticsEventHandler(page, 'Interest Expense and Average Interest Rates')}
      >
        cost of maintaining the debt
      </CustomLink>
    ),
  };
};

export const featuredContentCitationsMap = {
  'story-of-data-transparency': featuredContentCitations('The Story of Data Transparency'),
  'historic-data-announcement': featuredContentCitations('Historic Data Now Available'),
  'historic-govt-spending': featuredContentCitations('See Historic Government Spending'),
  'getting-started': featuredContentCitations('Getting Started on Fiscal Data'),
};
