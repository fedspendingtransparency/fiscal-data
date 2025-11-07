import React from 'react';
import { debtExplainerPrimary, debtExplainerSecondary, debtExplainerLightSecondary } from '../../../variables.module.scss';
import {
  nationalDebtActive,
  nationalDebtHover,
  nationalDeficitActive,
  nationalDeficitHover,
  federalSpendingActive,
  federalSpendingHover,
  revenueActive,
  revenueHover,
  treasurySavingsBondsActive,
  treasurySavingsBondsHover,
} from './explainer-helpers.module.scss';
import NationalDebtHero from '../heros/national-debt/national-debt-hero';
import {
  deficitExplainerPrimary,
  deficitExplainerSecondary,
  deficitExplainerLightSecondary,
} from '../sections/national-deficit/national-deficit.module.scss';
import NationalDeficitHero from '../heros/national-deficit/national-deficit-hero';
import {
  spendingExplainerPrimary,
  spendingExplainerSecondary,
  spendingExplainerLightSecondary,
} from '../sections/federal-spending/federal-spending.module.scss';
import {
  revenueExplainerPrimary,
  revenueExplainerSecondary,
  revenueExplainerLightSecondary,
} from '../sections/government-revenue/revenue.module.scss';
import {
  treasurySavingsBondsExplainerPrimary,
  treasurySavingsBondsExplainerSecondary,
  treasurySavingsBondsExplainerLightSecondary,
  treasurySavingsBondsExplainerHero,
} from '../sections/treasury-savings-bonds/treasury-savings-bonds.module.scss';
import FederalSpendingHero from '../heros/federal-spending/federal-spending-hero';
import GovernmentRevenueHero from '../heros/government-revenue/government-revenue-hero';
import { BASE_URL } from 'gatsby-env-variables';
import TreasurySavingsBondsHero from '../heros/treasury-savings-bonds/treasury-savings-bonds-hero';
import Analytics from '../../../utils/analytics/analytics';
import CustomLink from '../../../components/links/custom-link/custom-link';

const envBaseUrl = BASE_URL;

export const analyticsEventHandler = (eventLabel, eventAction) => {
  Analytics.event({
    category: 'Explainers',
    action: eventAction,
    label: eventLabel,
  });
};

const explainerCitations = page => {
  return {
    bls: (
      <CustomLink url="https://www.bls.gov/developers/" onClick={() => analyticsEventHandler('Bureau of Labor Statistics', `${page} Citation Click`)}>
        Bureau of Labor Statistics
      </CustomLink>
    ),
    bea: (
      <CustomLink url="https://www.bea.gov/" onClick={() => analyticsEventHandler('Bureau of Economic Analysis', `${page} Citation Click`)}>
        Bureau of Economic Analysis
      </CustomLink>
    ),
    beaSurvey: (
      <CustomLink
        url="https://apps.bea.gov/iTable/iTable.cfm?reqid=19&step=3&isuri=1&nipa_table_list=5&categories=survey"
        onClick={() => analyticsEventHandler('Bureau of Economic Analysis', `${page} Citation Click`)}
      >
        Bureau of Economic Analysis
      </CustomLink>
    ),
    github: (
      <CustomLink
        url="https://github.com/fedspendingtransparency/fiscal-data/tree/master/documentation"
        onClick={() => analyticsEventHandler('GitHub repository', `${page} Citation Click`)}
      >
        GitHub repository
      </CustomLink>
    ),
    mtsSummary: (
      <CustomLink
        url="/datasets/monthly-treasury-statement/summary-of-receipts-outlays-and-the-deficit-surplus-of-the-u-s-government"
        id="Monthly Treasury Statement"
        onClick={() => analyticsEventHandler('Monthly Treasury Statement (MTS)', `${page} Citation Click`)}
      >
        Monthly Treasury Statement (MTS)
      </CustomLink>
    ),
    mtsReceipts: (
      <CustomLink
        url="/datasets/monthly-treasury-statement/receipts-of-the-u-s-government/"
        id="Monthly Treasury Statement"
        onClick={() => analyticsEventHandler('Monthly Treasury Statement (MTS)', `${page} Citation Click`)}
      >
        Monthly Treasury Statement (MTS)
      </CustomLink>
    ),
    mtsOutlays: (
      <CustomLink
        url="/datasets/monthly-treasury-statement/outlays-of-the-u-s-government"
        id="Monthly Treasury Statement"
        onClick={() => analyticsEventHandler('Monthly Treasury Statement (MTS)', `${page} Citation Click`)}
      >
        Monthly Treasury Statement (MTS)
      </CustomLink>
    ),
    mtsSummaryReceipts: (
      <CustomLink
        url="/datasets/monthly-treasury-statement/summary-of-receipts-and-outlays-of-the-u-s-government"
        id="Monthly Treasury Statement"
        onClick={() => analyticsEventHandler('Monthly Treasury Statement (MTS)', `${page} Citation Click`)}
      >
        Monthly Treasury Statement (MTS)
      </CustomLink>
    ),
    mspd: (
      <CustomLink
        url="/datasets/monthly-statement-public-debt/"
        id="Monthly Statement of the Public Debt"
        onClick={() => analyticsEventHandler('Monthly Statement of the Public Debt (MSPD)', `${page} Citation Click`)}
      >
        Monthly Statement of the Public Debt (MSPD)
      </CustomLink>
    ),
    mspdSummary: (
      <CustomLink
        url="/datasets/monthly-statement-public-debt/summary-of-treasury-securities-outstanding"
        onClick={() => analyticsEventHandler('Monthly Statement of the Public Debt (MSPD)', `${page} Citation Click`)}
        id="U.S. Treasury Monthly Statement of the Public Debt"
      >
        U.S. Treasury Monthly Statement of the Public Debt (MSPD)
      </CustomLink>
    ),
    mspdOutstanding: (
      <CustomLink
        url="/datasets/monthly-statement-public-debt/summary-of-treasury-securities-outstanding"
        id="U.S. Treasury Monthly Statement of the Public Debt"
        onClick={() => analyticsEventHandler('Monthly Statement of the Public Debt (MSPD)', `${page} Citation Click`)}
      >
        U.S. Treasury Monthly Statement of the Public Debt
      </CustomLink>
    ),
    debtToThePenny: (
      <CustomLink
        url="/datasets/debt-to-the-penny/"
        id="Debt to the Penny"
        onClick={() => analyticsEventHandler('Debt to the Penny', `${page} Citation Click`)}
      >
        Debt to the Penny
      </CustomLink>
    ),
    historicalDebt: (
      <CustomLink
        url="/datasets/historical-debt-outstanding/"
        onClick={() => analyticsEventHandler('Historical Debt Outstanding', `${page} Citation Click`)}
        id="Historical Debt Outstanding"
      >
        Historical Debt Outstanding
      </CustomLink>
    ),
    treasuryDirectHistoricalDebt: (
      <CustomLink
        url="https://treasurydirect.gov/government/historical-debt-outstanding/"
        onClick={() => analyticsEventHandler('The History of the Debt', `${page} Citation Click`)}
      >
        history of the debt
      </CustomLink>
    ),
    USAs: (
      <CustomLink url="https://www.usaspending.gov/" onClick={() => analyticsEventHandler('USAspending', `${page} Citation Click`)}>
        USAspending
      </CustomLink>
    ),
    USAsGov: (
      <CustomLink url="https://www.usaspending.gov/" onClick={() => analyticsEventHandler('USAspending', `${page} Citation Click`)}>
        USAspending.gov
      </CustomLink>
    ),
    USAsExplorer: (
      <CustomLink
        url="https://www.usaspending.gov/explorer"
        onClick={() => analyticsEventHandler('USAspending Spending Explorer', `${page} Citation Click`)}
      >
        USAspending.gov
      </CustomLink>
    ),
    USAsExplorerPage: (
      <CustomLink
        url="https://www.usaspending.gov/explorer"
        onClick={() => analyticsEventHandler('USAspending Spending Explorer', `${page} Citation Click`)}
      >
        Spending Explorer
      </CustomLink>
    ),
    USAsAgencyPage: (
      <CustomLink
        url="https://www.usaspending.gov/agency"
        onClick={() => analyticsEventHandler('USAspending Agency Profile', `${page} Citation Click`)}
      >
        Agency Profile
      </CustomLink>
    ),
    USAsObjectClass: (
      <CustomLink
        url="https://www.usaspending.gov/explorer/object_class"
        onClick={() => analyticsEventHandler('USAspending Object Class', `${page} Citation Click`)}
      >
        Object Class
      </CustomLink>
    ),
    USAsBudgetFunction: (
      <CustomLink
        url="https://www.usaspending.gov/explorer/budget_function"
        onClick={() => analyticsEventHandler('USAspending Budget Function', `${page} Citation Click`)}
      >
        Budget Function
      </CustomLink>
    ),
    USAsCovidSpending: (
      <CustomLink
        url="https://www.usaspending.gov/disaster/covid-19?publicLaw=all"
        onClick={() => analyticsEventHandler('USAspending COVID-19 Spending Profile', `${page} Citation Click`)}
      >
        COVID-19 Spending Profile
      </CustomLink>
    ),
    USAsCovidResponse: (
      <CustomLink
        url="https://www.usaspending.gov/disaster/covid-19?publicLaw=all"
        onClick={() => analyticsEventHandler('USAspending COVID-19 Spending Profile', `${page} Citation Click`)}
      >
        in response to the COVID-19 pandemic
      </CustomLink>
    ),
    USAsCovidFederalResponse: (
      <CustomLink
        url="https://www.usaspending.gov/disaster/covid-19?publicLaw=all"
        onClick={() => analyticsEventHandler('USAspending COVID-19 Spending Profile', `${page} Citation Click`)}
      >
        the federal response to COVID-19
      </CustomLink>
    ),
    fiscalService: (
      <CustomLink
        url="https://www.fiscal.treasury.gov/"
        onClick={() => analyticsEventHandler('Bureau of the Fiscal Service', `${page} Citation Click`)}
      >
        Bureau of the Fiscal Service
      </CustomLink>
    ),
    treasurySecurities: (
      <CustomLink
        url="/datasets/average-interest-rates-treasury-securities/"
        id="Average Interest Rates on U.S. Treasury Securities"
        onClick={() => analyticsEventHandler('Average Interest Rates on U.S. Treasury Securities', `${page} Citation Click`)}
      >
        Average Interest Rates on U.S. Treasury Securities
      </CustomLink>
    ),
    ssaAnnualReport: (
      <CustomLink
        url="https://www.ssa.gov/oact/TRSUM/"
        onClick={() => analyticsEventHandler('Annual Reports on the Financial Status of Social Security and Medicare', `${page} Citation Click`)}
      >
        Annual Reports on the Financial Status of Social Security and Medicare
      </CustomLink>
    ),
    ssa: (
      <CustomLink
        url="https://www.ssa.gov/OP_Home/ssact/ssact-toc.htm"
        onClick={() => analyticsEventHandler('Social Security Act', `${page} Citation Click`)}
      >
        Social Security Act
      </CustomLink>
    ),
    monetaryPolicy: (
      <CustomLink
        url="https://www.federalreserve.gov/monetarypolicy.htm"
        onClick={() => analyticsEventHandler('Monetary Policy', `${page} Citation Click`)}
      >
        monetary policy
      </CustomLink>
    ),
    gps: (
      <CustomLink url="https://www.gps.gov/policy/funding/" onClick={() => analyticsEventHandler('GPS.gov', `${page} Citation Click`)}>
        GPS.gov
      </CustomLink>
    ),
    irs: (
      <CustomLink
        url="https://www.irs.gov/newsroom/historical-highlights-of-the-irs"
        onClick={() => analyticsEventHandler('IRS.gov', `${page} Citation Click`)}
      >
        IRS.gov
      </CustomLink>
    ),
    federalReserveAct: (
      <CustomLink
        url="https://www.federalreserve.gov/aboutthefed/section7.htm"
        onClick={() => analyticsEventHandler('Federal Reserve Act', `${page} Citation Click`)}
      >
        Federal Reserve Act, Section 7(a)(1-3)
      </CustomLink>
    ),
  };
};

export const explainerCitationsMap = {
  'national-debt': explainerCitations('Debt'),
  'national-deficit': explainerCitations('Deficit'),
  'federal-spending': explainerCitations('Spending'),
  'government-revenue': explainerCitations('Revenue'),
  'treasury-savings-bonds': explainerCitations('Savings Bonds'),
  afg: explainerCitations('AFG Overview'),
};

export const getDateWithoutOffset = date => {
  const today = new Date(date);
  return new Date(today.getTime() + today.getTimezoneOffset() * 60000);
};

export const explainerAnalyticsLabelMap = {
  'national-debt': 'Debt',
  'national-deficit': 'Deficit',
  'federal-spending': 'Spending',
  'government-revenue': 'Revenue',
  'treasury-savings-bonds': 'Savings Bonds',
};

export const explainerColorMap = {
  'national-debt': {
    primary: debtExplainerPrimary,
    secondary: debtExplainerSecondary,
    secondaryLight: debtExplainerLightSecondary,
    hero: debtExplainerLightSecondary,
  },
  'national-deficit': {
    primary: deficitExplainerPrimary,
    secondary: deficitExplainerSecondary,
    secondaryLight: deficitExplainerLightSecondary,
    hero: deficitExplainerLightSecondary,
  },
  'federal-spending': {
    primary: spendingExplainerPrimary,
    secondary: spendingExplainerSecondary,
    secondaryLight: spendingExplainerLightSecondary,
    hero: spendingExplainerLightSecondary,
  },
  'government-revenue': {
    primary: revenueExplainerPrimary,
    secondary: revenueExplainerSecondary,
    secondaryLight: revenueExplainerLightSecondary,
    hero: revenueExplainerLightSecondary,
  },
  'treasury-savings-bonds': {
    primary: treasurySavingsBondsExplainerPrimary,
    secondary: treasurySavingsBondsExplainerSecondary,
    secondaryLight: treasurySavingsBondsExplainerLightSecondary,
    hero: treasurySavingsBondsExplainerHero,
  },
};

export const explainerClassMap = {
  'national-debt': {
    active: nationalDebtActive,
    hover: nationalDebtHover,
  },
  'national-deficit': {
    active: nationalDeficitActive,
    hover: nationalDeficitHover,
  },
  'federal-spending': {
    active: federalSpendingActive,
    hover: federalSpendingHover,
  },
  'government-revenue': {
    active: revenueActive,
    hover: revenueHover,
  },
  'treasury-savings-bonds': {
    active: treasurySavingsBondsActive,
    hover: treasurySavingsBondsHover,
  },
};

export const explainerSocialShareMap = {
  'national-debt': {
    title: 'Fiscal Data Explains the National Debt',
    description: 'Check out @FiscalService Fiscal Data’s new national debt page! #NationalDebt',
    body: 'Check out @FiscalService Fiscal Data’s new topic page, explaining national debt! #FiscalData #OpenData #NationalDebt',
    emailSubject: 'Fiscal Data Explains the National Debt',
    emailBody: 'Check out Fiscal Data’s new topic page explaining the national debt!',
    url: envBaseUrl + '/americas-finance-guide/national-debt/',
    image: envBaseUrl + '/images/nationalDebt-YourGuide.png',
  },
  'national-deficit': {
    title: 'Fiscal Data Explains the National Deficit',
    description: 'Check out @FiscalService Fiscal Data’s new national deficit page! #NationalDeficit',
    body: 'Check out @FiscalService Fiscal Data’s new topic page, explaining the national deficit! #FiscalData #OpenData #NationalDeficit',
    emailSubject: 'Fiscal Data Explains the National Deficit',
    emailBody: 'Check out Fiscal Data’s new topic page explaining the national deficit!',
    url: envBaseUrl + '/americas-finance-guide/national-deficit/',
    image: envBaseUrl + '/images/nationalDeficit_1200x630.png',
  },
  'federal-spending': {
    title: 'Fiscal Data Explains Federal Spending',
    description: 'Check out @FiscalService Fiscal Data’s new federal spending page! #FederalSpending ',
    body: 'Check out @FiscalService Fiscal Data’s new topic page, explaining federal spending! #FiscalData #OpenData #FederalSpending ',
    emailSubject: 'Fiscal Data Explains Federal Spending',
    emailBody: 'Check out Fiscal Data’s new topic page, explaining federal spending!',
    url: envBaseUrl + '/americas-finance-guide/federal-spending/',
    image: envBaseUrl + '/images/Spending-1200x630.png',
  },
  'government-revenue': {
    title: 'Fiscal Data Explains Federal Revenue',
    description: 'Check out @FiscalService Fiscal Data’s new federal revenue page! #FederalRevenue',
    body: ' Check out @FiscalService Fiscal Data’s new topic page, explaining federal revenue! #FiscalData #OpenData #FederalRevenue  ',
    emailSubject: 'Fiscal Data Explains Federal Revenue',
    emailBody: 'Check out Fiscal Data’s new topic page, explaining federal revenue!',
    url: envBaseUrl + '/americas-finance-guide/government-revenue/',
    image: envBaseUrl + '/images/revenue-social-share.png',
  },
  'americas-finance-guide': {
    title: 'Your Guide to America’s Finances',
    description: 'Check out @FiscalService Fiscal Data’s new guide to America’s finances! #FiscalData',
    body:
      'Check out the latest accessible and data-driven guide to America’s finances, presented by ' +
      '@FiscalService Fiscal Data! #FiscalData #OpenData #AmericasFinances',
    emailSubject: 'Your Guide to America’s Finances',
    emailBody:
      'Check out Fiscal Data’s new guide to America’s finances, an accessible and open-source ' +
      'guide to federal finance data! In this guide, you’ll find explanations of the four core ' +
      'pillars of America’s finances – Revenue, Spending, Deficit, and Debt. Have you ever ' +
      'wondered how a budget deficit occurs? Or how government spending has fluctuated over time? ' +
      'Find out the answers to these question and more here!',
    url: envBaseUrl + '/americas-finance-guide/',
    image: envBaseUrl + '/images/AFG-Overview_1200x630.png',
  },
  'treasury-savings-bonds': {
    title: 'Fiscal Data Explains U.S. Treasury Savings Bonds',
    description: 'Check out @FiscalService Fiscal Data’s new savings bonds page! #SavingsBonds ',
    body: 'Check out @FiscalService Fiscal Data’s new topic page explaining Treasury savings bonds! #FiscalData #SavingsBonds',
    emailSubject: 'Fiscal Data Explains U.S. Treasury Savings Bonds',
    emailBody: 'Check out Fiscal Data’s new topic page explaining U.S. Treasury savings bonds!',
    url: envBaseUrl + '/treasury-savings-bonds/',
    image: envBaseUrl + '/images/Savings-Bonds-Social-Share-w-Illustration_1200x630.png',
  },
};

export const explainerHeroMap = {
  'national-debt': {
    component: () => <NationalDebtHero />,
  },
  'national-deficit': {
    component: () => <NationalDeficitHero />,
  },
  'federal-spending': {
    component: () => <FederalSpendingHero />,
  },
  'government-revenue': {
    component: () => <GovernmentRevenueHero />,
  },
  'treasury-savings-bonds': {
    component: () => <TreasurySavingsBondsHero />,
  },
};

export const explainerRelatedDatasetMap = {
  'national-debt': 'See the datasets that relate to the national debt',
  'national-deficit': 'See the datasets behind the national deficit',
  'federal-spending': 'See the datasets that relate to federal spending',
  'government-revenue': 'See the datasets that relate to government revenue',
  'treasury-savings-bonds': 'See the datasets that relate to savings bonds',
};

export const datasetSectionConfig = {
  'national-debt': {
    'the-growing-national-debt': {
      name: 'Historical Debt Outstanding',
      slug: '/datasets/historical-debt-outstanding/',
      endpoint: 'v2/accounting/od/debt_outstanding?sort=-record_date&page[size]=101',
      dateField: 'record_date',
      valueField: 'debt_outstanding_amt',
    },
    'breaking-down-the-debt': {
      name: 'U.S. Treasury Monthly Statement of the Public Debt (MSPD)',
      slug: '/datasets/monthly-statement-public-debt/summary-of-treasury-securities-outstanding/',
      endpoint: 'v1/debt/mspd/mspd_table_1?',
      getQueryString: () => {
        const fieldsParam = 'fields=debt_held_public_mil_amt,intragov_hold_mil_amt,record_calendar_year,record_calendar_month,record_date';
        const pad = monthNum => (monthNum < 10 ? `0${monthNum}` : monthNum.toString());

        const currentDate = new Date(Date.now());
        const thisMonth = currentDate.getMonth() + 1;
        const lastMonth = thisMonth === 1 ? 12 : thisMonth - 1;
        const priorMonth = lastMonth === 1 ? 12 : lastMonth - 1;
        const year = currentDate.getFullYear();
        const years = [year, year - 10];
        if (thisMonth < 3) {
          years.push(year - 1);
          years.push(year - 11);
        }
        const monthVals = `(${pad(thisMonth)},${pad(lastMonth)},${pad(priorMonth)})`;
        let filterParam = `filter=record_calendar_month:in:${monthVals},`;
        filterParam += `record_calendar_year:in:(${years.join()}),security_type_desc:eq:Total%20Public%20Debt%20Outstanding`;
        return `${fieldsParam}&${filterParam}&sort=record_date&limit=12`;
      },
      transformer: response => {
        if (response && response.data) {
          // find latest month and year in data sorted by date
          const latestRecord = response.data[response.data.length - 1];
          const priorRecord = response.data.find(
            rec =>
              rec.record_calendar_month === latestRecord.record_calendar_month &&
              Number(rec.record_calendar_year) === Number(latestRecord.record_calendar_year) - 10
          );
          const output = [priorRecord, latestRecord];
          output.forEach(r => {
            r['Debt Held by the Public'] = Number(r.debt_held_public_mil_amt) / 1000000;
            r['Intragovernmental Holdings'] = Number(r.intragov_hold_mil_amt) / 1000000;
            r.total = r['Debt Held by the Public'] + r['Intragovernmental Holdings'];
          });
          return output;
        }
      },
      multichart: {
        name: 'Historical Debt Outstanding',
        slug: '/datasets/historical-debt-outstanding/',
        endpoints: [
          {
            name: 'Interest Expense',
            path:
              'v2/accounting/od/avg_interest_rates' +
              '?filter=security_type_desc:eq:Interest-bearing%20Debt,record_calendar_day:eq:30,record_calendar_month:eq:09' +
              '&sort=-record_date&page[size]=10',
            dateField: 'record_date',
            valueField: 'avg_interest_rate_amt',
          },
          {
            name: 'Total Debt',
            path:
              'v1/debt/mspd/mspd_table_1' +
              '?filter=security_type_desc:eq:Total%20Public%20Debt%20Outstanding,record_calendar_day:eq:30,record_calendar_month:eq:09' +
              '&sort=-record_date&page[size]=10',
            dateField: 'record_date',
            valueField: 'total_mil_amt',
          },
        ],
      },
    },
  },
  'national-deficit': {
    'understanding-the-national-deficit': {
      name: 'Monthly Treasury Statement (MTS)',
      slug: '/datasets/monthly-treasury-statement/summary-of-receipts-and-outlays-of-the-u-s-government',
      endpoints: [
        {
          name: 'Fiscal Year',
          path:
            'v1/accounting/mts/mts_table_5?fields=current_fytd_net_outly_amt,record_date,' +
            'record_fiscal_year,record_calendar_month&filter=line_code_nbr:eq:5694,' +
            'record_calendar_month:eq:09&sort=-record_date&page%5bsize%5d=1',
          dateField: 'record_date',
          valueField: 'record_fiscal_year',
        },
        {
          name: 'Deficit',
          path:
            'v1/accounting/mts/mts_table_5?fields=current_fytd_net_outly_amt,record_date,' +
            'record_calendar_month&filter=line_code_nbr:eq:5694,record_calendar_month:eq:09' +
            '&sort=-record_date&page%5bsize%5d=1',
          valueField: 'current_fytd_net_outly_amt',
        },
        {
          name: 'Revenue',
          path:
            'v1/accounting/mts/mts_table_4?fields=current_fytd_net_rcpt_amt,record_date,' +
            'record_fiscal_year&filter=line_code_nbr:eq:830,record_calendar_month:eq:09&' +
            'sort=-record_date&page%5bsize%5d=1',
          dateField: 'record_date',
          valueField: 'current_fytd_net_rcpt_amt',
        },
        {
          name: 'Spending',
          path:
            'v1/accounting/mts/mts_table_5?fields=current_fytd_net_outly_amt,record_date,' +
            'record_calendar_month,record_fiscal_year&filter=line_code_nbr:eq:5691,' +
            'record_calendar_month:eq:09&sort=-record_date&page[size]=1',
          valueField: 'current_fytd_net_outly_amt',
        },
        {
          name: 'Deficit Prior Year',
          path:
            'v1/accounting/mts/mts_table_5?fields=current_fytd_net_outly_amt,' +
            'prior_fytd_net_outly_amt,record_date,record_calendar_month,record_fiscal_year&' +
            'filter=line_code_nbr:eq:5694,record_calendar_month:eq:09&sort=-record_date&' +
            'page[size]=1',
          valueField: 'prior_fytd_net_outly_amt',
        },
      ],
    },
  },
};
