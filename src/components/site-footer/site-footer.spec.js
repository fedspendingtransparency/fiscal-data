import React from 'react';
import { render } from '@testing-library/react';
import renderer from 'react-test-renderer'
import SiteFooter, { siteFooterColumns } from "./site-footer";
import DownloadSticky from '../download-sticky/download-sticky';
import ResumeDownloadModal from '../download-modal/resume-download-modal/resume-download-modal';
import Analytics from '../../utils/analytics/analytics';

describe('SiteFooter', () => {

/**
 * INTERNAL LINKS (Gatsby <Link/> uses props.to, not props.href)
 */

  //logo
  it('contains the logo', () => {
    const { getByTestId } = render(<SiteFooter />);
    expect(getByTestId('logo')).toBeDefined();
  });

  //faq link
  it('contains the link to the faq page', () => {
    const { getByText } = render(<SiteFooter />);
    const faqLink = getByText(siteFooterColumns[0].links[0].title);
    expect(faqLink).toBeDefined();
  });

  //contact us
  it('contains the link to the contact us page', () => {
    const { getByText } = render(<SiteFooter />);
    const contactLink = getByText(siteFooterColumns[0].links[1].title);
    expect(contactLink).toBeDefined();
  });

  //about
  it('contains the link to the about us page', () => {
    const { getByText } = render(<SiteFooter />);
    const aboutLink = getByText(siteFooterColumns[1].links[0].title);
    expect(aboutLink).toBeDefined();
  });

  //release calendar
  it('contains the link to the release calendar page', () => {
    const { getByText } = render(<SiteFooter />);
    const aboutLink = getByText(siteFooterColumns[1].links[1].title);
    expect(aboutLink).toBeDefined();
  });

  //subscribe
  it('contains the link to the subscribe page', () => {
    const { getByText } = render(<SiteFooter />);
    const subscribeLink = getByText(siteFooterColumns[1].links[2].title);
    expect(subscribeLink).toBeDefined();
  });

/**
 * EXTERNAL LINKS (<a> tag uses props.href, not props.to)
 */

  //usaspending
  it('contains the link to the usaSpending page', () => {
    const { getByText } = render(<SiteFooter />);
    const usaSpendLink = getByText(siteFooterColumns[2].links[0].title);
    expect(usaSpendLink).toBeDefined();
  });

  //a11y
  it('contains the link to the accessibility page', () => {
    const { getByText } = render(<SiteFooter />);
    const accessLink = getByText('Accessibility');
    expect(accessLink).toBeDefined();
  });

  //privacy
  it('contains the link to the privacy page', () => {
    const { getByText } = render(<SiteFooter />);
    const privacyLink = getByText('Privacy Policy');
    expect(privacyLink).toBeDefined();
  });

  //foia
  it('contains the link to the foia page', () => {
    const { getByText } = render(<SiteFooter />);
    const foiaLink = getByText('Freedom of Information Act');
    expect(foiaLink).toBeDefined();
  });

  it('incorporates the download sticky footer component', () => {
    const instance = renderer.create(<SiteFooter />).root;
    expect(instance.findByType(DownloadSticky)).toBeDefined();
  });

  it('incorporates the ResumeDownloadModal component', () => {
    const instance = renderer.create(<SiteFooter />).root;
    expect(instance.findByType(ResumeDownloadModal)).toBeDefined();
  });

  it('calls the appropriate analytics event when links are clicked on', () => {
    const spy = jest.spyOn(Analytics, 'event');
    const pageTitle = 'test page title'
    const { getByTestId, getByText } = render(<SiteFooter />);
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
      label: pageTitle
    });
    spy.mockClear();

    faqButton.click();
    expect(spy).toHaveBeenCalledWith({
      category: 'Sitewide Navigation',
      action: `Bottom ${siteFooterColumns[0].links[0].title} Click`,
      label: pageTitle
    });
    spy.mockClear();

    contactButton.click();
    expect(spy).toHaveBeenCalledWith({
      category: 'Sitewide Navigation',
      action: `Bottom ${siteFooterColumns[0].links[1].actionTitle} Click`,
      label: pageTitle
    });
    spy.mockClear();

    aboutButton.click();
    expect(spy).toHaveBeenCalledWith({
      category: 'Sitewide Navigation',
      action: `Bottom ${siteFooterColumns[1].links[0].actionTitle} Click`,
      label: pageTitle
    });
    spy.mockClear();

    releaseCalendarButton.click();
    expect(spy).toHaveBeenCalledWith({
      category: 'Sitewide Navigation',
      action: `Bottom ${siteFooterColumns[1].links[1].title} Click`,
      label: pageTitle
    });

    subscribeButton.click();
    expect(spy).toHaveBeenCalledWith({
      category: 'Sitewide Navigation',
      action: `Bottom ${siteFooterColumns[1].links[2].actionTitle} Click`,
      label: pageTitle
    });
    spy.mockClear();

    usaSpendingButton.click();
    expect(spy).toHaveBeenCalledWith({
      category: 'Sitewide Navigation',
      action: `Bottom ${siteFooterColumns[2].links[0].title} Click`,
      label: pageTitle
    });
    spy.mockClear();
  });
});
