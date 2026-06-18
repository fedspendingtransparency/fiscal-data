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
    prodReady: false,
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
    prodReady: false,
    heroImage: {
      heading: 'Historic Data Now Available',
      subHeading: 'Federal receipts and expenditure data dating back to 1793 is now available for the first time on FiscalData.Treasury.gov.',
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
