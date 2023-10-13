import '@rxreact/jest-helpers';
import { setGlobalFetchResponse } from '../../utils/mock-utils';
import { mockReleaseCalendarEntries, updatedEntries, mockUpdatedDatasets } from './release-calendar.mockdata';
import globalConstants from '../../helpers/constants';
import { skip, take, shareReplay } from 'rxjs';
import { act } from '@testing-library/react';

jest.useFakeTimers();

describe('Release Calendar Service', () => {
  let releaseCalendarService, sub;

  const watchSignal = o$ => {
    // Share so the signal records all values emitted.
    const hot$ = o$.pipe(shareReplay());

    // Subscribe to the signal so it starts emitting.
    sub = hot$.subscribe();

    // Return the hot signal for testing.
    return hot$;
  };

  beforeEach(() => {
    setGlobalFetchResponse(jest, []);
    return import('./release-calendar-service').then(module => {
      releaseCalendarService = module.releaseCalendarService;
      releaseCalendarService.setInitialReleaseCalendarData(mockReleaseCalendarEntries);
    });
  });

  afterEach(() => {
    jest.resetModules();
    jest.clearAllTimers();
    global.fetch.mockReset();
  });

  it('fetch is called once on initial import', () => {
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('release calendar entries are formatted correctly', () => {
    const expectedOutput = [...mockReleaseCalendarEntries];
    act(() => {
      releaseCalendarService.setInitialReleaseCalendarData(mockReleaseCalendarEntries);
    });
    expect(releaseCalendarService.entries).toStrictEqual(expectedOutput);
  });

  it('fetch is polled every interval time', () => {
    const intervalTime = globalConstants.config.releaseCalendar.pollingInterval;

    expect(global.fetch).toHaveBeenCalledTimes(1); // initial fetch on load
    jest.advanceTimersByTime(intervalTime - 1000); // timer is at intervalTime - 1000
    expect(global.fetch).toHaveBeenCalledTimes(1); // not called just yet

    jest.advanceTimersByTime(1005); // timer is at (intervalTime - 1000) + 1005
    expect(global.fetch).toHaveBeenCalledTimes(2); // first polled update

    // below: timer is at ((intervalTime - 1000) + 1005) + intervalTime + 1
    jest.advanceTimersByTime(intervalTime + 1);
    expect(global.fetch).toHaveBeenCalledTimes(3); // second polled update
  });

  it('updates cached release calendar entries on call to update endpoint', async () => {
    setGlobalFetchResponse(jest, updatedEntries);

    const hot$ = watchSignal(releaseCalendarService.entriesUpdated().pipe(skip(1), take(1)));

    jest.advanceTimersByTime(1000 * 60 * 6);

    await expect(hot$).toEmitValue(mockUpdatedDatasets);
  });
});
