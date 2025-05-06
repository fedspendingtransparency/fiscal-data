import React from 'react';
import { render, screen } from '@testing-library/react';
import SearchFilterSummary from './searchFilterSummary';
import { mockFilters } from '../../mockData/mockFilters';
import * as filterTools from '../../../../transform/filters/filterDefinitions';
import userEvent from '@testing-library/user-event';

describe('Search Filter Summary', () => {
  const onGroupReset = jest.fn();
  const onIndividualReset = jest.fn();

  const filtersByGroupKeyWithNameSpy = jest.spyOn(filterTools, 'filtersByGroupKeyWithName');

  const defaultProps = {
    searchQuery: '',
    activeFilters: [],
    allFilters: mockFilters,
    onGroupReset,
    onIndividualReset,
  };

  const renderSummary = (props = {}) => render(<SearchFilterSummary {...defaultProps} {...props} />);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders element', () => {
    const { container } = renderSummary();
    expect(container).toBeEmptyDOMElement();
  });

  it('calls filtersByGroupKeyWithName upon with the active filters and allFilters', () => {
    renderSummary();
    expect(filtersByGroupKeyWithNameSpy).toHaveBeenCalledWith(defaultProps.activeFilters, mockFilters);
  });

  it('renders no children if both searchQuery and activeFilters are empty', () => {
    const { container } = renderSummary();
    expect(container).toBeEmptyDOMElement();
  });

  it('renders both search summary and filter summary when both searchQuery and activeFilters are not empty', () => {
    renderSummary({
      searchQuery: 'test',
      activeFilters: ['startDateRangeThree', 'savingsBonds'],
    });

    expect(screen.getByText(/searching datasets matching/i)).toBeInTheDocument();
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getAllByRole('button').length).toBeGreaterThan(2);
  });

  it('clears selected filter when onClick on specific filter', async () => {
    renderSummary({
      activeFilters: ['startDateRangeThree'],
    });

    const filterBtn = screen.getByRole('button', { name: /startDateRangeThree/i });
    await userEvent.click(filterBtn);

    expect(onIndividualReset).toHaveBeenCalledTimes(1);
  });

  it('clears all filters', async () => {
    renderSummary({
      searchQuery: 'test',
      activeFilters: ['startDateRangeThree', 'savingsBonds'],
    });

    const clearAll = screen.getByRole('button', { name: /clear all filters/i });
    await userEvent.click(clearAll);

    expect(onGroupReset).toHaveBeenCalledWith('startDate');
    expect(onGroupReset).toHaveBeenCalledWith('topics');
    expect(onGroupReset).toHaveBeenCalledTimes(2);
  });
});
