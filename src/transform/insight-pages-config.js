const insightPagesSource = {
  'interest-expense': {
    slug: '/interest-expense/',
    breadCrumbLinkName: 'Interest Expense',
    seoConfig: {
      pageTitle: '',
      description: '',
      keywords: '',
    },
    prodReady: false,
    heroImage: {
      heading: 'Interest Expense and Average Interest Rates on the National Debt FY {YYYY} – FYTD {YYYY}',
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
