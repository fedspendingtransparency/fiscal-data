import { ReplaySubject } from 'rxjs';
import { renderHook } from '@testing-library/react-hooks';
import { useReleaseCalendarEntriesUpdater } from './use-release-calendar-entries-updater-hook';
import { mockReleaseCalendarEntries } from './release-calendar.mockdata';

const mockEntriesUpdated = new ReplaySubject(1);

jest.mock('./release-calendar-service', () => {
  let origRel;
  return {
    releaseCalendarService: {
      setInitialReleaseCalendarData: jest.fn().mockImplementation(orig => (origRel = orig)),
      entriesUpdated: jest.fn().mockImplementation(() => mockEntriesUpdated),
    },
  };
});

describe('Use Release Calendar Entries Updater Hook', () => {
  it('passes through entries unchanged if there are no updates', () => {
    const testEntries = [{ test: 'test', datasetId: 'test1' }];
    mockEntriesUpdated.next(null);
    const { result } = renderHook(() => useReleaseCalendarEntriesUpdater(testEntries));
    expect(result.current).toStrictEqual(testEntries);
  });

  it('updates entries when passed in', () => {
    const testEntries = [...mockReleaseCalendarEntries];

    const { result } = renderHook(() => useReleaseCalendarEntriesUpdater(testEntries));

    expect(result.current).toStrictEqual(testEntries);

    mockEntriesUpdated.next([
      {
        datasetId: '015-BFS-2020Q4-xx',
        date: '2021-11-01',
        time: '1600',
        released: true,
      },
    ]);

    expect(result.current).toBeTruthy();
  });
});
