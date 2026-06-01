const featuredContentPagesSource = {
  'story-of-data-transparency': {
    slug: '/featured-content/story-of-data-transparency/',
    breadCrumbLinkName: 'The Story of Data Transparency',
    seoConfig: {
      pageTitle: 'The Story of Data Transparency',
      description:
        ' U.S. Government financial transparency was established in the Constitution. Learn more about how transparency has evolved to get us where we are today.',
      keywords: 'fiscal data, transparency, history, federal finances',
    },
    prodReady: false,
    heroImage: {
      heading: 'The Story of Data Transparency',
      subHeading: 'From the very beginning, transparency into government finances has been a critical part of government accounting.',
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
