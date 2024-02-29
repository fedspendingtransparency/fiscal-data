import React from 'react';
import { render, waitFor } from '@testing-library/react'; import '@testing-library/jest-dom/extend-expect';
import WhatInfluencesPurchaseOfSavingsBonds from './what-influences-purchase-of-savings-bonds';
import mockSavingsBondFetchResponses from './../../../explainer-test-helper';



describe('WhatInfluencesPurchaseOfSavingsBonds Component - Comprehensive Test', () => {
  beforeAll(() => mockSavingsBondFetchResponses);

  it('What influences Purchase OF saving bounds', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { getByText } = render(<WhatInfluencesPurchaseOfSavingsBonds />);
    await waitFor(() => expect(fetchSpy).toBeCalled());
    expect(getByText('savings bonds this fiscal year', { exact: false })).toBeInTheDocument();
  });
});
