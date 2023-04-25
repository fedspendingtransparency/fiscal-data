import React from 'react';
import Analytics from '../../../../../utils/analytics/analytics';
import { render } from '@testing-library/react';
import TrackingTheDebt from './tracking-the-debt';


describe('Tracking the debt', () => {
  it('calls the appropriate analytics event when link is clicked on',  () => {
    const spy = jest.spyOn(Analytics, 'event');
    const { getByText } = render(
      <TrackingTheDebt />
    );

    const fiscalService = getByText('Bureau of the Fiscal Service');

    fiscalService.click();
    expect(spy).toHaveBeenCalledWith({
      category: 'Explainers',
      action: `Citation Click`,
      label: 'Debt - Tracking the Debt'
    });
    spy.mockClear();
  });
})
