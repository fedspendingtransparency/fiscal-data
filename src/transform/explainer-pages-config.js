const explainerPagesSource = {
  'national-debt': {
    slug: '/national-debt/',
    breadCrumbLinkName: 'Debt',
    seoConfig: {
      pageTitle: 'Understanding the National Debt',
      description: `The federal government currently has $XX.XX trillion in federal debt.
      Learn how the national debt works and how it impacts you.`
    },
    heroImage: {
      heading: 'What is the national debt?',
      subHeading: `The national debt is the total amount of outstanding borrowings by the U.S. Federal
      Government accumulated over the nation’s history.`
    },
    relatedDatasets: [ "015-BFS-2014Q3-065", "015-BFS-2014Q3-071", "015-BFS-2014Q1-11", "015-BFS-2014Q3-056" ]
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
