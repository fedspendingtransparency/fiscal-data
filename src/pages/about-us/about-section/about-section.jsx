import React from 'react';
import globalConstants from '../../../helpers/constants';
import SectionContent from '../../../components/api-documentation/section-content/section-content';
import '../../../styles.scss';
import { section, list } from '../about-us.module.scss';
import CustomLink from '../../../components/links/custom-link/custom-link';

const AboutUs = () => {
  return (
    <>
      <div className={section}>
        <SectionContent id="about-fiscal-data" headingLevel={2} title="About Fiscal Data">
          <p>
            Fiscal Data is your one-stop shop for federal financial data. The Department of the Treasury and the Bureau of the Fiscal Service created
            Fiscal Data to consolidate federal financial data into one easy-to-use website. Fiscal Data adheres to modern data practices and offers
            data in machine-readable formats via file downloads and application programming interfaces (APIs).
          </p>
        </SectionContent>
        <SectionContent id="mission" headingLevel={3} title="Mission">
          <p>
            To provide accessible, easy-to-use federal financial data and resources to inform the American public and inspire trust in government.
          </p>
        </SectionContent>
        <SectionContent id="mission" headingLevel={3} title="Vision">
          <p>The American public regularly uses and relies on our data and resources to better understand their government.</p>
        </SectionContent>
        <SectionContent id="mission" headingLevel={3} title="Values">
          <p>
            We are committed to providing authoritative, objective, trusted data in a manner that aligns with the core values of the Fiscal Service:
            integrity, collaboration, accountability, learning, and excellence.
          </p>
        </SectionContent>
        <SectionContent id="who-we-are" headingLevel={3} title="Who We Are">
          <p>
            This site was created by the Office of the Chief Data Officer (OCDO) at the{' '}
            <CustomLink url={`${globalConstants.FISCAL_TREASURY_URL}/about.html`} data-testid="fsLink">
              Bureau of the Fiscal Service (Fiscal Service)
            </CustomLink>
            , which is part of the Department of the Treasury. Fiscal Service is responsible for managing public debt, central payment systems, and
            government accounting. Our team is comprised of data analysts, developers, and UX designers who are passionate about putting trusted data
            in the hands of the people.
          </p>
        </SectionContent>
        <SectionContent id="what-makes-fiscal-data-different" headingLevel={3} title="What Makes Fiscal Data Different">
          <ul className={list}>
            <li>
              <strong>Human-Centered Design</strong>
              <br />
              Usability is a core value we have embraced from the start of the development of this website. Throughout development, we have integrated
              best practices and user feedback to deliver a modern, easy-to-navigate site.
            </li>
            <li>
              <strong>Machine-Readable Data Downloads</strong>
              <br />
              All of our datasets are available for download in multiple machine-readable formats and feature customizable data previews.
              Additionally, each dataset is complete with comprehensive metadata to explain when the data is updated, what each row of the data
              represents, and descriptions for each dataset and data table.
            </li>
            <li>
              <strong>Easily Accessible APIs</strong>
              <br />
              With complete documentation and APIs for each dataset, accessing data has never been easier. New to APIs? Visit our{' '}
              <CustomLink url="/api-documentation/#getting-started" data-testid="getting-started">
                getting started section
              </CustomLink>{' '}
              to learn more!
            </li>
          </ul>
        </SectionContent>
        <SectionContent id="background" headingLevel={3} title="Background">
          <p>
            Fiscal Service is a leader in the open data community within the federal government. In 2018, we re-launched USAspending.gov to enhance
            the public’s ability to examine and track federal spending data and we launched a new website, Data Lab. Based on the principles outlined
            in the 2019 <strong>Foundations for Evidence-Based Policymaking Act</strong> and the 2020{' '}
            <strong>Federal Data Strategy Action Plan</strong>, Fiscal Data builds on our data transparency work by modernizing how we provide data to
            the public.
          </p>
        </SectionContent>
        <SectionContent id="open-data-policy" headingLevel={3} title="Open Data Policy">
          <p>
            Fiscal Service recognizes the importance of providing accurate data on the financial operations of the federal government to the public.
            This information is critical for the proper functioning of markets, the efficient management of the federal government, and ensuring the
            trust of the American people. The OCDO developed an{' '}
            <CustomLink className="primary" href="/data/about-us/901-1 Open Data Policy.pdf">
              Open Data Policy
            </CustomLink>{' '}
            which outlines policies and procedures governing Fiscal Service’s open data. Fiscal Service’s publicly available data will be made
            accessible on Fiscal Data. Please visit us regularly for updates to the Open Data Policy.
          </p>
        </SectionContent>
        <SectionContent
          id="International-Monetary-Fund-Special-Data-Dissemination-Standard"
          headingLevel={3}
          title="International Monetary Fund Special Data Dissemination Standard"
        >
          <p>
            Fiscal Data helps the U.S. government satisfy its transparency commitments as a member nation of the{' '}
            <CustomLink className="primary" href="https://www.imf.org/en/home">
              International Monetary Fund (IMF)
            </CustomLink>{' '}
            through the publication of financial data on the national debt and central government operations following its{' '}
            <CustomLink
              className="primary"
              href={
                'https://www.imf.org/en/About/Factsheets/Sheets/2023/Standards-for-data-dissemination#:~:text=The%20Special%20Data%20Dissemination%' +
                '20System,access%20to%20international%20capital%20markets.'
              }
            >
              Special Data Dissemination Standard (SDDS)
            </CustomLink>
            . We derive the IMF data from other datasets on our site, specifically the{' '}
            <CustomLink className="primary" href="/datasets/monthly-statement-public-debt/summary-of-treasury-securities-outstanding">
              Monthly Statement of the Public Debt (MSPD)
            </CustomLink>{' '}
            and the{' '}
            <CustomLink
              className="primary"
              href="/datasets/monthly-treasury-statement/summary-of-receipts-outlays-and-the-deficit-surplus-of-the-u-s-government"
            >
              Monthly Treasury Statement (MTS)
            </CustomLink>
            . If you're interested in the data provided to the IMF, the two XML pages are as follows:
          </p>
          <ul className={list}>
            <li>
              Consolidated Government Debt (CGD) file:{' '}
              <CustomLink className="primary" href="https://fiscaldata.treasury.gov/static-data/reports-statements/mts/imf/cgd.xml">
                https://fiscaldata.treasury.gov/static-data/reports-statements/mts/imf/cgd.xml
              </CustomLink>
            </li>
            <li>
              Consolidated Government Operations (CGO) file:{' '}
              <CustomLink className="primary" href="https://fiscaldata.treasury.gov/static-data/reports-statements/mts/imf/cgo.xml">
                https://fiscaldata.treasury.gov/static-data/reports-statements/mts/imf/cgo.xml
              </CustomLink>
            </li>
          </ul>
          <p>
            To learn more about IMF SDDS requirements, please visit the{' '}
            <CustomLink
              className="primary"
              href={
                'https://www.imf.org/en/About/Factsheets/Sheets/2023/Standards-for-data-dissemination#:~:text=The%20Special%20Data%20Dissemination' +
                '%20System,access%20to%20international%20capital%20markets.'
              }
            >
              IMF SDDS website
            </CustomLink>
            .
          </p>
        </SectionContent>
        <SectionContent id="data-sources" headingLevel={3} title="Data Sources">
          <p>
            The mission of Fiscal Service is to promote the financial integrity and operational efficiency of the federal government through
            exceptional accounting, financing, collections, payments, and shared services. We pay, collect, finance, and account for trillions of
            dollars each year. Our datasets come from the systems that perform these critical functions such as debt management systems and summary
            debt accounting systems. Each dataset notes the publisher, which indicates the area within Fiscal Service from which the data originated.
          </p>
        </SectionContent>
        <SectionContent id="understanding-the-data" headingLevel={3} title="Understanding the Data">
          <p>
            As a first step in improving the usability of our data, we have focused on increasing the metadata available to users, including complete
            data dictionaries for each dataset, explicit notes and limitations to help users understand the data, and detailed metadata to explain
            when the data is updated, what each row of the data represents, and descriptions for each dataset and data table.
          </p>
        </SectionContent>
        <SectionContent id="development-and-releases" headingLevel={3} title="Development and Releases">
          <p>
            Fiscal Data is being developed using the Agile Scrum method. We release updates to the site about every two weeks. If you would like to
            receive our release notes, please{' '}
            <CustomLink
              url="mailto:join-fiscal-data-gov@lists.fiscal.treasury.gov?subject=Yes, I'd like to receive updates from Fiscal Data!"
              className="primary"
            >
              sign up for our emails
            </CustomLink>
            .
          </p>
        </SectionContent>
        <SectionContent id="licensing" headingLevel={3} title="Licensing">
          <p>
            The U.S. Department of the Treasury’s Bureau of the Fiscal Service is committed to providing open data. The data on this site is available
            to copy, adapt, redistribute, or otherwise use for non-commercial and commercial purposes.
          </p>
        </SectionContent>
        <SectionContent id="more-information" headingLevel={3} title="More Information">
          <p>
            For more information, see the{' '}
            <CustomLink url="#faq" data-testid="faq">
              FAQs
            </CustomLink>{' '}
            or <CustomLink url="mailto:fiscaldata@fiscal.treasury.gov?subject=Contact Us">Contact Us</CustomLink>.
          </p>
        </SectionContent>
      </div>
    </>
  );
};

export default AboutUs;
