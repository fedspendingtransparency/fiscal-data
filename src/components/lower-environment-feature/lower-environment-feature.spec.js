import { cleanup, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import LowerEnvironmentFeature from './lower-environment-feature';
import React from 'react';
import 'gatsby-env-variables';

jest.mock('gatsby-env-variables', () => ({
  ENV_ID: 'dev',
  API_BASE_URL: 'https://www.transparency.treasury.gov',
  ADDITIONAL_DATASETS: {},
  LOWER_ENV_FEATURE_WHITELIST: ['mock lower env feature'],
}));

describe('Lower environment feature wrapper component', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders children when environment allows if it', () => {
    const { getByText } = render(
      <LowerEnvironmentFeature featureId="mock lower env feature">
        <span>Some component body text</span>
        <div>And some more content.</div>
      </LowerEnvironmentFeature>
    );
    expect(getByText('Some component body text')).toBeInTheDocument();
    expect(getByText('And some more content.')).toBeInTheDocument();
  });

  it('does not render children when environment does not have the featureId whitelisted', () => {
    const { queryByText } = render(
      <LowerEnvironmentFeature featureId="a different lower env feature" exclude>
        <span>Some EXPERIMENTAL content</span>
        <div>And some more content.</div>
      </LowerEnvironmentFeature>
    );
    expect(queryByText('Some EXPERIMENTAL content')).toBeNull();
    expect(queryByText('And some more content.')).toBeNull();
  });
});
