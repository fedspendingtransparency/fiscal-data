import React, { FunctionComponent, useEffect, useState } from 'react';
import {
  container,
  containerClass,
  exchangeRateFAQ,
  externalIcon,
  footer,
  headTitle,
  linkText,
  relatedResource,
  resourceList,
  title,
} from './exchange-rate-faq.module.scss';
import Accordion from '../../accordion/accordion';
import CustomLink from '../../links/custom-link/custom-link';
import { analyticsHandler, dateStringConverter } from '../../../helpers/currency-exchange-rates-converter/currency-exchange-rates-converter-helper';
import { graphql, useStaticQuery } from 'gatsby';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLink } from '@fortawesome/free-solid-svg-icons/faExternalLink';

const CurrencyExchangeFAQ: FunctionComponent = () => {
  const data = useStaticQuery(
    graphql`
      query {
        allExchangeRatesData {
          exchangeRatesData: nodes {
            record_date
          }
        }
      }
    `
  ).allExchangeRatesData.exchangeRatesData;

  const [datasetDate, setDatasetDate] = useState<string>('');

  useEffect(() => {
    const mostRecentDate = data.map(record => new Date(record.record_date)).reduce((latest, date) => (date > latest ? date : latest), new Date(0));

    setDatasetDate(dateStringConverter(mostRecentDate));
  }, [data]);

  const faqs = [
    {
      title: 'How is this foreign currency converter different from others?',
      content: (
        <>
          This currency converter is powered by data from the{' '}
          {
            <CustomLink url="/datasets/treasury-reporting-rates-exchange/treasury-reporting-rates-of-exchange">
              Treasury Reporting Rates of Exchange
            </CustomLink>
          }{' '}
          dataset. The data represents the U.S. government’s authoritative exchange rates and is available quarterly. Other currency converters may be
          available more frequently, but those are not official rates from the U.S. Treasury and are more likely powered by financial exchanges or
          market data contributors.
        </>
      ),
    },
    {
      title: 'Can I use these exchange rates for my IRS tax forms?',
      content: (
        <>
          You should always check the latest IRS guidance on how to complete tax forms. Although the intended purpose of this data is to ensure
          consistency for foreign currency units and U.S. dollar equivalents across all reporting done by agencies of the government, the exchange
          rates on Fiscal Data represent the U.S. government’s authoritative exchange rates and can also be used for your IRS tax forms. For questions
          on completing those forms, reference the Related Resources section on this page for helpful links or visit{' '}
          <CustomLink url="https://www.irs.gov/help/let-us-help-you">Let us help you | IRS.gov</CustomLink>.
        </>
      ),
    },
    {
      title: 'Why can’t I see a real-time exchange rate?',
      content: 'The U.S. Treasury publishes this data quarterly. The data is not available on a more frequent cadence at this time.',
    },
  ];

  const relatedResources = [
    {
      url: 'https://www.irs.gov/businesses/small-businesses-self-employed/report-of-foreign-bank-and-financial-accounts-fbar',
      text: 'Report of Foreign Bank and Financial Accounts (FBAR) | IRS.gov',
    },
    {
      url: 'https://www.irs.gov/forms-pubs/about-form-8938',
      text: 'About Form 8938, Statement of Specified Foreign Financial Assets | IRS.gov',
    },
    {
      url: 'https://www.irs.gov/individuals/international-taxpayers/foreign-currency-and-currency-exchange-rates',
      text: 'Foreign currency and currency exchange rates | IRS.gov',
    },
    {
      url: 'https://www.irs.gov/individuals/international-taxpayers/yearly-average-currency-exchange-rates',
      text: 'Yearly Average Currency Exchange Rates | IRS.gov',
    },
    {
      url: 'https://www.irs.gov/individuals/international-taxpayers/us-citizens-and-residents-abroad-filing-requirements',
      text: 'U.S. citizens and residents abroad filing requirements | IRS.gov',
    },
  ];

  return (
    <aside className={container}>
      <div>
        <h2 className={headTitle}>Frequently Asked Questions</h2>
        <div className={exchangeRateFAQ}>
          {faqs.map((faq, index) => (
            <Accordion key={index} title={faq.title} containerClass={containerClass}>
              {faq.content}
            </Accordion>
          ))}
        </div>
      </div>
      <div>
        <h2 className={title}>Related Resources</h2>
        <ul className={resourceList}>
          {relatedResources.map((resource, index) => (
            <li className={relatedResource} key={index}>
              <CustomLink external url={resource.url} id={resource.text}>
                <div className={linkText}>
                  <FontAwesomeIcon icon={faExternalLink} className={externalIcon} />
                  <span>{resource.text}</span>
                </div>
              </CustomLink>
            </li>
          ))}
        </ul>
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
          dataset. This dataset is updated quarterly and covers the period from March 31, 2018 to {datasetDate}.
        </span>
      </div>
    </aside>
  );
};

export default CurrencyExchangeFAQ;
