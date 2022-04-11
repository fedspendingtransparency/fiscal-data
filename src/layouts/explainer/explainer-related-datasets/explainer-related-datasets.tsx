import React, { FunctionComponent } from 'react';
import DatasetCard from "../../../components/dataset-card/dataset-card";
import {IExplainerRelatedDatasets} from "../../../models/IExplainerRelatedDatasets";
import {
  paddingAdjust,
  cardWrapper
} from './explainer-related-datasets.module.scss';

export const title = 'Related Datasets';
export const context = 'Related Dataset';

const ExplainerRelatedDatasets:
  FunctionComponent<IExplainerRelatedDatasets> = ({ datasets, referrer }) => {

  let sortedDatasets = [];

  const sortByName = (a, b) => {
    const nameA = a.name;
    const nameB = b.name;
    return nameA.localeCompare(nameB);
  };

  if (datasets) {
    sortedDatasets = datasets.sort(sortByName);
  }

  return (
      <div className={paddingAdjust}>
        <h1> See the datasets behind federal debt </h1>
        {sortedDatasets.map((dataset, i) => (
          <div
            data-testid="cardWrapper"
            className={cardWrapper}
            key={i}
          >
            <DatasetCard
              dataset={dataset}
              context={context}
              referrer={referrer}
            />
          </div>
        ))}
      </div>
  )
}

export default ExplainerRelatedDatasets;
