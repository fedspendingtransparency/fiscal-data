import React from 'react';
import {render} from "@testing-library/react";
import SocialShare from "./social-share";


describe('Social Share Platforms', () => {
  it('returns all five sections ', () => {
    const { findAllByTestId } = render(
      <SocialShare />
    );
    const facebook = findAllByTestId('facebook');
    const twitter = findAllByTestId('twitter');
    const linkedIn = findAllByTestId('linkedIn');
    const reddit = findAllByTestId('reddit');
    const email = findAllByTestId('email');
    expect(facebook).toBeTruthy();
    expect(twitter).toBeTruthy();
    expect(linkedIn).toBeTruthy();
    expect(reddit).toBeTruthy();
    expect(email).toBeTruthy();
  });
});
