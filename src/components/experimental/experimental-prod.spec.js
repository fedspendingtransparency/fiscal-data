import { render, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Experimental from './experimental';
import React from 'react';
import "gatsby-env-variables";

jest.mock("gatsby-env-variables", () => ({
  ENV_ID: 'production',
  API_BASE_URL: 'https://www.transparency.treasury.gov',
  ADDITIONAL_DATASETS: {},
  EXPERIMENTAL_WHITELIST: ['mock experimental feature']
}));

describe('Experimental wrapper component', () => {
  afterEach(() => {
    cleanup();
  });

  it('does not render children when the environment ID is set to production', () => {
    const { queryByText } = render(
      <Experimental featureId='mock experimental feature'>
        <span>Some NON-EXPERIMENTAL content</span>
        <div>And some more content.</div>
      </Experimental>
    );
    expect(queryByText('Some NON-EXPERIMENTAL content')).toBeNull();
    expect(queryByText('And some more content.')).toBeNull();
  });
});