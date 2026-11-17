import React from 'react';
import PageHelmet from './page-helmet';
import { cleanup, render } from '@testing-library/react';
import { useStaticQuery } from 'gatsby';
import 'gatsby-env-variables';

jest.mock('gatsby-env-variables', () => ({
  ENV_ID: 'production',
  API_BASE_URL: 'https://www.transparency.treasury.gov',
  ADDITIONAL_DATASETS: {},
}));

const versionInfoData = {
  gitTag: {
    name: '2021.5.1',
  },
  gitCommit: {
    hash: '123abc',
    date: 'date of commit',
    message: 'mock commit msg',
  },
  gitBranch: {
    name: 'prod',
  },
};

describe('page helmet in production', () => {
  afterEach(() => {
    cleanup();
  });

  it('does not include version-info when the environment ID is set to production', () => {
    useStaticQuery.mockReturnValue(versionInfoData);
    render(<PageHelmet />, { container: document.head });
    expect(document.head.querySelector('meta[data-testid="version-info"]')).toBeNull();
    expect(document.head.querySelector('meta[name="build-info"]')).toBeNull();
  });
});
