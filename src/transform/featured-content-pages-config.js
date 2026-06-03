const { BASE_URL } = require('gatsby-env-variables');

const envBaseUrl = BASE_URL;

const featuredContentRegistry = {
  'story-of-data-transparency': {
    slug: '/featured-content/story-of-data-transparency/',
    title: 'The Story of Data Transparency',
    breadCrumbLinkName: 'The Story of Data Transparency',
    seoConfig: {
      pageTitle: 'The Story of Data Transparency',
      description:
        ' U.S. Government financial transparency was established in the Constitution. ' +
        'Learn more about how transparency has evolved to get us where we are today.',
      keywords: 'fiscal data, transparency, history, federal finances',
    },
    prodReady: false,
    heroImage: {
      heading: 'The Story of Data Transparency',
      subHeading: 'From the very beginning, transparency into government finances has been a critical part of government accounting.',
    },
    image: {
      imageRefDesktop: '/images/story-of-data-transparency.png',
      imageRefMobile: '/images/story-of-data-transparency.png',
      altText: 'The Story of Data Transparency',
    },
    colors: {
      primary: '#263A73',
      secondary: '#cfd8f3',
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
          text: 'Government Spending Open Data | USAspending ',
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
          text: 'Monthly Statement of the Public Debt (MSPD)',
          url: '/datasets/monthly-statement-public-debt/summary-of-treasury-securities-outstanding',
        },
      ],
    },
  },
};

const getFeaturedContentPage = pageName => featuredContentRegistry[pageName];

const freshFeaturedContentPages = () => {
  const output = [];

  Object.entries(featuredContentRegistry).forEach(([pageName, ep]) => {
    output[output.length] = {
      pageName,
      slug: ep.slug,
      breadCrumbLinkName: ep.breadCrumbLinkName,
      seoConfig: ep.seoConfig,
      prodReady: ep.prodReady,
      heroImage: ep.heroImage,
    };
  });

  return output;
};

exports.featuredContentRegistry = featuredContentRegistry;
exports.getFeaturedContentPage = getFeaturedContentPage;
exports.freshFeaturedContentPages = freshFeaturedContentPages;
