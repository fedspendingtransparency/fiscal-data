import React from 'react';
import {render} from "@testing-library/react";
import SocialShare from "./social-share";
import globalConstants from "../../../helpers/constants";

const smallSampleCopy = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
  labore et dolore magna aliqua.`;
const baseUrl = globalConstants.BASE_SITE_URL;

describe('Social Share component', () => {
  it('returns social share sections ', () => {
    const { findByTestId } = render(
      <SocialShare quote={smallSampleCopy}
                   title={"Sample Title"}
                   summary={smallSampleCopy}
                   url={baseUrl + "/national-debt/"}/>
    );

    const facebook = findByTestId('facebook');
    const twitter = findByTestId('twitter');
    const linkedIn = findByTestId('linkedIn');
    const reddit = findByTestId('reddit');
    const email = findByTestId('email');

    expect(facebook).toBeTruthy();
    expect(twitter).toBeTruthy();
    expect(linkedIn).toBeTruthy();
    expect(reddit).toBeTruthy();
    expect(email).toBeTruthy();
  });
});
