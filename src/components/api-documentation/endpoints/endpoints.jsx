import React from 'react';
import SectionContent from '../section-content/section-content';
import { graphql, useStaticQuery } from 'gatsby';
import { code } from '../../../pages/api-documentation/api.module.scss';
import { endpointTableSpacing, listOfEndpointsTable } from './endpoints.module.scss';
import GLOBALS from '../../../helpers/constants';
import CustomLink from '../../links/custom-link/custom-link';
import SuperBasicDtgTable from '../../dtg-table/super-basic-dtg-table';

const Endpoints = () => {
  const result = useStaticQuery(graphql`
    query {
      allDatasets(filter: { apis: { elemMatch: { endpoint: { ne: "" } } } }) {
        datasets: nodes {
          name
          slug
          apis {
            endpoint
            tableDescription
            tableName
          }
        }
      }
    }
  `);

  const apiBaseUrl = GLOBALS.PROD_API_BASE_URL;
  const rowsPerPage = 10;

  const data = [];

  result.allDatasets.datasets
    .sort((a, b) => {
      /*
       * Performs a two-tiered sort. The primary sort is the dataset name, the secondary sort is the
       * table name.
       */
      const nameA = a.name;
      const nameB = b.name;
      const nameDifference = nameA.localeCompare(nameB);

      if (nameDifference === 0) {
        const tableNameA = a.tableName ? a.tableName.replace(/&nbsp;/gi, ' ').toUpperCase() : '';
        const tableNameB = b.tableName ? b.tableName.replace(/&nbsp;/gi, ' ').toUpperCase() : '';
        return tableNameA.localeCompare(tableNameB);
      }

      return nameDifference;
    })
    .forEach(a => {
      // Creates desired link for the first column's data to point to the dataset's detail page.
      const datasetLink = <CustomLink url={`/datasets${a.slug}`}>{a.name}</CustomLink>;
      a.apis.forEach((b, j) => {
        let endpoint = b.endpoint || '';
        if (endpoint) {
          const wordBreakEndpoint = endpoint.split('/');
          const wordBreakLen = wordBreakEndpoint.length;
          endpoint = (
            <span key={`wb${j}`}>
              /
              {wordBreakEndpoint.map((d, i) =>
                i < wordBreakLen - 1 ? (
                  <span key={`wb${j}${i}`}>
                    {d}/<wbr></wbr>
                  </span>
                ) : (
                  d
                )
              )}
            </span>
          );
        }
        const tableName = b.tableName ? b.tableName.replace(/&nbsp;/gi, ' ') : '';
        data.push({
          datasetLink: datasetLink,
          description: b.tableDescription || '',
          endpoint: endpoint,
          table: tableName,
        });
      });
    });

  const columnConfig = [
    {
      property: 'datasetLink',
      name: 'Dataset',
      order: 1,
      width: 25,
    },
    {
      property: 'table',
      name: 'Table Name',
      order: 2,
      width: 25,
    },
    {
      property: 'endpoint',
      name: 'Endpoint',
      order: 3,
      width: 20,
    },
    {
      property: 'description',
      name: 'Endpoint Description',
      order: 4,
      width: 30,
    },
  ];

  const tableProps = {
    data,
    tableName: 'Endpoints',
    shouldPage: true,
    columnConfig,
    caption: `Table of the list of Fiscal Data endpoints. Columns are Dataset, Table Name,
      Endpoint, and Endpoint Description.`,
    aria: { 'aria-describedby': 'list-of-endpoints-id' },
  };

  return (
    <>
      <SectionContent id="endpoints" headingLevel={2} title="Endpoints">
        <p>
          Many datasets are associated with only one data table, and thus, one API endpoint. There are some datasets comprised of more than one data
          table, and therefore have more than one endpoint.
        </p>
      </SectionContent>
      <SectionContent id="list-of-endpoints" headingLevel={3} title="List of Endpoints">
        <p id="list-of-endpoints-id" data-testid="list-of-endpoints-id">
          The table below <strong>lists the available endpoints by dataset and data table, along with a brief description</strong> of the
          corresponding endpoint.
        </p>
        <p>Note that every API URL begins with the base URL:</p>
        <p>
          <code className={code}>{apiBaseUrl}</code>
        </p>
        <p>Thus, the full API request URL would be the Base URL + Endpoint. For example:</p>
        <p className={endpointTableSpacing}>
          <code className={code}>{apiBaseUrl}/v2/accounting/od/avg_interest_rates</code>
        </p>
        <div className={listOfEndpointsTable} id="list-of-endpoints-table">
          <SuperBasicDtgTable tableProps={tableProps} perPage={rowsPerPage} />
        </div>
      </SectionContent>
      <SectionContent id="fields-by-endpoint" headingLevel={3} title="Fields by Endpoint">
        <p>
          To discover what <strong>fields are available within each endpoint,</strong> check out the corresponding dataset’s details page for
          dataset-specific API documentation, or refer to its data dictionary.
        </p>
        <p>
          <strong>Not sure which dataset you need?</strong> Head over to our <CustomLink href="/datasets/">Datasets</CustomLink> page to search and
          filter for datasets by topic, dates available, file type, and more.
        </p>
      </SectionContent>
    </>
  );
};
export default Endpoints;
