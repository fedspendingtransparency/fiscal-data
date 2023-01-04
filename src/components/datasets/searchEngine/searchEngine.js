const elasticlunr = require('elasticlunr');

// class to handle search logic using elasticlunr on behalf of the search page.

export class DatasetSearch {
  init = (datasets) => {
    this.datasets = datasets;
    this.datasetsBySlug = {};
    this.searchIndex = this.initializeSearchIndex();
  };

  search = (queryTerm) => {
    if (queryTerm.replace(/\s/g, '').length) {
      const matchingDatasets = [];
      this.searchIndex.search(queryTerm, {expand: true}).forEach((result) => {
        const match = this.datasetsBySlug[result.ref];
        match.searchScore = result.score;
        matchingDatasets.push(match);
      });
      return matchingDatasets;
    } else {
      this.clearScores();
      return this.datasets;
    }
  };

  clearScores = () => {
    if(this.datasets){
      this.datasets.forEach((dataset) => {
        dataset.searchScore = 0;
      });
    }
  };

  initializeSearchIndex = () => {
    var fieldsMapper = function (dataset) {
      const allColumnNames = [];
      const allPrettyNames = [];
      
      if (dataset.apis.length > 0) {
        dataset.apis.forEach((api) => {
          if (api.fields && api.fields.length) {
            api.fields.forEach((e) => {
              allColumnNames.push(e.columnName);
              allPrettyNames.push(e.prettyName);
            });
          };
        });
      }

      return { 
        ...dataset,
        'allColumnNames': allColumnNames,
        'allPrettyNames': allPrettyNames
       };
    };

    const searchIndex = elasticlunr(function () {
      this.addField('name');
      this.addField('summaryText');
      this.addField('tagLine');
      this.addField('relatedTopics');
      this.addField('allColumnNames');
      this.addField('allPrettyNames');
      this.setRef('slug');
      this.saveDocument(false);
    });

    this.datasets
      .map(d => fieldsMapper(d))
      .forEach((dataset) => {
        searchIndex.addDoc(dataset);
        this.datasetsBySlug[dataset.slug] = dataset;
      });

    return searchIndex;
  };

  applySearch = (searchQuery) => {
    let searchResults = this.datasets;

    if (searchQuery) {
      searchResults = this.search(searchQuery);
    }

    return searchResults;
  };
}
