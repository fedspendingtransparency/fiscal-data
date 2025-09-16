import React from 'react';
import { render, waitFor } from '@testing-library/react';
import BodyCopy from '../body-copy/body-copy';
import { mockSLGSFetchResponses, mockSLGSFetchResponses2, mockSLGSFetchResponses3 } from '../../../../explainer/explainer-test-helper';


describe('State and Local Government Series Body Copy', () => {
  beforeAll(() => {
    mockSLGSFetchResponses();
  });

  it('renders the section', () => {
    const instance = render(<BodyCopy />);
    expect(instance).toBeDefined();
  });

  it('fetches evergreen values', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { findByText } = render(<BodyCopy />);
    await waitFor(() => expect(fetchSpy).toBeCalledTimes(3));
    expect(await findByText('June 25, 2025', { exact: false })).toBeInTheDocument();
    expect(await findByText('$88 B outstanding SLGS securities', { exact: false })).toBeInTheDocument();
    expect(await findByText('<1%', { exact: false })).toBeInTheDocument();
  });
});

describe('State and Local Government Series Body Copy', () => {
  beforeAll(() => {
    mockSLGSFetchResponses2();
  });

  it('fetches slgs total amount mock data values with an expected value of 0', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { findByText } = render(<BodyCopy />);
    await waitFor(() => expect(fetchSpy).toBeCalledTimes(3));
    expect(await findByText('0%', { exact: false })).toBeInTheDocument();
  });
});

describe('State and Local Government Series Body Copy', () => {
  beforeAll(() => {
    mockSLGSFetchResponses3();
  });
  it('fetches slgs debt to penny amount mock data values  with an expected value of 2', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { findByText } = render(<BodyCopy />);
    await waitFor(() => expect(fetchSpy).toBeCalledTimes(3));
    expect(await findByText('2%', { exact: false })).toBeInTheDocument();
  });
});
