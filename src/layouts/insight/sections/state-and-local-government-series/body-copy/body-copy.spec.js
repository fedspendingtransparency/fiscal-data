import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { BodyCopy } from './body-copy';
import { mockSLGSFetchResponses } from '../../../../explainer/explainer-test-helper';

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
    expect(await findByText('0.24 percent', { exact: false })).toBeInTheDocument();
  });
});
