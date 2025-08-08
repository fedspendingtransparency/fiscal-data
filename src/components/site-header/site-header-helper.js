export const menuSections = [
  {
    title: 'Topics',
    children: [
      {
        header: 'FEATURED TOPICS',
        children: [
          { to: '/interest-expense-avg-interest-rates/', title: 'Interest Expense', icon: 'percent', desc: 'What we pay on debt', color: '#00796B' },
          { to: '/treasury-savings-bonds/',              title: 'Savings Bonds',    icon: 'piggy',   desc: 'Rates, terms, & types', color: '#b04abd'},
          { to: '/state-and-local-government-series/',   title: 'State and Local Government Series',  icon: 'building',desc: 'Debt tools for municipal bonds', color: '#0071bc' },
        ],
      },
      {
        header: "AMERICA'S FINANCE GUIDE",
        children: [
          { to: '/americas-finance-guide/',  title: 'Overview', icon: 'compass',  desc: 'How the money moves', color: '#0071bc' },
          { to: '/americas-finance-guide/government-revenue/',title: 'Revenue',  icon: 'coins', desc: 'Where funds come from', color: '#0a2f5a' },
          { to: '/americas-finance-guide/federal-spending/', title: 'Spending', icon: 'chartPie', desc: 'Where funds go', color: '#00766c' },
          { to: '/americas-finance-guide/national-deficit/', title: 'Deficit',  icon: 'minus',  desc: 'Gap between Revenue and Spending', color: '#b3532d' },
          { to: '/americas-finance-guide/national-debt/', title: 'Debt', icon: 'bank',  desc: 'Total owed over time', color: '#4a0072' },
        ],
      },
    ],
  },
  {
    title: 'Tools',
    header: "TOOLS",
    children: [
      { to: '/currency-exchange-rates-converter/', title: 'FX Converter', icon: 'arrows', desc: 'Live exchange rates' },
    ],
  },
  {
    title: 'Resources',
    children: [
      { title: 'Glossary', icon: 'book', desc: 'Terms & plain-English defs' },
      { to: '/api-documentation/', title: 'API Documentation', icon: 'code', desc: 'Endpoints, params, examples' },
      { to: '/release-calendar/',  title: 'Release Calendar',  icon: 'calendar', desc: 'Upcoming data drops' },
      {
        to: 'https://onevoicecrm.my.site.com/FiscalDataCommunity/s/',
        title: 'Community Site',
        external: true,
        icon: 'user',
        skipExternalModal: true,
      },,    ],
  },
  { title: 'Dataset Search', to: '/datasets/', testId: 'search' },

  { title: 'About Us', to: '/about-us/', testId: 'about' },
  { title: 'Experimental', to: '/experimental/', testId: 'experimental', isExperimental: true, featureId: 'experimental-page' }, ];
