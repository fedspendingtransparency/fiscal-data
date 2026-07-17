const featuredContentPagesSource = {
  'story-of-data-transparency': {
    slug: '/featured-content/story-of-data-transparency/',
    breadCrumbLinkName: 'The Story of Data Transparency',
    seoConfig: {
      pageTitle: 'The Story of Data Transparency',
      description:
        'U.S. Government financial transparency was established in the Constitution. ' +
        'Learn more about how transparency has evolved to get us where we are today.',
      keywords: 'fiscal data, transparency, history, federal finances',
    },
    prodReady: true,
    heroImage: {
      heading: 'The Story of Data Transparency',
      subHeading: 'From the very beginning, transparency into government finances has been a critical part of government accounting.',
    },
  },
  'historic-data-announcement': {
    slug: '/featured-content/historic-data-announcement/',
    breadCrumbLinkName: 'Historic Data Now Available',
    seoConfig: {
      pageTitle: 'Historic Data Now Available',
      description:
        'Discover newly released federal receipts and expenditure data, now available on Fiscal Data. ' +
        'For the first time, access centuries of federal financial information in one modern, accessible platform.',
      keywords: 'government expenditures, government spending, government revenue, open data, fiscal data, how-to, transparency',
    },
    prodReady: true,
    heroImage: {
      heading: 'Historic Data Now Available',
      subHeading: 'Federal receipts and expenditure data dating back to 1793 is now available for the first time on FiscalData.Treasury.gov.',
    },
  },
  'getting-started': {
    slug: '/featured-content/getting-started/',
    breadCrumbLinkName: 'Getting Started on Fiscal Data',
    seoConfig: {
      pageTitle: 'Getting Started on Fiscal Data',
      description:
        'Be a part of federal financial transparency! Check out this quick guide to exploring and analyzing ' +
        'open data for U.S. government finances on Fiscal Data.',
      keywords: 'open data, fiscal data, how-to, transparency',
    },
    prodReady: false,
    heroImage: {
      heading: 'Getting Started on Fiscal Data',
      subHeading: 'Fiscal Data is your one-stop shop for federal financial data.',
    },
  },
  'historic-govt-spending': {
    slug: '/featured-content/historic-govt-spending/',
    breadCrumbLinkName: 'See Historic Government Spending ',
    seoConfig: {
      pageTitle: 'See Historic Government Spending',
      description:
        'Ever been curious about how the early U.S. government spent money? We explore some early financial reports ' +
        'highlighting historic spending of the early government.',
      keywords: 'fiscal data, transparency, history, federal finances',
    },
    prodReady: true,
    heroImage: {
      heading: 'See Historic Government Spending',
      subHeading: 'Ever been curious about how the early U.S. government spent money?',
    },
  },
};

const freshFeaturedContentPages = () => {
  const output = [];

  Object.entries(featuredContentPagesSource).forEach(([pageName, ep]) => {
    output[output.length] = {
      ...ep,
      pageName,
    };
  });

  return output;
};

exports.freshFeaturedContentPages = freshFeaturedContentPages;
