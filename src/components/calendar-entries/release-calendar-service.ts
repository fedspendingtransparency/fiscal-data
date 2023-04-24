import { basicFetch } from "../../utils/api-utils"
import { API_BASE_URL } from "gatsby-env-variables";
import globalConstants from "../../helpers/constants";
import { addDays, lightFormat } from "date-fns"
import { Observable, ReplaySubject } from "rxjs"
import { IReleaseCalendarEntry } from "../../models/IReleaseCalendarEntry"

export class ReleaseCalendarService {

  private readonly RELEASE_CALENDAR_URL: string =
    globalConstants.RELEASE_CALENDAR;
  private readonly API_DATE_FORMAT: string =
    globalConstants.config.formats.apiDate;
  private readonly DAYS_TO_REQUEST: number =
    globalConstants.config.releaseCalendar.daysToRequestFutureEntries;
  private readonly RELEASE_CALENDAR_POLLING_INTERVAL: number =
    globalConstants.config.releaseCalendar.pollingInterval;

  private _dateToRequest: Date;
  private _lastReleasedCheck: IReleaseCalendarEntry[];
  private _releaseCalendarData: IReleaseCalendarEntry[];
  private _indexedReleases: Record<string, IReleaseCalendarEntry> = {};
  private _intervalId: number;
  private _releaseCalendarUpdated: ReplaySubject<IReleaseCalendarEntry[]>
    = new ReplaySubject<IReleaseCalendarEntry[]>(1);
  private _releaseCalendarObservable: Observable<IReleaseCalendarEntry[]> = this._releaseCalendarUpdated.asObservable();

  constructor() {
    // Updates shouldn't occur for the build (server-side). Updates use
    // fetch which isn't available server-side anyway.
    if (typeof window == 'undefined' || !window.document) return;
    this._dateToRequest = addDays(new Date(), this.DAYS_TO_REQUEST);

    this._updateReleaseCalendarEntries();
    this._polledUpdates();
  }

  public setInitialReleaseCalendarData(initialReleaseCalendarData: IReleaseCalendarEntry[]): void {
    this._releaseCalendarData = initialReleaseCalendarData;
    this._indexReleaseCalendarData();
  }

  /**
   * Provide full output of cached release calendar data.
   */
  public get entries(): IReleaseCalendarEntry[] {
    return this._releaseCalendarData;
  }

  /**
   * return Observable for continued updates.
   */
  public entriesUpdated(): Observable<IReleaseCalendarEntry[]> {
    return this._releaseCalendarObservable;
  }

  private _indexReleaseCalendarData(): void {
    this._releaseCalendarData.forEach((entry: IReleaseCalendarEntry) => {
      this._indexedReleases[`${this._entryKey(entry)}`] = entry;
    });
    // check if we've already made the API call and update the cache if we have.
    if (this._lastReleasedCheck) {
      this._updateIndexedData(this._lastReleasedCheck);
    }
  }

  /**
   * Generates the index key for a given release calendar entry.
   * @param entry
   * @private
   */
  private _entryKey(entry: IReleaseCalendarEntry): string {
    return `${entry.datasetId}_${entry.date}_${entry.time}`;
  }

  private _polledUpdates(): void {
    this._intervalId = window.setInterval(
      this._updateReleaseCalendarEntries.bind(this),
      this.RELEASE_CALENDAR_POLLING_INTERVAL
    );
  }

  private _updateReleaseCalendarEntries(): void {
    this._fetchReleaseCalendarEntries(this._dateToRequest)
      .then((releasedEntries: IReleaseCalendarEntry[]) => {
        // keep the last check around in case we're making this API call before we've
        // indexed the full release calendar entries.
        this._lastReleasedCheck = releasedEntries;
        this._updateIndexedData(releasedEntries);
      })
      .catch((error) => {
        console.error('An error occurred while fetching release calendar entries.', error);
      });
  }

  private _updateIndexedData(releasedEntries: IReleaseCalendarEntry[]): void {
    // if we haven't indexed the releases yet, then we're not ready to update them.
    if (Object.keys(this._indexedReleases).length === 0) return;

    releasedEntries.forEach((entry: IReleaseCalendarEntry) => {
      // remove : from time string
      entry.time = entry.time.replace(/:/g, '');
      const key = this._entryKey(entry);
      // only value that can be updated is released, so only update released value.
      if (this._indexedReleases[key]) {
        this._indexedReleases[key].released = Boolean(entry.released);
      }
    });
    this._updateCache();
  }

  private _updateCache(): void {
    this._releaseCalendarData = [
      ...Object.values(this._indexedReleases)
    ];
    this._releaseCalendarUpdated.next(this._releaseCalendarData);
  }

  /**
   * Fetch from the metadata summary endpoint
   */
  private _fetchReleaseCalendarEntries(date: Date): Promise<IReleaseCalendarEntry[]> {
    const releasedByDate: string = lightFormat(date, this.API_DATE_FORMAT);
    return basicFetch(
      `${API_BASE_URL}${this.RELEASE_CALENDAR_URL}?released_by_date=${releasedByDate}`
    );
  }

}

export const releaseCalendarService = new ReleaseCalendarService();
