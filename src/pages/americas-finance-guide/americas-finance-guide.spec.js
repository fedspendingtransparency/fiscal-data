import React from 'react';
import { render } from '@testing-library/react';
import AmericasFinanceGuide from './index';
import { useStaticQuery } from 'gatsby';
import { RecoilRoot } from 'recoil';

Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1200 });

describe('Americas Finance Guide', () => {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = ResizeObserver;

  const glossaryMock = {
    allGlossaryCsv: {
      glossaryCsv: [
        {
          term: 'Excise',
          definition:
            'A tax collected on certain goods and commodities produced or sold within the country (i.e. alcohol and tobacco, gasoline) and on licenses granted for certain activities (i.e. import/export license).',
          site_page: 'Revenue Explainer & AFG Overview Page',
          id: '12',
          url_display: '',
          url_path: '',
        },
      ],
    },
    extensions: {},
  };

  beforeAll(() => {
    useStaticQuery.mockReturnValue(glossaryMock);
  });

  afterEach(() => {
    jest.resetModules();
  });

  it('renders the top container', async () => {
    const { getByTestId } = render(<AmericasFinanceGuide width={100} />, { wrapper: RecoilRoot });

    expect(getByTestId('topContainer')).toBeInTheDocument();
    expect(getByTestId('quoteContainer')).toBeInTheDocument();
    expect(getByTestId('bottomContainer')).toBeInTheDocument();
  });

  it('renders the Social Share', () => {
    const { getByRole, getByTestId } = render(<AmericasFinanceGuide width={100} />, { wrapper: RecoilRoot });

    const facebook = getByTestId('facebookButton');
    const twitter = getByTestId('twitterButton');
    const linkedIn = getByTestId('linkedinButton');
    const reddit = getByTestId('redditButton');
    const email = getByRole('button', { name: 'email' });

    expect(facebook).toBeInTheDocument();
    expect(twitter).toBeInTheDocument();
    expect(linkedIn).toBeInTheDocument();
    expect(reddit).toBeInTheDocument();
    expect(email).toBeInTheDocument();
  });
});
