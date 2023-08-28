import { renderHelper } from "../../../../helpers/renderHelper";
import FilterRow from "./filterRow";
import React from "react";
import FilterCount from "./filterCount/filterCount";
import Analytics from '../../../../utils/analytics/analytics';

describe('filter row', () => {
  const mockChangeHandler = jest.fn();
  const labelText = 'mock label';
  const filterKey = 'mock key';
  const mockAnalyticsObject = {};

  let component, instance, renderer, label, checkbox, filterCount;

  beforeEach(() => {
    ({ component, instance, renderer } = renderHelper(
      <FilterRow
        filterKey={filterKey}
        filterTally={{
          count: 1,
          of: 2
        }}
        currentState={false}
        onChange={mockChangeHandler}
        analyticsObject={mockAnalyticsObject}
      >
        {labelText}
      </FilterRow>
    ));
    label = instance.findByType('label');
    checkbox = label.findByType('input');
    filterCount = instance.findByType(FilterCount);
  });

  afterEach(() => {
    mockChangeHandler.mockClear();
  });

  it('renders a label wrapped around a checkbox', () => {
    expect(label).toBeDefined();
    expect(checkbox).toBeDefined();
    expect(checkbox.props.type).toBe('checkbox');
  })

  it('labels the checkbox', () => {
    expect(label.props.children).toContain(labelText);
  });

  it('calls the change handler upon initial render (at page load)', () => {
    expect(mockChangeHandler).toHaveBeenCalledWith({
      key: filterKey,
      value: false
    });
  });

  it('calls the change handler when the value changes', () => {
    mockChangeHandler.mockClear();
    renderer.act(() => {
      checkbox.props.onChange()
    });

    expect(mockChangeHandler).toHaveBeenCalledWith({
      key: filterKey,
      value: true
    });
  })

  it('submits a tracking action when the value changes to true', () => {
    const spy = jest.spyOn(Analytics, 'event');
    renderer.act(() => {
      checkbox.props.onChange()
    });

    expect(spy).toHaveBeenCalledWith({
      ...mockAnalyticsObject,
      label: labelText
    });
  });

  it('Pushes analytics event to datalayer for GA4 for filterRow', () => {
    window.dataLayer = window.dataLayer || [];
    const spy = jest.spyOn(window.dataLayer, 'push');
    renderer.act(() => {
      checkbox.props.onChange()
    });

    expect(spy).toHaveBeenCalledWith({
      event: mockAnalyticsObject.event,
      eventLabel: labelText
    });
  });

  it('reflects the parent value', () => {
    expect(checkbox.props.checked).toBeFalsy();

    renderer.act(() => {
      component.update(
        <FilterRow
          filterKey={filterKey}
          filterTally={{
            count: 1,
            of: 2
          }}
          currentState={true}
          onChange={mockChangeHandler}
        >
          {labelText}
        </FilterRow>
      )
    });

    expect(checkbox.props.checked).toBeTruthy();
  })

  it('includes the filter count component', () => {
    expect(filterCount.props.count.count).toBeDefined();
    expect(filterCount.props.count.of).toBeDefined();
  })
})
