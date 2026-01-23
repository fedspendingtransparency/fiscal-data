import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import BodyCopy from '../body-copy/body-copy';
import { mockSLGSFetchResponses, mockSLGSFetchResponses2, mockSLGSFetchResponses3 } from '../../../../explainer/explainer-test-helper';
import Analytics from '../../../../../utils/analytics/analytics';

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

describe('State and Local Government Series Body Copy - Calculation Variant #1', () => {
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

describe('State and Local Government Series Body Copy - Calculation Variant #2', () => {
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

describe('State and Local Government Series Body Copy - GA Events', () => {
  it('fires a GA event when each glossary term is clicked', () => {
    const analyticsSpy = jest.spyOn(Analytics, 'event');
    const glossaryList = [
      { text: 'total public debt outstanding', term: 'Total Public Debt Outstanding' },
      { text: 'State and Local Government Series (SLGS)', term: 'State and Local Government Series' },
      { text: 'non-marketable securities', term: 'Non-Marketable Securities' },
      { text: 'federal debt', term: 'Federal Debt' },
      { text: 'treasury securities', term: 'Treasury Securities' },
    ];
    const { getByText } = render(<BodyCopy />);
    glossaryList.forEach(glossaryItem => {
      const glossaryButton = getByText(glossaryItem.text);
      fireEvent.click(glossaryButton);
      expect(analyticsSpy).toHaveBeenCalledWith({
        action: 'Glossary Term Click',
        category: 'State and Local Government Series',
        label: glossaryItem.term,
      });
      analyticsSpy.mockClear();
    });
  });
});
