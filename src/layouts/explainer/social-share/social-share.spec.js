import React from 'react';
import {cleanup, render} from "@testing-library/react";
import SocialShare from "./social-share";
import globalConstants from "../../../helpers/constants";
import { breakpointLg, breakpointSm } from '../../../../variables.module.scss';


const smallSampleCopy = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
  labore et dolore magna aliqua.`;
const baseUrl = globalConstants.BASE_SITE_URL;

jest.mock('./variables.module.scss', (content) => ({
  ...content,
  breakpointSm: 600,
  breakpointLg: 992
}));

describe('Social Share component', () => {

  afterEach(() => {
    cleanup();
  });

  it('renders all five social share buttons ', () => {
    const { getByRole } = render(
      <SocialShare quote={smallSampleCopy}
                   title={"Sample Title"}
                   summary={smallSampleCopy}
                   url={baseUrl + "/national-debt/"}/>
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

  it('renders the heading, icons, and text in desktop view', () => {
    const { getByRole } = render(
      <SocialShare quote={smallSampleCopy}
                   title={"Sample Title"}
                   summary={smallSampleCopy}
                   url={baseUrl + "/national-debt/"}
                   width={breakpointLg}/>
    );

    const header = getByRole('heading', {name: 'Share this page:'});
    const facebookButton = getByRole('button', {name: 'facebook'});
    const facebookIcon = facebookButton.querySelector('svg');
    const facebookText = facebookButton.querySelector('p');

    expect(header).toBeInTheDocument();
    expect(facebookIcon).toBeInTheDocument();
    expect(facebookText).toBeInTheDocument();
  });

  it('renders only the icons in mobile view', () => {
    const { getByRole } = render(
      <SocialShare quote={smallSampleCopy}
                   title={"Sample Title"}
                   summary={smallSampleCopy}
                   url={baseUrl + "/national-debt/"}
                   width={breakpointSm}/>
    );

    const header = getByRole('heading');
    const facebookButton = getByRole('button', {name: 'facebook'});
    const facebookIcon = facebookButton.querySelector('svg');
    const facebookText = facebookButton.querySelector('p');

    expect(header).toBeEmptyDOMElement();
    expect(facebookIcon).toBeInTheDocument();
    expect(facebookText).toBeEmptyDOMElement();
  });
});
