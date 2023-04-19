import React from 'react';
import { render } from "@testing-library/react";
import { SocialShareComponent } from "./social-share";
import { breakpointLg, breakpointSm } from '../../../../variables.module.scss';
import Analytics from "../../utils/analytics/analytics";

jest.mock('./variables.module.scss', (content) => ({
  ...content,
  breakpointSm: 600,
  breakpointLg: 992
}));

const testCopy = {
  title: 'test',
  description: 'test',
  body: 'test',
  emailSubject: 'test',
  emailBody: 'test',
  url: 'test',
  image: 'test',
}

describe('Social Share component', () => {

  it('renders all five social share buttons ', () => {
    const { getByRole } = render(
      <SocialShareComponent copy={testCopy} />
    );

    const facebook = getByRole('button', {name: 'facebook'});
    const twitter = getByRole('button', {name: 'twitter'});
    const linkedIn = getByRole('button', {name: 'linkedin'});
    const reddit = getByRole('button', {name: 'reddit'});
    const email = getByRole('button', {name: 'email'});

    expect(facebook).toBeInTheDocument();
    expect(twitter).toBeInTheDocument();
    expect(linkedIn).toBeInTheDocument();
    expect(reddit).toBeInTheDocument();
    expect(email).toBeInTheDocument();
  });

  it('renders the heading and button text in desktop view',() => {
    const { getByRole, getByText } = render(
      <SocialShareComponent
        copy={testCopy}
        width={ breakpointLg }
        displayStyle={'responsive'}
      />
    );

    const header = getByRole('heading', {name: "Share this page:"});
    const facebookText = getByText('Facebook');
    const twitterText = getByText('Twitter');

    expect(header).toBeInTheDocument();
    expect(facebookText).toBeInTheDocument();
    expect(twitterText).toBeInTheDocument();
  });

  it('When displayStyle is horizontal, no text is rendered',() => {
    const { queryByText } = render(
      <SocialShareComponent
        copy={testCopy}
        width={ breakpointLg }
        displayStyle={'horizontal'}
      />
    );


    expect(queryByText('Facebook')).not.toBeInTheDocument();
    expect(queryByText('Twitter')).not.toBeInTheDocument();
  });

  it('When displayStyle is list, text labels are render for both desktop and mobile',() => {
    const { getByText, queryByRole } = render(
      <SocialShareComponent
        copy={testCopy}
        width={ breakpointSm }
        displayStyle={'list'}
      />
    );

    expect(queryByRole('heading', {name: "Share this page:"})).not.toBeInTheDocument();
    expect(getByText('Facebook')).toBeInTheDocument();
    expect(getByText('Twitter')).toBeInTheDocument();
  });

  it('renders only the icons in mobile view, and not the header or button text', () => {
    const { getByRole, queryByRole, queryByText } = render(
      <SocialShareComponent
        copy={testCopy}
                  width={ breakpointSm }
      />
    );

    const header = queryByRole('heading');
    const facebook = getByRole('button', {name: 'facebook'});
    const facebookText = queryByText('Facebook');

    expect(header).toBeNull();
    expect(facebook).toBeInTheDocument();
    expect(facebookText).toBeNull();
  });

  it('calls the appropriate analytics for Explainer pages event when buttons are clicked on', () => {
    const spy = jest.spyOn(Analytics, 'event');
    window.open = jest.fn();
    const { getByRole } = render(
      <SocialShareComponent
        copy={testCopy}
        pageName={'Debt'}
        width={ breakpointSm }
      />
    );

    const facebookButton = getByRole('button', {name: 'facebook'});
    const twitterButton = getByRole('button', {name: 'twitter'});
    const linkedInButton = getByRole('button', {name: 'linkedin'});
    const redditButton = getByRole('button', {name: 'reddit'});
    const emailButton = getByRole('button', {name: 'email'});

    facebookButton.click();
    expect(spy).toHaveBeenCalledWith({
      category: 'Explainers',
      action: `Share Click`,
      label: 'Debt - Share on Facebook'
    });
    spy.mockClear();

    twitterButton.click();
    expect(spy).toHaveBeenCalledWith({
      category: 'Explainers',
      action: `Share Click`,
      label: 'Debt - Share on Twitter'
    });
    spy.mockClear();

    linkedInButton.click();
    expect(spy).toHaveBeenCalledWith({
      category: 'Explainers',
      action: `Share Click`,
      label: 'Debt - Share on LinkedIn'
    });
    spy.mockClear();

    redditButton.click();
    expect(spy).toHaveBeenCalledWith({
      category: 'Explainers',
      action: `Share Click`,
      label: 'Debt - Share on Reddit'
    });
    spy.mockClear();

    emailButton.click();
    expect(spy).toHaveBeenCalledWith({
      category: 'Explainers',
      action: `Share Click`,
      label: 'Debt - Share on Email'
    });
    spy.mockClear();

  });

  it('calls the appropriate XR Converter analytics event when buttons are clicked on', () => {
    const spy = jest.spyOn(Analytics, 'event');
    window.open = jest.fn();
    const { getByRole } = render(
      <SocialShareComponent
        copy={testCopy}
        pageName={'Exchange Rates Converter'}
        width={ breakpointSm }
      />
    );

    const facebookButton = getByRole('button', {name: 'facebook'});
    const twitterButton = getByRole('button', {name: 'twitter'});
    const linkedInButton = getByRole('button', {name: 'linkedin'});
    const redditButton = getByRole('button', {name: 'reddit'});
    const emailButton = getByRole('button', {name: 'email'});

    facebookButton.click();
    expect(spy).toHaveBeenCalledWith({
      category: 'Exchange Rates Converter',
      action: `Share Click`,
      label: 'Share on Facebook'
    });
    spy.mockClear();

    twitterButton.click();
    expect(spy).toHaveBeenCalledWith({
      category: 'Exchange Rates Converter',
      action: `Share Click`,
      label: 'Share on Twitter'
    });
    spy.mockClear();

    linkedInButton.click();
    expect(spy).toHaveBeenCalledWith({
      category: 'Exchange Rates Converter',
      action: `Share Click`,
      label: 'Share on LinkedIn'
    });
    spy.mockClear();

    redditButton.click();
    expect(spy).toHaveBeenCalledWith({
      category: 'Exchange Rates Converter',
      action: `Share Click`,
      label: 'Share on Reddit'
    });
    spy.mockClear();

    emailButton.click();
    expect(spy).toHaveBeenCalledWith({
      category: 'Exchange Rates Converter',
      action: `Share Click`,
      label: 'Share on Email'
    });
    spy.mockClear();

  });
});
