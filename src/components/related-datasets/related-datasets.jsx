import React, { useEffect } from 'react';
import DatasetSectionContainer from '../dataset-section-container/dataset-section-container';
import DatasetCard from '../dataset-card/dataset-card';
import { paddingAdjust, cardWrapper } from './related-datasets.module.scss';

export const title = 'Related Datasets';
export const context = 'Related Dataset';

const RelatedDatasets = ({ datasets, referrer }) => {
  let sortedDatasets = [];

  useEffect(() => {
    datasets.forEach(dataset => {
      dataset.heroNumber = Math.floor(Math.random() * 8);
    });
  }, []);

  const sortByName = (a, b) => {
    const nameA = a.name;
    const nameB = b.name;
    return nameA.localeCompare(nameB);
  };

  if (datasets) {
    sortedDatasets = datasets.sort(sortByName);
  }

  return (
    <DatasetSectionContainer id="related-datasets" data-testid="section-container" title={title}>
      <div className={paddingAdjust}>
        {sortedDatasets.map((dataset, i) => (
          <div data-testid="cardWrapper" className={cardWrapper} key={i}>
            <DatasetCard dataset={dataset} context={context} referrer={referrer} />
          </div>
        ))}
      </div>
    </DatasetSectionContainer>
  );
};

export default RelatedDatasets;
