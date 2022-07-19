import React from 'react';
import { render } from "@testing-library/react";
import { SocialShareComponent } from "./social-share";
import { breakpointLg, breakpointSm } from '../../../../variables.module.scss';

jest.mock('./variables.module.scss', (content) => ({
  ...content,
  breakpointSm: 600,
  breakpointLg: 992
}));

describe('Social Share component', () => {
  const title = 'Title';
  const description = 'Description';
  const body = 'Body';
  const url = 'testUrl';
  const image = 'testImage';

  it('renders all five social share buttons ', () => {
    const { getByRole } = render(
      <SocialShareComponent
                   title={title}
                   description={description}
                   body={body}
                   url={url}
                   image={image}
      />
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
                  title={title}
                  description={description}
                  body={body}
                  url={url}
                  image={image}
                  width={ breakpointLg }
      />
    );

    const header = getByRole('heading', {name: "Share this page:"});
    const facebookText = getByText('Facebook');
    const twitterText = getByText('Twitter');

    expect(header).toBeInTheDocument();
    expect(facebookText).toBeInTheDocument();
    expect(twitterText).toBeInTheDocument();
  });

  it('renders only the icons in mobile view, and not the header or button text', () => {
    const { getByRole, queryByText } = render(
      <SocialShareComponent
                  title={title}
                  description={description}
                  body={body}
                  url={url}
                  image={image}
                  width={ breakpointSm }
      />
    );

    const header = getByRole('heading');
    const facebook = getByRole('button', {name: 'facebook'});
    const facebookText = queryByText('Facebook');

    expect(header).toBeEmptyDOMElement();
    expect(facebook).toBeInTheDocument();
    expect(facebookText).toBeNull();
  });
});
