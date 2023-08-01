/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

const activeEnv = process.env.BUILD_ENV || "index";
let { EXCLUDED_PAGE_PATHS } = require(`./env/${activeEnv}.js`);

if (!EXCLUDED_PAGE_PATHS || !Array.isArray(EXCLUDED_PAGE_PATHS)) {
  EXCLUDED_PAGE_PATHS = [];
}

module.exports = {
  siteMetadata: {
    siteUrl: "https://fiscaldata.treasury.gov",
  },
  plugins: [
    // ////// IMPORTANT: Google Analytics Plugin must be the first item in this array //////
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "UA-168882758-1",
        head: true,
        defer: true,
      },
    },
    {
      resolve: "gatsby-plugin-exclude",
      options: { paths: EXCLUDED_PAGE_PATHS },
    },
    `gatsby-source-local-git`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-build-date`,
      options: {
        formatAsDateString: false,
      },
    },
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        excludes: [
          `/buildtime-data-store/`,
          "/search-x/",
          // remove with DTG-2414
          "/about-us/about-section/about-section/",
          "/about-us/contact-section/contact-section/",
          "/about-us/faq-section/faq-section/",
          // end DTG-2414
          // remove with DTG-2415
          "/api-documentation/aggregation/aggregation/",
          "/api-documentation/endpoints/endpoints/",
          "/api-documentation/examples/examples/",
          "/api-documentation/fields/fields/",
          "/api-documentation/filters/filters/",
          "/api-documentation/getting-started/getting-started/",
          "/api-documentation/methods/methods/",
          "/api-documentation/multi-dimension-datasets/multi-dimension-datasets/",
          "/api-documentation/parameters/format/format/",
          "/api-documentation/parameters/pagination/pagination/",
          "/api-documentation/parameters/parameters/",
          "/api-documentation/parameters/sorting/sorting/",
          "/api-documentation/pivoting/pivoting/",
          "/api-documentation/responses/responses/",
          "/api-documentation/section-content/section-content/",
          // end DTG-2415
        ],
      },
    },
    {
      resolve: `gatsby-plugin-polyfill-io`,
      options: {
        features: [`Array.prototype.map`, `fetch`],
      },
    },
    {
      resolve: "gatsby-plugin-sass",
      options: {
        useResolveUrlLoader: true,
      },
    },
    "gatsby-plugin-dts-css-modules",
    {
      resolve: "gatsby-plugin-html-attributes",
      options: {
        lang: "en",
      },
    },
    {
      resolve: "gatsby-plugin-eslint",
      options: {
        test: /\.js$|\.jsx$/,
        exclude: /(node_modules|.cache|public)/,
        stages: ["develop"],
        options: {
          emitWarning: true,
          failOnError: false,
        },
      },
    },
    "gatsby-plugin-material-ui",
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: "Fiscal Data",
        short_name: "Fiscal Data",
        start_url: "/",
        background_color: "white",
        theme_color: "#112e51",
        display: "standalone",
        icon: "src/images/favicon.png",
        crossOrigin: `use-credentials`,
      },
    },
    "gatsby-env-variables",
    {
      resolve: `gatsby-plugin-robots-txt`,
      options: {
        host: "https://fiscaldata.treasury.gov/",
        sitemap: "https://fiscaldata.treasury.gov/sitemap/sitemap-index.xml",
        resolveEnv: () => process.env.BUILD_ENV,
        env: {
          prod: {
            policy: [{ userAgent: "*", allow: "/" }],
          },
          development: {
            policy: [{ userAgent: "*", disallow: ["/"] }],
          },
        },
      },
    },
    {
      resolve: `gatsby-plugin-typescript`,
    },
    "gatsby-transformer-remark",
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `topic-icons`,
        path: `${__dirname}/static/topic-icons/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `topics-section-images`,
        path: `${__dirname}/static/topics-section-images/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `markdown`,
        path: `${__dirname}/src/markdown/`,
        ignore: [`**/\.*`], // ignore files starting with a dot
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `cpi-data`,
        path: `${__dirname}/static/data/CPI/`,
      },
    },
    `gatsby-transformer-csv`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `glossary`,
        path: `${__dirname}/static/data/glossary/`,
      },
    },
    `gatsby-transformer-csv`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `deficitExplainerEventTracking`,
        path: `${__dirname}/static/data/ga-event-tracking/`,
      },
    },
    `gatsby-transformer-csv`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `debtExplainerEventTracking`,
        path: `${__dirname}/static/data/ga-event-tracking/`,
      },
    },
    `gatsby-transformer-csv`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `spendingExplainerEventTracking`,
        path: `${__dirname}/static/data/ga-event-tracking/`,
      },
    },
    `gatsby-transformer-csv`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `revenueExplainerEventTracking`,
        path: `${__dirname}/static/data/ga-event-tracking/`,
      },
    },
    `gatsby-transformer-csv`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `AFGOverviewEventTracking`,
        path: `${__dirname}/static/data/ga-event-tracking/`,
      },
    },
    `gatsby-transformer-csv`,
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.mdx`, `.md`],
        defaultLayouts: {
          default: require.resolve("./src/components/mdx/defaultLayout.jsx"),
        },
      },
    },
    `gatsby-plugin-client-side-redirect`,
    {
      resolve: 'gatsby-plugin-axe-core-react',
      options: {
        debounce: 3000,
      },
    },
  ],
};
