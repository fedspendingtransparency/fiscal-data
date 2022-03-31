import { useStaticQuery, graphql } from 'gatsby';

const getUrl = (config) => {
   // eslint-disable-next-line react-hooks/rules-of-hooks
   const { site } = useStaticQuery(
      graphql`
         query {
            site {
               siteMetadata {
                  siteUrl
               }
            }
         }
   `);

   return site.siteMetadata.siteUrl + '/datasets' + config.slug;
};

const setTemporalCoverage = (config) => {
   return ['earliestDate', 'latestDate'].map(d => {
      const dateParts = config.techSpecs[d].split('/');

      return [dateParts[2], dateParts[0], dateParts[1]].join('-')
   }).join('/');
};

const structuredData = {
   '@context': 'https://schema.org/',
   '@type': 'Dataset',
   creator: {
      '@type': 'Organization',
      url: 'https://home.treasury.gov/',
      name: 'U.S. DEPARTMENT OF THE TREASURY'
   },
   distribution: [
      {
         '@type': 'DataDownload',
         encodingFormat: 'CSV'
      },
      {
         '@type': 'DataDownload',
         encodingFormat: 'JSON'
      },
      {
         '@type': 'DataDownload',
         encodingFormat: 'XML'
      }
   ]
};

const DatasetStructuredData = (config) => {
   structuredData.name = config.name;
   structuredData.description = config.tagLine;
   structuredData.url = getUrl(config);
   structuredData.hasPart = config.apis.map(t => {
      return {
         '@type': 'Dataset',
         name: t.tableName,
         description: t.tableDescription
      }
   });
   structuredData.distribution.forEach(d => d.contentUrl = getUrl(config));
   structuredData.temporalCoverage = setTemporalCoverage(config);

   return JSON.stringify(structuredData);
};

export default DatasetStructuredData;
