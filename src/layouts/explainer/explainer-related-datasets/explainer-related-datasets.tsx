import React, { FunctionComponent } from 'react';
import DatasetCard from "../../../components/dataset-card/dataset-card";
import {IExplainerRelatedDatasets} from "../../../models/IExplainerRelatedDatasets";
import {
  paddingAdjust,
  cardWrapper,
  titleStyle
} from './explainer-related-datasets.module.scss';

export const title = 'Related Datasets';
export const context = 'Related Dataset';

const ExplainerRelatedDatasets:
  FunctionComponent<IExplainerRelatedDatasets> = ({ datasets, referrer }) => {

  return (
      <div className={paddingAdjust}>
        <h1 className={titleStyle}> See the datasets behind federal debt </h1>
        { datasets ? datasets.map((dataset, i) => (
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
        ))
        : []}
      </div>
  )
}

export default ExplainerRelatedDatasets;
