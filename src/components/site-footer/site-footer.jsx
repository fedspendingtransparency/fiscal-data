import React from 'react';
import { Link } from 'gatsby';
import {
  footerBottom,
  footerBottomLinks,
  copyright,
  bottomContent,
  column,
  columnTitle,
  footerMain,
  content,
  logo,
  pageLinks,
} from './site-footer.module.scss';
import globalConstants from '../../helpers/constants';
import DownloadSticky from '../download-sticky/download-sticky';
import ResumeDownloadModal from '../download-modal/resume-download-modal/resume-download-modal';
import { StaticImage } from 'gatsby-plugin-image';
import Analytics from '../../utils/analytics/analytics';
import CustomLink from '../links/custom-link/custom-link';

export const siteFooterColumns = [
  {
    title: 'Help',
    links: [
      {
        title: 'FAQ',
        to: '/about-us/#faq',
        testId: 'faq',
      },
      {
        title: 'Contact Us',
        to: 'mailto:fiscaldata@fiscal.treasury.gov?subject=Contact Us',
        actionTitle: 'Contact',
        testId: 'contact',
      },
      {
        title: 'Community Site',
        to: 'https://onevoicecrm.my.site.com/FiscalDataGroup/s/',
        testId: 'community',
      },
    ],
  },
  {
    title: 'About Us',
    links: [
      {
        title: 'About Fiscal Data',
        to: '/about-us/#about-fiscal-data',
        actionTitle: 'About',
        testId: 'about',
      },
      {
        title: 'Release Calendar',
        to: '/release-calendar/',
        testId: 'release-calendar',
      },
      {
        title: 'Subscribe to Our Mailing List',
        to: '/about-us/#subscribe',
        actionTitle: 'Subscribe',
        testId: 'subscribe',
      },
    ],
  },
  {
    title: 'Our Sites',
    links: [
      {
        title: 'USAspending',
        to: globalConstants.USA_SPENDING_URL,
        testId: 'usaSpending',
        isExternal: true,
      },
    ],
  },
];

const SiteFooter = () => {
  const fiscalURL = globalConstants.FISCAL_TREASURY_URL;
  const copyrightDate = new Date().getFullYear();
  const clickHandler = action => {
    Analytics.event({
      category: 'Sitewide Navigation',
      action: `Bottom ${action} Click`,
      label: document.title,
    });
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: `${action}-click`,
      eventLabel: document.title,
    });
  };

  return (
    <>
      <ResumeDownloadModal />
      <DownloadSticky />
      <div className={footerMain}>
        <div className={content}>
          <Link data-testid="logo" className={logo} to="/" onClick={() => clickHandler('Logo')} aria-label={'Redirect to Fiscal Data homepage'}>
            <StaticImage
              src="../../images/logos/fd-logo-ko.svg"
              alt="Fiscal Data logo"
              height={49}
              width={171}
              placeholder="dominantColor"
              layout="fixed"
              aria-label="Fiscal Data logo"
            />
          </Link>
          <div className={pageLinks}>
            {siteFooterColumns.map(columnContent => {
              return (
                <div className={column} key={columnContent.title}>
                  <div className={columnTitle}>{columnContent.title}</div>
                  {columnContent.links.map(link => (
                    <CustomLink key={link.testId} href={link.to} onClick={() => clickHandler(link.actionTitle || link.title)}>
                      {link.title}
                    </CustomLink>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className={footerBottom}>
        <div className={bottomContent}>
          <div className={copyright}>&copy; {copyrightDate} Data Transparency</div>
          <div className={footerBottomLinks}>
            <CustomLink href={`${fiscalURL}/accessibility.html`}>Accessibility</CustomLink>
            <CustomLink href={`${fiscalURL}/privacy.html`}>Privacy Policy</CustomLink>
            <CustomLink href={`${fiscalURL}/foia.html`}>Freedom of Information Act</CustomLink>
          </div>
        </div>
      </div>
    </>
  );
};
export default SiteFooter;
