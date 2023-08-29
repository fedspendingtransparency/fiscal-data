import React, { useEffect, useState } from "react"

import SectionContent from '../../../components/api-documentation/section-content/section-content';
import '../../../styles.scss';
import * as styles from '../about-us.module.scss';
import GLOBALS from '../../../helpers/constants';
import CustomLink from "../../../components/links/custom-link/custom-link";

const FAQ = ({triggerHighlight = 0}) => {
  const commonSectionHeadingLevel = 3;
  const highlightTime = GLOBALS.config.highlight.defaultTimeToHighlight;

  const whoCanIContactPreface =
    <>Because Fiscal Data's focus is publicly available government
    data, we do not have access to personal data and cannot assist with personal inquiries. For
    personal inquiries, please contact the following departments and agencies:
    </>;

  const whoToContactOptions =
    <ul className={[styles.list, styles.noBullets].join(' ')}>
      <li>
        For the <b>Treasury Offset Program</b>, contact their team directly by
        calling <CustomLink  url="tel:+18003043107" external>800-304-3107</CustomLink> or
        {' '}
        <CustomLink url="https://fiscal.treasury.gov/top/contact.html"> visit their Contact Us page
        </CustomLink> for more details.
      </li>
      <li>
        For <b>Coronavirus Tax Relief and Economic Impact Payments</b> (stimulus payments),
        visit the Internal Revenue Service's
        {' '}
        <CustomLink url="http://www.irs.gov/coronavirus-tax-relief-and-economic-impact-payments">
          Economic Impact Payments Page
        </CustomLink>
      </li>
      <li>
        To get the status of your <b>tax refund</b>, visit the Internal Revenue Service's
        "<CustomLink url="https://www.irs.gov/refunds">Where's My Refund?</CustomLink>" page.
      </li>
      <li>
        For child support inquiries, please contact your state's Attorney General at the Office of
        the Attorney General and/or contact your local Child Support Division.
      </li>
      <li>
        For additional topics,{' '}
        <CustomLink url="https://fiscal.treasury.gov/contact/">
          contact the Bureau of the Fiscal Service
        </CustomLink>.
      </li>
    </ul>;

  const [highlight, setHighlight] = useState(false);

  const highlightWhoCanIContactText = () => {
    if (highlight) return;
    setHighlight(true);

    setTimeout(() => {
      setHighlight(false);
    }, highlightTime);
  };

  useEffect(() => {
    if (triggerHighlight === 0) return;
    highlightWhoCanIContactText();
  }, [triggerHighlight]);


  return (
    <div className={`${styles.section} ${styles.noBullets}`}>
      <h2 id="faq" className={styles.title}>
        FAQs
      </h2>
      <SectionContent id="how-often-is-the-data-updated"
        headingLevel={commonSectionHeadingLevel}
        title="How often is the data updated?"
      >
          <p>
            The answer varies by dataset. To determine the update frequency, refer to the <strong>Metadata</strong>
            tab in the <strong>About this Dataset</strong> section for a
            particular dataset. You can also filter the datasets in our{' '}
            <CustomLink url="/datasets/">
              Dataset Search
            </CustomLink> based on when the data was last updated.
          </p>
      </SectionContent>
      <SectionContent id="how-is-data-being-rolled-out-on-website"
        headingLevel={commonSectionHeadingLevel}
        title="How is data being rolled out on the website?"
      >
          <p>
            For our launch in July 2020, we prioritized the most popular and relevant public
            datasets and will continue to add more datasets over time.
          </p>
      </SectionContent>
      <SectionContent id="how-can-i-learn-about-updates-to-site"
        headingLevel={commonSectionHeadingLevel}
        title="How can I learn about updates to this site?"
      >
          <p>
            Please check back regularly for updates to the
            site including new features and additional datasets. You can also {' '}
            <CustomLink url="mailto:join-fiscal-data-gov@lists.fiscal.treasury.gov">
              sign up to receive updates via email.
            </CustomLink>
          </p>
      </SectionContent>
      <SectionContent id="when-is-new-data-uploaded-to-site"
        headingLevel={commonSectionHeadingLevel}
        title="When is new data uploaded to the site?"
      >
          <p>
            We will continue to add more datasets to the site over time. To receive email updates
            about new features and datasets,{' '}
            <CustomLink url="mailto:join-fiscal-data-gov@lists.fiscal.treasury.gov?subject=Yes,
            I’d like to receive updates from Fiscal Data!"
            >
              sign up for our mailing list
            </CustomLink>.
          </p>
      </SectionContent>
      <SectionContent id="why-datasets-go-further-than-others"
        headingLevel={commonSectionHeadingLevel}
        title="Why do some datasets go back further than others?"
      >
          <p>
            The answer varies by dataset. Some data started being recorded as the result of
            specific legislation and others became available as a result of new data systems put in
            place. We strive to provide as much data as is available for each dataset and will
            continue working to provide as much historical data as possible.
          </p>
      </SectionContent>
      <SectionContent id="new-to-apis"
        headingLevel={commonSectionHeadingLevel}
        title="I’m new to using APIs. How can I start using your APIs?"
      >
          <p>
            You can find all the information you’ll need to access our data via APIs on the{' '}
            <CustomLink url="/api-documentation/">
              API Documentation
            </CustomLink> page. You may find the <strong>Getting Started</strong> section
            most helpful.
          </p>
      </SectionContent>
      <SectionContent id="taxes-stimulus-inquiries"
        headingLevel={commonSectionHeadingLevel}
        title="Where can I find information about my taxes, my stimulus payments, redeeming savings
        bonds, and other personal inquiries?"
      >
        <div>
          <p>
            Because Fiscal Data's focus is publicly available government data, we do not have
            access to personal data and cannot assist with personal inquiries. For personal
            inquires, please contact the following departments and agencies:
          </p>
          {whoToContactOptions}
        </div>
      </SectionContent>
      <SectionContent id="who-can-i-contact"
        headingLevel={commonSectionHeadingLevel}
        title="Who can I contact if I have questions about the data or wish to make a suggestion?"
      >
          <p>
            Please{' '}
            <CustomLink url="mailto:fiscaldata@fiscal.treasury.gov?subject=Contact Us">
              contact us
            </CustomLink> with questions about the
             data or to submit recommendations.
          </p>
          <div>
            <p>
              {highlight ?
                <mark>{whoCanIContactPreface}</mark> :
                whoCanIContactPreface }
            </p>
            {whoToContactOptions}
          </div>
      </SectionContent>
    </div>
  );
};

export default FAQ;
