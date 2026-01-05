import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Analytics from '../../utils/analytics/analytics'
import HomeMainContent from './home-main-content';

jest.mock('../../utils/analytics/analytics', () => ({
  __esModule: true,
  default: { event: jest.fn() },
}));

describe('Home Main Content', () => {
  it('should render text for h2', () => {
    const { getByTestId } = render(<HomeMainContent />);
    const headerDiv = getByTestId('home-main-content');
    expect(headerDiv).toBeDefined();
  });

  it('should render HomeHighlightCards component', () => {
    const { getByTestId } = render(<HomeMainContent />);
    expect(getByTestId('highlight-cards-parent')).toBeDefined();
  });

  it('fires analytics when Dataset Search link is clicked', async () => {
    render(<HomeMainContent />);

    const link =
      screen.queryByRole('link', { name: /dataset search page/i }) ??
      screen.getByText(/dataset search page/i);

    userEvent.click(link)

    expect(Analytics.event).toHaveBeenCalledWith({
      category: 'Homepage Navigation',
      action: 'Citation Click',
      label: 'Dataset Search',
    });
  });

});
