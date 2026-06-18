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
    image: envBaseUrl + '/images/story-of-data-transparency.png',
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
    image: envBaseUrl + '/images/historic-data-now-available.png',
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

const featuredContentPages = {
  'story-of-data-transparency': storyOfDataTransparency,
  'historic-data-announcement': historicDataNowAvailable,
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
        id="Account of the Receipts and Expenditures of the United States"
        onClick={() => analyticsEventHandler(page, 'Account of the Receipts and Expenditures of the United States')}
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
  };
};

export const featuredContentCitationsMap = {
  'story-of-data-transparency': featuredContentCitations('The Story of Data Transparency'),
  'historic-data-announcement': featuredContentCitations('Historic Data Now Available'),
};
