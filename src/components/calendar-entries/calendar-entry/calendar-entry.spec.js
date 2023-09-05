import React from 'react';
import { fireEvent, render, screen } from "@testing-library/react";
import * as Gatsby from 'gatsby';
import CalendarEntry, { releaseCalendarDatasetClickEvent } from './calendar-entry';
import Analytics from '../../../utils/analytics/analytics';
import {releaseCalendarSortEvent} from "../calendar-entries";
import {sortOptions} from "../calendar-helpers";

describe('Calendar Entry', () => {
  const firstDate = '2000-01-01';
  const secondDate = '3000-01-01';
  const dataset = {
    name: 'Test name',
    date: firstDate,
    time: '1300',
    url: '/test-dataset-url/'
  };

  it('renders a calendar entry with the correct title, date, time and status', () => {
    render(<CalendarEntry dataset={dataset} />);

    expect(screen.getByTestId('title').textContent).toEqual('Test name');
    expect(screen.getByTestId('date').textContent).toEqual('01/01/2000');
    expect(screen.getByTestId('time').textContent).toEqual('8:00 am');
    expect(screen.getByTestId('updated-text').textContent).toEqual('Not yet updated');
  });

  it('renders a calendar entry with the UTC -> ET conversion that changes date', () => {
    const modifiedDataset = {
      ...dataset,
      date: '2022-01-20',
      time: '0000'
    }

    render(<CalendarEntry dataset={modifiedDataset} />);

    expect(screen.getByTestId('date').textContent).toEqual('01/19/2022');
    expect(screen.getByTestId('time').textContent).toEqual('7:00 pm');
  });

  it('navigates to the dataset detail page when clicked on', () => {
    const navigationSpy = jest.spyOn(Gatsby, 'navigate');

    render(<CalendarEntry dataset={dataset} earliestDate={firstDate} />);
    fireEvent.click(screen.getByTestId('calendar-entry'));

    expect(navigationSpy).toHaveBeenCalledTimes(1);
    expect(navigationSpy).toHaveBeenCalledWith(`/datasets${dataset.url}`);
  });

  it('triggers the correct analytics event when clicked on', () => {
    const analyticsSpy = jest.spyOn(Analytics, 'event');
    window.dataLayer = window.dataLayer || [];
    const dataLayerSpy = jest.spyOn(window.dataLayer, 'push');

    const {rerender} = render(<CalendarEntry dataset={dataset} earliestDate={firstDate} />);
    fireEvent.click(screen.getByTestId('calendar-entry'));

    expect(analyticsSpy).toHaveBeenCalledWith({
      ...releaseCalendarDatasetClickEvent,
      label: `${dataset.name} Current Date`
    });
    analyticsSpy.mockClear();
    expect(dataLayerSpy).toHaveBeenCalledWith({
      event: releaseCalendarDatasetClickEvent.action,
      eventLabel: `${dataset.name} Current Date`,
    });
    dataLayerSpy.mockClear();

    rerender(<CalendarEntry dataset={dataset} earliestDate={secondDate} />);
    fireEvent.click(screen.getByTestId('calendar-entry'));

    expect(analyticsSpy).toHaveBeenCalledWith({
      ...releaseCalendarDatasetClickEvent,
      label: `${dataset.name} Future Date`
    });
    expect(dataLayerSpy).toHaveBeenCalledWith({
      event: releaseCalendarDatasetClickEvent.action,
      eventLabel: `${dataset.name} Future Date`,
    });
  });
});
