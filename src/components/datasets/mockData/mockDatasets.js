import { mockFilters } from "./mockFilters"
import { format } from "date-fns";
import {testVariables} from "../../../utils/mock-utils";

export const mockLatestDates = {
  '1': {
    cachedTechSpecs: '12/19/2019',
    summaryMetadata: '2021-01-01',
    summaryTechSpecs: '01/01/2021'
  },
  '2': {
    cachedTechSpecs: '01/02/2019',
    summaryMetadata: '2019-01-02',
    summaryTechSpecs: '01/02/2019'
  },
  '3': {
    cachedTechSpecs: '12/20/2019',
    summaryMetadata: '',
    summaryTechSpecs: ''
  }
};

export const mockDatasets = [
    {
        "datasetId": "015-BFS-2014Q1-11",
        "dataStartYear": "2000",
        "name": "Treasury Offset Program (TOP)",
        "searchScore": 10,
        "tags": ["Debt", "MVP"],
        "slug": "/treasury-offset-program-TOP/",
        "tagLine": "test tag line TOP",
        "summaryText": "The TOP is a centralized program which collects delinquent debts " +
          "owed to federal agencies and states.",
        "relatedTopics": [
          "Debt",
          "Financial Summaries",
          "Interest & Exchange Rates",
          "Savings Bonds"
        ],
        "filters": [
          "startDateRangeThree",
          "csv"
        ],
        "techSpecs": {
          "earliestDate": "01/01/1950",
          "latestDate": format(
            testVariables.dates.withinNinetyDays,
            testVariables.dateFormats.displayFormat
          ),
          "fileFormat": "JSON, CSV, XML",
          "lastUpdated": format(
            testVariables.dates.withinNinetyDays_Updated,
            testVariables.dateFormats.displayFormat
          )
        },
        "apis": [
          {
            "apiId": 3,
            "latestDate": format(
              testVariables.dates.withinNinetyDays,
              testVariables.dateFormats.isoDate
            ),
            "lastUpdated": format(
              testVariables.dates.withinNinetyDays_Updated,
              testVariables.dateFormats.isoDate
            ),
            "earliestDate": "1950-01-01",
            "fields": [
              {
                "columnName": "record_fiscal_year",
                "prettyName": "Fiscal Year"
              },
              {
                "columnName": "some_crazy_name",
                "prettyName": "SomeCrazyName"
              }
            ]
          },
          {
            "apiId": 5,
            "latestDate": "2021-08-01",
            "lastUpdated": "2021-08-02",
            "earliestDate": "1905-01-05",
            "field": [
              {
                "columnName": "record_fiscal_year",
                "prettyName": "Fiscal Year"
              },
              {
                "columnName": "some_crazy_name",
                "prettyName": "SomeCrazyName"
              }
            ]
          }
        ]
    },
    {
        "datasetId": "dataset_id_2",
        "dataStartYear": "1995",
        "name": "Debt to the Penny",
        "searchScore": 100,
        "tags": ["Debt", "MVP"],
        "tagLine": "test tag line DTTP",
        "summaryText": "DTTP is the total public debt outstanding reported each business " +
          "day at 3:00 P.M. Eastern Time",
        "slug": "/debt-to-the-penny/",
        "techSpecs": {
          "earliestDate": "01/01/1995",
          "latestDate": mockLatestDates['2'].cachedTechSpecs,
          "fileFormat": "JSON, CSV, XML",
          "lastUpdated": "04/08/2021"
        },
        "filters": [
          "ninetyDays",
          "startDateRangeTwo",
          "csv",
          "lastYear"
        ],
        "apis": [
          {
            "apiId": 4,
            "latestDate": "2021-08-04",
            "lastUpdated": "2021-08-05",
            "earliestDate": "1995-04-04",
            "fields": [
              {
                "columnName": "some_crazy_name",
                "prettyName": "SomeCrazyName"
              }
            ]
          }
        ]
    },
    {
        "datasetId": "dataset_id_3",
        "dataStartYear": "2019",
        "name": "Record Setting Auction Data",
        "searchScore": 1,
        "tags": ["Auction", "MVP"],
        "slug": "/record-setting-auction-data/",
        "tagLine": "test tag line Auction Data",
        "summaryText": "RSAD for Treasury marketable securities, such as the lowest rate " +
          "or yield ever, the highest rate ever",
        "techSpecs": {
            "earliestDate": "12/19/2019",
            "latestDate": mockLatestDates['3'].cachedTechSpecs,
            "fileFormat": "JSON, CSV, XML",
            "lastUpdated": "12/20/2019"
        },
        "filters": [
          "startDateRangeFour",
          "lastYear",
          "ninetyDays",
          "thirtyDays"
        ],
        "apis": [
          {
            "apiId": 100,
            "latestDate": "2021-08-01",
            "lastUpdated": "2021-08-02",
            "earliestDate": "2005-01-01"
          },
          {
            "apiId": 101,
            "latestDate": "2021-08-02",
            "lastUpdated": "2021-08-03",
            "earliestDate": "1901-01-11"
          },
          {
            "apiId": 102,
            "latestDate": "2021-08-02",
            "lastUpdated": "2021-08-03",
            "earliestDate": "1902-02-20"
          }
        ]
    }];

export const metadataSummaryData = [
  {
    dataset_id: "015-BFS-2014Q1-11",
    apis: [
      {
        api_id: 3,
        earliest_date: "1950-01-01",
        latest_date: format(
          testVariables.dates.withinNinetyDays,
          testVariables.dateFormats.isoDate
        ),
        last_updated: format(
          testVariables.dates.withinNinetyDays_Updated,
          testVariables.dateFormats.isoDate
        )
      },
      {
        api_id: 5,
        earliest_date: "1997-10-31",
        latest_date: format(
          testVariables.dates.outsideNinetyDays,
          testVariables.dateFormats.isoDate
        ),
        last_updated: format(
          testVariables.dates.outsideNinetyDays_Updated,
          testVariables.dateFormats.isoDate
        )
      }
    ]
  },
  {
    dataset_id: "dataset_id_2",
    apis: [
      {
        api_id: 4,
        earliest_date: "1997-01-31",
        latest_date: format(
          testVariables.dates.withinSixtyDays,
          testVariables.dateFormats.isoDate
        ),
        last_updated: format(
          testVariables.dates.withinSixtyDays_Updated,
          testVariables.dateFormats.isoDate
        )
      }
    ]
  },
  {
    dataset_id: "dataset_id_3",
    apis: [
      {
        api_id: 100,
        earliest_date: "2005-10-31",
        latest_date: "2021-07-31",
        last_updated: "2021-08-17"
      },
      {
        api_id: 101,
        earliest_date: "2004-12-31",
        latest_date: "2021-07-31",
        last_updated: "2021-08-20"
      },
      {
        api_id: 102,
        earliest_date: "2015-09-30",
        latest_date: format(
          testVariables.dates.withinThirtyDays,
          testVariables.dateFormats.isoDate
        ),
        last_updated: format(
          testVariables.dates.withinThirtyDays_Updated,
          testVariables.dateFormats.isoDate
        )
      }
    ]
  }
];

export const metadataSummaryDataWithMod = [
  {
    dataset_id: "015-BFS-2014Q1-11",
    apis: [
      {
        api_id: 3,
        earliest_date: "1950-01-01",
        latest_date: format(
          testVariables.dates.withinNinetyDays,
          testVariables.dateFormats.isoDate
        ),
        last_updated: format(
          testVariables.dates.withinNinetyDays_Updated,
          testVariables.dateFormats.isoDate
        )
      },
      {
        api_id: 5,
        earliest_date: "1997-10-31",
        latest_date: format(
          testVariables.dates.outsideNinetyDays,
          testVariables.dateFormats.isoDate
        ),
        last_updated: format(
          testVariables.dates.outsideNinetyDays_Updated,
          testVariables.dateFormats.isoDate
        )
      }
    ]
  },
  {
    dataset_id: "dataset_id_2",
    apis: [
      {
        api_id: 4,
        earliest_date: "1997-01-31",
        latest_date: format(
          testVariables.dates.withinSixtyDays,
          testVariables.dateFormats.isoDate
        ),
        last_updated: format(
          testVariables.dates.withinSixtyDays_Updated,
          testVariables.dateFormats.isoDate
        )
      }
    ]
  },
  {
    dataset_id: "dataset_id_3",
    apis: [
      {
        api_id: 100,
        earliest_date: "2005-10-31",
        latest_date: "2021-07-31",
        last_updated: "2021-08-17"
      },
      {
        api_id: 101,
        earliest_date: "2004-12-31",
        latest_date: "2021-07-31",
        last_updated: "2021-08-20"
      },
      {
        api_id: 102,
        earliest_date: "2015-09-30",
        latest_date: format(
          testVariables.dates.withinThirtyDays,
          testVariables.dateFormats.isoDate
        ),
        last_updated: format(
          testVariables.dates.withinThirtyDays_Updated,
          testVariables.dateFormats.isoDate
        )
      }
    ]
  }
];

export const mockUpdatedMetadataDatasets = [
  {
    "datasetId": "015-BFS-2014Q1-11",
    "dataStartYear": "2000",
    "name": "Treasury Offset Program (TOP)",
    "searchScore": 10,
    "tags": ["Debt", "MVP"],
    "slug": "/treasury-offset-program-TOP/",
    "tagLine": "test tag line TOP",
    "summaryText": "The TOP is a centralized program which collects delinquent debts " +
      "owed to federal agencies and states.",
    "relatedTopics": ["Debt", "Financial Summaries", "Interest & Exchange Rates", "Savings Bonds"],
    "techSpecs": {
      "earliestDate": "01/01/1950",
      "latestDate": format(
        testVariables.dates.withinNinetyDays,
        testVariables.dateFormats.displayFormat
      ),
      "fileFormat": "JSON, CSV, XML",
      "lastUpdated": format(
        testVariables.dates.withinNinetyDays_Updated,
        testVariables.dateFormats.displayFormat
      ),
    },
    "filters": [
      "lastYear",
      "startDateRangeThree"
    ],
    "apis": [
      {
        "apiId": 3,
        "earliestDate": "1950-01-01",
        "latestDate": format(
          testVariables.dates.withinNinetyDays,
          testVariables.dateFormats.isoDate
        ),
        "lastUpdated": format(
          testVariables.dates.withinNinetyDays_Updated,
          testVariables.dateFormats.isoDate
        ),
        "fields": [
          {
            "columnName": "record_fiscal_year",
            "prettyName": "Fiscal Year"
          },
          {
            "columnName": "some_crazy_name",
            "prettyName": "SomeCrazyName"
          }
        ]
      },
      {
        "apiId": 5,
        "earliestDate": "2002-10-31",
        "latestDate": "2021-08-01",
        "lastUpdated": "2021-08-17",
        "field": [
          {
            "columnName": "record_fiscal_year",
            "prettyName": "Fiscal Year"
          },
          {
            "columnName": "some_crazy_name",
            "prettyName": "SomeCrazyName"
          }
        ]
      }
    ]
  },
  {
    "datasetId": "dataset_id_2",
    "dataStartYear": "1995",
    "name": "Debt to the Penny",
    "searchScore": 100,
    "tags": ["Debt", "MVP"],
    "tagLine": "test tag line DTTP",
    "summaryText": "DTTP is the total public debt outstanding reported each business " +
      "day at 3:00 P.M. Eastern Time",
    "slug": "/debt-to-the-penny/",
    "techSpecs": {
      "earliestDate": "01/31/1997",
      "latestDate": format(
        testVariables.dates.withinSixtyDays,
        testVariables.dateFormats.displayFormat
      ),
      "fileFormat": "JSON, CSV, XML",
      "lastUpdated": format(
        testVariables.dates.withinSixtyDays_Updated,
        testVariables.dateFormats.displayFormat
      ),
    },
    "filters": [
      "ninetyDays",
      "startDateRangeTwo",
      "csv"
    ],
    "apis": [
      {
        "apiId": 4,
        "earliestDate": "2000-01-31",
        "latestDate": format(
          testVariables.dates.withinSixtyDays,
          testVariables.dateFormats.isoDate
        ),
        "lastUpdated": format(
          testVariables.dates.withinSixtyDays_Updated,
          testVariables.dateFormats.isoDate
        ),
        "fields": [
          {
            "columnName": "some_crazy_name",
            "prettyName": "SomeCrazyName"
          }
        ]
      }
    ]
  },
  {
    "datasetId": "dataset_id_3",
    "dataStartYear": "2019",
    "name": "Record Setting Auction Data",
    "searchScore": 1,
    "tags": ["Auction", "MVP"],
    "slug": "/record-setting-auction-data/",
    "tagLine": "test tag line Auction Data",
    "summaryText": "RSAD for Treasury marketable securities, such as the lowest rate or " +
      "yield ever, the highest rate ever",
    "techSpecs": {
      "earliestDate": "12/31/2004",
      "latestDate": format(
        testVariables.dates.withinThirtyDays,
        testVariables.dateFormats.displayFormat
      ),
      "fileFormat": "JSON, CSV, XML",
      "lastUpdated": format(
        testVariables.dates.withinThirtyDays_Updated,
        testVariables.dateFormats.displayFormat
      )
    },
    "filters": ["startDateRangeFour"],
    "apis": [
      {
        "apiId": 100,
        "earliestDate": "2005-10-31",
        "latestDate": "2021-07-31",
        "lastUpdated": "2021-08-17"
      },
      {
        "apiId": 101,
        "earliestDate": "2004-12-31",
        "latestDate": "2021-07-31",
        "lastUpdated": "2021-08-20"
      },
      {
        "apiId": 102,
        "earliestDate": "2001-09-30",
        "latestDate": format(
          testVariables.dates.withinThirtyDays,
          testVariables.dateFormats.isoDate
        ),
        "lastUpdated": format(
          testVariables.dates.withinThirtyDays_Updated,
          testVariables.dateFormats.isoDate
        )
      }
    ]
  }
];

export const datasetPageSampleConfig = {
  "datasetId": "dataset_id_1",
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
            "include the discount and premium for treasury bills, notes, bonds, FRNs, and " +
            "TIPS, all of which can be bought and sold in the secondary market at " +
            "prevailing market prices.",
          "tableName": "Summary of Treasury Securities Outstanding",
          "prettyName": null,
          "dataType": null,
          "isRequired": "yes"
        },
        {
          "columnName": "security_holder",
          "definition": "Tier two of a three-tier hierarchy for categorizing Treasury " +
            "securities. Indicates whether the security is held by the public or part " +
            "of intragovernmental holdings. ",
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
      "tableName": "Table 2 with a longer name to show off truncation",
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
          "definition": "Indicates the corresponding table number in the Monthly Statement " +
            "of the Public Debt report",
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
  "tagLine": "High level overview of Treasury securities and the statutory debt limit, " +
    "detailed data on outstanding securities, and holdings of treasury securities in " +
    "stripped form.",
  "summaryText": "The Monthly Statement of the Public Debt is a report dating back to " +
    "1869 that details the Treasury’s outstanding debts and the debt limit. Debt is " +
    "categorized by its marketability (whether it can be sold in secondary markets) as well " +
    "as if the debt is held by the public or intragovernmental organizations. Beyond the " +
    "first page, there are detailed accounts of debt by type as well as accounts of debt " +
    "that is no longer outstanding. All amounts are reported in the millions of dollars. " +
    "Reports are published on the fourth business day of each month, detailing the debt as " +
    "of the end of the previous month.",
  "publisher": "Fiscal Accounting"
};

export const pageQueryMock = {
    allDatasets: {
      datasets: mockDatasets
    },
    allTopics: {
      topics: []
    },
    allFilters: {
      filters: mockFilters
    },
    allFile: {
      topicIcons: []
    }
}
