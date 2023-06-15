export const menuSections = [
  {
    title: 'Topics',
    children: [
      {
        header: 'AMERICA\'S FINANCE GUIDE',
        analyticsAction: 'Topics Click',
        children: [
          {
            to: '/americas-finance-guide/',
            title: 'Overview',
          },
          {
            to: '/americas-finance-guide/government-revenue/',
            title: 'Revenue',
          },
          {
            to: '/americas-finance-guide/federal-spending/',
            title: 'Spending',
          },
          {
            to: '/americas-finance-guide/national-deficit/',
            title: 'Deficit',
          },
          {
            to: '/americas-finance-guide/national-debt/',
            title: 'Debt',
          }
        ]
      }
    ],
  },
  {
    title: 'Tools',
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
    children: [
      {
        title: 'Glossary',
      },
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

