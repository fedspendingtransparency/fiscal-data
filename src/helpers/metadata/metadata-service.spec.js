import {setGlobalFetchResponse, testVariables} from "../../utils/mock-utils";
import "@rxreact/jest-helpers";
import {
  mockPublishedReportsAPIResponse,
  mockSummaryFormattedData,
  mockSummaryFormattedDataWithMod
} from "./metadata.mockdata";
import globalConstants from "../constants";
import { API_BASE_URL } from "gatsby-env-variables";
import { shareReplay, tap, take } from "rxjs/operators";
import {
  metadataSummaryData,
  metadataSummaryDataWithMod
} from "../../components/datasets/mockData/mockDatasets";

jest.useFakeTimers();

describe('Metadata Service', () => {
  let metadataService, sub;

  const watchSignal = (o$) => {
    // Share so the signal records all values emitted.
    const hot$ = o$.pipe(shareReplay());

    // Subscribe to the signal so it starts emitting.
    sub = hot$.subscribe();

    // Return the hot signal for testing.
    return hot$;
  };

  beforeEach(() => {
    setGlobalFetchResponse(jest, metadataSummaryData);
    return import('./metadata-service').then((module) => {
      metadataService = module.metadataService;
    });
  });

  afterEach(() => {
    if (sub) sub.unsubscribe();
    jest.resetModules();
    jest.clearAllTimers();
    global.fetch.mockReset();
  });

  it('fetch is called once on initial import', () => {
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('summary data is formatted correctly', async () => {
    expect(metadataService.summaryData).toStrictEqual(mockSummaryFormattedData);
  });

  it('updates the summaryData if the new dates observed indicate an update', async() => {
    const hot$ = watchSignal(metadataService.summaryUpdated().pipe());
    await expect(hot$).toEmit();
  });

  it('does not update the summaryData if the new dates observed do not indicate an update',
    async() => {
    let counter = 0;
    const hot$ = watchSignal(metadataService.summaryUpdated().pipe(tap(() => counter++)));
    await expect(hot$).toEmit();
    expect(counter).toStrictEqual(1);
    jest.advanceTimersByTime(globalConstants.config.metadataUpdateService.pollingInterval + 1);
    expect(counter).toStrictEqual(1);
  });

  it('fetch is called every interval time', () => {
    const intervalTime = globalConstants.config
      .metadataUpdateService.pollingInterval;
    expect(global.fetch).toHaveBeenCalledTimes(1); // from initial call
    jest.advanceTimersByTime(intervalTime - 1000); // timer is at intervalTime - 1000
    expect(global.fetch).toHaveBeenCalledTimes(1); // shouldn't have called just yet

    jest.advanceTimersByTime(1005); // timer is at (intervalTime - 1000) + 1005ms
    expect(global.fetch).toHaveBeenCalledTimes(2); // should have made the first 'polled' call

    // timer is at (intervalTime - 1000) + 1005ms + intervalTime + 1
    jest.advanceTimersByTime(intervalTime + 1);
    expect(global.fetch).toHaveBeenCalledTimes(3); // should make a second call
  });

  it('when a change occurs all the changed dataset is updated and all datasets are returned',
    async () => {
    setGlobalFetchResponse(jest, metadataSummaryDataWithMod);
    const hot$ = watchSignal(metadataService.summaryUpdated().pipe());

    // start out with expected initial data
    expect(metadataService.summaryData).toStrictEqual(mockSummaryFormattedData);

    jest.advanceTimersByTime(globalConstants.config.metadataUpdateService.pollingInterval + 5);
    await expect(hot$).toEmit();

    // emitted value represents all datasets with the applicable changes
    expect(metadataService.summaryData).toStrictEqual(mockSummaryFormattedDataWithMod);
  });

  it('update published report returns null if dataset id not allowed', async () => {

    const hot$ = watchSignal(
      metadataService.updatedPublishedReports('test-dataset-id')
        .pipe(take(1))
    );

    await expect(hot$).toEmitValue(null);
  });

  it('fetches published reports for dataset when dataset is valid and is not cached', async () => {

    const datasetIdToTestWith= '015-BFS-2014Q1-11'; // chosen from published reports allow list
    const fetchUrl =
      `${API_BASE_URL}${globalConstants.PUBLISHED_REPORTS}?dataset_id=${datasetIdToTestWith}`;

    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockPublishedReportsAPIResponse),
      }));

    const hot$ = watchSignal(metadataService.updatedPublishedReports(datasetIdToTestWith).pipe());
    await expect(hot$).toEmit();

    const fetchCount = global.fetch.mock.calls.filter(call => call[0] === fetchUrl).length;

    expect(fetchCount).toBe(1);

  });

  it('uses cached published reports for dataset when data is not too old', async () => {

    const datasetIdToTestWith= '015-BFS-2014Q1-11'; // chosen from published reports allow list
    const fetchUrl =
      `${API_BASE_URL}${globalConstants.PUBLISHED_REPORTS}?dataset_id=${datasetIdToTestWith}`;

    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockPublishedReportsAPIResponse),
      }));

    const hot$ = watchSignal(metadataService.updatedPublishedReports(datasetIdToTestWith).pipe());

    await expect(global.fetch.mock.calls[0][0]).toStrictEqual(fetchUrl);
    await expect(hot$).toEmit();

    sub.unsubscribe();

    jest.advanceTimersByTime(80000);

    watchSignal(metadataService.updatedPublishedReports(datasetIdToTestWith).pipe());

    jest.advanceTimersByTime(8000);

    await expect(global.fetch.mock.calls.filter(call => call[0] === fetchUrl).length)
      .toBe(1); // not called again with a second request for data
  });

  it('fetches published reports for dataset when data is too old', async () => {

    const datasetIdToTestWith= '015-BFS-2014Q1-11'; // chosen from published reports allow list
    const fetchUrl =
      `${API_BASE_URL}${globalConstants.PUBLISHED_REPORTS}?dataset_id=${datasetIdToTestWith}`;

    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockPublishedReportsAPIResponse),
      }));

    const hot$ = watchSignal(metadataService.updatedPublishedReports(datasetIdToTestWith).pipe());

    await expect(global.fetch.mock.calls[0][0]).toStrictEqual(fetchUrl);
    await expect(hot$).toEmit();

    sub.unsubscribe();

    jest.advanceTimersByTime(80000);

    const hot2$ = watchSignal(metadataService.updatedPublishedReports(datasetIdToTestWith).pipe());
    await expect(hot2$).toEmit();

    expect(global.fetch.mock.calls.filter(call => call[0] === fetchUrl).length)
      .toBe(1); // not called again with a second request for data

    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockPublishedReportsAPIResponse),
      }));

    sub.unsubscribe();

    jest.advanceTimersByTime(300000); // 6 minutes

    const hot3$ = watchSignal(metadataService.updatedPublishedReports(datasetIdToTestWith));
    await expect(hot3$).toEmit();
    const callCount = global.fetch.mock.calls.filter(call => call[0] === fetchUrl).length;
    expect(callCount).toBe(1); // called again with a second request for data (fetch mock reset)
  });

});
