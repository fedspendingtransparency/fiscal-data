import React from 'react';
import { useStaticQuery } from 'gatsby';
import ApiDocumentationPage from './index';
import { RecoilRoot } from 'recoil';
import { render, waitFor } from '@testing-library/react';
import { Head } from './index';

jest.useFakeTimers();
describe('ApiDocumentationPage', () => {
  const internalData = require('../../testData/__dataConfig_for_tests.json');
  const profilerConfigMockData = {
    allDatasets: {
      datasets: internalData.datasets,
    },
    allTopics: {
      topics: internalData.topics,
    },
  };
  document.querySelector = jest.fn(() => {
    return {
      appendChild: jest.fn(),
      getAttribute: jest.fn(),
      getBoundingClientRect: jest.fn(() => {
        return { height: 0 };
      }),
    };
  });

  beforeAll(() => {
    useStaticQuery.mockReturnValue(profilerConfigMockData);
  });

  it('expects Getting Started to be within its layout', () => {
    const { getByRole } = render(
      <RecoilRoot>
        <ApiDocumentationPage />
      </RecoilRoot>
    );
    const gettingStarted = getByRole('heading', { name: 'Getting Started' });
    expect(gettingStarted).toBeInTheDocument();
  });

  it('expects Endpoints to be within its layout', () => {
    const { getByRole } = render(
      <RecoilRoot>
        <ApiDocumentationPage />
      </RecoilRoot>
    );
    const gettingStarted = getByRole('heading', { name: 'Endpoints' });
    expect(gettingStarted).toBeInTheDocument();
  });

  it('expects Data Registry to be within its layout', () => {
    const { getByRole } = render(
      <RecoilRoot>
        <ApiDocumentationPage />
      </RecoilRoot>
    );
    const gettingStarted = getByRole('heading', { name: 'Fiscal Service Data Registry' });
    expect(gettingStarted).toBeInTheDocument();
  });

  it('expects Methods to be within its layout', () => {
    const { getByRole } = render(
      <RecoilRoot>
        <ApiDocumentationPage />
      </RecoilRoot>
    );
    const gettingStarted = getByRole('heading', { name: 'Methods' });
    expect(gettingStarted).toBeInTheDocument();
  });

  it('expects Parameters to be within its layout', () => {
    const { getByRole } = render(
      <RecoilRoot>
        <ApiDocumentationPage />
      </RecoilRoot>
    );
    const gettingStarted = getByRole('heading', { name: 'Parameters' });
    expect(gettingStarted).toBeInTheDocument();
  });

  it('expects Responses to be within its layout', () => {
    const { getByRole } = render(
      <RecoilRoot>
        <ApiDocumentationPage />
      </RecoilRoot>
    );
    const gettingStarted = getByRole('heading', { name: 'Responses and Response Objects' });
    expect(gettingStarted).toBeInTheDocument();
  });

  it('expects Aggregation to be within its layout', () => {
    const { getByRole } = render(
      <RecoilRoot>
        <ApiDocumentationPage />
      </RecoilRoot>
    );
    const gettingStarted = getByRole('heading', { name: 'Aggregation and Sums' });
    expect(gettingStarted).toBeInTheDocument();
  });

  it('expects Examples to be within its layout', () => {
    const { getByRole } = render(
      <RecoilRoot>
        <ApiDocumentationPage />
      </RecoilRoot>
    );
    const gettingStarted = getByRole('heading', { name: 'Examples and Code Snippets' });
    expect(gettingStarted).toBeInTheDocument();
  });

  it('contains a TOCButton', () => {
    const { getByRole } = render(
      <RecoilRoot>
        <ApiDocumentationPage />
      </RecoilRoot>
    );
    const tocButton = getByRole('button', { name: 'Table of Contents' });
    expect(tocButton).toBeInTheDocument();
  });

  it('ensures component has the correct page helmet title', () => {
    render(<Head />);
    expect(document.title).toBe('API Documentation | U.S. Treasury Fiscal Data');
  });
});
