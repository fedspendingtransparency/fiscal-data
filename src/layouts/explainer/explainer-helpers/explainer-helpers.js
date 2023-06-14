import React from 'react';
import {
  debtExplainerPrimary,
  debtExplainerSecondary,
  debtExplainerLightSecondary
} from '../../../variables.module.scss';
import {
  nationalDebtActive,
  nationalDebtHover,
  nationalDeficitActive,
  nationalDeficitHover,
  federalSpendingActive,
  federalSpendingHover,
  revenueActive,
  revenueHover
} from './explainer-helpers.module.scss';
import NationalDebtHero from "../heros/national-debt/national-debt-hero";
import {
  deficitExplainerPrimary,
  deficitExplainerSecondary,
  deficitExplainerLightSecondary
} from "../sections/national-deficit/national-deficit.module.scss";
import NationalDeficitHero from "../heros/national-deficit/national-deficit-hero";
import {
  spendingExplainerPrimary,
  spendingExplainerSecondary,
  spendingExplainerLightSecondary
} from "../sections/federal-spending/federal-spending.module.scss";
import {
  revenueExplainerPrimary,
  revenueExplainerSecondary,
  revenueExplainerLightSecondary
} from "../sections/government-revenue/revenue.module.scss";
import FederalSpendingHero from "../heros/federal-spending/federal-spending-hero";
import GovernmentRevenueHero from "../heros/government-revenue/government-revenue-hero"
import { BASE_URL } from "gatsby-env-variables";

const envBaseUrl = BASE_URL;

export const getDateWithoutOffset = (date) => {
  const today = new Date(date);
  return new Date(today.getTime() + today.getTimezoneOffset() * 60000);
}

export const explainerAnalyticsLabelMap = {
  'national-debt': 'Debt',
  'national-deficit': 'Deficit',
  'federal-spending': 'Spending',
  'government-revenue': 'Revenue'
}

export const explainerColorMap = {
  'national-debt': {
    primary: debtExplainerPrimary,
    secondary: debtExplainerSecondary,
    secondaryLight: debtExplainerLightSecondary
  },
  'national-deficit': {
    primary: deficitExplainerPrimary,
    secondary: deficitExplainerSecondary,
    secondaryLight: deficitExplainerLightSecondary
  },
  'federal-spending': {
    primary: spendingExplainerPrimary,
    secondary: spendingExplainerSecondary,
    secondaryLight: spendingExplainerLightSecondary
  },
  'government-revenue': {
    primary: revenueExplainerPrimary,
    secondary: revenueExplainerSecondary,
    secondaryLight: revenueExplainerLightSecondary
  }
}

export const explainerClassMap = {
  'national-debt': {
    active: nationalDebtActive,
    hover: nationalDebtHover
  },
  'national-deficit': {
    active: nationalDeficitActive,
    hover: nationalDeficitHover
  },
  'federal-spending': {
    active: federalSpendingActive,
    hover: federalSpendingHover
  },
  'government-revenue': {
    active: revenueActive,
    hover: revenueHover
  }
}

export const explainerSocialShareMap = {
  'national-debt': {
    title: 'Fiscal Data Explains the National Debt',
    description: 'Check out @FiscalService Fiscal Data’s new national debt page! #NationalDebt',
    body: 'Check out @FiscalService Fiscal Data’s new topic page, explaining national debt! ' +
      '#FiscalData #OpenData #NationalDebt',
    emailSubject: 'Fiscal Data Explains the National Debt',
    emailBody: 'Check out Fiscal Data’s new topic page explaining the national debt!',
    url: envBaseUrl+'/americas-finance-guide/national-debt/',
    image: envBaseUrl+'/images/nationalDebt-YourGuide.png'
  },
  'national-deficit': {
    title: 'Fiscal Data Explains the National Deficit',
    description: 'Check out @FiscalService Fiscal Data’s new national deficit page! ' +
      '#NationalDeficit',
    body: 'Check out @FiscalService Fiscal Data’s new topic page, explaining the national deficit! '
      + '#FiscalData #OpenData #NationalDeficit',
    emailSubject: 'Fiscal Data Explains the National Deficit',
    emailBody: 'Check out Fiscal Data’s new topic page explaining the national deficit!',
    url: envBaseUrl+'/americas-finance-guide/national-deficit/',
    image: envBaseUrl+'/images/nationalDeficit_1200x630.png'
  },
  'federal-spending': {
    title: 'Fiscal Data Explains Federal Spending',
    description: 'Check out @FiscalService Fiscal Data’s new federal spending page! '
      + '#FederalSpending ',
    body: 'Check out @FiscalService Fiscal Data’s new topic page, '
      + 'explaining federal spending! #FiscalData #OpenData #FederalSpending ',
    emailSubject: 'Fiscal Data Explains Federal Spending',
    emailBody: 'Check out Fiscal Data’s new topic page, explaining federal spending!',
    url: envBaseUrl+'/americas-finance-guide/federal-spending/',
    image: envBaseUrl+'/images/Spending-1200x630.png'
  },
  'government-revenue': {
    title: 'Fiscal Data Explains Federal Revenue',
    description: 'Check out @FiscalService Fiscal Data’s new federal revenue page!' +
    ' #FederalRevenue',
    body: ' Check out @FiscalService Fiscal Data’s new topic page, explaining ' +
    'federal revenue! #FiscalData #OpenData #FederalRevenue  ',
    emailSubject: 'Fiscal Data Explains Federal Revenue',
    emailBody: 'Check out Fiscal Data’s new topic page, explaining federal revenue!',
    url: envBaseUrl+'/americas-finance-guide/government-revenue/',
    image: envBaseUrl+'/images/revenue-social-share.png'
  },
  'americas-finance-guide': {
    title: "Your Guide to America’s Finances",
    description:
    "Check out @FiscalService Fiscal Data’s new guide to America’s finances! #FiscalData",
    body:
    "Check out the latest accessible and data-driven guide to America’s finances, presented by " +
      "@FiscalService Fiscal Data! #FiscalData #OpenData #AmericasFinances",
    emailSubject: "Your Guide to America’s Finances",
    emailBody:
      "Check out Fiscal Data’s new guide to America’s finances, an accessible and open-source " +
      "guide to federal finance data! In this guide, you’ll find explanations of the four core " +
      "pillars of America’s finances – Revenue, Spending, Deficit, and Debt. Have you ever " +
      "wondered how a budget deficit occurs? Or how government spending has fluctuated over time? "+
      "Find out the answers to these question and more here!",
    url: envBaseUrl + "/americas-finance-guide/",
    image: envBaseUrl + "/images/AFG-Overview_1200x630.png",
  },
}

export const explainerHeroMap = {
  'national-debt': {
    component: (glossary, glossaryClickHandler) => <NationalDebtHero />
  },
  'national-deficit': {
    component: (glossary, glossaryClickHandler) => <NationalDeficitHero glossary={glossary} glossaryClickHandler={glossaryClickHandler} />
  },
  'federal-spending': {
    component: (glossary, glossaryClickHandler) => <FederalSpendingHero />
  },
  'government-revenue': {
    component: (glossary, glossaryClickHandler) => <GovernmentRevenueHero glossary={glossary} glossaryClickHandler={glossaryClickHandler} />
  }
}

export const explainerRelatedDatasetMap = {
  'national-debt': 'See the datasets that relate to the national debt',
  'national-deficit': 'See the datasets behind the national deficit',
  'federal-spending': 'See the datasets that relate to federal spending',
  'government-revenue': 'See the datasets that relate to government revenue',

}

export const datasetSectionConfig = {
  'national-debt': {
    'the-growing-national-debt': {
      name: 'Historical Debt Outstanding',
      slug: '/datasets/historical-debt-outstanding/',
      endpoint: 'v2/accounting/od/debt_outstanding?sort=-record_date&page[size]=101',
      dateField: 'record_date',
      valueField: 'debt_outstanding_amt'
    },
    'breaking-down-the-debt': {
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
  },
  'national-deficit': {
    'understanding-the-national-deficit': {
      name: 'Monthly Treasury Statement (MTS)',
      slug: '/datasets/monthly-treasury-statement/' +
        'summary-of-receipts-and-outlays-of-the-u-s-government',
      endpoints: [
        {
          name: 'Fiscal Year',
          path: 'v1/accounting/mts/mts_table_5?fields=current_fytd_net_outly_amt,record_date,' +
                'record_fiscal_year,record_calendar_month&filter=line_code_nbr:eq:5694,' +
                'record_calendar_month:eq:09&sort=-record_date&page%5bsize%5d=1',
          dateField: 'record_date',
          valueField: 'record_fiscal_year'
        },
        {
          name: 'Deficit',
          path: 'v1/accounting/mts/mts_table_5?fields=current_fytd_net_outly_amt,record_date,' +
                'record_calendar_month&filter=line_code_nbr:eq:5694,record_calendar_month:eq:09' +
                '&sort=-record_date&page%5bsize%5d=1',
          valueField: 'current_fytd_net_outly_amt'
        },
        {
          name: 'Revenue',
          path: 'v1/accounting/mts/mts_table_4?fields=current_fytd_net_rcpt_amt,record_date,' +
            'record_fiscal_year&filter=line_code_nbr:eq:830,record_calendar_month:eq:09&' +
            'sort=-record_date&page%5bsize%5d=1',
          dateField: 'record_date',
          valueField: 'current_fytd_net_rcpt_amt'
        },
        {
          name: 'Spending',
          path: 'v1/accounting/mts/mts_table_5?fields=current_fytd_net_outly_amt,record_date,' +
            'record_calendar_month,record_fiscal_year&filter=line_code_nbr:eq:5691,' +
            'record_calendar_month:eq:09&sort=-record_date&page[size]=1',
          valueField: 'current_fytd_net_outly_amt'
        },
        {
          name: 'Deficit Prior Year',
          path: 'v1/accounting/mts/mts_table_5?fields=current_fytd_net_outly_amt,' +
                'prior_fytd_net_outly_amt,record_date,record_calendar_month,record_fiscal_year&' +
                'filter=line_code_nbr:eq:5694,record_calendar_month:eq:09&sort=-record_date&' +
                'page[size]=1',
          valueField: 'prior_fytd_net_outly_amt'
        }
      ]
    }
  }
}
