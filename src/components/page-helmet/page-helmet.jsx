import React, { useEffect, useState } from 'react';
import DatasetStructuredData from './build-dataset-structured-data.helper';
import globalConstants from '../../helpers/constants';
import { ENV_ID } from 'gatsby-env-variables';
import { graphql, useStaticQuery } from 'gatsby';
import SocialMetaData from '../social-share/social-metadata/social-metadata';

const PageHelmet = ({
  pageTitle,
  description,
  descriptionGenerator = false,
  keywords,
  image = '',
  canonical = '',
  datasetDetails = '',
  socialShare,
}) => {
  let versionInfo = useStaticQuery(graphql`
    {
      gitCommit(latest: { eq: true }) {
        hash
        date
        message
      }
      gitBranch(current: { eq: true }) {
        name
      }
    }
  `);

  // protecting against null and undefined values mainly for unit tests
  // where version info is not supplied
  versionInfo = versionInfo && versionInfo.gitCommit ? versionInfo : {};
  const latestTag = versionInfo.gitTag ? versionInfo.gitTag.name : '';
  const latestCommit = versionInfo.gitCommit || {};
  const currentBranch = versionInfo.gitBranch ? versionInfo.gitBranch.name : '';

  const [finalDescription, setFinalDescription] = useState(description);
  const baseUrl = globalConstants.BASE_SITE_URL;
  const title = pageTitle ? `${pageTitle} | U.S. Treasury Fiscal Data` : 'U.S. Treasury Fiscal Data';

  useEffect(() => {
    if (descriptionGenerator) {
      descriptionGenerator().then(res => {
        setFinalDescription(res);
      });
    }
  }, []);

  return (
    <>
      {/* Version info is placed inside a script comment below because both react jsx
          and gatsby are unfriendly toward rendering <!-- html comments --> into built pages.
      */}
      <script data-testid="version-info">
        {`/*
            TAG: ${latestTag}
            CURRENT BRANCH: ${currentBranch}
            COMMIT HASH: ${latestCommit?.hash}
            COMMIT MESSAGE: ${latestCommit?.message}
            COMMIT DATE: ${latestCommit?.date}
            ENV ID: ${ENV_ID}
          */`}
      </script>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width" />
      <title>{title}</title>
      <meta name="description" content={finalDescription || description} />
      {!socialShare && (
        <>
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="og:image" content={image || `${baseUrl}/logos/fiscal_data_logo_1200x628.png`} />
        </>
      )}
      {socialShare && (
        <SocialMetaData image={socialShare.image} title={socialShare.title} description={socialShare.description} url={socialShare.url} />
      )}
      <meta name="keywords" content={keywords} />
      <meta name="google-site-verification" content="xVYP-oDTuRBvXHwXwy4kAM7weCAP1OlWoOCX_DsJC0M" />
      {canonical && <link rel="canonical" href={`${baseUrl}${canonical}`} />}
      {datasetDetails && (
        <script data-testid="structured-data" type="application/ld+json">
          {DatasetStructuredData(datasetDetails)}
        </script>
      )}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
      {/*<link rel="preconnect" href="https://www.googletagmanager.com" />*/}
      {/*/!*Google Tag Manager *!/*/}
      {/*<script*/}
      {/*  async*/}
      {/*  type="text/javascript"*/}
      {/*  src="https://dap.digitalgov.gov/Universal-Federated-Analytics-Min.js?agency=TRE&subagency=FS"*/}
      {/*  id="_fed_an_ua_tag"*/}
      {/*/>*/}
      {/*<script async>*/}
      {/*  {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':*/}
      {/*  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],*/}
      {/*  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=*/}
      {/*  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);*/}
      {/*})(window,document,'script','dataLayer','GTM-5N9D5C5');`}*/}
      {/*</script>*/}
      {/*/!*End Google Tag Manager*!/*/}
      {/*/!*Google Analytics 4 Tag  *!/*/}
      {/*<script async src="https://www.googletagmanager.com/gtag/js?id=G-ME8TBPZYXP" />*/}
      {/*<script async>*/}
      {/*  {`window.dataLayer = window.dataLayer || [];*/}
      {/*  function gtag(){dataLayer.push(arguments);}*/}
      {/*  gtag('js', new Date());*/}
      {/*  gtag('config', 'G-ME8TBPZYXP');`}*/}
      {/*</script>*/}
      {/*Google Analytics 4 Tag  */}
    </>
  );
};

export default PageHelmet;
