import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import DatasetStructuredData from './build-dataset-structured-data.helper';
import globalConstants from "../../helpers/constants";
import { ENV_ID } from 'gatsby-env-variables';
import { graphql, useStaticQuery } from 'gatsby';


const PageHelmet = ({ pageTitle, description, descriptionGenerator, keywords, image, canonical, datasetDetails }) => {

  let versionInfo = useStaticQuery(graphql`
    {
      gitTag(latest: { eq: true }) {
        name
      }
      gitCommit(latest: { eq: true }) {
        hash
        date
        message
      }
      gitBranch(current: { eq: true }) {
        name
      }
      currentBuildDate {
        currentDate
      }
    }
  `);

  // protecting against null and undefined values mainly for unit tests
  // where version info is not supplied
  versionInfo = (versionInfo && versionInfo.gitCommit) ? versionInfo : {};
  const latestTag = versionInfo.gitTag ? versionInfo.gitTag.name : '';
  const latestCommit = versionInfo.gitCommit || {};
  const currentBranch = versionInfo.gitBranch ? versionInfo.gitBranch.name : '';
  const builtOnDate = versionInfo.currentBuildDate ? versionInfo.currentBuildDate.currentDate : '';

  const [dapAnalytics, setDapAnalytics] = useState(null);
  const [finalDescription, setFinalDescription] = useState(description);
  const baseUrl = globalConstants.BASE_SITE_URL;
  const title = pageTitle
    ? `${pageTitle} | U.S. Treasury Fiscal Data`
    : 'U.S. Treasury Fiscal Data';

  useEffect(() => {
    if (descriptionGenerator) {
      descriptionGenerator().then(res => {
        setFinalDescription(res)
      });
    }
    setDapAnalytics(
      <script
        async
        type="text/javascript"
        src="https://dap.digitalgov.gov/Universal-Federated-Analytics-Min.js?agency=TRE&subagency=FS"
        id="_fed_an_ua_tag"
      />
    )
  }, []);

  return (
    <Helmet>
      {/*Google Tag Manager */}
      <script>
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-5N9D5C5');`}
      </script>
      {/*End Google Tag Manager*/}
      {/*Google Tag Manager (noscript)*/}
      <noscript>
        {/* eslint-disable-next-line jsx-a11y/iframe-has-title */}
        {`<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5N9D5C5"
        height="0" width="0" style="display:none;visibility:hidden"
        />`}
      </noscript>
      {/*End Google Tag Manager (noscript)*/}
      {/*Google Analytics 4 Tag  */}
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-ME8TBPZYXP" />
      <script>
        {`window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-ME8TBPZYXP');`}
      </script>
      {/*Google Analytics 4 Tag  */}
      {/* Version info is placed inside a script comment below because both react jsx
          and gatsby are unfriendly toward rendering <!-- html comments --> into built pages.
      */}

      {(latestCommit && latestCommit.hash) && (
        <script id="version-info">
          {`/*
            TAG: ${latestTag}
            CURRENT BRANCH: ${currentBranch}
            COMMIT HASH: ${latestCommit.hash}
            COMMIT MESSAGE: ${latestCommit.message}
            COMMIT DATE: ${latestCommit.date}
            BUILD TIME: ${builtOnDate}
            ENV ID: ${ENV_ID}
          */`}
        </script>
      )}
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width" />
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <meta name="description" content={finalDescription || description} />
      <meta property="og:description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta
        property="og:image"
        content={image || `${baseUrl}/logos/fiscal_data_logo_1200x628.png`}
      />
      {dapAnalytics}
      {canonical && <link rel="canonical" href={`${baseUrl}${canonical}`} />}
      {datasetDetails && (
        <script data-test-id="structured-data" type="application/ld+json">
          {DatasetStructuredData(datasetDetails)}
        </script>
      )}
    </Helmet>
  );
};

export default PageHelmet;
