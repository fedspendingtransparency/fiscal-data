import React from 'react';
import { render, waitFor } from '@testing-library/react';
import fetchMock from 'fetch-mock';
import NationalDeficitHero from './national-deficit-hero';
import { mockDeficitHeroData, mockDeficitHeroData_noChange } from '../../explainer-test-helper';
import { queryClient } from '../../../../../react-query-client';

describe('National Deficit Hero', () => {
  beforeAll(() => {
    // include a "current" and a last record from the prior year for testing values
    // fetch.resetMocks();
    fetchMock.get(`begin:https://www.transparency.treasury.gov/services/api/fiscal_service/`, mockDeficitHeroData, { overwriteRoutes: true });
  });
  afterEach(() => {
    queryClient.clear();
  });
  afterAll(() => {
    fetchMock.restore();
  });

  const glossary = [];
  it('Hero Image section loads with relevant data', async () => {
    const { getByText, queryByText, getByLabelText } = render(<NationalDeficitHero glossary={glossary} />);
    await waitFor(() => getByText('$2.24 trillion', { exact: false }));
    expect(await getByText('$2.24 trillion', { exact: false })).toBeInTheDocument();
    expect(await queryByText('$2,237,949,464,925.', { exact: false })).not.toBeInTheDocument();
    expect(await getByText('decreased', { exact: false })).toBeInTheDocument();
    expect(await getByLabelText('down arrow')).toBeInTheDocument();
    expect(await getByText('fiscal year (FY)', { exact: false })).toBeInTheDocument();
    expect(await getByText('2022', { exact: false })).toBeInTheDocument();
    expect(await getByText('government has spent $515 billion', { exact: false })).toBeInTheDocument();
    expect(await getByText('period last year (Oct 2020 - Jun 2021)', { exact: false })).toBeInTheDocument();
  });
});

describe('National deficit no change in data', () => {
  beforeAll(() => {
    // include a "current" and a last record from the prior year for testing values
    // fetch.resetMocks();
    fetchMock.get(`begin:https://www.transparency.treasury.gov/services/api/fiscal_service/`, mockDeficitHeroData_noChange, {
      overwriteRoutes: true,
    });
  });
  afterEach(() => {
    queryClient.clear();
  });
  afterAll(() => {
    fetchMock.restore();
  });

  const glossary = [];
  it('Hero Image displays not changed', async () => {
    const { getByText, queryByText } = render(<NationalDeficitHero glossary={glossary} />);
    await waitFor(() => getByText('4.51 trillion for the same period', { exact: false }));
    expect(await getByText('not changed', { exact: false })).toBeInTheDocument();
    expect(await queryByText('$4,511,067,070,149.', { exact: false })).not.toBeInTheDocument();
    expect(await getByText('2022', { exact: false })).toBeInTheDocument();
  });
});
