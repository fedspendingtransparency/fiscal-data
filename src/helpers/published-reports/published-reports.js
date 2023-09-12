
// This file needs to use CommonJS syntax and therefore can't use import. However,
// we will be migrating all of this to ES6 module syntax in order to further streamline
// the code base.
//import globalConstants from "../constants";

//const whitelistDatasetIds = globalConstants.config.publishedReports.datasets;
// TODO - Update Node/Gatsby-Node to ES6 vs CommonJS
const { getDateWithoutTimeZoneAdjust } = require ("../../utils/date-utils");

/**
 * **********************************************************
 * If the following list of dataset ids needs to be updated, you will need to also
 * update the same list in the constants.js > config > publishedReports > datasets
 * until the above TODO is to done. - 28 Sept 2021
 * **********************************************************
  * @type {string[]}
 */
const whitelistDatasetIds = [
  '015-BFS-2014Q1-13',
  '015-BFS-2014Q3-076',
  '015-BFS-2014Q1-11',
  '015-BFS-2014Q1-07',
  '015-BFS-2014Q3-077',
  '015-BFS-2014Q1-18',
  '015-BFS-2014Q3-038',
  '015-BFS-2014Q1-03',
  '015-BFS-2014Q3-037',
  '015-BFS-2014Q3-098',
  '015-BFS-2014Q3-045',
  '015-BFS-2014Q3-046',
];
exports.whiteListIds = whitelistDatasetIds;

const whitelistedGroupsByDataset = {};

const getPublishedReports = async (datasetId, baseUrl, requestUtil) => {
  // Todo - Remove all references to whiteListIds when every dataset is approved for use from the
  // publishedReports api.
  let publishedReports = null;

  if(whitelistDatasetIds.some(d => d === datasetId)){
    const url = `${baseUrl}/services/dtg/publishedfiles?dataset_id=${datasetId}`;
    publishedReports = await requestUtil(url)
      .then(async res => {
        let reports = await res.json().then(body => body);
        if (whitelistedGroupsByDataset[datasetId]) {
          reports = reports.filter(
            rpt => whitelistedGroupsByDataset[datasetId].includes(rpt['report_group_desc'])
          );
        }
        reports.forEach(report => {
          if (report.report_date && typeof report.report_date === 'string') {
            report.report_date = getDateWithoutTimeZoneAdjust(report.report_date);
          }
        });
        return reports
      })
      .catch(async err => {
        console.warn(`Failed to get build-time published files.  Msg: ${err}`);
      });
  }
  return publishedReports;
};
exports.getPublishedReports = getPublishedReports;

exports.mockPublishedReportsMSPD = {
  "015-BFS-2014Q1-11": [
    {
      "path": "/downloads/mspd_reports/opdm092020.pdf",
      "report_group_desc": "Entire (.pdf)",
      "report_date": "2020-09-30",
      "filesize": "188264",
      "report_group_sort_order_nbr": 0,
      "report_group_id": 3
    },
    {
      "path": "/downloads/mspd_reports/opdx092020.xls",
      "report_group_desc": "Primary Dealers (.xls)",
      "report_date": "2020-09-30",
      "filesize": "810496",
      "report_group_sort_order_nbr": 1,
      "report_group_id": 3
    }
  ]
};

exports.mockPublishedReportsMTS = {
  "015-BFS-2014Q1-11": [
    {
      "path": "/downloads/mts_reports/mts092020.pdf",
      "report_group_desc": "Entire (.pdf)",
      "report_date": "2020-09-30",
      "filesize": "188264",
      "report_group_sort_order_nbr": 0,
      "report_group_id": 3
    },
    {
      "path": "/downloads/mts_reports/mts092020.xls",
      "report_group_desc": "Primary Dealers (.xls)",
      "report_date": "2020-09-30",
      "filesize": "810496",
      "report_group_sort_order_nbr": 1,
      "report_group_id": 3
    }
  ]
};
