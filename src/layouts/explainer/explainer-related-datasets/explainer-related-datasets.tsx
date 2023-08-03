import React, { FunctionComponent } from 'react';
import DatasetCard from "../../../components/dataset-card/dataset-card";
import {IExplainerRelatedDatasets} from "../../../models/IExplainerRelatedDatasets";
import {
  paddingAdjust,
  cardWrapper,
  titleStyle
} from './explainer-related-datasets.module.scss';

export const title = 'Related Datasets';
export const context = 'Related Datasets';

const ExplainerRelatedDatasets: FunctionComponent<IExplainerRelatedDatasets> = ({ datasets, referrer, header, explainer  }) => {

  return (
      <div className={paddingAdjust}>
        <h1 className={`${titleStyle} relatedDatasetTitle`}> {header} </h1>
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
              explainer={explainer}
            />
          </div>
        ))
        : []}
      </div>
  )
}

export default ExplainerRelatedDatasets;
