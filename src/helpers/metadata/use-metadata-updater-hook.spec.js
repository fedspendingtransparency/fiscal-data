import { renderHook } from '@testing-library/react-hooks';
import { useMetadataUpdater } from './use-metadata-updater-hook';
import { mockPublishedReportsFormattedData, mockSummaryFormattedData } from './metadata.mockdata';
import { ReplaySubject } from 'rxjs';
import { mockDatasets, mockUpdatedMetadataDatasets } from '../../components/datasets/mockData/mockDatasets';
import { datasetPageSampleConfig } from '../../layouts/dataset-detail/dataset-detail.spec';
import { testVariables } from '../../utils/mock-utils';
import { format } from 'date-fns';

const mockSummaryUpdated = new ReplaySubject(1);
const mockPublishedReports = new ReplaySubject(1);

jest.mock('./metadata-service', () => {
  return {
    metadataService: {
      summaryUpdated: jest.fn().mockImplementation(() => mockSummaryUpdated),
      updatedPublishedReports: jest.fn().mockImplementation(datasetId => mockPublishedReports),
    },
  };
});

describe('useMetadataUpdaterHook', () => {
  beforeEach(() => {});

  it('passes through context unchanged if there is no updated summary data', () => {
    const testContext = { test: 'test' };
    mockSummaryUpdated.next(null);
    const { result } = renderHook(() => useMetadataUpdater(testContext));
    expect(result.current).toStrictEqual(testContext);
  });

  it('updates datasets when passed into context', () => {
    const testContext = mockDatasets;

    const expected = [
      {
        ...mockDatasets[0],
        filters: ['startDateRangeThree', 'csv', 'lastYear', 'ninetyDays'],
        techSpecs: mockUpdatedMetadataDatasets[0].techSpecs,
      },
      {
        ...mockDatasets[1],
        techSpecs: mockUpdatedMetadataDatasets[1].techSpecs,
      },
      {
        ...mockDatasets[2],
        techSpecs: mockUpdatedMetadataDatasets[2].techSpecs,
      },
    ];
    mockSummaryUpdated.next(mockSummaryFormattedData);
    const { result } = renderHook(() => useMetadataUpdater(testContext));
    expect(result.current).toStrictEqual(expected);
  });

  it('updates dataset config when passed into context', () => {
    const testContext = { config: datasetPageSampleConfig };
    mockSummaryUpdated.next(mockSummaryFormattedData);
    const { result } = renderHook(() => useMetadataUpdater(testContext));
    expect(result.current).toStrictEqual(testContext);
  });

  it('updates published reports when passed into context', () => {
    const testContext = { config: datasetPageSampleConfig };
    const expectedContext = {
      config: {
        ...testContext.config,
        publishedReports: mockPublishedReportsFormattedData,
        techSpecs: {
          earliestDate: '01/01/1950',
          fileFormat: 'JSON, CSV, XML',
          lastUpdated: format(testVariables.dates.withinNinetyDays_Updated, 'MM/dd/yyyy'),
          latestDate: format(testVariables.dates.withinNinetyDays, 'MM/dd/yyyy'),
          updateFrequency: 'Updated Monthly',
        },
      },
    };
    mockSummaryUpdated.next(mockSummaryFormattedData);
    mockPublishedReports.next(mockPublishedReportsFormattedData);
    const { result } = renderHook(() => useMetadataUpdater(testContext));

    expect(result.current).toStrictEqual(expectedContext);
  });
});
