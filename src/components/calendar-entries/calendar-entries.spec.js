import React from 'react';
import renderer from 'react-test-renderer';
import { useStaticQuery } from "gatsby";
import CalendarEntriesList, { releaseCalendarSortEvent } from './calendar-entries';
import { sortOptions } from "./calendar-helpers";
import CalendarEntry from './calendar-entry/calendar-entry';
import CalendarEntryPages from './calendar-entry-pages/calendar-entry-pages';
import internalData from '../../testData/__dataConfig_for_tests.json';
import PageButtons from '../pagination/page-buttons';
import SelectControl from '../select-control/select-control';
import Analytics from '../../utils/analytics/analytics';
import {render, fireEvent} from "@testing-library/react";

jest.mock(
  '../../components/calendar-entries/use-release-calendar-entries-updater-hook',
  () => ({ useReleaseCalendarEntriesUpdater: (i) => i })
);

describe('Calendar Entries List', () => {

  let component = renderer.create();
  let instance;

  const profilerConfigMockData = {
    allDatasets: {
      datasets: internalData.datasets
    },
    allReleases: {
      releases: internalData.releases
    }
  };

  beforeEach(() => {
    useStaticQuery.mockReturnValue(profilerConfigMockData);
    renderer.act(() => {
      component = renderer.create(
        <CalendarEntriesList />
      );
    });
    instance = component.root;
  });

  it('renders a list of calendar entries, a sort-by button, and a pagination component', () => {
    const list = instance.findByType(CalendarEntryPages);
    const pageButtons = instance.findByType(PageButtons);
    const dropdown = instance.findByType(SelectControl);

    expect(list).toBeDefined();
    expect(pageButtons).toBeDefined();
    expect(dropdown).toBeDefined();
  });

  it('passes the Name and Date options to the dropdown', () => {
    expect(instance.findByType(SelectControl).props.options).toEqual(sortOptions);
  });

  it('sorts the entries by name order', () => {
    expect(instance.findAllByType(CalendarEntry)[0].props.dataset.name)
      .toBe("120 Day Delinquent Debt Referral Compliance Report");
  });

  it('sorts the entries by date order', () => {
    const dropdown = instance.findByType(SelectControl);
    renderer.act(() => {
      dropdown.props.changeHandler(sortOptions[1]);
    });

    expect(instance.findAllByType(CalendarEntry)[0].props.dataset.date).toBe("2021-05-10");
  });

  it('triggers an analytics event when the sort changes', () => {
    const analyticsSpy = jest.spyOn(Analytics, 'event');
    window.dataLayer = window.dataLayer || [];
    const spy = jest.spyOn(window.dataLayer, 'push');
    const dropdown = instance.findByType(SelectControl);
    renderer.act(() => {
      dropdown.props.changeHandler(sortOptions[1]);
    });

    expect(analyticsSpy).toHaveBeenCalledWith({
      ...releaseCalendarSortEvent,
      label: sortOptions[1].label
    });
    expect(spy).toHaveBeenCalledWith({
      event: releaseCalendarSortEvent.action,
      eventLabel: sortOptions[1].label

    })
    spy.mockClear();
  })
});
