import React from 'react';
import { render, screen } from '@testing-library/react';
import CalendarEntryTime from './calendar-entry-time';
import * as sortHelper from '../calendar-entry-sort-helper/calendar-entry-sort-helper';

describe('Calendar Entry Time component', () => {
  beforeAll(() => {
    jest.spyOn(sortHelper, 'getLocalTimeZone').mockReturnValue('America/New_York');
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('shows morning if time is AM and minutes are 59', () => {
    render(<CalendarEntryTime dateString="2021-01-01" timeInUTC="1059" />);
    expect(screen.getByTestId('time-display')).toHaveTextContent('Morning');
  });

  it('shows afternoon if time is PM, before 3 and minutes are 59', () => {
    render(<CalendarEntryTime dateString="2021-01-01" timeInUTC="1759" />);
    expect(screen.getByTestId('time-display')).toHaveTextContent('Afternoon');
  });

  it('shows evening if time is PM, after 3 and minutes are 59', () => {
    render(<CalendarEntryTime dateString="2021-01-01" timeInUTC="2159" />);
    expect(screen.getByTestId('time-display')).toHaveTextContent('Evening');
  });

  it('shows the time in the local timezone when minutes are not 59', () => {
    render(<CalendarEntryTime dateString="2021-01-01" timeInUTC="2100" />);
    expect(screen.getByTestId('time-display')).toHaveTextContent('4:00 pm');
  });

  it('converts 00:00 UTC to the local time (7:00 pm in America/New_York)', () => {
    render(<CalendarEntryTime dateString="2021-01-01" timeInUTC="0000" />);
    expect(screen.getByTestId('time-display')).toHaveTextContent('7:00 pm');
  });
});
