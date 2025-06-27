import React from 'React';
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
    expect(await findByText('88 B', { exact: false })).toBeInTheDocument();
    // add more expect statements for the other 2 evergreen value spots (date, and % of total debt)
  });
});
