import React, { FunctionComponent, useEffect, useState } from 'react';
import { footer, title, container, exchangeRateFAQ, containerClass, link } from './exchange-rate-faq.module.scss';
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
        <div className={exchangeRateFAQ}>
          <Accordion
            title="How is this foreign currency converter different from others?"
            openEventNumber="16"
            explainerGAEvent="SpendingExplainer"
            ga4ID="social-sec"
            containerClass={containerClass}
          >
            This currency converter is powered by data from the Treasury Reporting Rates of Exchange dataset. The data represents the U.S.
            government’s authoritative exchange rates and is available quarterly. Other currency converters may be available more frequently, but
            those are not official rates from the U.S. Treasury and are more likely powered by financial exchanges or market data contributors.
          </Accordion>
          <Accordion
            title="What does the future of Social Security and Medicare look like?"
            openEventNumber="16"
            explainerGAEvent="SpendingExplainer"
            ga4ID="social-sec"
            containerClass={containerClass}
          >
            You should always check the latest IRS guidance on how to complete tax forms. Although the intended purpose of this data is to ensure
            consistency for foreign currency units and U.S. dollar equivalents across all reporting done by agencies of the government, the exchange
            rates on Fiscal Data represent the U.S. government’s authoritative exchange rates and can also be used for your IRS tax forms. For
            questions on completing those forms, reference the Related Resources section on this page for helpful links or visit Let us help you |
            IRS.gov.
          </Accordion>
          <Accordion title="Why can’t I see a real-time exchange rate?" openEventNumber="16" explainerGAEvent="SpendingExplainer" ga4ID="social-sec">
            The U.S. Treasury publishes this data quarterly. The data is not available on a more frequent cadence at this time.
          </Accordion>
        </div>
      </div>
      <div>
        <h2 className={title}>Related Resources</h2>
        <div>
          <CustomLink
            external={true}
            url="https://www.irs.gov/businesses/small-businesses-self-employed/report-of-foreign-bank-and-financial-accounts-fbar"
            id="Report of Foreign Bank and Finacial Accounts (FBAR) IRS.gov"
            displayIcon={true}
          >
            Report of Foreign Bank and Finacial Accounts (FBAR) IRS.gov
          </CustomLink>
          <CustomLink
            external={true}
            url="https://www.irs.gov/forms-pubs/about-form-8938"
            id="Report of Foreign Bank and Finacial Accounts (FBAR) IRS.gov"
            displayIcon={true}
          >
            About Form 8938, Statement of Specified Foreign Financial Assets | IRS.gov
          </CustomLink>
          <CustomLink
            external={true}
            url="https://www.irs.gov/individuals/international-taxpayers/foreign-currency-and-currency-exchange-rates"
            id="Report of Foreign Bank and Finacial Accounts (FBAR) IRS.gov"
            displayIcon={true}
          >
            Foreign currency and currency exchange rates | IRS.gov
          </CustomLink>
          <CustomLink
            external={true}
            url="https://www.irs.gov/individuals/international-taxpayers/yearly-average-currency-exchange-rates"
            id="Report of Foreign Bank and Finacial Accounts (FBAR) IRS.gov"
            displayIcon={true}
          >
            Yearly Average Currency Exchange Rates | IRS.gov
          </CustomLink>
          <CustomLink
            external={true}
            url="https://www.irs.gov/individuals/international-taxpayers/us-citizens-and-residents-abroad-filing-requirements"
            id="Report of Foreign Bank and Finacial Accounts (FBAR) IRS.gov"
            displayIcon={true}
          >
            U.S. citizens and residents abroad filing requirements | IRS.gov
          </CustomLink>
        </div>
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
