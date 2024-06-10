const explainerPagesSource = {
  'national-debt': {
    slug: '/americas-finance-guide/national-debt/',
    breadCrumbLinkName: 'Debt',
    seoConfig: {
      pageTitle: 'Understanding the National Debt',
      description: `Learn how the national debt works and how it impacts you.`,
      keywords:
        'us national debt, federal debt, national debt by year, debt held by public, intragovernmental holdings, debt ceiling, national debt to gdp',
    },
    prodReady: true,
    heroImage: {
      heading: 'What is the national debt?',
      subHeading: `The national debt is the total amount of outstanding borrowing by the U.S. Federal Government accumulated over the nation’s history.`,
    },
    relatedDatasets: ['015-BFS-2014Q3-065', '015-BFS-2014Q3-071', '015-BFS-2014Q1-11', '015-BFS-2014Q3-056'],
    isAFG: true,
  },
  'national-deficit': {
    slug: '/americas-finance-guide/national-deficit/',
    breadCrumbLinkName: 'Deficit',
    seoConfig: {
      pageTitle: 'National Deficit',
      description: `Learn about the national deficit, the difference between budget deficit and
      debt, and how the deficit has changed over time.`,
      keywords: 'national deficit, federal deficit, us deficit, deficit spending, surplus, balanced budget, national deficit by year',
    },
    prodReady: true,
    heroImage: {
      heading: 'What is the national deficit?',
      subHeading: '',
    },
    relatedDatasets: ['015-BFS-2014Q1-13', '015-BFS-2014Q3-096', '015-BFS-2014Q1-07', '015-BFS-2014Q1-03'],
    isAFG: true,
  },
  'federal-spending': {
    slug: '/americas-finance-guide/federal-spending/',
    breadCrumbLinkName: 'Spending',
    seoConfig: {
      pageTitle: 'Federal Spending',
      description: `Explore federal spending by category or agency and learn how much the United
      States government spends each year.`,
      keywords:
        'federal spending, us government spending, us government spending chart, discretionary spending, mandatory ' +
        'spending, federal spending by year, federal spending by category, federal spending by agency, government spending as percent of gdp',
    },
    prodReady: true,
    heroImage: {
      heading: 'How much has the U.S. government spent this year?',
      subHeading: '',
    },
    relatedDatasets: ['015-BFS-2014Q1-13', '015-BFS-2014Q3-103', '015-BFS-2014Q1-03', '015-BFS-2014Q1-07'],
    isAFG: true,
  },
  'government-revenue': {
    slug: '/americas-finance-guide/government-revenue/',
    breadCrumbLinkName: 'Government Revenue',
    seoConfig: {
      pageTitle: 'Government Revenue',
      description: `Learn how much the U.S. government collects in revenue, and what types of
      revenue it brings in.`,
      keywords:
        'government revenue, tax revenue, government revenue sources, us tax revenue by year, government revenue to gdp ' +
        'ratio, largest federal revenue source',
    },
    prodReady: true,
    heroImage: {
      heading: 'How much revenue has the U.S. government collected this year? ',
      subHeading: '',
    },
    relatedDatasets: ['015-BFS-2014Q1-13', '015-BFS-2014Q1-04', '015-BFS-2020Q4-yy', '015-BFS-2014Q1-07'],
    isAFG: true,
  },
  'treasury-savings-bonds': {
    slug: '/treasury-savings-bonds/',
    breadCrumbLinkName: 'Treasury Savings Bonds Explained',
    seoConfig: {
      pageTitle: 'Treasury Savings Bonds Explained ',
      description: `Learn how U.S. government savings bonds work, including types of savings bonds, and how you might have a savings bond ready to redeem.`,
      keywords: 'treasury savings bonds, savings bonds history, savings bonds over time, savings bonds and inflation, matured savings bonds',
    },
    prodReady: true,
    heroImage: {
      heading: 'How much has been invested in savings bonds this year?',
      subHeading: '',
    },
    relatedDatasets: ['015-BFS-2014Q3-080', '015-BFS-2014Q3-096', '015-BFS-2014Q1-11', '015-BFS-2014Q3-056'],
    isAFG: false,
  },
};

const freshExplainerPages = () => {
  const output = [];

  Object.entries(explainerPagesSource).forEach(([pageName, ep]) => {
    output[output.length] = {
      ...ep,
      pageName,
    };
  });

  return output;
};

exports.freshExplainerPages = freshExplainerPages;
