const { addDatasetToTopic, freshTopics } = require("./topics-config");

const camelcaseKeys = require('camelcase-keys');
const { addMissingPublishers } = require("./filters/filterDefinitions");
const DataTransform = require('node-json-transform').DataTransform;
const {getDateRange} = require('./dates');
const { getConfigByApiId } = require('./endpointConfig');
const { processFilters } = require('./filters/filterDefinitions');
const { largeDatasetThreshold } = require('../helpers/largeDatasetThreshold');
const matchedApiConfigs = [];

const {getPublishedReports} =
  require('../helpers/published-reports/published-reports');

const getPrettyNameForColumn = (fields, columnName, apiId) => {
  const field = fields.find(field => field.columnName === columnName);
  if (field) {
    return field.prettyName;
  } else {
    console.warn('No prettyName in metadata for API: ' + apiId + ' could be found' +
      'for dimension field:', columnName);
    return columnName;
  }
};

const sortApisByOrder = (a, b) => {
  return Number(a.apiSortOrderNbr) - Number(b.apiSortOrderNbr);
};

const sortFieldsByOrder = (a, b) => {
  return Number(a.sortOrderNbr) - Number(b.sortOrderNbr);
};

// Temporary setup for datasets with SEO approved metadata short descriptions and, in some cases,
// the dataset name.
const metadataSEOApprovedDS = [
  '015-BFS-2014Q3-074',
  '015-BFS-2014Q1-04',
  '015-BFS-2014Q3-xx',
  '015-BFS-2014Q1-14',
  '015-BFS-2014Q3-094',
  '015-BFS-2014Q3-080',
  '015-BFS-2014Q3-058',
  '015-BFS-2014Q1-07'
];

const transformMapper = (datasetIdMap,
                         endpointConfigIdMap, topics, filters, releaseCalendarEntries) => {
  return {
    item: {
      datasetId: 'datasetId',
      dataFormats: 'fileTypes',
      name: 'title',
      tagLine: 'shortDescription',
      publisher: 'publisher',
      publishedReports: 'publishedReports',
      publishedReportsTip: 'publishedReportsTip',
      summaryText: 'longDescription',
      dictionary: 'metadataComplete',
      notesAndKnownLimitations: 'notesAndKnownLimitations',
      slug: 'datasetPath',
      techSpecs: {
        updateFrequency: 'updateFrequency',
        fileFormat: ''
      },
      seoConfig: {
        pageTitle: 'title',
        description: 'shortDescription',
        keywords: ''
      },
      apis: 'apis'
    },
    operate: [
      {
        run: (val) => val ? '/' + val + '/' : undefined,
        on: 'slug'
      },
      {
        run: (val) => 'Updated ' + val,
        on: 'techSpecs.updateFrequency'
      },
      {
        run: () => 'JSON, CSV, XML',
        on: 'techSpecs.fileFormat'
      },
      {
        run: (val) => val ? val : '',
        on: 'publisher'
      }
    ],
    each: (dataset) => {
      const mappedDataset = datasetIdMap[dataset.datasetId];
      if (dataset.apis === []) {
        console.warn(`Dataset without endpoints IN METADATA found.
        DatasetId:${dataset.datasetId} "${dataset.name}"`);
      }
      dataset.apis.forEach(api => {
        const apiConfig = getConfigByApiId(api.apiId, endpointConfigIdMap);
        if (apiConfig) {
          Object.assign(api, apiConfig);
          matchedApiConfigs.push(api.apiId);
        } else {
          api.markedForDelete = true;
          console.warn(`API Id without corresponding static endpoint configuration found.
          API_ID: ${api.apiId}, DatasetId:${dataset.datasetId} "${dataset.name}"`);
        }
      });

      dataset.apis = dataset.apis.filter(api => !api.markedForDelete);
      if (dataset.apis.length === 0) {
        if (mappedDataset && mappedDataset.apiIds) {
          mappedDataset.apiIds.forEach(id => {
            const apiConfig = getConfigByApiId(id);
            if (apiConfig !== null) {
              dataset.apis.push(apiConfig);
            } else {
              console.warn(`API Id without corresponding endpoint found.
              API_ID: ${id},
              DatasetId:${dataset.datasetId} "${dataset.name}"`);
            }
          });
          if (!dataset.apis[0].tableName) {
            dataset.apis[0].tableName = dataset.name;
          }
        } else {
          console.warn(`Dataset without endpoints found. DatasetId:${dataset.datasetId}
          "${dataset.name}"`);
        }
      } else {
        dataset.apis.forEach(api => {
          if (Number(api.rowCount) > 5000 && Number(api.rowCount) < 8500) {
            console.info(`DatasetId:${dataset.datasetId} "${dataset.name}", API: ${api.apiId} has
            ${Number(api.rowCount)} rows`);
          }
          if (Number(api.rowCount) > largeDatasetThreshold) {
            api.isLargeDataset = true;
            const aggregateLargeDatasetPivot = true; // TODO: set by environmental variable

            if (aggregateLargeDatasetPivot) {
              // aggregate pivots for large datasets
              api.dataDisplays.forEach(dd => {
                if (!dd.chartType || dd.chartType !== 'none') {
                  dd.aggregateOn = [
                    {
                      field: 'record_calendar_year',
                      type: 'YEAR'
                    },
                    {
                      field: 'record_calendar_month',
                      type: 'MONTH'
                    }
                  ];
                }
              });
            }
          }
        });

        const apiDateRange = getDateRange(dataset.apis);
        dataset.techSpecs.latestDate = apiDateRange.latestDate;
        dataset.techSpecs.earliestDate = apiDateRange.earliestDate;
        dataset.techSpecs.lastUpdated = apiDateRange.lastUpdated;

      }

      dataset.apis.sort(sortApisByOrder);

      dataset.apis.forEach(api => {
        if (api.fields) {
          api.fields.sort(sortFieldsByOrder);
          api.dataDisplays.filter(disp => disp.dimensionField &&
            disp.dimensionField.length && disp.title === undefined)
          .forEach(disp => {
            disp.title = 'By ' + getPrettyNameForColumn(api.fields, disp.dimensionField, api.apiId);
          });
        }
        // convert tableName to kebab case
        api.pathName = api.tableName.toLocaleLowerCase().replace(/[^a-z0-9]+/g, '-')
          .replace(/-$/, ''); // remove any trailing hyphen
      });

      dataset.relatedDatasets = mappedDataset && mappedDataset.relatedDatasets
        ? mappedDataset.relatedDatasets : [];
      dataset.currentDateButton = mappedDataset && mappedDataset.currentDateButton
        ? mappedDataset.currentDateButton : null;
      dataset.dataStartYear = dataset.techSpecs.earliestDate ?
        dataset.techSpecs.earliestDate.substr(-4) : '1000';

      const seoConfig = determineSEO(dataset, mappedDataset);
      dataset.seoConfig = {
        pageTitle: seoConfig.pageTitle,
        description: seoConfig.description,
        // Keywords are not yet provided in the metadata (06/24/21)
        keywords: mappedDataset && mappedDataset.seoConfig ? mappedDataset.seoConfig.keywords : ''
      };

      dataset.relatedTopics = [];
      dataset.filterTopics = [];
      topics.forEach((topic) => {
        if (topic.datasetIds.includes(dataset.datasetId)) {
          dataset.relatedTopics.push(topic.label);
          dataset.filterTopics.push(topic.slug);
        }
        dataset.relatedTopics.sort();
      });

      processFilters(dataset, filters);

      // Add Upcoming dates to Release Calendar
      dataset.releases = [];
      if (releaseCalendarEntries && Array.isArray(releaseCalendarEntries)) {
        dataset.releases = releaseCalendarEntries
          .filter((rcEntry) => rcEntry.datasetId === dataset.datasetId);
        dataset.releases.sort((a, b) => {
          if (a.date > b.date) return 1;
          if (a.date < b.date) return -1;
          if (a.time > b.time) return 1;
          if (a.time < b.time) return -1;
          return 0;
        });
      }
    }
  };
};

const vetApiMetadataAgainstWhitelist = (whitelistMap, datasets, minimumDatasetCount) => {
  const vettedList = [];
  Object.keys(whitelistMap).forEach(whitelistId => {
    const matchedInMeta = datasets.find(ds => ds.datasetId === whitelistId);
    if (matchedInMeta) {
      vettedList.push(matchedInMeta);
    } else {
      // warn if the whitelisted dataset doesn't exist in the API Load
      console.warn(`Dataset ${whitelistId} is missing in metadata from API`);
    }
  });

  // Perform basic sanity check on dataset count before continuing
  if (vettedList.length < minimumDatasetCount) {
    throw Error(`ERROR: Can only confirm ${vettedList.length} datasets.
    At least ${minimumDatasetCount} are for required for a successful build`);
  }

  // make a note of non-whitelisted Datasets in the API response
  if (vettedList.length < datasets.length) {
    datasets.filter(ds => !vettedList.includes(ds)).forEach(ignored => {
      console.info(`NOTE: Api Metadata for Dataset "${ignored.title}" [${ignored.datasetId}]
      was not on the whitelist and is excluded from this build.`);
    });
  }
  return vettedList;
};

const extractPublishedReportsType = function(reports){
  if(!reports || !reports.length){
    return [];
  }

  const fileTypesSet = new Set();
  const fileTypesArr = [];

  reports.forEach(report => {
    const pathSplit = report.path.split('.');
    const fileType = pathSplit[pathSplit.length - 1].match(/[a-zA-Z]/gi)
      .join('').toUpperCase();
    fileTypesSet.add(fileType);
  });

  const keys = fileTypesSet.keys();
  let curKey = keys.next();
  while(!curKey.done){
    fileTypesArr.push(curKey.value);
    curKey = keys.next();
  }
  return fileTypesArr;
};

/**
 * Hard-coded source for published reports tips
 * @type {{"015-BFS-2014Q1-11": string}}
 */
const datasetPublishedReportsCustomSelectionTips = {
  '015-BFS-2014Q1-13': 'Monthly Treasury Statement reports dated before 1998 are grouped ' +
    'by year. Once inside the desired year, scroll to the specific month.',
  '015-BFS-2014Q1-03': 'Daily Treasury Statement reports dated before FY 1998 are grouped ' +
    'by fiscal year. Once inside the desired year, scroll to the specific month and day.'
};

const determineSEO = (dataset, mappedDataset) => {
  const seoConfig = {
    pageTitle: '',
    description: '',
    keywords: ''
  };
  const mappedSeoConfig = (mappedDataset && mappedDataset.seoConfig) ?
    mappedDataset.seoConfig :
    JSON.parse(JSON.stringify(seoConfig));

  if(metadataSEOApprovedDS.some(id => dataset.datasetId === id)){
    // Some of the metadata fields are not SEO approved, so check to see if we set the values
    // ourselves before applying the values from the metadata.
    seoConfig.pageTitle = mappedSeoConfig.pageTitle || dataset.seoConfig.pageTitle || '';
    seoConfig.description = mappedSeoConfig.description || dataset.seoConfig.description || '';
  } else {
    seoConfig.pageTitle = mappedSeoConfig.pageTitle || '';
    seoConfig.description = mappedSeoConfig.description || '';
  }

  return seoConfig;
};

/**
 * Resolves datasetId to a published reports tip
 * @param datasetId
 * @returns {null|*}
 */
const addPublishedReportsTip = (datasetId) => {
  if (!datasetPublishedReportsCustomSelectionTips[datasetId]) return null;
  return datasetPublishedReportsCustomSelectionTips[datasetId];
};

const reciprocateRelationships = (datasetIdMap) => {
  const relationshipSetsById = {};

  Object.entries(datasetIdMap).forEach(([dsId, {relatedDatasets}]) => {
    if (relatedDatasets) {
      relatedDatasets.forEach(relatedId => {

        // add the relationship to the deduped set for this dataset
        if (!relationshipSetsById[dsId]) {
          relationshipSetsById[dsId] = new Set();
        }
        relationshipSetsById[dsId].add(relatedId);

        // add this dataset Id to the deduped set for the related dataset
        if (!relationshipSetsById[relatedId]) {
          relationshipSetsById[relatedId] = new Set();
        }
        relationshipSetsById[relatedId].add(dsId);
      });
    }
  });

  // replace each dataset's original related Datasets list
  Object.entries(relationshipSetsById).forEach(([dsId, relatedSet]) => {
    datasetIdMap[dsId].relatedDatasets = Array.from(relatedSet);
  });
};

const addDatasetsToTopics = (datasetIdMap) => {
  Object.entries(datasetIdMap).forEach(([datasetId, dataset]) => {
    dataset.topics.forEach((dsTopic) => addDatasetToTopic(dsTopic, datasetId));
  });
};

// exported for unit-tests
exports.transformMapper = transformMapper;
exports.vetApiMetadataAgainstWhitelist = vetApiMetadataAgainstWhitelist;
exports.sortApisByOrder = sortApisByOrder;
exports.sortFieldsByOrder = sortFieldsByOrder;
exports.extractPublishedReportsType = extractPublishedReportsType;
exports.metadataSEOApprovedDS = metadataSEOApprovedDS;
exports.determineSEO = determineSEO;
exports.reciprocateRelationships = reciprocateRelationships;

exports.metadataTransform = async function(metadataObjectsFromApi,
                                           datasetIdMap,
                                           endpointConfigIdMap,
                                           releaseCalendarEntries,
                                           API_BASE_URL,
                                           fetch,
                                           minimumDatasetCount) {
  reciprocateRelationships(datasetIdMap);
  addDatasetsToTopics(datasetIdMap);

  const metadataObjects = camelcaseKeys(metadataObjectsFromApi, { deep: true });
  const vettedDatasets =
    vetApiMetadataAgainstWhitelist(datasetIdMap, metadataObjects, minimumDatasetCount);
  console.info('EXCLUDED FOR LACK OF APIS:', vettedDatasets
    .filter(dataset => !dataset.apis.length).map(ds => ds.title));
  const thinnedDatasets = vettedDatasets.filter(dataset => dataset.apis.length);
  const filters = await addMissingPublishers(thinnedDatasets);

  for (const d in thinnedDatasets) {
    const dataset = thinnedDatasets[d];
    const publishedReports = await getPublishedReports(dataset.datasetId,
      API_BASE_URL, fetch);
    dataset.hasPublishedReports = !!publishedReports;
    dataset.publishedReports = publishedReports || [];
    dataset.fileTypes = extractPublishedReportsType(publishedReports);
    dataset.publishedReportsTip = addPublishedReportsTip(dataset.datasetId);
  }

  const transformer = DataTransform(thinnedDatasets,
    transformMapper(datasetIdMap, endpointConfigIdMap,
      freshTopics(), filters, releaseCalendarEntries));
  const transformed = await transformer.transform();

  Object.keys(endpointConfigIdMap).forEach(staticId => {
    if (matchedApiConfigs.indexOf(Number(staticId)) === -1) {
      console.warn(`Statically defined api_id:
      ${staticId}
      (${endpointConfigIdMap[staticId].endpoint}) not matched by any entry in metadata download`);
    }
  });
  return transformed;
};
