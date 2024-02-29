import React from 'react';
import { render, waitFor } from '@testing-library/react'; import '@testing-library/jest-dom/extend-expect';
import WhatInfluencesPurchaseOfSavingsBonds from './what-influences-purchase-of-savings-bonds';
import mockSavingsBondFetchResponses from './../../../explainer-test-helper';

global.ResizeObserver = class ResizeObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe(){}
  unobserve(){}
  disconnect(){}
}

describe('WhatInfluencesPurchaseOfSavingsBonds Component - Comprehensive Test', () => {
  beforeAll(() => mockSavingsBondFetchResponses);

  it('What influences Purchase OF saving bounds', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { getByText } = render(<WhatInfluencesPurchaseOfSavingsBonds />);
    await waitFor(() => expect(fetchSpy).toBeCalled());
    expect(getByText('The chart below shows savings bond sales over time for all 0 savings bond types and their relative popularity', { exact: false })).toBeInTheDocument();
  });
});
