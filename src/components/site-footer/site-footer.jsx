import React from 'react';
import { Link } from 'gatsby';
import {
  bottomContent,
  column,
  columnTitle,
  content,
  copyright,
  footerBottom,
  footerBottomLinks,
  footerMain,
  logo,
  pageLinks,
  topRow,
  socialIcons,
  socialIconLink,
  screenReader
} from './site-footer.module.scss';
import globalConstants from '../../helpers/constants';
import DownloadSticky from '../download-sticky/download-sticky';
import ResumeDownloadModal from '../download-modal/resume-download-modal/resume-download-modal';
import { StaticImage } from 'gatsby-plugin-image';
import Analytics from '../../utils/analytics/analytics';
import CustomLink from '../links/custom-link/custom-link';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';
import YouTubeIcon from '@mui/icons-material/YouTube';

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
        to: 'https://onevoicecrm.my.site.com/FiscalDataCommunity/s/',
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
      <footer>
        <div className={footerMain}>
          <div className={content}>
            <div className={topRow}>
            <Link data-testid="logo" className={logo} to="/" onClick={() => clickHandler('Logo')} aria-label={'Redirect to Fiscal Data homepage'}>
              <StaticImage
                src="../../images/logos/fd-logo-ko.svg"
                alt="Fiscal Data logo"
                height={39.16}
                width={141.32}
                placeholder="dominantColor"
                layout="fixed"
                aria-label="Fiscal Data logo"
              />
            </Link>
              <div className={socialIcons}>
                <CustomLink
                  url="https://www.facebook.com/fiscalservice"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="facebook"
                  className={socialIconLink}
                >
                  <FacebookIcon  />
                  <span className={screenReader}>Facebook</span>
                </CustomLink>
                <CustomLink
                  url="https://x.com/FiscalService"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="x"
                  className={socialIconLink}
                >
                  <XIcon fontSize="small" />
                  <span className={screenReader}>X</span>
                </CustomLink>
                <CustomLink
                  url="https://www.linkedin.com/company/1722850/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="linkedin"
                  className={socialIconLink}
                >
                  <LinkedInIcon />
                  <span className={screenReader}>LinkedIn</span>
                </CustomLink>
                <CustomLink
                  url="https://www.youtube.com/channel/UCrezr4h8sW9zB6IEoKwBqRQ/videos"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="youtube"
                  className={socialIconLink}
                >
                  <YouTubeIcon />
                  <span className={screenReader}>Youtube</span>
                </CustomLink>
              </div>
            </div>
            <div className={pageLinks}>
              {siteFooterColumns.map(columnContent => {
                return (
                  <div className={column} key={columnContent.title}>
                    <div className={columnTitle}>{columnContent.title}</div>
                    {columnContent.links.map(link => (
                      <CustomLink
                        key={link.testId}
                        href={link.to}
                        onClick={() => clickHandler(link.actionTitle || link.title)}
                        skipExternalModal={true}
                      >
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
      </footer>
    </>
  );
};
export default SiteFooter;
