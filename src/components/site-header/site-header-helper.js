export const menuSections = [
  {
    title: 'Topics',
    to: '/',
    testId: 'topics',
    featureId: 'topics',
    children: [
      {
        subsectionHeader: 'AMERICA\'S FINANCE GUIDE',
        analyticsAction: 'Topics Click',
        children: [
          {
            to: '/americas-finance-guide/',
            title: 'Overview',
            testId: 'overview'
          },
          {
            to: '/americas-finance-guide/government-revenue/',
            title: 'Revenue',
            testId: 'revenue'
          },
          {
            to: '/americas-finance-guide/federal-spending/',
            title: 'Spending',
            testId: 'spending'
          },
          {
            to: '/americas-finance-guide/national-deficit/',
            title: 'Deficit',
            testId: 'deficit'
          },
          {
            to: '/americas-finance-guide/national-debt/',
            title: 'Debt',
            testId: 'debt'
          }
        ]
      }
    ],
  },
  {
    title: 'Tools',
    to: '/',
    testId: 'tools',
    featureId: 'tools',
    children: [
      {
        to: '/currency-exchange-rates-converter/',
        title: 'Currency Exchange Rates Converter'
      }
    ]
  },
  {
    title: 'Dataset Search',
    to: '/datasets/',
    testId: 'search'
  },
  {
    title: 'Resources',
    to: '/',
    testId: 'Resources',
    children: [
      {
        to: '/api-documentation/',
        title: 'API Documentation'
      },
      {
        to: '/release-calendar/',
        title: 'Release Calendar'
      },
    ]
  },
  {
    title: 'About Us',
    to: '/about-us/',
    testId: 'about'
  },
  {
    title: 'Experimental',
    to: '/experimental/',
    testId: 'experimental',
    isExperimental: true,
    featureId: 'experimental-page'
  }
]

