import React from 'react';
import { render, screen } from '@testing-library/react';
import SiteFooter, { siteFooterColumns } from './site-footer';
import Analytics from '../../utils/analytics/analytics';
import { RecoilRoot } from 'recoil';

jest.mock('../download-sticky/download-sticky', () => () => <div data-testid="download-sticky" />);
jest.mock('../download-modal/resume-download-modal/resume-download-modal', () => () => <div data-testid="resume-download-modal" />);

describe('SiteFooter', () => {
  /**
   * INTERNAL LINKS (Gatsby <Link/> uses props.to, not props.href)
   */

  //logo
  it('contains the logo', () => {
    const { getByTestId } = render(
      <RecoilRoot>
        <SiteFooter />
      </RecoilRoot>
    );
    expect(getByTestId('logo')).toBeDefined();
  });

  //copyright
  it('contains the copyright date', () => {
    const { getByText } = render(
      <RecoilRoot>
        <SiteFooter />
      </RecoilRoot>
    );
    const copyrightDate = new Date().getFullYear();
    expect(getByText(copyrightDate, { exact: false })).toBeDefined();
  });

  //faq link
  it('contains the link to the faq page', () => {
    const { getByText } = render(
      <RecoilRoot>
        <SiteFooter />
      </RecoilRoot>
    );
    const faqLink = getByText(siteFooterColumns[0].links[0].title);
    expect(faqLink).toBeDefined();
  });

  //contact us
  it('contains the link to the contact us page', () => {
    const { getByText } = render(
      <RecoilRoot>
        <SiteFooter />
      </RecoilRoot>
    );
    const contactLink = getByText(siteFooterColumns[0].links[1].title);
    expect(contactLink).toBeDefined();
  });

  //about
  it('contains the link to the about us page', () => {
    const { getByText } = render(
      <RecoilRoot>
        <SiteFooter />
      </RecoilRoot>
    );
    const aboutLink = getByText(siteFooterColumns[1].links[0].title);
    expect(aboutLink).toBeDefined();
  });

  //release calendar
  it('contains the link to the release calendar page', () => {
    const { getByText } = render(
      <RecoilRoot>
        <SiteFooter />
      </RecoilRoot>
    );
    const aboutLink = getByText(siteFooterColumns[1].links[1].title);
    expect(aboutLink).toBeDefined();
  });

  //subscribe
  it('contains the link to the subscribe page', () => {
    const { getByText } = render(
      <RecoilRoot>
        <SiteFooter />
      </RecoilRoot>
    );
    const subscribeLink = getByText(siteFooterColumns[1].links[2].title);
    expect(subscribeLink).toBeDefined();
  });

  /**
   * EXTERNAL LINKS (<a> tag uses props.href, not props.to)
   */

  //usaspending
  it('contains the link to the usaSpending page', () => {
    const { getByText } = render(
      <RecoilRoot>
        <SiteFooter />
      </RecoilRoot>
    );
    const usaSpendLink = getByText(siteFooterColumns[2].links[0].title);
    expect(usaSpendLink).toBeDefined();
  });

  //a11y
  it('contains the link to the accessibility page', () => {
    const { getByText } = render(
      <RecoilRoot>
        <SiteFooter />
      </RecoilRoot>
    );
    const accessLink = getByText('Accessibility');
    expect(accessLink).toBeDefined();
  });

  //privacy
  it('contains the link to the privacy page', () => {
    const { getByText } = render(
      <RecoilRoot>
        <SiteFooter />
      </RecoilRoot>
    );
    const privacyLink = getByText('Privacy Policy');
    expect(privacyLink).toBeDefined();
  });

  //foia
  it('contains the link to the foia page', () => {
    const { getByText } = render(
      <RecoilRoot>
        <SiteFooter />
      </RecoilRoot>
    );
    const foiaLink = getByText('Freedom of Information Act');
    expect(foiaLink).toBeDefined();
  });

  it('incorporates the download sticky footer component', () => {
    render(
      <RecoilRoot>
        <SiteFooter />
      </RecoilRoot>
    );
    expect(screen.getByTestId('download-sticky')).toBeInTheDocument();
  });

  it('incorporates the ResumeDownloadModal component', () => {
    render(
      <RecoilRoot>
        <SiteFooter />
      </RecoilRoot>
    );
    expect(screen.getByTestId('resume-download-modal')).toBeInTheDocument();
  });

  it('calls the appropriate analytics event when links are clicked on', () => {
    const spy = jest.spyOn(Analytics, 'event');
    const pageTitle = 'test page title';
    const { getByTestId, getByText } = render(
      <RecoilRoot>
        <SiteFooter />
      </RecoilRoot>
    );
    document.title = pageTitle;

    const logo = getByTestId('logo');
    const faqButton = getByText(siteFooterColumns[0].links[0].title);
    const contactButton = getByText(siteFooterColumns[0].links[1].title);
    const aboutButton = getByText(siteFooterColumns[1].links[0].title);
    const releaseCalendarButton = getByText(siteFooterColumns[1].links[1].title);
    const subscribeButton = getByText(siteFooterColumns[1].links[2].title);
    const usaSpendingButton = getByText(siteFooterColumns[2].links[0].title);

    logo.click();
    expect(spy).toHaveBeenCalledWith({
      category: 'Sitewide Navigation',
      action: `Bottom Logo Click`,
      label: pageTitle,
    });
    spy.mockClear();

    faqButton.click();
    expect(spy).toHaveBeenCalledWith({
      category: 'Sitewide Navigation',
      action: `Bottom ${siteFooterColumns[0].links[0].title} Click`,
      label: pageTitle,
    });
    spy.mockClear();

    contactButton.click();
    expect(spy).toHaveBeenCalledWith({
      category: 'Sitewide Navigation',
      action: `Bottom ${siteFooterColumns[0].links[1].actionTitle} Click`,
      label: pageTitle,
    });
    spy.mockClear();

    aboutButton.click();
    expect(spy).toHaveBeenCalledWith({
      category: 'Sitewide Navigation',
      action: `Bottom ${siteFooterColumns[1].links[0].actionTitle} Click`,
      label: pageTitle,
    });
    spy.mockClear();

    releaseCalendarButton.click();
    expect(spy).toHaveBeenCalledWith({
      category: 'Sitewide Navigation',
      action: `Bottom ${siteFooterColumns[1].links[1].title} Click`,
      label: pageTitle,
    });

    subscribeButton.click();
    expect(spy).toHaveBeenCalledWith({
      category: 'Sitewide Navigation',
      action: `Bottom ${siteFooterColumns[1].links[2].actionTitle} Click`,
      label: pageTitle,
    });
    spy.mockClear();

    usaSpendingButton.click();
    expect(spy).toHaveBeenCalledWith({
      category: 'Sitewide Navigation',
      action: `Bottom ${siteFooterColumns[2].links[0].title} Click`,
      label: pageTitle,
    });
    spy.mockClear();
  });

  // it('contains social links and navigates to profile', () => {
  //   const { getByLabelText } = render(
  //     <RecoilRoot>
  //       <SiteFooter />
  //     </RecoilRoot>
  //   );
  //   const socialLinks= [
  //     { testId: 'FacebookIcon', url: 'https://www.facebook.com/fiscalservice'},
  //     { testId: 'XIcon', url: 'https://x.com/FiscalService'},
  //     { testId: 'LinkedInIcon', url:  'https://www.linkedin.com/company/1722850/'},
  //     { testId: 'YouTubeIcon', url: 'https://www.youtube.com/channel/UCrezr4h8sW9zB6IEoKwBqRQ/videos'}
  //   ]
  //   socialLinks.forEach(({ testId }) => {
  //     expect(screen.getByTestId(testId)).toBeInTheDocument()
  //   });
  // });
});
