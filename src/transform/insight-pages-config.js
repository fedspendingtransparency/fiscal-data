const insightPagesSource = {
  'interest-expense': {
    slug: '/interest-expense-avg-interest-rates/',
    breadCrumbLinkName: 'Interest Expense',
    seoConfig: {
      pageTitle: 'Interest Expense and Average Interest Rates on the National Debt ',
      description: '',
      keywords: 'interest expense, interest cost, interest payments, U.S. debt interest, interest rates',
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
