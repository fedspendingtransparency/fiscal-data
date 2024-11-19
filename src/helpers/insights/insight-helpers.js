import { BASE_URL } from 'gatsby-env-variables';
import { apiPrefix, basicFetch } from '../../utils/api-utils';

const envBaseUrl = BASE_URL;

export const constructInterestPageHeader = async () => {
  const result = await basicFetch(`${apiPrefix}v2/accounting/od/interest_expense?sort=record_date&page[size]=1`);
  console.log(result);
  const currentFY = result.data[0].current_fiscal_year;
  const recordFY = result.data[0].record_fiscal_year;
  let start;
  if (currentFY - 20 > recordFY) {
    start = currentFY - 20;
  } else {
    start = recordFY;
  }
  return `Interest Expense and Average Interest Rates on the National Debt FY ${start} – ${currentFY}`;
};

export const insightSocialShareMap = {
  'interest-expense': {
    title: '',
    description: '',
    body: '',
    emailSubject: '',
    emailBody: '',
    url: envBaseUrl + '',
    image: envBaseUrl + '',
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
