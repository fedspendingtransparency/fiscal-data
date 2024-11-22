import { BASE_URL } from 'gatsby-env-variables';

const envBaseUrl = BASE_URL;

export const insightSocialShareMap = {
  'interest-expense': {
    title: 'Fiscal Data Explores Interest Expense on National Debt',
    description: 'Check out @FiscalService Fiscal Data’s new topic page exploring interest expense on the national debt! #InterestExpense',
    body:
      'Check out @FiscalService Fiscal Data’s new topic page exploring interest expense and average interest rates on the national debt! #FiscalData #InterestExpense',
    emailSubject: 'Fiscal Data Explores Interest Expense on National Debt',
    emailBody:
      'Check out Fiscal Data’s new interactive insight page, exploring interest expense and average interest rates on the national debt. This tool visualizes trends over time in interest expense and average interest rates. You’ll find both historical and current data, along with easy access to downloadable datasets powering the insight, allowing users to perform their own analysis. Start exploring this essential data today to learn more about U.S. federal finance trends!',
    url: envBaseUrl + '/interest-expense-avg-interest-rates/',
    image: envBaseUrl + '/images/Interest-Expense-Social-Share-Graph-and-Money_1200x630.png',
  },
};

export const exploreMoreCitationsMap = {
  'interest-expense': [{ text: 'Example Citation with an extra long name that should wrap correctly', url: 'fiscaldata.treasury.gov' }],
};

export const discoverDatasetsCitationsMap = {
  'interest-expense': [
    { text: 'Example Citation', url: 'fiscaldata.treasury.gov' },
    { text: 'Example Citation', url: 'fiscaldata.treasury.gov' },
  ],
};
