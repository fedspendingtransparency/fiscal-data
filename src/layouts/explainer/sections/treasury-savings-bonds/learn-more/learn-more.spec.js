import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LearnMore from './learn-more';
import Analytics from '../../../../../utils/analytics/analytics';
import userEvent from '@testing-library/user-event';

describe('Learn More Section', () => {
  it('renders the section', () => {
    render(<LearnMore />);
    expect(screen.getByText('Today, individuals can buy Series I and Series EE bonds online through', { exact: false })).toBeInTheDocument();
  });

  it('calls citation click ga events', () => {
    const analyticsSpy = jest.spyOn(Analytics, 'event');
    const { getByRole } = render(<LearnMore />);
    const citation1 = getByRole('link', { name: 'TreasuryDirect' });
    const citation2 = getByRole('link', { name: 'Treasury Hunt' });
    userEvent.click(citation1);
    expect(analyticsSpy).toHaveBeenCalledWith({ action: 'Savings Bonds Citation Click', category: 'Explainers', label: 'TreasuryDirect' });
    userEvent.click(citation2);
    expect(analyticsSpy).toHaveBeenCalledWith({ action: 'Savings Bonds Citation Click', category: 'Explainers', label: 'Treasury Hunt' });
  });
});
