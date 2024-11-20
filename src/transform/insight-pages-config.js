const insightPagesSource = {
  'interest-expense': {
    slug: '/interest-expense-avg-interest-rates/',
    breadCrumbLinkName: 'Interest Expense',
    seoConfig: {
      pageTitle: '',
      description: '',
      keywords: '',
    },
    prodReady: false,
    heroImage: {
      heading: '',
      subHeading: '',
    },
  },
};

const freshInsightPages = () => {
  const output = [];

  Object.entries(insightPagesSource).forEach(([pageName, ep]) => {
    output[output.length] = {
      ...ep,
      pageName,
    };
  });

  return output;
};

exports.freshInsightPages = freshInsightPages;
