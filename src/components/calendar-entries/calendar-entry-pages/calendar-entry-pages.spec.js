import React from 'react';
import renderer from 'react-test-renderer';
import CalendarEntryPages from './calendar-entry-pages';
import internalData from '../../../testData/__dataConfig_for_tests.json';
import { sortOptions } from '../calendar-helpers';
import CalendarEntry from '../calendar-entry/calendar-entry';

describe('Calendar Entries Pages', () => {
  let component = renderer.create();

  let instance;

  const entries = internalData.releases;
  const entriesPerPage = 10;
  const activePage = 1;

  const selectedOption = sortOptions[0];

  beforeEach(() => {
    renderer.act(() => {
      component = renderer.create(
        <CalendarEntryPages entries={entries} entriesPerPage={entriesPerPage} activePage={activePage} selectedOption={selectedOption} />
      );
    });
    instance = component.root;
  });

  it('returns a Calendar Entries page no larger than entriesPerPage', () => {
    expect(instance.findAllByType(CalendarEntry).length).toBeLessThanOrEqual(entriesPerPage);
  });
});
