const { freshTopics } = require('./src/transform/topics-config');
const { freshExplainerPages } = require('./src/transform/explainer-pages-config');
const { freshInsightPages } = require('./src/transform/insight-pages-config');
const { getEndpointConfigsById } = require('./src/transform/endpointConfig');
const { sortPublishers } = require('./src/transform/filters/filterDefinitions');
let { filters } = require('./src/transform/filters/filterDefinitions');
const fs = require('fs');

// TODO:  remove preprod holdover and give all environments and env config filename that directly
//  matches the build-time process.env.BUILD_ENV
const varToEnvironmentConfig = {
  preprod: 'qat',
  qat: 'qat',
  uat: 'uat',
  dev: 'dev',
  stg: 'stg',
  prod: 'prod',
};

const MINIMUM_DATASETS_FOR_BUILD = 20;
const activeEnv = varToEnvironmentConfig[process.env.BUILD_ENV] || 'index';
const {
  ENV_ID,
  API_BASE_URL,
  ADDITIONAL_DATASETS,
  ADDITIONAL_ENDPOINTS,
  EXCLUDED_ENDPOINT_IDS,
  AUTHENTICATE_API,
  USE_MOCK_RELEASE_CALENDAR_DATA_ON_API_FAIL,
} = require(`./env/${activeEnv}.js`);
console.info(`Using environment config: '${ENV_ID}'`);

const apiKey = AUTHENTICATE_API ? process.env.GATSBY_API_KEY : false;
const path = require(`path`);
const metadataTransform = require('./src/transform/metadata-transform').metadataTransform;
const fetchUtil = require('make-fetch-happen');
const authenticatingFetch = require('./src/utils/authenticating-fetch/authenticating-fetch');
const fetch = apiKey ? authenticatingFetch(apiKey, fetchUtil) : fetchUtil;

const datasetIdMap = require('./src/transform/static-metadata/datasets.json');
// this is temporary until the API is available. This will need to be replaced
// with an API call similar to what is in getMetaData below
const releaseCalendarMockData = require('./src/testData/release-calendar.mock.data.json').data;

exports.sourceNodes = async ({ actions, createNodeId, createContentDigest }) => {
  const { createNode } = actions;
  const releaseCalendarUrl = `${API_BASE_URL}/services/calendar/release`;
  const metadataUrl = `${API_BASE_URL}/services/dtg/metadata/`;

  console.info(`Loading metadata from ${metadataUrl} ` + `with${apiKey ? '' : 'out'} authentication.`);
  console.info(`Loading release calendar from ${releaseCalendarUrl} ` + `with${apiKey ? '' : 'out'} authentication.`);

  if (ENV_ID !== 'production') {
    console.info('App is including datasets whitelisted for lower environments');
    if (ADDITIONAL_DATASETS && Object.keys(ADDITIONAL_DATASETS).length) {
      Object.assign(datasetIdMap, ADDITIONAL_DATASETS);
      console.info(
        'Adding Datasets: ',
        Object.entries(ADDITIONAL_DATASETS).map(([dsId, ds]) => `${dsId}: ${ds.seoConfig.pageTitle}`)
      );
    }
  } else {
    console.info('App is including only datasets whitelisted for production environments');
  }

  let numMetaDataCalls = 0;
  let numRelCalendarCalls = 0;
  let numBLSAPICalls = 0;
  let numBEAAPICalls = 0;
  let numTRREAPICalls = 0;

  const getReleaseCalendarData = async () => {
    const rejectOrMockOutput = (error, resolve, reject) => {
      if (USE_MOCK_RELEASE_CALENDAR_DATA_ON_API_FAIL) {
        error !== null
          ? console.info('Reject received, but resolving with mock release calendar data.')
          : console.info('API endpoint unavailable for Release Calendar, using mock data.');
        resolve(releaseCalendarMockData);
      } else {
        error !== null
          ? console.warn('Reject received, rejecting with error.')
          : console.warn('API endpoint unavailable for Release Calender, not configured to allow mock data.');
        reject(error);
      }
    };

    const generateSortKey = entry => `${entry.date}_${entry.time}`;

    return new Promise((resolve, reject) => {
      try {
        fetch(releaseCalendarUrl)
          .then(async res => {
            if (res.status === 404) {
              rejectOrMockOutput(null, resolve, reject);
            } else {
              const rcEntries = await res.json();

              rcEntries.sort((a, b) => {
                const aKey = generateSortKey(a);
                const bKey = generateSortKey(b);

                if (aKey > bKey) return 1;
                else if (aKey < bKey) return -1;
                else return 0;
              });

              resolve(rcEntries);
            }
          })
          .catch(error => {
            console.info(
              `failed to get release calendar
              ${++numRelCalendarCalls} time(s), `,
              error
            );
            if (numRelCalendarCalls < 3) {
              getReleaseCalendarData();
            } else {
              rejectOrMockOutput(error, resolve, reject);
            }
          });
      } catch (e) {
        console.error('Error thrown while getting Release Calendar Data', e);
        rejectOrMockOutput(e, resolve, reject);
      }
    });
  };

  const getMetaData = async () => {
    return new Promise((resolve, reject) => {
      fetch(metadataUrl)
        .then(res => {
          resolve(res.json());
        })
        .catch(error => {
          console.error(`failed to get metadata ${++numMetaDataCalls} time(s), error:${error}`);
          if (numMetaDataCalls < 3) {
            getMetaData();
          } else {
            reject(error);
          }
        });
    });
  };

  const freshMetadata = await getMetaData()
    .then(res => res)
    .catch(error => {
      throw error;
    });
  const freshReleaseCalendarData = await getReleaseCalendarData()
    .then(res => res)
    .catch(error => {
      console.error('Error while getting Release Calendar Data', error);
    });

  const endpointConfigIdMap = getEndpointConfigsById(EXCLUDED_ENDPOINT_IDS, ADDITIONAL_ENDPOINTS);
  const datasets = await metadataTransform(
    freshMetadata,
    datasetIdMap,
    endpointConfigIdMap,
    freshReleaseCalendarData,
    API_BASE_URL,
    fetch,
    MINIMUM_DATASETS_FOR_BUILD
  );
  console.info(`Retrieved data for a total of: ${datasets.length} datasets`);
  filters = sortPublishers(filters);
  const topics = freshTopics();
  const explainerPages = freshExplainerPages();
  const insightPages = freshInsightPages();

  const getDatasetConfig = dataset => {
    const allColumnNames = [];
    const allPrettyNames = [];
    if (dataset.apis.length > 0) {
      dataset.apis.forEach(api => {
        if (api.fields && api.fields.length) {
          api.fields.forEach(e => {
            allColumnNames.push(e.columnName);
            allPrettyNames.push(e.prettyName);
          });
        }
      });
    }
    const releaseCalendarData = freshReleaseCalendarData;
    const sortedRes = releaseCalendarData.filter(rcDataset => rcDataset.datasetId === dataset.datasetId && rcDataset.released === 'false');
    return {
      ...dataset,
      dateExpected: sortedRes[0]?.date,
      timeExpected: sortedRes[0]?.time,
      allColumnNames: allColumnNames,
      allPrettyNames: allPrettyNames,
    };
  };

  for (const dataset of datasets) {
    dataset.id = createNodeId(dataset.datasetId);
    const datasetConfig = getDatasetConfig(dataset);
    const node = {
      ...datasetConfig,
      parent: null,
      children: [],
      internal: {
        type: `Datasets`,
      },
    };
    node.internal.contentDigest = createContentDigest(node);
    createNode(node);
  }

  topics.forEach(topic => {
    topic.id = createNodeId(topic.slug);
    const node = {
      ...topic,
      parent: null,
      children: [],
      internal: {
        type: `Topics`,
      },
    };
    node.internal.contentDigest = createContentDigest(node);
    createNode(node);
  });

  freshReleaseCalendarData.forEach(rcEntry => {
    rcEntry.time = rcEntry.time.replace(/:/g, '');
    rcEntry.id = createNodeId(`${rcEntry.datasetId}-${rcEntry.date}-${rcEntry.time}`);
    const node = {
      ...rcEntry,
      parent: createNodeId(rcEntry.datasetId),
      children: [],
      internal: {
        type: 'Releases',
      },
    };
    node.internal.contentDigest = createContentDigest(node);
    createNode(node);
  });

  explainerPages.forEach(explainerPage => {
    explainerPage.id = createNodeId(explainerPage.slug);
    const node = {
      ...explainerPage,
      parent: null,
      children: [],
      internal: {
        type: `Explainers`,
      },
    };
    node.internal.contentDigest = createContentDigest(node);
    createNode(node);
  });

  insightPages.forEach(insightPage => {
    insightPage.id = createNodeId(insightPage.slug);
    const node = {
      ...insightPage,
      parent: null,
      children: [],
      internal: {
        type: `Insights`,
      },
    };
    node.internal.contentDigest = createContentDigest(node);
    createNode(node);
  });

  const trreApiUrl =
    API_BASE_URL +
    '/services/api/fiscal_service/v1/accounting/od/rates_of_exchange?filter=record_date:gte:2018-01-01&sort=currency,-effective_date&page[size]=10000';

  const getExchangeRatesData = async () => {
    return new Promise((resolve, reject) => {
      fetch(trreApiUrl)
        .then(res => {
          resolve(res.json());
        })
        .catch(error => {
          console.error(`failed to get TRRE API data ${++numTRREAPICalls} time(s), error:${error}`);
          if (numTRREAPICalls < 3) {
            getExchangeRatesData();
          } else {
            reject(error);
          }
          console.error(error);
        });
    });
  };

  const exchangeRatesResults = await getExchangeRatesData()
    .then(res => res)
    .catch(error => {
      throw error;
    });

  exchangeRatesResults.data.forEach(x => {
    x.id = createNodeId(x.effective_date + x.country_currency_desc);
    const node = {
      ...x,
      record_date: x.record_date,
      country_currency_desc: x.country_currency_desc,
      exchange_rate: x.exchange_rate,
      effective_date: x.effective_date,
      record_calendar_quarter: x.record_calendar_quarter,
      parent: null,
      children: [],
      internal: {
        type: `exchangeRatesData`,
      },
    };
    node.internal.contentDigest = createContentDigest(node);
    createNode(node);
  });

  const blsPublicApiUrl = `https://api.bls.gov/publicAPI/v2/timeseries/data/CUUR0000SA0?registrationkey=50b554ded02341bd895de05ff7b0495e`;
  const getBLSData = async () => {
    return new Promise((resolve, reject) => {
      fetch(blsPublicApiUrl)
        .then(res => {
          resolve(res.json());
        })
        .catch(error => {
          console.error(`failed to get BLS API data ${++numBLSAPICalls} time(s), error:${error}`);
          if (numBLSAPICalls < 3) {
            getBLSData();
          } else {
            reject(error);
          }
          console.error(error);
        });
    });
  };

  let resultDataBLS;
  let resultDataBEA;

  // This file can be used for any local testing, otherwise the fallback api response will include 10 years of data
  // fs.readFile('./static/data/CPI/bls-data-fallback.json', 'utf8', async (err, data) => {
  fs.readFile('./static/data/bls-data.json', 'utf8', async (err, data) => {
    if (err) {
      resultDataBLS = await getBLSData()
        .then(res => res)
        .catch(error => {
          throw error;
        });
      console.warn('USING BLS API RESPONSE');
    } else {
      resultDataBLS = JSON.parse(data);
    }
    resultDataBLS.Results.series[0].data.forEach(blsRow => {
      blsRow.id = createNodeId(blsRow.year + blsRow.period);
      const node = {
        ...blsRow,
        _12mo_percentage_change: blsRow['12mo_percentage_change'],
        parent: null,
        children: [],
        internal: {
          type: `BLSPublicAPIData`,
        },
      };
      node.internal.contentDigest = createContentDigest(node);
      createNode(node);
    });
  });

  const beaURL = `https://apps.bea.gov/api/data/?UserID=F9C35FFF-7425-45B0-B988-9F10E3263E9E&method=GETDATA&datasetname=NIPA&TableName=T10105&frequency=Q&year=X&ResultFormat=JSON`;

  const fetchBEA = async () => {
    return new Promise((resolve, reject) => {
      fetch(beaURL)
        .then(res => {
          resolve(res.json());
        })
        .catch(error => {
          console.error(`failed to get metadata ${++numBEAAPICalls} time(s), error:${error}`);
          if (numBEAAPICalls < 3) {
            fetchBEA();
          } else {
            reject(error);
          }
          console.error(error);
        });
    });
  };

  fs.readFile('./static/data/bea-data.json', 'utf8', async (err, data) => {
    if (err) {
      resultDataBEA = await fetchBEA()
        .then(res => res)
        .catch(error => {
          throw error;
        });
      console.warn('USING BEA API RESPONSE');
    } else {
      console.warn('USING BEA CACHED FILE');
      resultDataBEA = JSON.parse(data);
    }
    resultDataBEA.BEAAPI.Results.Data.forEach(bea => {
      if (bea.LineDescription === 'Gross domestic product') {
        const node = {
          id: bea.TableName + bea.TimePeriod,
          lineDescription: bea.LineDescription,
          timePeriod: bea.TimePeriod,
          dataValue: bea.DataValue,
          parent: null,
          children: [],
          internal: {
            type: `BeaGDP`,
          },
        };
        node.internal.contentDigest = createContentDigest(node);
        createNode(node);
      }
    });
  });
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `
    type PublishedReport {
      report_date: Date,
      path: String,
      report_group_id: String,
      report_group_desc: String,
      report_group_sort_order_nbr: String,
    }
    type UniquePivotValues {
      columnName: String,
      prettyName: String
    }
    type FieldFilter {
      field: String,
      value: [String]
    }
    type CustomDateFilter {
      startDateField: String,
      endDateField: String,
      dateRange: String
    }
    type UserFilter {
      field: String,
      label: String,
      notice: String,
      optionValues: [String!],
      dataUnmatchedHeader: String,
      dataUnmatchedMessage: String,
    }
    type OptionLabels {
      label: String,
    }
    type ApiFilter {
      field: String,
      labelField: String,
      filterEndpoint: String,
      downloadLabel: String,
      label: String,
      displayDefaultData: Boolean,
      disableDateRangeFilter: Boolean,
      notice: String,
      optionValues: [String!],
      optionLabels: OptionLabels,
      dataUnmatchedHeader: String,
      dataUnmatchedMessage: String,
      dataDefaultHeader: String,
      dataDefaultMessage: String,
      dataSearchLabel: String,
      fieldFilter: FieldFilter,
      customDateFilter: CustomDateFilter
    }
    type SEOConfig {
      title: String,
      description: String,
      keywords: String
    }
    type DetailView {
      apiId: Int,
      field: String,
      label: String,
      secondaryField: String,
      dateRangeLockCopy: String,
      summaryTableFields: [String],
      selectColumns: [String],
    }
    type CustomFormatConfig {
      type: String,
      fields: [String],
      decimalPlaces: Int,
      noFormatting: String,
      breakChar: String,
      customType: String,
      dateFormat: String,
    }
    type SpecialAnnouncement {
      label: String,
      value: String,
    }
    type DataTableRequest {
      fields: String,
      dateField: String,
    }
    type RunTimeReportConfig {
      filterField: String,
      filterLabel: String,
      dateFilterType: String,
      unmatchedHeader: String,
      unmatchedMessage: String,
      defaultHeader: String,
      defaultMessage: String,
      defaultMessage: String,
      searchText: String,
      optionValues: [String!],
      experimental: Boolean,
      specialAnnouncement: SpecialAnnouncement,
      cusipFirst: Boolean,
      dataTableRequest: DataTableRequest,
    }
    type Datasets implements Node {
      publishedReports: [PublishedReport!],
      dataFormats: [String!],
      filters: [String!],
      seoConfig: SEOConfig,
      customRangePreset: String,
      selectColumns: [String],
      detailView: DetailView,
      disableAllTables: Boolean,
      reportGenKey: String,
      downloadTimestamp: Boolean,
      sharedApiFilterOptions: Boolean,
      reportSelection: String,
      dateExpected: String,
      timeExpected: String,
      allColumnNames: [String],
      allPrettyNames: [String],
      hideRawDataTable: Boolean,
      hideReportDatePicker: Boolean,
      runTimeReportConfig: RunTimeReportConfig,
    }
    type DownloadLimit {
      fileType: String,
      maxYearRange: Int,
    }
    type DatasetsApis implements Node {
      alwaysSortWith: [String!],
      hideColumns: [String],
      selectColumns: [String!],
      userFilter: UserFilter,
      apiFilter: ApiFilter,
      apiNotesAndLimitations: String,
      customFormatting: [CustomFormatConfig!],
      downloadLimit: DownloadLimit,
    }
    type DatasetsApisDataDisplays implements Node {
      uniquePivotValues: [UniquePivotValues!]
      lastRowSnapshot: Boolean
    }
    type Explainers implements Node {
      pageName: String,
      seoConfig: SEOConfig,
      breadCrumbLinkName: String
    }
    type Insights implements Node {
      pageName: String,
      seoConfig: SEOConfig,
      breadCrumbLinkName: String
    }
    type BLSPublicAPIData implements Node {
      year: String,
      period: String,
      latest: String,
      value: String,
      _12mo_percentage_change: String
    }
    type BeaGDP implements Node {
      lineDescription: String,
      timePeriod: String,
      dataValue: String
    }
    type ExchangeRatesData implements Node {
      record_date: String,
      country_currency_desc: String,
      exchange_rate: String,
      effective_date: String,
      record_calendar_quarter: String,
    }
  `;

  createTypes(typeDefs);
};

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage, createRedirect } = actions;

  // Note: if customNoChartMessage needs to be used again, it can be re inserted into the below query. If it is included
  // in the query without being used or defined in a dataset config, the query will fail

  const result = await graphql(`
    query {
      allDatasets {
        datasets: nodes {
          dataFormats
          dataStartYear
          datasetId
          dictionary
          name
          slug
          relatedDatasets
          currentDateButton
          runTimeReportConfig {
            filterField
            filterLabel
            searchText
            dateFilterLabel
            dateFilterType
            unmatchedHeader
            unmatchedMessage
            defaultHeader
            defaultMessage
            optionValues
            experimental
            cusipFirst
            specialAnnouncement {
              label
              value
            }
            dataTableRequest {
              fields
              dateField
            }
          }
          hideRawDataTable
          hideReportDatePicker
          reportSelection
          disableAllTables
          downloadTimestamp
          reportGenKey
          sharedApiFilterOptions
          dateExpected
          timeExpected
          allColumnNames
          allPrettyNames
          detailView {
            apiId
            field
            label
            secondaryField
            dateRangeLockCopy
            summaryTableFields
            selectColumns
          }
          datePreset
          customRangePreset
          bannerCallout {
            banner
            startDate
            endDate
          }
          datatableBanner
          relatedTopics
          filterTopics
          publisher
          publishedReportsTip
          publishedReports {
            report_date
            path
            report_group_id
            report_group_desc
            report_group_sort_order_nbr
          }
          seoConfig {
            pageTitle
            description
            keywords
          }
          summaryText
          tagLine
          notesAndKnownLimitations
          techSpecs {
            earliestDate
            fileFormat
            lastUpdated
            latestDate
            updateFrequency
          }
          apis {
            apiId
            dataDisplays {
              chartType
              dimensionField
              uniquePivotValues {
                columnName
                prettyName
              }
              filters {
                key
                value
                operator
              }
              title
              roundingDenomination
              aggregateOn {
                field
                type
              }
              lastRowSnapshot
            }
            dateField
            alwaysSortWith
            hideColumns
            customFormatting {
              type
              fields
              decimalPlaces
              noFormatting
              breakChar
              customType
              dateFormat
            }
            selectColumns
            downloadLimit {
              fileType
              maxYearRange
            }
            userFilter {
              field
              label
              notice
              optionValues
              dataUnmatchedHeader
              dataUnmatchedMessage
            }
            apiFilter {
              field
              labelField
              filterEndpoint
              downloadLabel
              label
              displayDefaultData
              disableDateRangeFilter
              notice
              optionValues
              optionLabels {
                label
              }
              dataUnmatchedHeader
              dataUnmatchedMessage
              dataDefaultHeader
              dataDefaultMessage
              dataSearchLabel
              fieldFilter {
                field
                value
              }
              customDateFilter {
                startDateField
                endDateField
                dateRange
              }
            }
            downloadName
            earliestDate
            endpoint
            fields {
              columnName
              dataType
              definition
              isRequired
              prettyName
              tableName
            }
            isLargeDataset
            lastUpdated
            latestDate
            apiNotesAndLimitations
            pathName
            rowCount
            rowDefinition
            tableDescription
            tableName
            updateFrequency
            valueFieldOptions
          }
        }
      }
      allTopics {
        topics: nodes {
          datasetIds
          label
          slug
          title
        }
      }
      allExplainers {
        explainers: nodes {
          pageName
          slug
          seoConfig {
            pageTitle
            description
            keywords
          }
          prodReady
          breadCrumbLinkName
          heroImage {
            heading
            subHeading
          }
          relatedDatasets
          isAFG
        }
      }
      allInsights {
        insights: nodes {
          pageName
          slug
          seoConfig {
            pageTitle
            description
            keywords
          }
          prodReady
          breadCrumbLinkName
          heroImage {
            heading
            subHeading
          }
        }
      }
      allCpi100Csv {
        cpi100Csv: nodes {
          year
          value
        }
      }
      allSavingsBondsByTypeHistoricalCsv {
        savingsBondsByTypeHistoricalCsv: nodes {
          year
          bond_type
          sales
        }
      }
      allBlsPublicApiData {
        blsPublicApiData: nodes {
          year
          value
          period
          latest
          _12mo_percentage_change
        }
      }
      allExchangeRatesData {
        exchangeRatesData: nodes {
          record_date
          country_currency_desc
          exchange_rate
          effective_date
          record_calendar_quarter
        }
      }
      allGlossaryCsv {
        glossaryCsv: nodes {
          term
          definition
          site_page
          id
          url_display
          url_path
        }
      }
    }
  `);

  const glossaryData = result.data.allGlossaryCsv.glossaryCsv;
  glossaryData.map(
    term =>
      (term.slug = term.term
        .toLowerCase()
        .split(' ')
        .join('-'))
  );

  result.data.allBlsPublicApiData.blsPublicApiData
    .filter(blsRow => blsRow.year > 2021 && (blsRow.period === 'M12' || blsRow.latest === 'true'))
    .forEach(blsRow => {
      const appendRow = {
        year: blsRow.year,
        value: blsRow.value,
      };
      result.data.allCpi100Csv.cpi100Csv.push(appendRow);
    });
  result.data.allCpi100Csv.cpi100Csv.sort((a, b) => Number(a.year) - Number(b.year));
  const cpiYearMap = {};
  result.data.allCpi100Csv.cpi100Csv.forEach(row => {
    cpiYearMap[row.year] = row.value;
  });

  const cpi12MonthPercentChangeMap = {};

  result.data.allBlsPublicApiData.blsPublicApiData.forEach(blsRow => {
    cpi12MonthPercentChangeMap[blsRow.period + blsRow.year] = blsRow['_12mo_percentage_change'];
  });
  for (const config of result.data.allDatasets.datasets) {
    // datasets must have an api with an endpoint, unless hideRawDataTable is true
    if ((config.apis && config.apis[0].endpoint !== '') || config.hideRawDataTable) {
      const allResults = [];
      const allResultsLabels = {};
      const runTimeReportOptions = [];
      for (const api of config.apis) {
        if (config?.runTimeReportConfig) {
          const filterConfig = config.runTimeReportConfig;
          let filterOptionsUrl = `${API_BASE_URL}/services/api/fiscal_service/`;
          filterOptionsUrl += `${api.endpoint}?fields=${filterConfig.filterField}`;
          filterOptionsUrl += `&page[size]=10000&sort=${filterConfig.filterField}`;
          const options = await fetch(filterOptionsUrl).then(res =>
            res.json().then(body => body.data.map(row => row[filterConfig.filterField]).sort((a, b) => a.localeCompare(b)))
          );
          runTimeReportOptions.push(...options);
        }
        if (api.userFilter) {
          let filterOptionsUrl = `${API_BASE_URL}/services/api/fiscal_service/`;
          filterOptionsUrl += `${api.endpoint}?fields=${api.userFilter.field}`;
          filterOptionsUrl += `&page[size]=10000&sort=${api.userFilter.field}`;

          const options = await fetch(filterOptionsUrl).then(res =>
            res.json().then(body => body.data.map(row => row[api.userFilter.field]).sort((a, b) => a.localeCompare(b)))
          );
          api.userFilter.optionValues = [...new Set(options)]; // uniquify results
        }
        if (api.apiFilter) {
          let filterOptionsUrl = `${API_BASE_URL}/services/api/fiscal_service/`;
          if (api.apiFilter.filterEndpoint) {
            filterOptionsUrl += `${api.apiFilter.filterEndpoint}?page[size]=10000`;
          } else {
            filterOptionsUrl += `${api.endpoint}?fields=${api.apiFilter.field}`;
            if (api.apiFilter?.labelField) {
              filterOptionsUrl += `,${api.apiFilter.labelField}&page[size]=10000&sort=${api.apiFilter.labelField}`;
            } else {
              filterOptionsUrl += `&page[size]=10000&sort=${api.apiFilter.field}`;
            }
          }

          if (api.apiFilter.fieldFilter) {
            // Tables with subheaders within the dropdown (ex. UTF)
            const multiOptions = {};
            for (const val of api.apiFilter.fieldFilter.value) {
              const newUrl = filterOptionsUrl + `&filter=${api.apiFilter.fieldFilter.field}:eq:${val}`;
              const options = await fetch(newUrl).then(res =>
                res.json().then(body => body.data.map(row => row[api.apiFilter.field]).sort((a, b) => a.localeCompare(b)))
              );
              multiOptions[val] = options;
            }
            api.apiFilter.optionValues = multiOptions; // uniquify results
          } else if (api.apiFilter.labelField) {
            //Different field used for value vs label (ex. FBP)
            let options;
            const labelOptions = {};
            await fetch(filterOptionsUrl).then(res =>
              res.json().then(body => {
                const filterLabels = body.data;
                if (api.apiFilter?.labelField) {
                  filterLabels.forEach(row => (labelOptions[row[api.apiFilter.field]] = row[api.apiFilter.labelField]));
                }
                options = body.data.map(row => row[api.apiFilter.field]).sort((a, b) => a.localeCompare(b));
              })
            );
            api.apiFilter.optionValues = { all: [...new Set(options)] }; // uniquify results
            api.apiFilter.optionLabels = labelOptions;
          } else {
            const options = await fetch(filterOptionsUrl).then(res =>
              res.json().then(body => body.data.map(row => row[api.apiFilter.field]).sort((a, b) => a.localeCompare(b)))
            );
            api.apiFilter.optionValues = { all: [...new Set(options)] }; // uniquify results
          }
        }
      }
      if (config?.runTimeReportConfig) {
        config.runTimeReportConfig.optionValues = [...new Set(runTimeReportOptions)]; // uniquify results
      }
      if (allResults.length > 0) {
        for (const api of config.apis) {
          api.apiFilter.optionValues = { all: [...new Set(allResults)] }; // uniquify results
          api.apiFilter.optionLabels = allResultsLabels;
        }
      }
      createPage({
        path: `/datasets${config.slug}`,
        matchPath: '/datasets' + config.slug + '*',
        component: path.resolve(`./src/layouts/dataset-detail/dataset-detail.jsx`),
        context: {
          config: config,
          relatedDatasets: config.relatedDatasets ? config.relatedDatasets : [],
          experimental: false,
          seoConfig: config.seoConfig,
          isPreProd: ENV_ID === 'preprod',
        },
      });
    }
  }

  if (ENV_ID === 'preprod') {
    result.data.allTopics.topics.forEach(config => {
      const slug = `${config.slug.trim()}/`;
      createPage({
        path: `/topics/${slug}`,
        matchPath: '/topics/' + slug + '*',
        component: path.resolve(`./src/layouts/topics/topics.jsx`),
        context: {
          config: config,
          slug: config.slug,
          relatedDatasets: [],
          seoConfig: null,
          isPreProd: ENV_ID === 'preprod',
        },
      });
    });
  }
  //
  // result.data.allExplainers.explainers.forEach(explainer => {
  //   if (ENV_ID !== 'production' || explainer.prodReady) {
  //     const explainerRelatedDatasets = [];
  //     explainer.relatedDatasets.forEach(dataset => {
  //       explainerRelatedDatasets.push(result.data.allDatasets.datasets.find(ds => ds.datasetId === dataset));
  //     });
  //     createPage({
  //       path: explainer.slug,
  //       matchPath: `${explainer.slug}*`,
  //       component: path.resolve('./src/layouts/explainer/explainer.tsx'),
  //       context: {
  //         pageName: explainer.pageName,
  //         breadCrumbLinkName: explainer.breadCrumbLinkName,
  //         seoConfig: explainer.seoConfig,
  //         heroImage: explainer.heroImage,
  //         relatedDatasets: explainerRelatedDatasets,
  //         isAFG: explainer.isAFG,
  //         cpiDataByYear: cpiYearMap,
  //         cpi12MonthPercentChange: cpi12MonthPercentChangeMap,
  //       },
  //     });
  //   }
  // });

  result.data.allInsights.insights.forEach(insight => {
    if (ENV_ID !== 'production' || insight.prodReady) {
      createPage({
        path: insight.slug,
        matchPath: `${insight.slug}*`,
        component: path.resolve('./src/layouts/insight/insight.tsx'),
        context: {
          pageName: insight.pageName,
          breadCrumbLinkName: insight.breadCrumbLinkName,
          seoConfig: insight.seoConfig,
          heroImage: insight.heroImage,
        },
      });
    }
  });

  createPage({
    path: `/currency-exchange-rates-converter/`,
    matchPath: '/currency-exchange-rates-converter/',
    component: path.resolve(`./src/layouts/currency-exchange-rates-converter/index.tsx`),
  });

  if (ENV_ID !== 'production') {
    createPage({
      path: `/experimental/`,
      matchPath: '/experimental/',
      component: path.resolve(`./src/layouts/experimental/experimental.jsx`),
    });

    // const featurePageTemplate = path.resolve(`src/layouts/feature/feature.tsx`);
    // const features = await graphql(`
    //   {
    //     allMdx(sort: { order: DESC, fields: [frontmatter___datePublished] }, limit: 1000) {
    //       edges {
    //         node {
    //           frontmatter {
    //             path
    //             relatedDatasets
    //           }
    //         }
    //       }
    //     }
    //   }
    // `);
    // if (features.errors) {
    //   reporter.panicOnBuild(`Error while running GraphQL query.`);
    //   return;
    // }
    //
    // features.data.allMdx.edges.forEach(({ node }) => {
    //   if (node.frontmatter.path) {
    //     const insightRelatedDatasets = [];
    //     if (node.frontmatter.relatedDatasets) {
    //       node.frontmatter.relatedDatasets.forEach(dataset => {
    //         insightRelatedDatasets.push(result.data.allDatasets.datasets.find(ds => ds.datasetId === dataset));
    //       });
    //     }
    //     createPage({
    //       path: node.frontmatter.path,
    //       component: featurePageTemplate,
    //       context: {
    //         relatedDatasets: insightRelatedDatasets,
    //       },
    //     });
    //   }
    // });
  }
  createRedirect({
    fromPath: '/government-revenue/',
    toPath: '/americas-finance-guide/government-revenue/',
    isPermanent: true,
  });
  createRedirect({
    fromPath: '/federal-spending/',
    toPath: '/americas-finance-guide/federal-spending/',
    isPermanent: true,
  });
  createRedirect({
    fromPath: '/national-deficit/',
    toPath: '/americas-finance-guide/national-deficit/',
    isPermanent: true,
  });
  createRedirect({
    fromPath: '/national-debt/',
    toPath: '/americas-finance-guide/national-debt/',
    isPermanent: true,
  });
  createRedirect({
    fromPath: '/datasets/securities-issued-in-treasurydirect/',
    toPath: '/datasets/electronic-securities-transactions/',
    isPermanent: true,
  });
};

exports.onCreatePage = async ({ page, actions: { createPage } }) => {
  if (page) {
    const pagePath = page.path;
    const datasetsPageRegEx = /^\/datasets\/$/;

    if (pagePath.match(/^\/datasets\/.+/)) {
      const datasetForPage = Object.values(datasetIdMap).find(ds => pagePath.indexOf('datasets' + ds.slug) !== -1);
      page.matchPath = '/datasets' + datasetForPage.slug + '/*';
      page.context = { ...page.context, filters: filters };
      createPage(page);
    } else if (pagePath.match(/^\/downloads\/$/)) {
      page.matchPath = '/downloads/*';
      createPage(page);
    } else if (pagePath.match(/^\/topics\/.+/)) {
      const topicsForPage = Object.values(datasetIdMap).find(ds => pagePath.indexOf('topics/' + ds.slug) !== -1);
      page.matchPath = '/topics/' + topicsForPage.slug + '/*';
      createPage(page);
    } else if (pagePath.match(datasetsPageRegEx)) {
      page.context = { ...page.context, filters: filters };
      createPage(page);
    }
  }
};

// The following resolves console errors around the Chunks being out of order.
exports.onCreateWebpackConfig = ({ stage, actions, plugins, getConfig }) => {
  if (stage === 'build-javascript' || stage === 'develop') {
    const config = getConfig();

    const miniCssExtractPlugin = config.plugins.find(plugin => plugin.constructor.name === 'MiniCssExtractPlugin');

    if (miniCssExtractPlugin) {
      miniCssExtractPlugin.options.ignoreOrder = true;
    }
    actions.replaceWebpackConfig(config);

    actions.setWebpackConfig({
      plugins: [
        plugins.provide({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer'],
        }),
      ],
    });
  }
};
