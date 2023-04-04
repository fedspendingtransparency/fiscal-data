import { getConfigByApiId, getEndpointConfigsById } from './endpointConfig';

const {
  staticDatasetIdMap,
  staticTopicsAssociations,
  datasetInTransformation,
  staticFilters,
  mockFilterableData } = require('./transform-mock-data.json');
const releaseCalendarEntries = require('../testData/release-calendar.mock.data.json').data;

// make separate untransformed copy of mock obj
const datasetForPathName = JSON.parse(JSON.stringify(datasetInTransformation));
const vetApiMetadataAgainstWhitelist =
  require('./metadata-transform').vetApiMetadataAgainstWhitelist;
const transformMapper = require('./metadata-transform').transformMapper;
const sortApisByOrder = require('./metadata-transform').sortApisByOrder;
const sortFieldsByOrder = require('./metadata-transform').sortFieldsByOrder;
const extractPublishedReportsType = require('./metadata-transform').extractPublishedReportsType;
const metadataSEOApprovedDS = require('./metadata-transform').metadataSEOApprovedDS;
const determineSEO = require('./metadata-transform').determineSEO;
const reciprocateRelationships = require('./metadata-transform').reciprocateRelationships;

describe('Metadata Transform', () => {

  const mockWhitelistMap = {
    '015-BFS-2014Q3-065': {
      'slug': '/debt-to-the-penny/'
    },
    '015-BFS-2014Q3-056': {
      'slug': '/debt-to-the-nickel/'
    },
    '015-BFS-2014Q3-100': {
      'slug': '/debt-to-the-quarter/'
    }
  };

  const mockTransformedDatasetsFromApi = [
    {
      'datasetId': '015-BFS-2014Q3-065',
      'name': 'Debt to the Penny',
      'slug': '/debt-to-the-penny/',
      'apiSortOrderNbr': '3',
      'fields': [
        { 'sortOrderNbr': '3' },
        { 'sortOrderNbr': '2' },
        { 'sortOrderNbr': '1' },
      ]
    },
    {
      'datasetId': '015-BFS-2014Q3-056',
      'name': 'Debt to the Nickel',
      'slug': '/debt-to-the-nickel/',
      'apiSortOrderNbr': '4'
    },
    {
      'datasetId': '015-BFS-2014Q3-100',
      'name': 'Debt to the Quarter',
      'slug': '/debt-to-the-quarter/',
      'apiSortOrderNbr': '1'
    },
    {
      'datasetId': '015-BFS-2014Q3-075',
      'name': 'Non-whitelisted Debt to the Shilling',
      'slug': '/debt-to-the-shilling/',
      'apiSortOrderNbr': '2'
    }
  ];

  const mockPublishedFiles = [
    {
      "report_date":"2011-07-31",
      "path":
        "/static-data/published-reports/mspd-strips/MonthlyStatementPublicDebt_STRIPS_201107.pdf",
      "report_group_id":"2","report_group_desc":"STRIPS (.pdf)",
      "report_group_sort_order_nbr":"3"
    },
    {
      "report_date":"2011-08-31",
      "path":
        "/static-data/published-reports/mspd-strips/MonthlyStatementPublicDebt_STRIPS_201108.doc",
      "report_group_id":"2","report_group_desc":"STRIPS (.doc)",
      "report_group_sort_order_nbr":"3"
    },
    {
      "report_date":"2011-09-30",
      "path":
        "/static-data/published-reports/mspd-strips/MonthlyStatementPublicDebt_STRIPS_201109.pdf",
      "report_group_id":"2",
      "report_group_desc":"STRIPS (.pdf)",
      "report_group_sort_order_nbr":"3"
    },
    {
      "report_date":"2007-04-30",
      "path":
        "/static-data/published-reports/mspd-strips/MonthlyStatementPublicDebt_STRIPS_200704.xls",
      "report_group_id":"9",
      "report_group_desc":"STRIPS (.xls)",
      "report_group_sort_order_nbr":"4"
    }
  ];

  const mockFetch = jest.fn().mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve(mockFilterableData),
    }));

  it('formats dataset-wide date specs as MM/dd/YYYY when retrieving dates from child apiEndpoints',
    async () => {
    const transformIterationProcessor =
      transformMapper(staticDatasetIdMap,
        getEndpointConfigsById(null, null),
        staticTopicsAssociations,
        staticFilters,
        releaseCalendarEntries,
        'http://api.baseurl.fdg',
        mockFetch).each;

    // demonstrate pre-processed mock dataset does not yet have dataset-wide dates
    expect(datasetInTransformation.techSpecs.earliestDate).toBeUndefined();
    expect(datasetInTransformation.techSpecs.latestDate).toBeUndefined();
    expect(datasetInTransformation.techSpecs.lastUpdated).toBeUndefined();
    expect(datasetInTransformation.dataStartYear).toBeUndefined();

    // demonstrate mock dataset initially contains child endpoint with YYYY-MM-dd formatted dates
    expect(datasetInTransformation.apis[0].earliestDate).toEqual('2005-10-03');
    expect(datasetInTransformation.apis[0].latestDate).toEqual('2020-01-01');
    expect(datasetInTransformation.apis[0].lastUpdated).toEqual('2020-01-02');

    // run the process that determines dataset-wide date specs
    await transformIterationProcessor(datasetInTransformation);

    expect(datasetInTransformation.techSpecs.earliestDate).toEqual('10/03/2005');
    expect(datasetInTransformation.techSpecs.latestDate).toEqual('01/01/2020');
    expect(datasetInTransformation.techSpecs.lastUpdated).toEqual('01/02/2020');
    expect(datasetInTransformation.dataStartYear).toEqual('2005');
  });

  it('it creates kebab-cased pathName values for each api endpoint', async () => {
    const transformIterationProcessor =
      transformMapper(
        staticDatasetIdMap,
        getEndpointConfigsById(null, null),
        staticTopicsAssociations,
        staticFilters,
        releaseCalendarEntries,
        'http://api.baseurl.fdg',
        mockFetch).each;

    // demonstrate mock dataset initially contains child endpoint with a
    // tableName but no kebab-case pathName
    expect(datasetForPathName.apis[0].tableName).toEqual('Debt to the Nickel');
    expect(datasetForPathName.apis[0].pathName).toBeUndefined();

    // run the process that determines path names per table
    await transformIterationProcessor(datasetForPathName);

    // child endpoint is correctly assigned kebab-case pathName for URL parsing/formulation
    expect(datasetForPathName.apis[0].pathName).toEqual('debt-to-the-nickel');
  });

  it('returns a vetted list that excludes non-whitelisted datasets', () => {

    // Test will break if a "missing from whitelist" error occurs.
    const slugsFromVettedList =
      vetApiMetadataAgainstWhitelist(mockWhitelistMap, mockTransformedDatasetsFromApi,
        Object.entries(mockWhitelistMap).length)
      .map(ds => ds.slug);

    // returns all the whitelisted items in mock Metadata and
    // excludes non-whitelisted '/debt-to-the-shilling/'.
    expect(slugsFromVettedList)
      .toEqual(['/debt-to-the-penny/', '/debt-to-the-nickel/', '/debt-to-the-quarter/']);
  });

  it(`throws an error if the minimum number of datasets cannot be vetted`, () => {
    let errorCaught = false;
    try {
      vetApiMetadataAgainstWhitelist(mockWhitelistMap, mockTransformedDatasetsFromApi,
        Object.entries(mockWhitelistMap).length + 1);
    } catch (error) {
      errorCaught = error;
    }
    expect(errorCaught).toBeTruthy();
  });

  it('sorts the api tables based on the field api_sort_order_nbr (aka apiSortOrderNbr)', () => {
    expect(mockTransformedDatasetsFromApi[0].apiSortOrderNbr).toBe('3');
    mockTransformedDatasetsFromApi.sort(sortApisByOrder);
    expect(mockTransformedDatasetsFromApi[0].apiSortOrderNbr).toBe('1');
    expect(mockTransformedDatasetsFromApi[1].apiSortOrderNbr).toBe('2');
    expect(mockTransformedDatasetsFromApi[2].apiSortOrderNbr).toBe('3');
    expect(mockTransformedDatasetsFromApi[3].apiSortOrderNbr).toBe('4');
  });

  it('sorts the table fields based on the field sort_order_nbr (aka sortOrderNbr)', () => {
    expect(mockTransformedDatasetsFromApi[2].fields[0].sortOrderNbr).toBe('3');
    mockTransformedDatasetsFromApi[2].fields.sort(sortFieldsByOrder);
    expect(mockTransformedDatasetsFromApi[2].fields[0].sortOrderNbr).toBe('1');
    expect(mockTransformedDatasetsFromApi[2].fields[1].sortOrderNbr).toBe('2');
    expect(mockTransformedDatasetsFromApi[2].fields[2].sortOrderNbr).toBe('3');
  });

  it(`adds a property called isLargeDataset to the api and sets it to true if
   the rowCount > largeDatasetThreshold`, async () => {
    const transformIterationProcessor =
      transformMapper(
        staticDatasetIdMap,
        getEndpointConfigsById(null, null),
        staticTopicsAssociations,
        staticFilters,
        releaseCalendarEntries,
        'http://api.baseurl.fdg',
        mockFetch).each;
    await transformIterationProcessor(datasetInTransformation);

    expect(datasetInTransformation.apis[0].isLargeDataset).toBeUndefined();
    expect(datasetInTransformation.apis[1].isLargeDataset).toBeTruthy();
  });

  it('processes endpoint exclusions properly', () => {
    const allEndpointConfigs = getEndpointConfigsById(null, null);
    const allIds = Object.keys(allEndpointConfigs);
    // explicitly confirm whatever that the map holds an entry
    // for the 1st and 3rd IDs (before we exclude them)
    expect(allEndpointConfigs[allIds[0]]).toBeDefined(); // explicitly confirm whatever the first is
    expect(allEndpointConfigs[allIds[2]]).toBeDefined();

    // exclude 1st and 3rd endpoints (one from the edge of the list and one from inside it)
    const vettedEndpointConfigs = getEndpointConfigsById([allIds[0], allIds[2]], null);
    expect(allIds.length - Object.keys(vettedEndpointConfigs).length)
      .toEqual(2); // confirming list is shorter by 2
    expect(vettedEndpointConfigs[allIds[0]]).toBeUndefined();
    expect(vettedEndpointConfigs[allIds[2]]).toBeUndefined();
  });

  it('processes endpoint additions correctly', () => {

    const additionalEndpoints = {
      '99137': {
        'endpoint': 'v1/accounting/od/nickels_of_exchange',
        'dateField': 'record_date',
        'downloadName': 'NickRateXchg',
      },
      '99138': {
        'endpoint': 'v1/accounting/od/quarters_fed_debt',
        'dateField': 'record_date',
        'downloadName': 'SFD_QuartFedDebtMo'
      }
    };

    const allEndpointConfigs = getEndpointConfigsById(null, null);
    const allIds = Object.keys(allEndpointConfigs);
    expect(allEndpointConfigs['99137']).toBeUndefined();
    expect(allEndpointConfigs['99138']).toBeUndefined();

    // add the couple of endpoints defined above
    const augmentedEndpointConfigs = getEndpointConfigsById(null, additionalEndpoints);

    // confirm there are two more total entries than there were before
    expect(Object.keys(augmentedEndpointConfigs).length - allIds.length).toEqual(2);

    // the addendum made it in
    expect(augmentedEndpointConfigs['99137']).toBeDefined();
    expect(augmentedEndpointConfigs['99137'].downloadName).toStrictEqual('NickRateXchg');
    expect(augmentedEndpointConfigs['99138']).toBeDefined();
    expect(augmentedEndpointConfigs['99138'].endpoint)
      .toStrictEqual('v1/accounting/od/quarters_fed_debt');
  });

  it(`uses a function that returns statically defined endpoint configs corresponding to ids
  retrieved in metadata api and that ignores endpoints without corresponding statically defined
  configs`, () => {
    const mockEndpointConfigIMap = {
      '126': {
        name: 'simplified endpoint config entry'
      }
    };
    // if real, return the obj with the correctly updated dateField
    expect(getConfigByApiId('126', mockEndpointConfigIMap)).toBeTruthy();
    expect(getConfigByApiId('126', mockEndpointConfigIMap).dateField).toStrictEqual('record_date');
    expect(getConfigByApiId('125', mockEndpointConfigIMap)).toBeFalsy();
  });

  it('exits out of extractPublishedReportsType function if parameters are invalid', () => {
    expect(extractPublishedReportsType()).toEqual([]);
    expect(extractPublishedReportsType([])).toEqual([]);
  });

  it('extracts the published file types from the publishedFiles api response', () => {
    const fileTypesArr = extractPublishedReportsType(mockPublishedFiles);
    expect(fileTypesArr).toContain('PDF');
    expect(fileTypesArr).toContain('XLS');
    expect(fileTypesArr).toContain('DOC');
  });

  it('returns the desired SEO values from datasets', () => {
    const dummyDSId = '123';
    const metadataSEOId = metadataSEOApprovedDS && metadataSEOApprovedDS.length ?
      metadataSEOApprovedDS[0] : '';
    let seoConfig = {
      pageTitle: '',
      description: ''
    };

    const dataset = {
      datasetId: metadataSEOId,
      seoConfig: {
        pageTitle: 'SEO title extracted from the metadata',
        description: 'SEO description extracted from the metadata'
      }
    };

    // No pageTitle or description exists for the dataset in the static files, meaning the
    // metadata is SEO approved.
    const mappedDatasetSEOApproved = {
      seoConfig: {
      }
    };

    // Only the pageTitle has been approved within the metadata for SEO use.
    const mappedDatasetSomeSEOApproved = {
      seoConfig: {
        description: 'Description captured in our static files'
      }
    };

    // Dataset does not have any SEO approved metadata, use SEO captured in the static files.
    const mappedDatasetSEOStatic = {
      seoConfig: {
        pageTitle: 'Title captured in our static files',
        description: 'Description captured in our static files'
      }
    };

    seoConfig = determineSEO(dataset, mappedDatasetSEOApproved);
    expect(seoConfig.pageTitle).toStrictEqual(dataset.seoConfig.pageTitle);
    expect(seoConfig.description).toStrictEqual(dataset.seoConfig.description);

    seoConfig = determineSEO(dataset, mappedDatasetSomeSEOApproved);
    expect(seoConfig.pageTitle).toStrictEqual(dataset.seoConfig.pageTitle);
    expect(seoConfig.description).toStrictEqual(mappedDatasetSomeSEOApproved.seoConfig.description);

    seoConfig = determineSEO(dataset, mappedDatasetSEOStatic);
    expect(seoConfig.pageTitle).toStrictEqual(mappedDatasetSEOStatic.seoConfig.pageTitle);
    expect(seoConfig.description).toStrictEqual(mappedDatasetSEOStatic.seoConfig.description);

    // Dataset has unapproved SEO in metadata and partial fields in static files
    dataset.datasetId = dummyDSId;
    seoConfig = determineSEO(dataset, mappedDatasetSomeSEOApproved);
    expect(seoConfig.pageTitle).toStrictEqual('');
    expect(seoConfig.description).toStrictEqual(mappedDatasetSomeSEOApproved.seoConfig.description);
  });

  it('has a function that ensures reciprocity for dataset relationships', () => {
    const mockDatasetsMappedById = {
      "dataset-x1": {
        "relatedDatasets": [],
      },
      "dataset-x2": {
        "relatedDatasets": ["dataset-x1", "dataset-x3"]
      },
      "dataset-x3": {
        "relatedDatasets": ["dataset-x2", "dataset-x1"]
      },
      "dataset-x4": {
        "relatedDatasets": ["dataset-x1", "dataset-x3"]
      },
    };

    reciprocateRelationships(mockDatasetsMappedById);
    expect(mockDatasetsMappedById).toEqual({
      "dataset-x1": {
        "relatedDatasets": ["dataset-x2", "dataset-x3", "dataset-x4"],
      },
      "dataset-x2": {
        "relatedDatasets": ["dataset-x1", "dataset-x3"]
      },
      "dataset-x3": {
        "relatedDatasets": ["dataset-x2", "dataset-x1", "dataset-x4"]
      },
      "dataset-x4": {
        "relatedDatasets": ["dataset-x1", "dataset-x3"]
      },
    });
  });
});
