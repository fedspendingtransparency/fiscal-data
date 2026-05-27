import React from 'react';
import CalendarEntryPages from './calendar-entry-pages';
import internalData from '../../../testData/__dataConfig_for_tests.json';
import { sortOptions } from '../calendar-helpers';
import { render } from '@testing-library/react';

describe('Calendar Entries Pages', () => {
  const entries = internalData.releases;
  const entriesPerPage = 10;
  const activePage = 1;

  const selectedOption = sortOptions[0];

  it('returns a Calendar Entries page no larger than entriesPerPage', () => {
    const { getAllByTestId } = render(
      <CalendarEntryPages entries={entries} entriesPerPage={entriesPerPage} activePage={activePage} selectedOption={selectedOption} />
    );
    const calendarEntries = getAllByTestId('calendar-entry');
    expect(calendarEntries.length).toBeLessThanOrEqual(entriesPerPage);
  });
});
