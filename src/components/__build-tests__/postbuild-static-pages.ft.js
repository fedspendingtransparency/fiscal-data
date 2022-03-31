import {getDateRange} from '../../transform/dates';
import { isAfter, isEqual, parse, format } from "date-fns";

const { ENV_ID, API_BASE_URL, ADDITIONAL_DATASETS, EXCLUDED_ENDPOINT_IDS, ADDITIONAL_ENDPOINTS,
  EXPERIMENTAL_WHITELIST, AUTHENTICATE_API, EXCLUDED_PAGE_PATHS } = require("gatsby-env-variables");

const hasExperimentalFeaturesWhitelist = EXPERIMENTAL_WHITELIST && EXPERIMENTAL_WHITELIST.length;

const puppeteer = require('puppeteer');

const apiKey = AUTHENTICATE_API ? process.env.GATSBY_API_KEY : false;
const fetchUtil = require('make-fetch-happen');
const authenticatingFetch = require('../../utils/authenticating-fetch/authenticating-fetch');
const fetch = apiKey ? authenticatingFetch(apiKey, fetchUtil) : fetchUtil;

const { port } = require('../../../jest-puppeteer.config').server;

console.info(`Using environment config: '${ENV_ID}', Port: [${port}]`);
console.info(`Expecting to ${hasExperimentalFeaturesWhitelist ? 'FIND' : 'NOT find'} `
  + `experimental page paths.`);


const siteRoot = `http://localhost:${port}`;

const datasetIdMap = require('../../transform/static-metadata/datasets.json');
const apiMap = require('../../transform/endpointConfig')
  .getEndpointConfigsById(EXCLUDED_ENDPOINT_IDS, ADDITIONAL_ENDPOINTS);
const { freshTopics } = require('../../transform/topics-config');
const multimatch = require('multimatch');
const recordSettingAuctionData = "015-BFS-2014Q1-14";

describe('Fully built site', () => {
  let browser = '';
  let page = '';
  let verifyStepCount = 0;
  const metadataUrl = `${API_BASE_URL}/services/dtg/metadata/`;

  const verifyPageStatus = async (url, status = 200) => {

    // if it's meant to be excluded expect 404
    if (EXCLUDED_PAGE_PATHS && Array.isArray(EXCLUDED_PAGE_PATHS) && EXCLUDED_PAGE_PATHS.length) {
      status = multimatch(url, EXCLUDED_PAGE_PATHS).length ? 404 : status;
    }

    console.info(`${++verifyStepCount}. Verifying ${url} is ${status}`);
    const time = Date.now();
    try {
      const pageRequest = await page.goto(url);
      expect(pageRequest._status).toBe(status);
    } catch (error) {
      console.error(`Error encountered while confirming the path: `
        + `${url} returns status ${status}`, error);
      throw error;
    } finally {
      console.info(`${(Date.now() - time) / 1000} seconds elapsed`);
    }
  };

  console.info(`Testing built pages against metadata from: ${metadataUrl}`);

  let metaData;

  beforeAll(async () => {

    browser = await puppeteer.launch();
    page = await browser.newPage();

    await page.emulate({
      viewport: {
        width: 500,
        height: 2400
      },
      userAgent: ''
    });

    const metaDataAll = await fetch(metadataUrl).then((data) => data.json());

    /* ********* PARE DOWN METADATA TO TESTABLE DATASETS PER ENVIRONMENT *********** */
    // first: eliminate any datasets in loaded metadata without any apis declared at all
    const metadataWithAPIs = metaDataAll.filter(dataset => dataset.apis.length);

    // second: eliminate any loaded datasets for which there are no APIs that match
    // statically defined endPointConfigs
    metaData = metadataWithAPIs.filter(dataset =>
      dataset.apis.filter(api => Object.keys(apiMap).some(key => ('' + key) ===
        ('' + api['api_id']))).length);

    // third: make sure any datasets eliminated above are also removed from the static
    // dataset config map
    const exclusions = metaDataAll.filter(ds => !metaData.includes(ds));

    // fourth: remove any datasets from the static list that have no counterpart in loaded metadata
    Object.keys(datasetIdMap).forEach(dsid => {
      if (!metaData.find(mds => mds['dataset_id'] === dsid)) {
        exclusions.push({ dataset_id: dsid });
      }
    });

    exclusions.forEach(eds => {
      delete datasetIdMap[eds['dataset_id']];
      if (ADDITIONAL_DATASETS) {
        delete ADDITIONAL_DATASETS[eds['dataset_id']];
      }
    });

  });

  afterAll(() => {
    browser.close();
  });

  it('has all expected automatic pages from the pages directory', async () => {
    const pagePaths = [
      '/',
      '/api-documentation',
      '/about-us',
      '/datasets',
      '/release-calendar',
      '/downloads'
    ];
    for (const pagePath of pagePaths) {
      await verifyPageStatus(`${siteRoot}${pagePath === '/' ? pagePath : (pagePath + '/')}`);
    }
  });

  it('has a custom 404 page', async ()=> {
    await verifyPageStatus(`${siteRoot}/fake/`, 404);
  });

  it('ensures the date range shown on the dataset detail page for each dataset matches what ' +
    'comes back from the metadata API', async() => {

    const dateFormat = 'MM/dd/yyyy';

    const matchOnDatasetId = (id, data) => {
      return data.filter(d => d.dataset_id === id);
    }

    const parseDate = (dateString) => {
      if (dateString === undefined || dateString === null
        || dateString === '') {
        return null;
      }

      return parse(dateString, dateFormat, new Date());
    };

    const extractMetaDataDateRange = (metaDataObj) => {
      const apiData = metaDataObj.apis;
      const dateRange = getDateRange(apiData);

      const earliestDate = parseDate(dateRange.earliestDate);
      const latestDate = parseDate(dateRange.latestDate);
      return {
        startDate: earliestDate,
        endDate: latestDate
      };
    }

    const convertTextDateRangeToObj = (dateRangeString) => {

      if (dateRangeString.indexOf(" — ") < 0) {
        return { startDate: null, endDate: null };
      }

      const splt = dateRangeString.split(" — ");

      if (splt.length !== 2) {
        return { startDate: null, endDate: null };
      }

      const startDate = parseDate(splt[0]);
      const endDate = parseDate(splt[1]);
      return {
        startDate: startDate,
        endDate: endDate
      };
    };

    const ensureDateRange = async (id, slug) => {
      console.info(`${++verifyStepCount}. Comparing date range for ${siteRoot}/datasets${slug}`);
      const time = Date.now();
      try {
        await page.goto(`${siteRoot}/datasets${slug}`);

        const metaDataObj = matchOnDatasetId(id, metaData)[0];
        const metaDataRange = extractMetaDataDateRange(metaDataObj);

        let dateRange;
        await page.waitForSelector('[data-test-id="dateRangePill"]').then(async (page) => {
          const dateRangeString = await page.evaluate(async () =>
            document.querySelector('[data-test-id="dateRangePill"]').textContent);

          dateRange = convertTextDateRangeToObj(dateRangeString);

          expect(metaDataRange.startDate).toBeTruthy();
          expect(metaDataRange.endDate).toBeTruthy();
          expect(dateRange.startDate).toBeTruthy();
          expect(dateRange.endDate).toBeTruthy();


          expect(isEqual(metaDataRange.startDate, dateRange.startDate))
            .toBe(true);

          if (isAfter(metaDataRange.endDate, dateRange.endDate)) {
            console.info("Expected date (%s) from metadata is after " +
              "received date (%s) in dataset detail DOM for [%s]",
              format(metaDataRange.endDate, dateFormat),
              format(dateRange.endDate, dateFormat),
              slug);
          }

          expect(isEqual(metaDataRange.endDate, dateRange.endDate)
            || isAfter(metaDataRange.endDate, dateRange.endDate))
            .toBe(true);

        });
      } catch (error) {
        console.error(`Error encountered while checking dates on `
          + ` ${`${siteRoot}/datasets${slug}`} `);
        throw error;
      } finally {
        console.info(`${(Date.now() - time) / 1000} seconds elapsed`);
      }
    };

    // Exclude record-setting auction data from date checking since its dates are so different from
    // the other datasets. These dates checks don't make much sense as a result.
    const normalDateDatasets = Object.assign({}, datasetIdMap);
    if(normalDateDatasets[recordSettingAuctionData]){
      delete normalDateDatasets[recordSettingAuctionData];
    }

    for (const dataset in normalDateDatasets) {
      if (normalDateDatasets.hasOwnProperty(dataset)) {
        await ensureDateRange(dataset, normalDateDatasets[dataset].slug);
      }
    }
  });

  it('correctly includes or excludes preprod-only whitelisted datasets depending ' +
    'upon environment', async () => {
    if (ADDITIONAL_DATASETS && Object.keys(ADDITIONAL_DATASETS).length) {
      // todo - Update the following to be an "await Promise.all" as seen in the test below
      //  so these checks can be done in parallel rather than sequence.
      for (const dataset of Object.values(ADDITIONAL_DATASETS)) {
        if (ENV_ID === 'preprod') {
          await verifyPageStatus(`${siteRoot}/datasets${dataset.slug}`);
        } else {
          await verifyPageStatus(`${siteRoot}/datasets${dataset.slug}`, 404);
        }
      }
    }
  });

  it('only builds the topics pages in preprod environments', async() => {
    const pageStatus = (ENV_ID === 'preprod') ? 200 : 404;
    const topics = Object.values(freshTopics);
    for (const topic of topics) {
      await verifyPageStatus(`${siteRoot}/topics/${topic.slug}/`, pageStatus);
    }
  });
});
