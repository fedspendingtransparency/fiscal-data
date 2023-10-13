import { updatePercentage, updateProgress } from './download-progress-helper';

describe('download progress helper', () => {
  const mockRequestTime = new Date('2021-08-09T10:01:18Z').valueOf();
  jest.spyOn(global.Date, 'now').mockImplementation(() => {
    return new Date(mockRequestTime + 50000);
  });

  it('exports a function that records a projected completion time in a download passed in', () => {
    const mockDownload = {
      requestTime: mockRequestTime,
      totalPages: 15,
      pagesProcessed: 4,
      selectedFileType: 'csv',
      apis: 'justOne',
      progressPct: 2,
    };

    updateProgress(mockDownload);
    expect(Math.round(mockDownload.estimatedFinishTime)).toStrictEqual(652298);
    expect(mockDownload.progressPct).toStrictEqual(8); // Math.round((50000 / 652298) * 100)

    // calculates the percentage differently for different file types
    mockDownload.selectedFileType = 'json';
    updateProgress(mockDownload);
    expect(Math.round(mockDownload.estimatedFinishTime)).toStrictEqual(612645);
    expect(mockDownload.progressPct).toStrictEqual(8); // Math.round((50000 / 612645) * 100)

    // calculates the percentage differently depending upon number of tables
    mockDownload.apis = ['mockApi', 'secondApi', 'third'];
    updateProgress(mockDownload);
    expect(Math.round(mockDownload.estimatedFinishTime)).toStrictEqual(457076);
    expect(mockDownload.progressPct).toStrictEqual(11); // Math.round((50000 / 457076) * 100)

    // adjust timing once all pages and tables are recorded as complete
    mockDownload.tablesCompleted = 3;
    mockDownload.pagesProcessed = 15;
    updateProgress(mockDownload);
    expect(Math.round(mockDownload.estimatedFinishTime)).toStrictEqual(70607);
    expect(mockDownload.progressPct).toStrictEqual(71); // Math.round((50000 / 70607) * 100)
  });

  it(`it updates the percentage (progressPct) when it should be increased and calls a function
    passed in with the new percentage`, () => {
    const mockPercentageUpdater = jest.fn();

    const mockDownload = {
      requestTime: mockRequestTime,
      totalPages: 15,
      pagesProcessed: 4,
      selectedFileType: 'csv',
      apis: 'mockApi',
      progressPct: 7,
      estimatedFinishTime: 250000,
    };
    expect(mockPercentageUpdater).toHaveBeenCalledTimes(0);
    updatePercentage(mockDownload, mockPercentageUpdater);
    expect(mockDownload.progressPct).toStrictEqual(20); // (50000 / 250000) * 100
    // since there was a change the callback is called with the value
    expect(mockPercentageUpdater).toHaveBeenCalledTimes(1);

    // it leaves the percentage (progressPct) unchanged if the latest calculation would otherwise
    // decrease it
    mockDownload.estimatedFinishTime = 750000;
    updatePercentage(mockDownload, mockPercentageUpdater);
    expect(mockDownload.progressPct).toStrictEqual(20); // (50000 / 250000) * 100
    // the callback should not have been called a second time
    expect(mockPercentageUpdater).toHaveBeenCalledTimes(1);
  });
});
