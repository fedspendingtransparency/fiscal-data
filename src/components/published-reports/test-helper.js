import { getDateWithoutTimeZoneAdjust } from "../../utils/date-utils"

export const reports = [
  {
    "path": "/downloads/mspd_reports/opdm072020.pdf",
    "report_group_desc": "Entire (.pdf)",
    "report_date": getDateWithoutTimeZoneAdjust("2020-07-31"),
    "filesize": "190932",
    "report_group_sort_order_nbr": 0,
    "report_group_id": "1"
  },
  {
    "path": "/downloads/mspd_reports/opdm062020.pdf",
    "report_group_desc": "Entire (.pdf)",
    "report_date": getDateWithoutTimeZoneAdjust("2020-06-30"),
    "filesize": "293887",
    "report_group_sort_order_nbr": 0,
    "report_group_id": "1"
  },
  {
    "path": "/downloads/mspd_reports/opdm052020.pdf",
    "report_group_desc": "Entire (.pdf)",
    "report_date": getDateWithoutTimeZoneAdjust("2019-05-31"),
    "filesize": "190396",
    "report_group_sort_order_nbr": 0,
    "report_group_id": "1"
  },
  {
    "path": "/downloads/mspd_reports/opdx092020.xls",
    "report_group_desc": "Entire (.xls)",
    "report_date": getDateWithoutTimeZoneAdjust("2020-09-30"),
    "filesize": "810496",
    "report_group_sort_order_nbr": 1,
    "report_group_id": "2"
  },
  {
    "path": "/downloads/mspd_reports/opdx082020.xls",
    "report_group_desc": "Entire (.xls)",
    "report_date": getDateWithoutTimeZoneAdjust("2020-08-31"),
    "filesize": "808960",
    "report_group_sort_order_nbr": 1,
    "report_group_id": "2"
  },
];

export const dailyReports = [
  {
    "path": "/downloads/dts_reports/worksheet2021.xls",
    "report_group_desc": "Spreadsheets",
    "report_date": getDateWithoutTimeZoneAdjust("2021-07-02"),
    "filesize": "190932",
    "report_group_sort_order_nbr": 1,
    "report_group_id": "1"
  },
  {
    "path": "/downloads/dts_reports/worksheet2020.xls",
    "report_group_desc": "Spreadsheets",
    "report_date": getDateWithoutTimeZoneAdjust("2020-07-08"),
    "filesize": "293887",
    "report_group_sort_order_nbr": 1,
    "report_group_id": "1"
  },
  {
    "path": "/downloads/mspd_reports/opdm072020.pdf",
    "report_group_desc": "Entire (.pdf)",
    "report_date": getDateWithoutTimeZoneAdjust("2020-07-14"),
    "filesize": "190932",
    "report_group_sort_order_nbr": 1,
    "report_group_id": "13"
  },
  {
    "path": "/downloads/mspd_reports/opdm062020.pdf",
    "report_group_desc": "Entire (.pdf)",
    "report_date": getDateWithoutTimeZoneAdjust("2020-07-13"),
    "filesize": "293887",
    "report_group_sort_order_nbr": 1,
    "report_group_id": "13"
  },
  {
    "path": "/downloads/mspd_reports/opdm052020.pdf",
    "report_group_desc": "Entire (.pdf)",
    "report_date": getDateWithoutTimeZoneAdjust("2020-07-12"),
    "filesize": "190396",
    "report_group_sort_order_nbr": 1,
    "report_group_id": "13"
  },
  {
    "path": "/downloads/mspd_reports/opdx092020.pdf",
    "report_group_desc": "Entire (.pdf)",
    "report_date": getDateWithoutTimeZoneAdjust("2020-07-11"),
    "filesize": "810496",
    "report_group_sort_order_nbr": 1,
    "report_group_id": "13"
  },
  {
    "path": "/downloads/mspd_reports/opdx082020.pdf",
    "report_group_desc": "Entire (.pdf)",
    "report_date": getDateWithoutTimeZoneAdjust("2019-02-14"),
    "filesize": "808960",
    "report_group_sort_order_nbr": 1,
    "report_group_id": "13"
  },
  {
    "path": "/downloads/dts_reports/announce2021.xls",
    "report_group_desc": "Announcements",
    "report_date": getDateWithoutTimeZoneAdjust("2021-07-02"),
    "filesize": "190932",
    "report_group_sort_order_nbr": 1,
    "report_group_id": "-1"
  },
  {
    "path": "/downloads/dts_reports/announce2020.xls",
    "report_group_desc": "Announcements",
    "report_date": getDateWithoutTimeZoneAdjust("2020-07-08"),
    "filesize": "293887",
    "report_group_sort_order_nbr": 1,
    "report_group_id": "-1"
  }
];

export const dataset = {
  slug: '/blah/',
  name: 'dataset 1',
  tagLine: 'dataset 1 does this',
  relatedTopics: ['one', 'two', 'three'],
  publishedReportsTip: "Test Report Tip",
  techSpecs: {
    earliestDate: '01/01/01',
    latestDate: '02/02/02',
    updateFrequency: 'monthly',
    lastUpdated: '01/01/20',
    fileFormat: 'yes'
  },
  dictionary: 1
};
