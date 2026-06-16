export const menuSections = [
         {
           title: 'Topics',
           children: [
             {
               header: 'FEATURED TOPICS',
               analyticsAction: 'Topics Click',
               children: [
                 {
                   to: '/interest-expense-avg-interest-rates/',
                   title: 'Interest Expense',
                 },
                 {
                   to: '/treasury-savings-bonds/',
                   title: 'Savings Bonds',
                 },
                 {
                   to: '/state-and-local-government-series/',
                   title: 'State and Local Government Series',
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
                 },
               ],
             },
             {
               header: 'FEATURED CONTENT',
               analyticsAction: 'Topics Click',
               isExperimental: true,
               featureId: 'featured-content',
               children: [
                 {
                   to: '/featured-content/historic-data-now-available/',

                   title: 'Historic Data Now Available',
                 },
                 {
                   to: '/featured-content/story-of-data-transparency/',
                   title: 'The Story of Data Transparency',
                 },
                 {
                   to: '/featured-content/history-of-government-spending/',
                   title: 'A History of Government Spending',
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
             },
           ],
         },
         {
           title: 'Dataset Search',
           to: '/datasets/',
           testId: 'search',
         },
         {
           title: 'Resources',
           children: [
             {
               title: 'Glossary',
             },
             {
               to: '/api-documentation/',
               title: 'API Documentation',
             },
             {
               to: '/release-calendar/',
               title: 'Release Calendar',
             },
             {
               to: 'https://onevoicecrm.my.site.com/FiscalDataCommunity/s/',
               title: 'Community Site',
               external: true,
               skipExternalModal: true,
             },
           ],
         },
         {
           title: 'About Us',
           to: '/about-us/',
           testId: 'about',
         },
         {
           title: 'Experimental',
           to: '/experimental/',
           testId: 'experimental',
           isExperimental: true,
           featureId: 'experimental-page',
         },
       ];
