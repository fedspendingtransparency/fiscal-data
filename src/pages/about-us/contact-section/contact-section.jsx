import React from 'react';
import {Link} from 'react-scroll';
import SectionContent from '../../../components/api-documentation/section-content/section-content';
import * as styles from './contact-section.module.scss';
import * as aboutUsStyles from '../about-us.module.scss';
import CustomLink from "../../../components/links/custom-link/custom-link";

const Contact = () => {

  return (
    <div className={aboutUsStyles.section}>
      <SectionContent id="contact-us"
                      headingLevel={2}
                      title="Contact Us"
                      className={styles.mainSection}
      >
        <p>
          Have a question about Fiscal Data? The{' '}
          <Link to="about-fiscal-data"
                className="primary"
                smooth={true}
                duration={600}
                delay={200}
          >
            About Us
          </Link> and{' '}
          <Link to="faq"
                className="primary"
                smooth={true}
                duration={600}
                delay={200}
          >
            FAQ
          </Link> are the quickest ways to get an answer, but if you can’t find what you’re
          looking for there or would like to make a suggestion, please contact us{' '}
          <CustomLink url="mailto:fiscaldata@fiscal.treasury.gov?subject=Contact Us">
            via email
          </CustomLink>, and our team will respond at our earliest opportunity.
          <br /><br />
          <i>
            Do not enter sensitive personal identifiable information such as SSN, address,
            phone number, date of birth, or driver's license number.
          </i>
        </p>
      </SectionContent>
      <SectionContent id="subscribe"
                      headingLevel={3}
                      title="Sign Up for Email Updates"
      >
        <p>
          Want to stay up to date about new features and datasets? Sign up for email
          updates by sending an email to{' '}
          <CustomLink
            url={`mailto:join-fiscal-data-gov@lists.fiscal.treasury.gov?
            subject=Yes, I’d like to receive updates from Fiscal Data!`}
          >
            join-fiscal-data-gov@lists.fiscal.treasury.gov
          </CustomLink>.
        </p>
      </SectionContent>
    </div>
  );
};

export default Contact;
