import {IAnalyticsEvents} from "../../models/IAnalyticsEvents";
import Analytics from '../../utils/analytics/analytics';
import configStore from "./redux/config/config";

/**
 *
 * @type {*[]} - An array of dates to track and update if a dataset's API/data table sees
 * updates in the summary metadata API when compared to the build-time metadata.
 */
export const trackedDatesArr = [
  {
    queriedField: 'latestDate',
    summaryAPIField: 'latest_date',
    maxDate: '',
    isUpdated: false
  },
  {
    queriedField: 'lastUpdated',
    summaryAPIField: 'last_updated',
    maxDate: '',
    isUpdated: false
  }
];

export const analyticsCategory = 'Data Download'; // Can be made into a key-value pair object if
//  more events are needed.

/**
 * Generates the desired fields for the analytics event when interacting with various elements
 * @param label {string} - Use for both the action and label field, unless _action is specified
 * @param _action {string} - Allows for a unique action field on the analytics event.
 */
export const getAnalyticsFields = (label : string, _action? : string): IAnalyticsEvents => {
  const analyticsFields: IAnalyticsEvents = {
    action: '',
    category: '',
    label: '',
  };

  if (!label) {
    return analyticsFields;
  }

  analyticsFields.category = analyticsCategory;
  analyticsFields.action = _action || `${label} Click`;
  analyticsFields.label = label;
  return analyticsFields;
};

/**
 * Nearly all of the analytics events surrounding the data downloads follow the same pattern,
 * where the category is the same across all, and the action and label fields are the same with
 * the additional word 'Click' at the end of the action field.
 * @param label {string} - Use for both the action and label field, unless _action is specified
 * @param _action {string} - Allows for a unique action field on the analytics event.
 */
export const generateAnalyticsEvent
  = (label: string, _action? : string): IAnalyticsEvents | null => {
  if (!label) {
    return null; // No need to console this out as we won't see a ga "collect"
    // event called in the network activity
  }

  const analyticsFields = getAnalyticsFields(label, _action);
  // Don't fire event if the analytics event isn't built correctly.
  if (analyticsFields.category) {
    Analytics.event(analyticsFields);
  }
};

/**
 *
 * @param summaryDataset {object} - The dataset detail page queries the current dataset from the
 * list of datasets returned from the summary metadata API.
 * @param apis {array} - The APIs (data tables) available on the dataset coming from the build-time
 * metadata call.
 * @param pageContextDataset {object} - The techSpecs of the dataset captured at build-time
 * @returns requiredUpdate {boolean} - Indicates if the pageContext config needs to be updated.
 */
export const updateDates = (
  summaryDataset: Record<string, unknown | Array<unknown>>,
  apis: Record<string, unknown>,
  pageContextDataset: Record<string, unknown | unknown[]>): boolean => {
  let requiresUpdate = false;
  const trackedDates = JSON.parse(JSON.stringify((trackedDatesArr)));

  if (!summaryDataset || !summaryDataset.apis || !apis || !pageContextDataset) {
    console.warn('updateDates called with improper params');
    return requiresUpdate;
  }

  for (let i = trackedDates.length; i--;) {
    const curDateField = trackedDates[i];
    const queriedField = curDateField.queriedField;
    if (pageContextDataset[queriedField]) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const [month, day, year] = pageContextDataset[queriedField].split('/');
      curDateField.maxDate = `${year}-${month}-${day}`;
    }
  }

  // Loop through all of the apis in the summary metadata API.
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  summaryDataset.apis.forEach(api => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const metadataAPI = apis.find(curAPI => curAPI.apiId === api.api_id);
    if (metadataAPI) {
      // Check all of the "tracked" dates between the cached metadata fields and the summary
      // metadata values
      for (let i = trackedDates.length; i--;) {
        const curDateField = trackedDates[i];
        const queriedField = curDateField.queriedField;
        const summaryField = curDateField.summaryAPIField;
        const apiDate = api[summaryField];

        // Check to see if the date values on the api have been updated since the site last built.
        if (metadataAPI[queriedField] < apiDate) {
          requiresUpdate = true;
          metadataAPI[queriedField] = apiDate;

          // Check to see if the new date that came in exceeds that on the entire dataset.
          if (curDateField.maxDate < apiDate) {
            curDateField.isUpdated = true;
            curDateField.maxDate = apiDate;
          }
        }
      }
    }
  });

  for (let i = trackedDates.length; i--;) {
    const curDateField = trackedDates[i];
    if (curDateField.isUpdated) {
      const [year, month, day] = curDateField.maxDate.split('-');
      pageContextDataset[curDateField.queriedField] = `${month}/${day}/${year}`;
    }
  }

  return requiresUpdate;
};

export const mockMaxDates = {
  lastUpdated: '2025-01-01',
  lastUpdatedTechSpecs: '01/01/2025',
  latestDate: '2022-01-01',
  latestDateTechSpecs: '01/01/2022'
};

export const mockSummaryDataset = {
  dataset_id: '111',
  apis: [
    {
      api_id: '1',
      last_updated: mockMaxDates.lastUpdated,
      latest_date: '2021-11-30'
    },
    {
      api_id: '2',
      last_updated: '2022-01-01',
      latest_date: mockMaxDates.latestDate
    },
    {
      api_id: '3',
      last_updated: '',
      latest_date: ''
    }
  ]
};

// The following uses the same setup and dates and the mockAPIs below. Only the field names
// differ because of the real-life setup.
export const mockSummaryDatasetNoUpdates = {
  apis: [{
    api_id: '1',
    last_updated: '2022-01-01',
    latest_date: '2022-01-01'
  },
  {
    api_id: '2',
    last_updated: '2022-01-01',
    latest_date: '2022-01-01'
  },
  {
    api_id: '3',
    last_updated: '2022-01-01',
    latest_date: '2022-01-01'
  }]
};

export const mockAPIs = [
  {
    apiId: '1',
    lastUpdated: '2022-01-01',
    latestDate: '2022-01-01'
  },
  {
    apiId: '2',
    lastUpdated: '2022-01-01',
    latestDate: '2022-01-01'
  },
  {
    apiId: '3',
    lastUpdated: '2022-01-01',
    latestDate: '2022-01-01'
  }
];

export const mockTechSpecs = {
  lastUpdated: '01/01/2022',
  latestDate: '01/01/2022'
};

export const dummyConfig = {
  slug: '/dummy',
  datasetId: '1',
  apis: [],
  publishedReports: [],
  techSpecs: {
    earliest_date: '2000-01-01',
    latest_date: '2022-01-01'
  }
}

export const updateConfig = (newConfig) => {
  configStore.dispatch({
    type: 'config',
    value: newConfig
  });
}
