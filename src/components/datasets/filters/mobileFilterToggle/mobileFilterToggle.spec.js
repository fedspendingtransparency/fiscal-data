import React from 'react';
import { render, screen } from '@testing-library/react';
import MobileFilterToggle from './mobileFilterToggle';
import { resetButton } from './mobileFilterToggle.module.scss';
import userEvent from '@testing-library/user-event';

describe('Mobile Filter Toggle', () => {
  const mobileToggleFn = jest.fn();
  const filterResetFn = jest.fn();

  const renderToggle = (props = {}) =>
    render(
      <MobileFilterToggle
        filterCnt={3}
        datasetsView={true}
        toggleDatasetView={mobileToggleFn}
        datasetsCount={13}
        filterReset={filterResetFn}
        {...props}
      />
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders element', () => {
    renderToggle();
    expect(screen.getByTestId('mobile-filter-toggle')).toBeInTheDocument();
  });

  it('shows toggle button text as filter your results when viewing datasets', () => {
    renderToggle({ datasetsView: true });
    expect(screen.getByRole('button', { name: 'Filter Your Results' })).toBeInTheDocument();
  });

  it('toggles datasetView when toggle button is clicked', async () => {
    renderToggle({ datasetsView: true });
    await userEvent.click(screen.getByRole('button', { name: 'Filter Your Results' }));
    expect(mobileToggleFn).toHaveBeenCalledTimes(1);
  });

  it('shows filter reset button when datasetViews are false and activeFilters.length >0', async () => {
    renderToggle({ datasetsView: false });

    expect(screen.getByRole('button', { name: /reset/i })).toHaveClass(resetButton);
  });

  it('calls filterReset when the reset button is clicked', async () => {
    renderToggle({ datasetsView: false });
    await userEvent.click(screen.getByRole('button', { name: /reset/i }));
    expect(filterResetFn).toHaveBeenCalledTimes(1);
  });
});
