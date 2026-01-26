import React from 'react';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import SurplusIllustration from './surplus-illustration';
import Analytics from '../../../../../../utils/analytics/analytics';
import { mockIsIntersecting } from 'react-intersection-observer/test-utils';
import userEvent from '@testing-library/user-event';

describe('Surplus Illustration', () => {
  const glossary = [];

  it('adds the bounce class for the animation', async () => {
    const { getByTestId } = render(<SurplusIllustration glossary={glossary} />);
    const illustration = getByTestId('surplus-illustration');
    const budgetTab = getByTestId('budget-tab');
    const deficitTab = getByTestId('deficit-tab');
    act(() => mockIsIntersecting(illustration, true));
    await waitFor(() => {
      expect(budgetTab).toHaveClass('bounce');
    });
    expect(deficitTab).toHaveClass('bounceDeficit');
  });

  it('renders all three tab titles', () => {
    const { getByText } = render(<SurplusIllustration glossary={glossary} />);
    expect(getByText('Surplus')).toBeInTheDocument();
    expect(getByText('Balanced Budget')).toBeInTheDocument();
    expect(getByText('Deficit')).toBeInTheDocument();
  });

  it('renders the surplus image', () => {
    const { getByTestId } = render(<SurplusIllustration glossary={glossary} />);
    expect(getByTestId('surplus-image')).toBeInTheDocument();
  });

  it('renders the balanced budget image', () => {
    global.console = { warn: jest.fn(), error: jest.fn() };
    const { getByTestId, getByText } = render(<SurplusIllustration glossary={glossary} />);
    const tab = getByText('Balanced Budget');
    userEvent.click(tab);
    expect(getByTestId('balanced-budget-image')).toBeInTheDocument();
  });

  it('renders the deficit image', () => {
    const { getByTestId, getByText } = render(<SurplusIllustration glossary={glossary} />);
    const tab = getByText('Deficit');
    userEvent.click(tab);
    expect(getByTestId('deficit-image')).toBeInTheDocument();
  });

  it('calls the appropriate analytics when a tab is clicked', () => {
    const { getByTestId } = render(<SurplusIllustration glossary={glossary} />);
    const spy = jest.spyOn(Analytics, 'event');
    const surplusTab = getByTestId('surplus-tab');
    const budgetTab = getByTestId('budget-tab');
    const deficitTab = getByTestId('deficit-tab');

    fireEvent.click(surplusTab);
    expect(spy).toHaveBeenCalled();

    fireEvent.click(budgetTab);
    expect(spy).toHaveBeenCalled();

    fireEvent.click(deficitTab);
    expect(spy).toHaveBeenCalled();

    spy.mockClear();
  });
});
