import React from 'react';
import {
  debtExplainerPrimary,
  debtExplainerSecondary,
  debtExplainerLightSecondary
} from '../../../variables.module.scss';
import {
  nationalDebtActive,
  nationalDebtHover
} from './explainer-helpers.module.scss';
import NationalDebtHero from "../heros/national-debt/national-debt-hero";
import globalConstants from "../../../helpers/constants";

// const baseUrl = globalConstants.BASE_SITE_URL;
const baseUrl = 'https://stg.fiscaldata.treasury.gov';


export const getDateWithoutOffset = (date) => {
  const today = new Date(date);
  return new Date(today.getTime() + today.getTimezoneOffset() * 60000);
}


export const explainerColorMap = {
  'national-debt': {
    primary: debtExplainerPrimary,
    secondary: debtExplainerSecondary,
    secondaryLight: debtExplainerLightSecondary
  }
}

export const explainerClassMap = {
  'national-debt': {
    active: nationalDebtActive,
    hover: nationalDebtHover
  }
}

export const explainerSocialShareMap = {
  'national-debt': {
    title: 'Fiscal Data Explains the National Debt',
    text: 'Check out @FiscalService Fiscal Data’s new topic page, explaining national debt! ' +
      '#FiscalData #OpenData #NationalDebt',
    emailSubject: 'Fiscal Data Explains the National Debt',
    emailBody: 'Check out Fiscal Data’s new topic page explaining the national debt!',
    url: baseUrl+'/national-debt/',
    image: baseUrl+'/images/nationalDebt_YourGuide_1200x630.png',
    hashtagString: '#FiscalData #OpenData #NationalDebt',
    hashtagArray: ['#FiscalData', '#OpenData', '#NationalDebt']
  }
}

export const explainerHeroMap = {
  'national-debt': <NationalDebtHero />
}

export const datasetSectionConfig = {
  'national-debt': {
    'growing-national-debt': {
      name: 'Historical Debt Outstanding',
      slug: '/datasets/historical-debt-outstanding/',
      endpoint: 'v2/accounting/od/debt_outstanding?sort=-record_date&page[size]=101',
      dateField: 'record_date',
      valueField: 'debt_outstanding_amt'
    },
    'breakdown': {
      name: 'U.S. Treasury Monthly Statement of the Public Debt (MSPD)',
      slug: '/datasets/monthly-statement-public-debt/summary-of-treasury-securities-outstanding/',
      endpoint: 'v1/debt/mspd/mspd_table_1?',
      getQueryString: () => {
        const fieldsParam = 'fields=debt_held_public_mil_amt,intragov_hold_mil_amt,' +
          'record_calendar_year,record_calendar_month,record_date';
        const pad = (monthNum) => monthNum < 10 ? `0${monthNum}` : monthNum.toString();

        const currentDate = new Date(Date.now());
        const thisMonth = currentDate.getMonth() + 1;
        const lastMonth = thisMonth === 1 ? 12 : thisMonth - 1;
        const priorMonth = lastMonth === 1 ? 12 : lastMonth - 1;
        const year = currentDate.getFullYear();
        const years = [year, year - 10] ;
        if (thisMonth < 3) {
          years.push(year - 1);
          years.push(year - 11);
        }
        const monthVals = `(${pad(thisMonth)},${pad(lastMonth)},${pad(priorMonth)})`;
        let filterParam = `filter=record_calendar_month:in:${monthVals},`;
        filterParam += `record_calendar_year:in:(${years.join()})` +
          ',security_type_desc:eq:Total%20Public%20Debt%20Outstanding';
        return `${fieldsParam}&${filterParam}&sort=record_date&limit=12`
      },
      transformer: (response) => {
        if (response && response.data) {
          // find latest month and year in data sorted by date
          const latestRecord = response.data[response.data.length - 1];
          const priorRecord = response.data
            .find(rec => rec.record_calendar_month === latestRecord.record_calendar_month &&
              Number(rec.record_calendar_year) === Number(latestRecord.record_calendar_year) - 10);
          const output = [priorRecord, latestRecord];
          output.forEach(r => {
            r['Debt Held by the Public'] =
              Number(r.debt_held_public_mil_amt) / 1000000;
            r['Intragovernmental Holdings'] =
              Number(r.intragov_hold_mil_amt) / 1000000;
            r.total = r['Debt Held by the Public'] + r['Intragovernmental Holdings'];
          });
          return output;
        }
      },
      'multichart': {
        name: 'Historical Debt Outstanding',
        slug: '/datasets/historical-debt-outstanding/',
        endpoints:  [
          {
            name: 'Interest Expense',
            path: 'v2/accounting/od/avg_interest_rates?filter=security_type_desc:eq:Interest-bearing%20Debt,record_calendar_day:eq:30,record_calendar_month:eq:09&sort=-record_date&page[size]=10',
            dateField: 'record_date',
            valueField: 'avg_interest_rate_amt'
          },
          {
            name: 'Total Debt',
            path: 'v1/debt/mspd/mspd_table_1?filter=security_type_desc:eq:Total%20Public%20Debt%20Outstanding,record_calendar_day:eq:30,record_calendar_month:eq:09&sort=-record_date&page[size]=10',
            dateField: 'record_date',
            valueField: 'total_mil_amt'
          }
        ]
      }
    }
  }
}
