import {
  faChartPie,
  faToolbox,
  faDatabase,
  faFileLines,
  faInfoCircle,
  faPiggyBank,
  faSackDollar,
} from '@fortawesome/free-solid-svg-icons';

export const menuSections = [
  {
    title: 'Topics',
    // grouped sections preserved
    children: [
      {
        header: 'FEATURED TOPICS',
        analyticsAction: 'Topics Click',
        children: [
          {
            to: '/interest-expense-avg-interest-rates/',
            title: 'Interest Expense',
            desc: 'How much we pay on federal debt',
            icon: faSackDollar,
          },
          {
            to: '/treasury-savings-bonds/',
            title: 'Savings Bonds',
            desc: 'Series I & EE basics',
            icon: faPiggyBank,
          },
          {
            to: '/state-and-local-government-series/',
            title: 'State and Local Government Series',
            desc: 'Custom bonds for governments',
            icon: faSackDollar,
          },
        ],
      },
      {
        header: "AMERICA'S FINANCE GUIDE",
        analyticsAction: 'Topics Click',
        children: [
          {
            to: '/americas-finance-guide/',
            title: 'Overview',
            desc: 'The big picture',
            icon: faChartPie,
          },
          {
            to: '/americas-finance-guide/government-revenue/',
            title: 'Revenue',
            desc: 'Where funds come from',
          },
          {
            to: '/americas-finance-guide/federal-spending/',
            title: 'Spending',
            desc: 'Where money goes',
          },
          {
            to: '/americas-finance-guide/national-deficit/',
            title: 'Deficit',
            desc: 'Gap between in & out',
          },
          {
            to: '/americas-finance-guide/national-debt/',
            title: 'Debt',
            desc: 'Total owed over time',
          },
        ],
      },
    ],
  },

  {
    title: 'Tools',
    children: [
      {
        to: '/currency-exchange-rates-converter/',
        title: 'Currency Exchange Rates Converter',
        desc: 'Convert historical & current rates',
        icon: faToolbox,
      },
    ],
  },

  // You said you swapped Resources and Dataset Search so the three dropdowns sit together.
  {
    title: 'Resources',
    children: [
      {
        title: 'Glossary',
        desc: 'Every term we use',
        icon: faFileLines,
      },
      {
        to: '/api-documentation/',
        title: 'API Documentation',
        desc: 'Build with our data',
        icon: faFileLines,
      },
      {
        to: '/release-calendar/',
        title: 'Release Calendar',
        desc: 'What’s coming & when',
        icon: faFileLines,
      },
      {
        to: 'https://onevoicecrm.my.site.com/FiscalDataCommunity/s/',
        title: 'Community Site',
        desc: 'Ask & discuss',
        external: true,
        skipExternalModal: true,
        icon: faFileLines,
      },
    ],
  },

  {
    title: 'Dataset Search',
    to: '/datasets/',
    testId: 'search',
    icon: faDatabase,
  },

  {
    title: 'About Us',
    to: '/about-us/',
    testId: 'about',
    icon: faInfoCircle,
  },

  {
    title: 'Experimental',
    to: '/experimental/',
    testId: 'experimental',
    isExperimental: true,
    featureId: 'experimental-page',
  },
];
