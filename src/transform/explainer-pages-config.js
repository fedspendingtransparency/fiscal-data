const explainerPagesSource = {
  'national-debt': {
    slug: '/national-debt/',
    breadCrumbLinkName: 'Debt',
    seoConfig: {
      pageTitle: 'Understanding the National Debt',
      description: `By the end of 2020, the federal government had $26.95 trillion in federal debt.
        Learn how the national debt works and how it impacts you.`
    },
    heroImage: {
      heading: 'What is the national debt?',
      subHeading: `The national debt is a measurement of how much money is borrowed to cover the
        outstanding balance of our expenses. The federal government  has over $26 trillion in
        federal debt.`
    },
    relatedDatasets: ["015-BFS-2014Q3-056", "015-BFS-2014Q3-065", "015-BFS-2014Q3-071", "015-BFS-2014Q1-11"]
  }
}

const freshExplainerPages = () => {
  const output = [];

  Object.entries(explainerPagesSource).forEach(([pageName, ep]) => {
    output[output.length] = {
      ...ep,
      pageName
    };
  });

  return output;
}

exports.freshExplainerPages = freshExplainerPages;
