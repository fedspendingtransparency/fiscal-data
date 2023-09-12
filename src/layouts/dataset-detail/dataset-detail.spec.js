import React from 'react';
import renderer from 'react-test-renderer';
import {
  mockAPIs,
  mockSummaryDataset,
  mockMaxDates,
  mockTechSpecs,
  updateDates,
  mockSummaryDatasetNoUpdates
} from './helper';
import DDNav from '../../components/dataset-detail-nav/dataset-detail-nav';
import DatasetDetail from './dataset-detail';
import DatasetAbout from '../../components/dataset-about/dataset-about';
import DatasetData from '../../components/dataset-data/dataset-data';
import ApiQuickGuide from '../../components/api-quick-guide/api-quick-guide';
import Masthead from '../../components/masthead/masthead';
import RelatedDatasets from '../../components/related-datasets/related-datasets';
import SiteLayout from '../../components/siteLayout/siteLayout';
import PageHelmet from '../../components/page-helmet/page-helmet';
import {useStaticQuery} from 'gatsby';
import metadataHelper from '../../helpers/metadata/metadata';
import { useMetadataUpdater } from "../../helpers/metadata/use-metadata-updater-hook"

export const datasetPageSampleConfig = {
  "datasetId": "015-BFS-2014Q1-11",
  "name": "Monthly Statement of the Public Debt",
  "searchScore": 10,
  "relatedTopics": ['topic1', 'topic2'],
  "apis": [
    {
      "apiId": '3',
      "endpoint": "debt/mspd/mspd_table_1",
      "dateField": "reporting_date",
      "tableName": "Table 1",
      "earliestDate": "2020-01-01",
      "lastUpdated": "2020-07-17",
      "latestDate": "2020-07-17",
      "dataDisplays": [
        {
          "title": "Complete Table"
        }
      ],
      "fields": [
        {
          "columnName": "reporting_date",
          "definition": "Reporting date for the data",
          "tableName": "Summary of Treasury Securities Outstanding",
          "prettyName": "Calendar Date",
          "dataType": "DATE",
          "isRequired": "yes"
        },
        {
          "columnName": "debt_out_amt",
          "definition": "Amount outstanding represents the total par (principal amount) of " +
            "marketable and non-marketable securities outstanding. The marketable securities " +
            "include the discount and premium for treasury bills, notes, bonds, FRNs, and TIPS, " +
            "all of which can be bought and sold in the secondary market at prevailing market " +
            "prices.",
          "tableName": "Summary of Treasury Securities Outstanding",
          "prettyName": null,
          "dataType": null,
          "isRequired": "yes"
        },
        {
          "columnName": "security_holder",
          "definition": "Tier two of a three-tier hierarchy for categorizing Treasury " +
            "securities. Indicates whether the security is held by the public or " +
            "part of intragovernmental " +
            "holdings. ",
          "tableName": "Summary of Treasury Securities Outstanding",
          "prettyName": null,
          "dataType": null,
          "isRequired": "yes"
        }
      ]
    },
    {
      "apiId": '5',
      "endpoint": "debt/mspd/mspd_table_2",
      "dateField": "reporting_date",
      "tableName": "Table 2",
      "earliestDate": "2010-01-01",
      "lastUpdated": "2020-07-17",
      "latestDate": "2020-07-17",
      "dataDisplays": [
        {
          "title": "Complete Table"
        }
      ],
      "fields": [
        {
          "columnName": "reporting_date",
          "definition": "Reporting date for the data",
          "tableName": "Statutory Debt Limit",
          "prettyName": "Calendar Date",
          "dataType": "DATE",
          "isRequired": "yes"
        },
        {
          "columnName": "report_table_nbr",
          "definition": "Indicates the corresponding table number in the Monthly Statement of " +
            "the Public Debt report",
          "tableName": "Statutory Debt Limit",
          "prettyName": null,
          "dataType": null,
          "isRequired": null
        },
        {
          "columnName": "security_holder",
          "definition": "Indicates whether the federal debt is held by the public or " +
            "intragovernmental holdings",
          "tableName": "Statutory Debt Limit",
          "prettyName": null,
          "dataType": null,
          "isRequired": null
        }
      ]
    },
    {
      "apiId": '3',
      "endpoint": "debt/mspd/mspd_table_3",
      "dateField": "reporting_date",
      "earliestDate": "2000-01-01",
      "latestDate": "2020-07-17",
      "lastUpdated": "2020-07-17",
      "tableName": "Table 3 with a longer name to show off truncation",
      "dataDisplays": [
        {
          "title": "Complete Table"
        }
      ]
    }
  ],
  "slug": "/monthy-statement-of-the-public-debt-MSPD/",
  "dictionary": false,
  "techSpecs": {
    "earliestDate": "01/01/2002",
    "latestDate": "03/17/2020",
    "lastUpdated": "03/17/2020",
    "updateFrequency": "Updated Monthly",
    "fileFormat": "JSON, CSV, XML"
  },
  "dataStartYear": 2002,
  "tagLine": "High level overview of Treasury securities and the statutory debt limit, detailed " +
    "data on outstanding securities, and holdings of treasury securities in stripped form.",
  "summaryText": "The Monthly Statement of the Public Debt is a report dating back to 1869 that " +
    "details the Treasury’s outstanding debts and the debt limit. Debt is categorized by its " +
    "marketability (whether it can be sold in secondary markets) as well as if the debt is held " +
    "by the public or intragovernmental organizations. Beyond the first page, there are " +
    "detailed accounts of debt by type as well as accounts of debt that is no longer " +
    "outstanding. All amounts are reported in the millions of dollars. Reports are published " +
    "on the fourth business day of each month, detailing the debt as of the end of the " +
    "previous month.",
  "publisher": "Fiscal Accounting",
  "publishedReports": [{
    "report_date": "2021-01-01",
    "path": "/test/test.pdf",
    "report_group_id": "1",
    "report_group_desc": "desc",
    "report_group_sort_order_nbr": "1"
  }]
};

const mockQueryReturn = {
  allDatasets: {
    datasets: [
      {
        slug: '/blah/',
        name: 'dataset 1',
        tagLine: 'dataset 1 does this',
        relatedTopics: ['one', 'two', 'three'],
        techSpecs: {
          earliestDate: '01/01/01',
          latestDate: '02/02/02',
          updateFrequency: 'monthly',
          lastUpdated: '01/01/20',
          fileFormat: 'yes'
        },
        dictionary: 1
      }
    ]
  }
};

const seoConfig = {
  datasetId: '015-BFS-2014Q1-11',
  pageTitle: 'Monthly Statement of the Public Debt (MSPD)',
  description: 'This dataset provides high-level information on the federal government’s ' +
    'outstanding debts, holdings, and the statutory debt limit on a monthly basis.',
  keywords: 'debt, public debt, government debt, Treasury, open data, monthly statement ' +
    'public debt, mspd, us debt, debt limit',
};

jest.mock('../../components/filter-download-container/filter-download-container.jsx',
  () => () => 'FilterDownloadContainer');
jest.mock('../../helpers/metadata/use-metadata-updater-hook', () => ({
  useMetadataUpdater: (i) => { return i;}
}));
describe('Dataset-Detail layout component', () => {

  // Jest gives an error about the following not being implemented even though the tests pass.
  HTMLCanvasElement.prototype.getContext = jest.fn();
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve({ data: [] }) }));

  // Necessary for API Quick Guide
  jest.spyOn(document, 'getElementById').mockReturnValueOnce({ scrollHeight: 100 });

  const metadataSummarySpy = jest.spyOn(metadataHelper, 'metadataSummary');
  metadataSummarySpy.mockReturnValue(Promise.resolve([mockSummaryDataset]));

  let component = renderer.create();
  let instance;
  beforeAll(async () => {
    await renderer.act(async () => {
      useStaticQuery.mockReturnValue(
        {
          site: {
            siteMetadata: {
              siteUrl: `https://fiscalData.treasury.gov`
            }
          }
        });
      component = await renderer.create(<DatasetDetail test={true}
                                                       pageContext={{
                                                         config: datasetPageSampleConfig,
                                                         seoConfig: seoConfig
                                                       }}
                                                       data={mockQueryReturn}
                                        />);
      instance = component.root;
    });
  });

  it('has a SiteLayout component placed forevermore within its layout', () => {
    // this statement causes test to fail if there's not exactly one <SiteLayout /> in layout
    instance.find(obj => obj.type === SiteLayout);
  });

  it('has a DDNav component placed forevermore within its layout', () => {
    // this statement causes test to fail if there's not exactly one <DDNav /> in layout
    instance.find(obj => obj.type === DDNav);
  });

  it('has a Masthead component placed forevermore within its layout', () => {
    // this statement causes test to fail if there's not exactly one <Masthead /> in layout
    instance.find(obj => obj.type === Masthead);
  });

  it('has a DatasetAbout component placed forevermore within its layout', () => {
    // this statement causes test to fail if there's not exactly one <DatasetAbout /> in layout
    instance.find(obj => obj.type === DatasetAbout);
  });

  it('has a DatasetData component and passes the setSelectedTable prop', () => {
    // this statement causes test to fail if there's not exactly one <DatasetData /> in layout
    const datasetDataComp = instance.find(obj => obj.type === DatasetData);
    expect(datasetDataComp.props.setSelectedTableProp).toBeDefined();
  });

  it('has an ApiQuickGuide component and passes the selectedTable prop', () => {
    // this statement causes test to fail if there's not exactly one <ApiQuickGuide /> in layout
    const apiComp = instance.find(obj => obj.type === ApiQuickGuide);
    expect(apiComp.props.selectedTable).toBeDefined();
  });

  it('has an RelatedDatasets component placed forevermore within its layout', () => {
    // this statement causes test to fail if there's not exactly one <RelatedDatasets /> in layout
    instance.find(obj => obj.type === RelatedDatasets);
  });

  it('ensures that the proper ordering of the dataset tables is preserved when passed ' +
    'down to dataset-data', () => {
    const datasetData = instance.findByType(DatasetData);
    expect(datasetData.props.config.apis.map(api => api.apiId))
    .toEqual(datasetPageSampleConfig.apis.map(api => api.apiId));
  });

  it('ensures that the proper ordering of the dataset tables\' fields are preserved when ' +
    'passed down to dataset-data', () => {
    const datasetData = instance.findByType(DatasetData);
    expect(datasetData.props.config.apis[0].fields).toEqual(datasetPageSampleConfig.apis[0].fields);
  });

  it('passes expected fields to helmet for structured data', () => {
    const helmet = instance.findByType(PageHelmet);
    expect(helmet.props.datasetDetails).toBeDefined();
    expect(helmet.props.pageTitle).toBe(seoConfig.pageTitle);
    expect(helmet.props.description).toBe(seoConfig.description);
    expect(helmet.props.keywords).toBe(seoConfig.keywords);
  });

  it('passes name of dataset to Related Datasets as a referrer', () => {
    const related = instance.findByType(RelatedDatasets);
    expect(related.props.referrer).toBe(datasetPageSampleConfig.name);
  });

  it('passes content for the banner callout if set in config', async() => {
    await renderer.act(async () => {
      useStaticQuery.mockReturnValue(
        {
          site: {
            siteMetadata: {
              siteUrl: `https://fiscalData.treasury.gov`
            }
          }
        });
      component = await renderer.create(<DatasetDetail test={true}
                                                       pageContext={{
                                                         config: {...datasetPageSampleConfig, "bannerCallout": {"banner": "TestCallout"}},
                                                         seoConfig: seoConfig
                                                       }}
                                                       data={mockQueryReturn}
                                        />);
      instance = component.root;
    });

    const masthead = instance.findByType(Masthead);
    expect(masthead.props.bannerCallout.banner).toBe("TestCallout");
  });
});

describe('Dataset detail - helper updateDates', () => {

  let consoleWarn;

  beforeAll(() => {
    consoleWarn = global.console.warn;
    global.console.warn = jest.fn();
  });

  afterAll(() => {
    global.console.warn = consoleWarn;
  });

  it('returns false if the inputs are invalid', () => {
    expect(updateDates(mockSummaryDataset, mockAPIs, null)).toBeFalsy();
    expect(updateDates(mockSummaryDataset, null, mockTechSpecs)).toBeFalsy();
    expect(updateDates(null, mockAPIs, null)).toBeFalsy();
    expect(updateDates({}, mockAPIs, null)).toBeFalsy();
  });

  it('returns false if there are no changes if no updates are found', () => {
    expect(updateDates(mockSummaryDatasetNoUpdates, mockAPIs, mockTechSpecs)).toBeFalsy();
  });

  it('returns true and updates both mockAPIs and mockTechSpecs if updates are found', () => {
    const newMockAPIs = JSON.parse(JSON.stringify((mockAPIs)));
    const newMockTechSpecs = JSON.parse(JSON.stringify((mockTechSpecs)));
    expect(newMockAPIs).toEqual(mockAPIs);
    expect(newMockTechSpecs).toEqual(mockTechSpecs);

    expect(updateDates(mockSummaryDataset, newMockAPIs, newMockTechSpecs)).toBeTruthy();

    expect(newMockAPIs).not.toEqual(mockAPIs);
    expect(newMockTechSpecs).not.toEqual(mockTechSpecs);

    expect(newMockTechSpecs.latestDate).toEqual(mockMaxDates.latestDateTechSpecs);
    expect(newMockTechSpecs.lastUpdated).toEqual(mockMaxDates.lastUpdatedTechSpecs);
    expect(newMockAPIs[0].lastUpdated).toEqual(mockMaxDates.lastUpdated);
    expect(newMockAPIs[1].latestDate).toEqual(mockMaxDates.latestDate);
  });
});
