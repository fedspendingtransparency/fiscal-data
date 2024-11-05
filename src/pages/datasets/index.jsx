import React, { useEffect, useState } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import dates from '../../helpers/datasets/dates';
import BreadCrumbs from '../../components/breadcrumbs/breadcrumbs';
import SiteLayout from '../../components/siteLayout/siteLayout';
import PageHelmet from '../../components/page-helmet/page-helmet';
import { searchContainer, page_title } from './datasets.module.scss';
import FilterSection from '../../components/datasets/filters/filters';
import SearchField from '../../components/datasets/search-field/search-field';
import { MuiThemeProvider } from '@material-ui/core';
import { dsTheme } from '../../theme';
import '../../helpers/download-service/download-service';
import { useMetadataUpdater } from '../../helpers/metadata/use-metadata-updater-hook';
import Fuse from 'fuse.js';

const DatasetsPage = ({ pageContext }) => {
  const { allDatasets, allFile } = useStaticQuery(
    graphql`
      query {
        allDatasets(filter: { apis: { elemMatch: { endpoint: { ne: "" } } } }) {
          datasets: nodes {
            name
            datasetId
            relatedTopics
            apis {
              endpoint
              dateField
              tableName
              dataDisplays {
                title
                chartType
                fields
                dimensionField
                filters {
                  key
                  value
                }
              }
              fields {
                columnName
                definition
                tableName
                prettyName
                dataType
                isRequired
              }
            }
            dataStartYear
            slug
            summaryText
            tagLine
            publisher
            dictionary
            techSpecs {
              latestDate
              earliestDate
              lastUpdated
              fileFormat
              updateFrequency
            }
            filters
          }
        }
        allTopics {
          topics: nodes {
            label
            title
            slug
            datasetIds
          }
        }
        allFile(filter: { extension: { eq: "png" } }) {
          topicIcons: nodes {
            name
            childImageSharp {
              gatsbyImageData(quality: 100, placeholder: NONE)
            }
          }
        }
      }
    `
  );

  const { filters } = pageContext;

  const { datasets } = allDatasets;
  const { topicIcons } = allFile;

  const breadCrumbLinks = [
    {
      name: 'Dataset Search',
    },
    {
      name: 'Home',
      link: '/',
    },
  ];
  const [searchResults, setSearchResults] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [innerWidth, setInnerWidth] = useState();
  const [finalDatesNotFound, setFinalDatesNotFound] = useState(true);
  const updatedDatasets = useMetadataUpdater(datasets);
  const options = { keys: ['name'], threshold: 0.2, includeScore: true, ignoreLocation: true };
  const searchIndex = Fuse.createIndex(options.keys, updatedDatasets);
  const fuse = new Fuse(updatedDatasets, options, searchIndex);

  useEffect(() => {
    setFinalDatesNotFound(true);

    if (typeof window !== 'undefined') {
      setInnerWidth(window.innerWidth);
    }

    // todo - Break out code and add a removeEventListener
    window.addEventListener('resize', () => {
      setInnerWidth(window.innerWidth);
    });
  }, []);

  useEffect(() => {
    setFinalDatesNotFound(false);
    // searchEngine.init(updatedDatasets);
    setTimeout(() => {
      if (searchQuery) {
        setSearchResults(
          fuse.search(searchQuery).map(result => {
            return { ...result.item, score: result.score };
          })
        );
      } else {
        setSearchResults(updatedDatasets);
      }
    }, 100); // let the page load before positioning cards for the first time
  }, [updatedDatasets]);

  useEffect(() => {
    console.log(searchQuery);
    if (searchQuery) {
      setSearchResults(
        fuse.search(searchQuery).map(result => {
          return { ...result.item, score: result.score };
        })
      );
    } else {
      setSearchResults(updatedDatasets);
    }
  }, [searchQuery]);

  const datasetAbstract = dataset => {
    if (dataset && dataset.techSpecs && dataset.techSpecs.latestDate) {
      return dataset.techSpecs.latestDate;
    }
    return null;
  };

  const maxDate = dates.getMaxDate(updatedDatasets, datasetAbstract);

  return (
    <SiteLayout>
      <PageHelmet
        pageTitle="Dataset Search"
        description={`Explore federal financial datasets on topics such as debt, interest rates,
          and more at Fiscal Data!`}
        keywords={`Debt, interest rates, financial summaries, revenue, savings bonds, spending,
          exchange rates, U.S. Treasury, datasets`}
      />
      <MuiThemeProvider theme={dsTheme}>
        <div className="searchBodyBackground">
          <div className={searchContainer}>
            <BreadCrumbs links={breadCrumbLinks} />
            <h1 data-testid="page-title" className={page_title}>
              Datasets
            </h1>
            <SearchField finalDatesNotFound={finalDatesNotFound} changeHandler={setSearchQuery} />
            <FilterSection
              searchIsActive={searchQuery.length > 0}
              searchResults={searchResults}
              allDatasets={updatedDatasets}
              availableFilters={filters}
              topicIcons={topicIcons}
              maxDate={maxDate}
              searchQuery={searchQuery}
              isHandheld={innerWidth < 992}
            />
          </div>
        </div>
      </MuiThemeProvider>
    </SiteLayout>
  );
};

export default DatasetsPage;
