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
            name: 'Overview',
            testId: 'overview'
          },
          {
            to: '/americas-finance-guide/government-revenue/',
            name: 'Revenue',
            testId: 'revenue'
          },
          {
            to: '/americas-finance-guide/federal-spending/',
            name: 'Spending',
            testId: 'spending'
          },
          {
            to: '/americas-finance-guide/national-deficit/',
            name: 'Deficit',
            testId: 'deficit'
          },
          {
            to: '/americas-finance-guide/national-debt/',
            name: 'Debt',
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
        name: 'Currency Exchange Rates Converter'
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
        name: 'API Documentation'
      },
      {
        to: '/release-calendar/',
        name: 'Release Calendar'
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

