import React, { FunctionComponent, useEffect, useState } from 'react';
import { footer, title, container } from './exchange-rate-faq.module.scss';
import Accordion from '../../accordion/accordion';
import CustomLink from '../../links/custom-link/custom-link';
import { countDecimals, dateStringConverter } from '../currency-exchange-rates-converter/currency-exchange-rates-converter-helper';
import { graphql, useStaticQuery } from 'gatsby';
import Analytics from '../../../utils/analytics/analytics';
import { ga4DataLayerPush } from '../../../helpers/google-analytics/google-analytics-helper';

const CurrencyExchangeFAQ: FunctionComponent = () => {
  const allExchangeRatesData = useStaticQuery(
    graphql`
      query {
        allExchangeRatesData {
          exchangeRatesData: nodes {
            record_date
            country_currency_desc
            exchange_rate
            effective_date
            record_calendar_quarter
          }
        }
      }
    `
  );
  const [datasetDate, setDatasetDate] = useState(null);

  useEffect(() => {
    const data = allExchangeRatesData.allExchangeRatesData.exchangeRatesData;
    let mostRecentDate: Date | null = null;
    data.forEach(record => {
      const rawDate = record.record_date;
      const parsedDate = new Date(rawDate);

      if (mostRecentDate === null || parsedDate > mostRecentDate) {
        mostRecentDate = parsedDate;
      }
    });

    if (mostRecentDate) {
      setDatasetDate(dateStringConverter(mostRecentDate));
    }
  }, []);

  const analyticsHandler = (action, label) => {
    if (action && label) {
      Analytics.event({
        category: 'Exchange Rates Converter',
        action: action,
        label: label,
      });
      ga4DataLayerPush({
        event: action,
        eventLabel: label,
      });
    }
  };
  return (
    <div className={container}>
      <div>
        <h2 className={title}>Frequently Asked Questions</h2>
        <Accordion
          title="What does the future of Social Security and Medicare look like?"
          openEventNumber="16"
          explainerGAEvent="SpendingExplainer"
          ga4ID="social-sec"
        >
          pasta
        </Accordion>
        <Accordion
          title="What does the future of Social Security and Medicare look like?"
          openEventNumber="16"
          explainerGAEvent="SpendingExplainer"
          ga4ID="social-sec"
        >
          pasta
        </Accordion>
        <Accordion
          title="What does the future of Social Security and Medicare look like?"
          openEventNumber="16"
          explainerGAEvent="SpendingExplainer"
          ga4ID="social-sec"
        >
          pasta
        </Accordion>
      </div>
      <div>
        <h2 className={title}>Related Resources</h2>
        <CustomLink
          external={true}
          url="https://www.irs.gov/businesses/small-businesses-self-employed/report-of-foreign-bank-and-financial-accounts-fbar"
          id="Report of Foreign Bank and Finacial Accounts (FBAR) IRS.gov"
        >
          Report of Foreign Bank and Finacial Accounts (FBAR) IRS.gov
        </CustomLink>
      </div>
      <div>
        <h2 className={title}>Data Source</h2>
        <span className={footer}>
          The Currency Exchange Rates Converter tool is powered by the{' '}
          <CustomLink
            url="/datasets/treasury-reporting-rates-exchange/treasury-reporting-rates-of-exchange"
            onClick={() => analyticsHandler('Citation Click', 'Treasury Reporting Rates of Exchange Dataset')}
            id="Treasury Reporting Rates of Exchange"
          >
            Treasury Reporting Rates of Exchange
          </CustomLink>{' '}
          dataset. This dataset is updated quarterly and covers the period from December 31, 2022 to {datasetDate}.
        </span>
      </div>
    </div>
  );
};

export default CurrencyExchangeFAQ;
