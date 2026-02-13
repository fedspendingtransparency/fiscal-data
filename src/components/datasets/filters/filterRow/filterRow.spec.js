import FilterRow from './filterRow';
import React from 'react';
import Analytics from '../../../../utils/analytics/analytics';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('filter row', () => {
  const mockChangeHandler = jest.fn();
  const labelText = 'mock label';
  const filterKey = 'mock key';
  const mockAnalyticsObject = {};

  afterEach(() => {
    mockChangeHandler.mockClear();
  });

  it('renders a label wrapped around a checkbox', () => {
    const { getByRole } = render(
      <FilterRow
        filterKey={filterKey}
        filterTally={{
          count: 1,
          of: 2,
        }}
        currentState={false}
        onChange={mockChangeHandler}
        analyticsObject={mockAnalyticsObject}
      >
        {labelText}
      </FilterRow>
    );
    expect(getByRole('checkbox', { name: labelText })).toBeInTheDocument();
  });

  it('calls the change handler upon initial render (at page load)', () => {
    render(
      <FilterRow
        filterKey={filterKey}
        filterTally={{
          count: 1,
          of: 2,
        }}
        currentState={false}
        onChange={mockChangeHandler}
        analyticsObject={mockAnalyticsObject}
      >
        {labelText}
      </FilterRow>
    );
    expect(mockChangeHandler).toHaveBeenCalledWith({
      key: filterKey,
      value: false,
    });
  });

  it('calls the change handler when the value changes', () => {
    const { getByRole } = render(
      <FilterRow
        filterKey={filterKey}
        filterTally={{
          count: 1,
          of: 2,
        }}
        currentState={false}
        onChange={mockChangeHandler}
        analyticsObject={mockAnalyticsObject}
      >
        {labelText}
      </FilterRow>
    );
    const checkbox = getByRole('checkbox', { name: labelText });
    mockChangeHandler.mockClear();
    userEvent.click(checkbox);
    expect(mockChangeHandler).toHaveBeenCalledWith({
      key: filterKey,
      value: true,
    });
  });

  it('submits a tracking action when the value changes to true', () => {
    const ananlyticsSpy = jest.spyOn(Analytics, 'event');
    window.dataLayer = window.dataLayer || [];
    const dataLayerSpy = jest.spyOn(window.dataLayer, 'push');
    const { getByRole } = render(
      <FilterRow
        filterKey={filterKey}
        filterTally={{
          count: 1,
          of: 2,
        }}
        currentState={false}
        onChange={mockChangeHandler}
        analyticsObject={mockAnalyticsObject}
      >
        {labelText}
      </FilterRow>
    );
    const checkbox = getByRole('checkbox', { name: labelText });
    userEvent.click(checkbox);
    expect(ananlyticsSpy).toHaveBeenCalledWith({
      ...mockAnalyticsObject,
      label: labelText,
    });
    expect(dataLayerSpy).toHaveBeenCalledWith({
      event: mockAnalyticsObject.event,
      eventLabel: labelText,
    });
  });

  it('reflects the parent value', () => {
    const { getByRole } = render(
      <FilterRow
        filterKey={filterKey}
        filterTally={{
          count: 1,
          of: 2,
        }}
        currentState={true}
        onChange={mockChangeHandler}
      >
        {labelText}
      </FilterRow>
    );
    const checkbox = getByRole('checkbox', { name: labelText });

    expect(checkbox).toBeChecked();
  });

  it('includes the filter count component', () => {
    const { getByTestId } = render(
      <FilterRow
        filterKey={filterKey}
        filterTally={{
          count: 1,
          of: 2,
        }}
        currentState={false}
        onChange={mockChangeHandler}
        analyticsObject={mockAnalyticsObject}
      >
        {labelText}
      </FilterRow>
    );
    expect(getByTestId('filter-count')).toBeInTheDocument();
  });
});
