const insightPagesSource = {
  'interest-expense': {
    slug: '/interest-expense-avg-interest-rates/',
    breadCrumbLinkName: 'Interest Expense',
    seoConfig: {
      pageTitle: 'Interest Expense and Interest Rates ',
      description: '',
      keywords: 'interest expense, interest cost, interest payments, U.S. debt interest, interest rates',
    },
    prodReady: true,
    heroImage: {
      heading: '',
      subHeading: '',
    },
  },
  'state-and-local-government-series': {
    slug: '/state-and-local-government-series/',
    breadCrumbLinkName: 'State and Local Government Series',
    seoConfig: {
      pageTitle: 'State and Local Government Series (SLGS)',
      description:
        'View charts with outstanding State and Local Government (SLGS) securities over time and learn how these securities support state and local government finances.',
      keywords: 'SLGS, State and Local Government Series, US Treasury SLGS',
    },
    prodReady: true,
    heroImage: {
      heading: 'Outstanding State and Local Government Series (SLGS) Securities',
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
