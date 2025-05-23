import Analytics from '../../../../../utils/analytics/analytics';
import { render } from '@testing-library/react';
import React from 'react';
import FundingProgramsAndServices from './funding-programs-and-services';
import userEvent from '@testing-library/user-event';

describe('Funding Programs & Services', () => {
  it('calls the appropriate analytics event when links are clicked on', () => {
    const spy = jest.spyOn(Analytics, 'event');
    const { getByText, getAllByText } = render(<FundingProgramsAndServices />);

    const accordion = getByText('What are some of the major spending categories?');
    userEvent.click(accordion);
    const usaSpending = getAllByText('USAspending.gov');
    const objectClass = getByText('Object Class');
    const budgetFunction = getByText('Budget Function');

    usaSpending[1].click();
    expect(spy).toHaveBeenCalledWith({
      category: 'Explainers',
      action: `Debt Citation Click`,
      label: 'USAspending',
    });
    spy.mockClear();

    usaSpending[0].click();
    expect(spy).toHaveBeenCalledWith({
      category: 'Explainers',
      action: `Debt Citation Click`,
      label: 'USAspending',
    });
    spy.mockClear();

    objectClass.click();
    expect(spy).toHaveBeenCalledWith({
      category: 'Explainers',
      action: `Debt Citation Click`,
      label: 'USAspending Object Class',
    });
    spy.mockClear();

    budgetFunction.click();
    expect(spy).toHaveBeenCalledWith({
      category: 'Explainers',
      action: `Debt Citation Click`,
      label: 'USAspending Budget Function',
    });
    spy.mockClear();
  });
});
