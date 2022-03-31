import { render, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Experimental from './experimental';
import React from 'react';
import "gatsby-env-variables";
import { siteContext } from '../persist/persist';

jest.mock("gatsby-env-variables", () => ({
  ENV_ID: 'dev',
  API_BASE_URL: 'https://www.transparency.treasury.gov',
  ADDITIONAL_DATASETS: {},
  EXPERIMENTAL_WHITELIST: ['mock experimental feature']
}));

describe('Experimental wrapper component', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders children when environment allows if it is NOT set to exclude', () => {
    const { getByText } = render(
      <siteContext.Provider value={{ showExperimentalFeatures: true }}>
        <Experimental featureId='mock experimental feature'>
          <span>Some component body text</span>
          <div>And some more content.</div>
        </Experimental>
      </siteContext.Provider>
    );
    expect(getByText('Some component body text')).toBeInTheDocument();
    expect(getByText('And some more content.')).toBeInTheDocument();
  });

  it('does not render children when environment does not allow if it IS set to exclude', () => {
    const { queryByText } = render(
      <siteContext.Provider value={{ showExperimentalFeatures: true }}>
        <Experimental featureId='mock experimental feature' exclude>
          <span>Some EXPERIMENTAL content</span>
          <div>And some more content.</div>
        </Experimental>
      </siteContext.Provider>
    );
    expect(queryByText('Some EXPERIMENTAL content')).toBeNull();
    expect(queryByText('And some more content.')).toBeNull();
  });
});
