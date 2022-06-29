import { basicFetch } from "../../utils/api-utils"
import { API_BASE_URL } from "gatsby-env-variables";
import globalConstants from "../constants";
import { ISummaryDatasetAPIData } from "../../models/ISummaryDatasetAPIData"
import { ISummaryDatasetDataJson } from "../../models/ISummaryDatasetDataJson"
import { ISummaryData } from "../../models/ISummaryData"
import { IDatasetDates } from "../../models/IDatasetDates"
import { from, Observable, ReplaySubject, Subject, tap } from "rxjs"
import { IPublishedReportDataJson } from "../../models/IPublishedReportDataJson"
import { map } from "rxjs/operators"
import { IPublishedReport } from "../../models/IPublishedReport"
import { IPublishedReports } from "../../models/IPublishedReports"
import { isAfter, isBefore, parseISO } from "date-fns"

export class MetadataService {

  private readonly METADATA_SUMMARY_URL: string =
    globalConstants.METADATA_SUMMARY;
  private readonly PUBLISHED_REPORT_URL: string =
    globalConstants.PUBLISHED_REPORTS;
  private readonly BASE_SITE_URL: string =
    globalConstants.BASE_SITE_URL;

  private readonly METADATA_POLLING_INTERVAL: number =
    globalConstants.config.metadataUpdateService.pollingInterval;
  private readonly PUBLISHED_REPORT_CACHE_MAX_AGE: number =
    globalConstants.config.metadataUpdateService.publishedReportsMaxCacheAge;
  private readonly PUBLISHED_REPORTS_DATASET_ALLOW_LIST: string[] =
    globalConstants.config.publishedReports.datasets;
  private readonly SUMMARY_DATES = {
    earliestDate: parseISO('9999-12-31'),
    latestDate: parseISO('1900-01-01'),
    lastUpdated: parseISO('1900-01-01')
  };

  private _summaryData: ISummaryData;
  private _publishedReportsData: IPublishedReports = {};
  private _intervalId: number;
  private _summaryUpdated: Subject<ISummaryData> = new ReplaySubject<ISummaryData>(1);
  private _publishedReportsUpdated: Subject<IPublishedReports>
    = new ReplaySubject<IPublishedReports>(1);

  constructor() {
    // Updates shouldn't occur for the build (server-side). Updates use
    // fetch which isn't available server-side anyway.
    if (typeof window == 'undefined' || !window.document) return;
    this._updateSummaryData();
    this._polledUpdates();
  }

  /**
   * Provides full output of summary data reformatted to be keyed on dataset ID
   */
  public get summaryData(): ISummaryData {
    return this._summaryData;
  }

  /**
   * Observable that emits when a summary update has occurred.
   */
  public summaryUpdated(): Observable<ISummaryData> {
    return this._summaryUpdated.asObservable();
  }

  /**
   * Provides full output of published data reformatted to be keyed on dataset ID
   */
  public get publishedReports(): IPublishedReports {
    return this._publishedReportsData;
  }

  /**
   * Observable that emits when a summary update has occurred.
   */
  public publishedReportsUpdated(): Observable<IPublishedReports> {
    return this._publishedReportsUpdated.asObservable();
  }

  public updatedPublishedReports(datasetId: string): Observable<IPublishedReportDataJson[] | null> {
    const output: Subject<IPublishedReportDataJson[]>
      = new ReplaySubject<IPublishedReportDataJson[]>(1);

    if (!this._datasetPublishedReportsAllowed(datasetId)) {
      output.next(null);
    }
    else if (this._cachedIsValid(datasetId)) {
      output.next(this._publishedReportsData[datasetId].reports);
    } else {
      // will need to request published reports for dataset id and cache
      from(this._fetchPublishedReportsForDataset(datasetId))
        .pipe(
          map((rawJson): IPublishedReportDataJson[] => {
            return rawJson.map((report) => {
              report.path = this.BASE_SITE_URL + report.path;
              let curDate = report.report_date;
              if (typeof curDate === 'string') {
                const [year,month,day] = curDate.split('-');
                curDate = new Date(Number(year),Number(month)-1,Number(day),0,0,0);
              }
              return {
                ...report,
                report_date: curDate
              } as IPublishedReportDataJson});
          }),
          // update cache for future use
          tap((datasetReports: IPublishedReportDataJson[]) => {
            this._updateCache(datasetId, datasetReports);
          })
        )
        .subscribe({
          next: (data) => {
            output.next(data);
          },
          error: (err) => {
            console.error('An error occurred while fetching the published reports', err);
            output.error(err);
          }
        });
    }

    return output.asObservable();
  }

  private _datasetPublishedReportsAllowed = (datasetId: string): boolean => {
    return this.PUBLISHED_REPORTS_DATASET_ALLOW_LIST.indexOf(datasetId) > -1;
  };

  private _cachedIsValid = (datasetId: string): boolean => {
    if (this._publishedReportsData[datasetId] === undefined) {
      return false;
    }

    return (this._publishedReportsData[datasetId].expiration > Date.now());
  };

  /**
   * Update published reports cache.
   * @param datasetId
   * @param reportData
   * @private
   */
  private _updateCache(datasetId: string, reportData: IPublishedReportDataJson[]): void {
    if (!this._publishedReportsData[datasetId]) {
      this._publishedReportsData[datasetId] = null;
    }

    this._publishedReportsData[datasetId] = {
      expiration: Date.now() + this.PUBLISHED_REPORT_CACHE_MAX_AGE,
      reports: reportData
    } as IPublishedReport;
  }

  /**
   * Sets up interval to update cached metadata summary every
   * METADATA_POLLING_INTERVAL.
   * @private
   */
  private _polledUpdates(): void {
    this._intervalId = window.setInterval(
        this._updateSummaryData.bind(this),
        this.METADATA_POLLING_INTERVAL
      );
  }

  /**
   * Update the local _summaryData with the data from the endpoint.
   */
  private _updateSummaryData(): void {
    this._fetchMetadataSummary().then((response: ISummaryDatasetDataJson[]) => {
      let hasDatesUpdated = false;
      const summaryData = response.reduce((obj: ISummaryData, dataset) => {
        const indexedApiData = this._indexApiData(dataset.apis);
        const curDatasetObj = this._summaryData && this._summaryData[dataset.dataset_id];
        const curDatasetDates: IDatasetDates = Object.assign(this.SUMMARY_DATES);
        if(curDatasetObj){
          curDatasetDates.earliestDate = curDatasetObj.earliestDate;
          curDatasetDates.latestDate = curDatasetObj.latestDate;
          curDatasetDates.lastUpdated = curDatasetObj.lastUpdated;
        }

        const updatedDates = this._collectDates(indexedApiData, curDatasetDates);
        if (updatedDates) {
          hasDatesUpdated = true;
        obj[dataset.dataset_id] = {
          datasetId: dataset.dataset_id,
          apis: indexedApiData,
          ...updatedDates
        };
        }
        return obj;
      }, {});

      // If no date changes are observed in the summary metadata call,
      // then don't trigger any unnecessary reassignments or events.
      if (hasDatesUpdated) {
        if (this._summaryData === undefined) {
          this._summaryData = {};
        }
        // Object.assign() to overwrite any updated dataset objects and to retain all others
        Object.assign(this._summaryData, summaryData);
        this._summaryUpdated.next(this._summaryData);
      }
    });
  }

  private _indexApiData(apis: ISummaryDatasetAPIData[]): Record<number, ISummaryDatasetAPIData> {
    const output: Record<number, ISummaryDatasetAPIData> = {};

    apis.forEach((api: ISummaryDatasetAPIData) => {
      output[api.api_id] = api;
      output[api.api_id] = {
        ...api,
        earliest_date: parseISO(`${api.earliest_date}`),
        latest_date: parseISO(`${api.latest_date}`),
        last_updated: parseISO(`${api.last_updated}`)
      };
    });

    return output;
  }

  private _collectDates(indexedApiData: Record<number, ISummaryDatasetAPIData>,
                        curDatasetDates = JSON.parse(JSON.stringify(this.SUMMARY_DATES)))
    : IDatasetDates | null {

    const output: IDatasetDates = {
      earliestDate: curDatasetDates.earliestDate,
      latestDate: curDatasetDates.latestDate,
      lastUpdated: curDatasetDates.lastUpdated
    };
    // Keep track of whether the dates have updated or not.
    let haveDatesUpdated = false;

    Object.keys(indexedApiData).forEach((key: string) => {
      const api = indexedApiData[key];
      if (isBefore(api.earliest_date, output.earliestDate)) {
        haveDatesUpdated = true;
        output.earliestDate = api.earliest_date;
      }
      if (isAfter(api.latest_date, output.latestDate)) {
        haveDatesUpdated = true;
        output.latestDate = api.latest_date;
      }
      if (isAfter(api.last_updated, output.lastUpdated)) {
        haveDatesUpdated = true;
        output.lastUpdated = api.last_updated;
      }
    });

    // If nothing has changed from the summary metadata call,
    // then don't trigger any further actions or changes.
    if(!haveDatesUpdated){
      return null;
    }

    return output;
  }

  /**
   * Fetch from the metadata summary endpoint
   */
  private _fetchMetadataSummary(): Promise<ISummaryDatasetDataJson[]> {
    return basicFetch(`${API_BASE_URL}${this.METADATA_SUMMARY_URL}`);
  }

  /**
   * Fetch published reports for provided dataset
   * @param datasetId
   * @private
   */
  private _fetchPublishedReportsForDataset(datasetId: string): Promise<IPublishedReportDataJson[]> {
    if (!datasetId || datasetId === '') {
      console.warn('Dataset ID is required to fetch reports.');
      return;
    }

    return basicFetch(
      `${API_BASE_URL}${this.PUBLISHED_REPORT_URL}?dataset_id=${datasetId}`
    );
  }
}

// eslint-disable-next-line prefer-const
export let metadataService = new MetadataService();
