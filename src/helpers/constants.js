
// const + Object.freeze makes the globalConstants object immutable.
const globalConstants = {
  API_BASE: 'https://api.fiscaldata.treasury.gov',
  BASE_SITE_URL: 'https://fiscaldata.treasury.gov',
  DATA_LAB_URL: 'https://datalab.usaspending.gov/',
  FISCAL_TREASURY_URL: 'https://fiscal.treasury.gov',
  PROD_API_BASE_URL:
    'https://api.fiscaldata.treasury.gov/services/api/fiscal_service',
  USA_SPENDING_URL: 'https://www.usaspending.gov/',
  METADATA_SUMMARY: '/services/dtg/metadata/summary',
  PUBLISHED_REPORTS: '/services/dtg/publishedfiles',
  RELEASE_CALENDAR: '/services/calendar/release',
  DOWNLOAD_CHECK_PAGE_PATH: '/downloads',
  EXTERNAL_LINK_REL: 'noreferrer noopener',
  DATA_DOWNLOAD_STATUS_PREFIX: '/static-data/downloads',
  DATE_RELATED_META_TYPES: ['YEAR', 'QUARTER', 'MONTH', 'DAY', 'DATE'],
  ENDPOINTS_WITH_YEAR_MONTH_DATE_FORMAT: ['151', '152'],
  DEFAULT_FETCH_RETRIES: 3,
  DEFAULT_FETCH_RETRY_TIMER: 3000,
  breakpoints: {
    small: 600,
    medium: 768,
    large: 992,
    extraLarge: 1205,
  },
  config: {
    splitFlap: {
      speed: 300, // milliseconds
    },
    formats: {
      apiDate: 'yyyy-MM-dd',
      uiDate: 'MM/dd/yyyy',
    },
    smooth_scroll: {
      delay: 200,
      duration: 600,
    },
    highlight: {
      defaultTimeToHighlight: 5000,
    },
    localStorage: {
      ttl: 2600000000, // in ms 30 days = 30 * 24 * 60 * (60 * 1000) = 2.6 billion dollars (ms)
    },
    publishedReports: {
      /**
       * If you alter this list of dataset ids, you will need to also update the same list
       * in published-reports.js > whitelistDatasetIds until Node/Gatsby-node is converted
       * to ES6 module syntax from CommonJS
       */
      datasets: [
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
      ],
    },
    downloadService: {
      localStorageKeys: {
        queued: 'queued-downloads',
        inProgress: 'in-progress-downloads',
        completed: 'completed-downloads',
      },
      pollingIntervalInMilliseconds: 30000, // 30 seconds
      APITotalPagesStartValue: 30,
      requestMaxAgeInMilliseconds: 86400000,
    },
    metadataUpdateService: {
      pollingInterval: 1000 * 60 * 5, // 5 minutes
      publishedReportsMaxCacheAge: 1000 * 60 * 5, // 5 minutes
    },
    stickyFooter: {
      defaultClosingTimeoutInMS: 7000,
    },
    homepage: {
      highlightAnalyticsHoverDelay: 3000,
      analyticsActions: {
        card: 'Card Hover',
        chart: 'Chart Hover',
        click: 'Click to Dataset',
      },
    },
    releaseCalendar: {
      daysToRequestFutureEntries: 365,
      pollingInterval: 1000 * 60 * 5, // 5 minutes
    },
  },
  gaEventLabels: {
    cancelDL: 'Cancel Download',
    closeDLDialog: 'Close Download Dialog Box',
    copyDLLink: 'Copy DL Link',
    downloadFile: 'Download File',
    stickyHideDetails: 'Hide Download Details',
    stickyMaximize: 'Maximize Download Bar',
    stickyMinimize: 'Minimize Download Bar',
    stickyShowDetails: 'Show Download Details',
  },
};

// Object.freeze(globalConstants);

export default globalConstants;
