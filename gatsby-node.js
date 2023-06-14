const { freshTopics } = require("./src/transform/topics-config");
const { freshExplainerPages } = require("./src/transform/explainer-pages-config");
const { getEndpointConfigsById } = require( './src/transform/endpointConfig');
const { sortPublishers } = require('./src/transform/filters/filterDefinitions');
let { filters } = require('./src/transform/filters/filterDefinitions');

// TODO:  remove preprod holdover and give all environments and env config filename that directly
//  matches the build-time process.env.BUILD_ENV
const varToEnvironmentConfig = {
  preprod: 'qat',
  qat: 'qat',
  uat: 'uat',
  dev: 'dev',
  stg: 'stg',
  prod: 'prod'
};

const MINIMUM_DATASETS_FOR_BUILD = 20;
const activeEnv = varToEnvironmentConfig[process.env.BUILD_ENV] || 'index';
const {
  ENV_ID, API_BASE_URL,
  ADDITIONAL_DATASETS,
  ADDITIONAL_ENDPOINTS,
  EXCLUDED_ENDPOINT_IDS,
  AUTHENTICATE_API,
  USE_MOCK_RELEASE_CALENDAR_DATA_ON_API_FAIL
} = require(`./env/${activeEnv}.js`);
console.info(`Using environment config: '${ENV_ID}'`);

const apiKey = AUTHENTICATE_API ? process.env.GATSBY_API_KEY : false;
const path = require(`path`);
const metadataTransform =
  require('./src/transform/metadata-transform').metadataTransform;

const fetchUtil = require('make-fetch-happen');
const authenticatingFetch =
  require('./src/utils/authenticating-fetch/authenticating-fetch');
const fetch = apiKey ? authenticatingFetch(apiKey, fetchUtil) : fetchUtil;

const datasetIdMap = require('./src/transform/static-metadata/datasets.json');
// this is temporary until the API is available. This will need to be replaced
// with an API call similar to what is in getMetaData below
const releaseCalendarMockData =
  require('./src/testData/release-calendar.mock.data.json').data;

exports.sourceNodes = async ({ actions, createNodeId, createContentDigest }) => {
  const { createNode } = actions;
  const releaseCalendarUrl = `${API_BASE_URL}/services/calendar/release`;
  const metadataUrl = `${API_BASE_URL}/services/dtg/metadata/`;

  console.info(`Loading metadata from ${metadataUrl} `
    + `with${apiKey ? '' : 'out'} authentication.`)
  console.info(`Loading release calendar from ${releaseCalendarUrl} `
    + `with${apiKey ? '' : 'out'} authentication.`)

  if (ENV_ID !== 'production') {
    console.info('App is including datasets whitelisted for lower environments');
    if (ADDITIONAL_DATASETS && Object.keys(ADDITIONAL_DATASETS).length) {
      Object.assign(datasetIdMap, ADDITIONAL_DATASETS);
      console.info('Adding Datasets: ', Object.entries(ADDITIONAL_DATASETS)
        .map(([dsId, ds]) => `${dsId}: ${ds.seoConfig.pageTitle}`));
    }
  } else {
    console.info('App is including only datasets whitelisted for production ' +
      'environments');
  }

  let numMetaDataCalls = 0;
  let numRelCalendarCalls = 0;
  let numBLSAPICalls = 0;
  let numBEAAPICalls = 0;

  const getReleaseCalendarData = async () => {

    const rejectOrMockOutput = (error, resolve, reject) => {
      if (USE_MOCK_RELEASE_CALENDAR_DATA_ON_API_FAIL) {
        error !== null
          ? console.info("Reject received, but resolving with mock " +
          "release calendar data.")
          : console.info("API endpoint unavailable for Release " +
          "Calendar, using mock data.");
        resolve(releaseCalendarMockData);
      } else {
        error !== null
          ? console.warn("Reject received, rejecting with error.")
          : console.warn("API endpoint unavailable for Release Calender, " +
          "not configured to allow mock data.");
        reject(error);
      }
    };

    const generateSortKey = (entry) => `${entry.date}_${entry.time}`;

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
              ${++numRelCalendarCalls} time(s), `, error);
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
  }

  const getMetaData = async () => {
    return new Promise((resolve, reject) => {
      fetch(metadataUrl)
        .then(res => {
          resolve(res.json());
        })
        .catch(error => {
          console.error(`failed to get metadata ${++numMetaDataCalls} time(s), error:${error}`);
          if(numMetaDataCalls < 3){
            getMetaData();
          } else {
            reject(error);
          }
        });
    });
  }

  const freshMetadata = await getMetaData().then(res => res)
    .catch(error => {throw error});
  const freshReleaseCalendarData =
    await getReleaseCalendarData()
      .then(res => res)
      .catch(error => {
        console.error('Error while getting Release Calendar Data', error);
      });

  const endpointConfigIdMap =
    getEndpointConfigsById(EXCLUDED_ENDPOINT_IDS, ADDITIONAL_ENDPOINTS);
  const datasets = await metadataTransform(freshMetadata, datasetIdMap,
    endpointConfigIdMap, freshReleaseCalendarData, API_BASE_URL, fetch, MINIMUM_DATASETS_FOR_BUILD);
  console.info(`Retrieved data for a total of: ${datasets.length} datasets`);
  filters = sortPublishers(filters);
  const topics = freshTopics();
  const explainerPages = freshExplainerPages();

  for (const dataset of datasets) {
    dataset.id = createNodeId(dataset.datasetId);
    const node = {
      ...dataset,
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
    rcEntry.id = createNodeId(
      `${rcEntry.datasetId}-${rcEntry.date}-${rcEntry.time}`
    );
    const node = {
      ...rcEntry,
      parent: createNodeId(rcEntry.datasetId),
      children: [],
      internal: {
        type: 'Releases'
      }
    };
    node.internal.contentDigest = createContentDigest(node);
    createNode(node);
  });

  explainerPages.forEach((explainerPage) => {
    explainerPage.id = createNodeId(explainerPage.slug);
    const node = {
      ...explainerPage,
      parent: null,
      children: [],
      internal: {
        type: `Explainers`
      }
    };
    node.internal.contentDigest = createContentDigest(node);
    createNode(node);
  })

  const blsPublicApiUrl = `https://api.bls.gov/publicAPI/v2/timeseries/data/CUUR0000SA0?registrationkey=0270cf2d85494f99aeab578067ad5d9c`;
  const getBLSData = async () => {
    return new Promise((resolve, reject) => {
      fetch(blsPublicApiUrl)
        .then(res => {
          resolve(res.json());
        })
        .catch(error => {
          console.error(`failed to get metadata ${++numBLSAPICalls} time(s), error:${error}`);
          if (numBLSAPICalls < 3) {
            getBLSData();
          } else {
            reject(error);
          }
          console.error(error);
        });
    });
  }

  const resultData = await getBLSData().then(res => res)
    .catch(error => {
      throw error
    });
  resultData.Results.series[0].data.forEach((blsRow) => {
    blsRow.id = createNodeId(blsRow.year + blsRow.period);
    const node = {
      ...blsRow,
      parent: null,
      children: [],
      internal: {
        type: `BLSPublicAPIData`,
      }
    };
    node.internal.contentDigest = createContentDigest(node);
    createNode(node);
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
  }

  const beaResults = await fetchBEA().then(res => res)
  .catch(error => {
    throw error
  });
  beaResults.BEAAPI.Results.Data.forEach((bea) => {

    if(bea.LineDescription === 'Gross domestic product') {
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
      }
      node.internal.contentDigest = createContentDigest(node);
      createNode(node);
    }

  })


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
    type UserFilter {
      field: String,
      label: String,
      notice: String,
      optionValues: [String!],
      dataUnmatchedMessage: String
    }
    type SEOConfig {
      title: String,
      description: String,
      keywords: String
    }
    type Datasets implements Node {
      publishedReports: [PublishedReport!],
      dataFormats: [String!],
      filters: [String!],
      seoConfig: SEOConfig,
      customRangePreset: String
    }
    type DatasetsApis implements Node {
      alwaysSortWith: [String!],
      userFilter: UserFilter,
      apiNotesAndLimitations: String
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
    type BLSPublicAPIData implements Node{
      year: String,
      period: String,
      latest: String,
      value: String
    }
    type BeaGDP implements Node{
      lineDescription: String,
      timePeriod: String,
      dataValue: String
    }
  `;

  createTypes(typeDefs);
};

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage, createRedirect } = actions;

  const result = await graphql(`
    query {
      allDatasets
        (filter: {
          apis: {
            elemMatch: {
              endpoint: {ne: ""}
            }
          }
        })
      {
        datasets: nodes {
          dataFormats
          dataStartYear
          datasetId
          dictionary
          name
          slug
          relatedDatasets
          currentDateButton
          datePreset
          customRangePreset
          bannerCallout
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
              aggregateOn {
                field
                type
              }
              lastRowSnapshot
            }
            dateField
            alwaysSortWith
            userFilter {
              field
              label
              notice
              optionValues
              dataUnmatchedMessage
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
        }
      }
      allCpi100Csv {
        cpi100Csv: nodes {
          year
          value
        }
      }
      allBlsPublicApiData {
        blsPublicApiData: nodes {
          year
          value
          period
          latest
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
  glossaryData.map((term) => term.slug = term.term.toLowerCase().split(' ').join('-'));

  result.data.allBlsPublicApiData.blsPublicApiData
    .filter(blsRow => blsRow.year > 2021 && (blsRow.period === "M12" || blsRow.latest === "true"))
    .forEach(blsRow => {
      const appendRow = {
        year: blsRow.year,
        value: blsRow.value
      };
      result.data.allCpi100Csv.cpi100Csv.push(appendRow);
  });
  result.data.allCpi100Csv.cpi100Csv.sort((a,b) => Number(a.year) - Number(b.year));
  const cpiYearMap = {};
  result.data.allCpi100Csv.cpi100Csv.forEach(row => {
    cpiYearMap[row.year] = row.value;
  })

  for (const config of result.data.allDatasets.datasets) {
    if (config.apis[0].userFilter) {
      let filterOptionsUrl = `${API_BASE_URL}/services/api/fiscal_service/`;
      filterOptionsUrl += `${config.apis[0].endpoint}?fields=${config.apis[0].userFilter.field}`;
      filterOptionsUrl += `&page[size]=10000&sort=${config.apis[0].userFilter.field}`;

      const options = await fetch(filterOptionsUrl)
      .then(res => res.json()
      .then(body => body.data.map(row => row[config.apis[0].userFilter.field])
      .sort((a,b)=>a.localeCompare(b))));
      config.apis[0].userFilter.optionValues = [...new Set(options)]; // uniquify results
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
        isPreProd: ENV_ID === 'preprod'
      }
    });
  }

  if (ENV_ID === 'preprod') {
    result.data.allTopics.topics.forEach((config) => {
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
          isPreProd: ENV_ID === 'preprod'
        }
      });
    })
  }

  result.data.allExplainers.explainers.forEach((explainer) => {
    if (ENV_ID !== 'production' || explainer.prodReady) {
      const explainerRelatedDatasets = [];
      explainer.relatedDatasets.forEach((dataset) => {
        explainerRelatedDatasets.push(
          result.data.allDatasets.datasets.find(ds => ds.datasetId === dataset));
      });
      createPage({
        path: explainer.slug,
        matchPath: `${explainer.slug}*`,
        component: path.resolve('./src/layouts/explainer/explainer.tsx'),
        context: {
          pageName: explainer.pageName,
          breadCrumbLinkName: explainer.breadCrumbLinkName,
          seoConfig: explainer.seoConfig,
          heroImage: explainer.heroImage,
          relatedDatasets: explainerRelatedDatasets,
          cpiDataByYear: cpiYearMap,
          glossary: glossaryData
        }
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

    const featurePageTemplate = path.resolve(`src/layouts/feature/feature.tsx`);
    const features = await graphql(`
		{
			allMdx(
				sort: { order: DESC, fields: [frontmatter___datePublished] }
				limit: 1000
			) {
				edges {
					node {
						frontmatter {
							path
							relatedDatasets
						}
					}
				}
			}
		}
	`);
    if (features.errors) {
      reporter.panicOnBuild(`Error while running GraphQL query.`);
      return;
    }

    features.data.allMdx.edges.forEach(({ node }) => {
      if (node.frontmatter.path) {
        const insightRelatedDatasets = [];
        if(node.frontmatter.relatedDatasets) {
          node.frontmatter.relatedDatasets.forEach((dataset) => {
            insightRelatedDatasets.push(
              result.data.allDatasets.datasets.find(ds => ds.datasetId === dataset));
          });
        }
        createPage({
          path: node.frontmatter.path,
          component: featurePageTemplate,
          context: {
            relatedDatasets: insightRelatedDatasets,
          }
        });
      }
    });
  }
  createRedirect(
    {
      fromPath: '/government-revenue/',
      toPath: '/americas-finance-guide/government-revenue/',
      isPermanent: true
    });
  createRedirect(
    {
      fromPath: '/federal-spending/',
      toPath: '/americas-finance-guide/federal-spending/',
      isPermanent: true
    });
  createRedirect(
    {
      fromPath: '/national-deficit/',
      toPath: '/americas-finance-guide/national-deficit/',
      isPermanent: true
    });
  createRedirect(
    {
      fromPath: '/national-debt/',
      toPath: '/americas-finance-guide/national-debt/',
      isPermanent: true
    });
};

exports.onCreatePage = async ({ page, actions: { createPage } }) => {
  if (page) {
    const pagePath = page.path;
    const datasetsPageRegEx = /^\/datasets\/$/;

    if (pagePath.match(/^\/datasets\/.+/)) {
      const datasetForPage = Object.values(datasetIdMap)
        .find(ds => pagePath.indexOf('datasets' + ds.slug) !== -1);
      page.matchPath = '/datasets' + datasetForPage.slug + '/*';
      page.context = { ...page.context, filters: filters  };
      createPage(page);
    }else if (pagePath.match(/^\/downloads\/$/)) {
      page.matchPath = '/downloads/*';
      createPage(page);
    } else if (pagePath.match(/^\/topics\/.+/)) {
      const topicsForPage = Object.values(datasetIdMap)
        .find(ds => pagePath.indexOf('topics/' + ds.slug) !== -1);
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

    const miniCssExtractPlugin = config.plugins.find(
      plugin => plugin.constructor.name === 'MiniCssExtractPlugin'
    );

    if (miniCssExtractPlugin) {
      miniCssExtractPlugin.options.ignoreOrder = true;
    }

    actions.replaceWebpackConfig(config);

    actions.setWebpackConfig({
      plugins: [plugins.provide({
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer']
      })],
    });
  }
};
