import React, { FunctionComponent } from 'react';
import DatasetCard from "../../../components/dataset-card/dataset-card";
import {
  paddingAdjust,
  cardWrapper,
  titleStyle
} from './insight-related-datasets.module.scss';
import {IDataset} from "../../../models/IDataset";

export interface IInsightRelatedDatasets {
  datasets: IDataset[],
  referrer: string
}

export const context = 'Related Datasets';

const InsightRelatedDatasets:
  FunctionComponent<IInsightRelatedDatasets> = ({ datasets, referrer }) => {

  console.log(datasets);

  return (
    <div className={paddingAdjust}>
      <h1 className={titleStyle}>See the datasets that relate to this Insight</h1>
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
              explainer={true}
            />
          </div>
        ))
        : []}
    </div>
  )
}

export default InsightRelatedDatasets;
