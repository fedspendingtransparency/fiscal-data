import { metadataService } from './metadata-service';
import { IDatasetTechSpecs } from '../../models/IDatasetTechSpecs';
import { ISummaryDatasetData } from '../../models/ISummaryDatasetData';
import { useEffect, useState } from 'react';
import { Subscription } from 'rxjs';
import { ISummaryData } from '../../models/ISummaryData';
import { take } from 'rxjs/operators';
import { IPublishedReportDataJson } from '../../models/IPublishedReportDataJson';
import { IDatasetApi } from '../../models/IDatasetApi';
import { IDatasetConfig } from '../../models/IDatasetConfig';
import { isAfter, isSameDay, lightFormat, startOfDay, subDays, subYears } from 'date-fns';
import globalConstants from '../constants';

const UI_DATE: string = globalConstants.config.formats.uiDate;

const today = startOfDay(new Date());
/**
 *
 * @param context - Datasets or a single dataset's page context
 */
export const useMetadataUpdater = (context: Record<string, unknown | IDatasetConfig> | IDatasetConfig[]) => {
  let updateSub: Subscription;
  const [summaryData, setSummaryData] = useState<ISummaryData>();
  const [output, setOutput] = useState(context);

  useEffect(() => {
    if (!summaryData) return;

    if (isDatasetPageContext(context)) {
      processDatasetPageContext(context as Record<string, unknown | IDatasetConfig>, summaryData).then(fullyUpdatedContext => {
        setOutput(fullyUpdatedContext);
      });
    } else {
      setOutput(processDatasetsData(context as IDatasetConfig[], summaryData));
    }
  }, [summaryData]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    updateSub = metadataService.summaryUpdated().subscribe((sumData: ISummaryData) => {
      setSummaryData(sumData);
    });
    return () => {
      if (updateSub && !updateSub.closed) {
        updateSub.unsubscribe();
      }
    };
  }, []);

  return output;
};

const isDatasetPageContext = (context: unknown): boolean => {
  return context.hasOwnProperty('config');
};

const processDatasetPageContext = async (
  datasetPageContext: Record<string, unknown | IDatasetConfig>,
  summaryData: ISummaryData
): Promise<Record<string, unknown>> => {
  const updatedDatasetConfig: IDatasetConfig = datasetPageContext['config'] as IDatasetConfig;

  updatedDatasetConfig['apis'] = updateDatasetApiData(updatedDatasetConfig['apis'], summaryData[updatedDatasetConfig.datasetId]);

  updatedDatasetConfig['techSpecs'] = generateTechSpecs(updatedDatasetConfig['techSpecs'], summaryData[updatedDatasetConfig.datasetId]);
  const updatedWithPublishedReports = await updatePublishedReports(updatedDatasetConfig);

  return {
    ...datasetPageContext,
    config: updatedWithPublishedReports,
  };
};

const updateDatasetApiData = (datasetConfigAPIs: IDatasetApi[], summaryData: ISummaryDatasetData): IDatasetApi[] => {
  const updatedAPIsData: IDatasetApi[] = [];

  datasetConfigAPIs.forEach((api: IDatasetApi) => {
    updatedAPIsData[updatedAPIsData.length] = {
      ...api,
      earliestDate: lightFormat(summaryData.apis[api.apiId].earliest_date, UI_DATE),
      latestDate: lightFormat(summaryData.apis[api.apiId].latest_date, UI_DATE),
      lastUpdated: lightFormat(summaryData.apis[api.apiId].last_updated, UI_DATE),
    };
  });

  return updatedAPIsData;
};

const processDatasetsData = (datasetsData: IDatasetConfig[], summaryData: ISummaryData): IDatasetConfig[] => {
  const datasets: IDatasetConfig[] = [];

  datasetsData.forEach((dataset: IDatasetConfig, index: number, arr: IDatasetConfig[]) => {
    const datasetId: string = dataset['datasetId'];
    if (summaryData[datasetId]) {
      datasets[index] = {
        ...dataset,
        techSpecs: generateTechSpecs(arr[index]['techSpecs'], summaryData[datasetId]),
      };

      // datasets may not have filters (related datasets on detail page)
      if (arr[index]['filters']) {
        datasets[index]['filters'] = updateDatasetFilters(arr[index]['filters'], summaryData[datasetId].lastUpdated);
      }
    }
  });

  return datasets;
};

const updateDatasetFilters = (currentFilters: string[], updatedLastUpdatedDate: Date): string[] => {
  let output: string[] = [...currentFilters];
  const filtersToRemove: string[] = [];

  filtersToUpdate.forEach(filter => {
    const isActiveFilter = filter.test(updatedLastUpdatedDate);
    const indexOfFilterToUpdate = output.indexOf(filter.id);

    if (isActiveFilter && indexOfFilterToUpdate < 0) {
      output[output.length] = filter.id;
    } else if (!isActiveFilter && indexOfFilterToUpdate > -1) {
      filtersToRemove[filtersToRemove.length] = output[indexOfFilterToUpdate];
    }
  });

  if (filtersToRemove.length > 0) {
    output = output.filter((filter: string) => {
      return filtersToRemove.indexOf(filter) < 0;
    });
  }

  return output;
};

const lastUpdatedHelper = (lastUpdated: Date, dateToCompare: Date) => {
  return isAfter(lastUpdated, dateToCompare) || isSameDay(lastUpdated, dateToCompare);
};

const filtersToUpdate = [
  {
    id: 'lastYear',
    test: (lastUpdatedDate: Date) => {
      const aYearAgo = subYears(today, 1);
      return lastUpdatedHelper(lastUpdatedDate, aYearAgo);
    },
  },
  {
    id: 'ninetyDays',
    test: (lastUpdatedDate: Date) => {
      const ninetyDaysAgo = subDays(today, 90);
      return lastUpdatedHelper(lastUpdatedDate, ninetyDaysAgo);
    },
  },
  {
    id: 'thirtyDays',
    test: (lastUpdatedDate: Date) => {
      const thirtyDaysAgo = subDays(today, 30);
      return lastUpdatedHelper(lastUpdatedDate, thirtyDaysAgo);
    },
  },
  {
    id: 'sevenDays',
    test: (lastUpdatedDate: Date) => {
      const sevenDaysAgo = subDays(today, 7);
      return lastUpdatedHelper(lastUpdatedDate, sevenDaysAgo);
    },
  },
  {
    id: 'oneDay',
    test: (lastUpdatedDate: Date) => {
      const yesterday = subDays(today, 1);
      return lastUpdatedHelper(lastUpdatedDate, yesterday);
    },
  },
];

const generateTechSpecs = (currentTechSpecs: IDatasetTechSpecs, updatedSummaryData: ISummaryDatasetData): IDatasetTechSpecs => {
  return {
    ...currentTechSpecs,
    latestDate: lightFormat(updatedSummaryData.latestDate, UI_DATE),
    earliestDate: lightFormat(updatedSummaryData.earliestDate, UI_DATE),
    lastUpdated: lightFormat(updatedSummaryData.lastUpdated, UI_DATE),
  };
};

const updatePublishedReports = async (datasetConfig: IDatasetConfig): Promise<IDatasetConfig> => {
  return new Promise<IDatasetConfig>(resolve => {
    metadataService
      .updatedPublishedReports(datasetConfig['datasetId'])
      .pipe(take(1))
      .subscribe({
        next: (updatedReports: IPublishedReportDataJson[] | null) => {
          datasetConfig['publishedReports'] = updatedReports;
          resolve(datasetConfig);
        },
        error: () => {
          // quietly pass through in the event there's an error. The service
          // puts something in the console.
          resolve(datasetConfig);
        },
      });
  });
};
