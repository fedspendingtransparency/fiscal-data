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

const baseUrl = globalConstants.BASE_SITE_URL;

const sampleCopy = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
  labore et dolore magna aliqua.`;

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
    quote: 'Sample Quote',
    title: 'Sample Title',
    summary: sampleCopy,
    url: baseUrl+'/national-debt/',
    image: baseUrl+'/images/nationalDebt-Wide.png'
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
      }
    }
  }
}
