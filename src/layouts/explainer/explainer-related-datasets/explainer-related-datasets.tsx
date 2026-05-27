import React, { FunctionComponent } from 'react';
import DatasetCard from '../../../components/dataset-card/dataset-card';
import { IExplainerRelatedDatasets } from '../../../models/IExplainerRelatedDatasets';
import { paddingAdjust, cardWrapper, titleStyle } from './explainer-related-datasets.module.scss';

export const title = 'Related Datasets';
export const context = 'Related Datasets';

const ExplainerRelatedDatasets: FunctionComponent<IExplainerRelatedDatasets> = ({ datasets, referrer, header, explainer }) => {
  if (datasets) {
    datasets.forEach(dataset => {
      dataset.heroNumber = Math.floor(Math.random() * 8);
    });
  }

  return (
    <div className={paddingAdjust}>
      <div className={`${titleStyle} relatedDatasetTitle`}> {header} </div>
      {datasets
        ? datasets.map((dataset, i) => (
            <div data-testid="cardWrapper" className={cardWrapper} key={i}>
              <DatasetCard dataset={dataset} context={context} referrer={referrer} explainer={explainer} />
            </div>
          ))
        : []}
    </div>
  );
};

export default ExplainerRelatedDatasets;
