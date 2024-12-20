import React, { FunctionComponent } from 'react';
import DatasetSectionContainer from '../dataset-section-container/dataset-section-container';
import DetailPills from '../detail-pills/detail-pills';
import { IDatasetTechSpecs } from '../../models/IDatasetTechSpecs';
import { MarkdownTransform } from '../markdown-transform/markdown-transform';

interface IIntroduction {
  summaryText: string;
  techSpecs: IDatasetTechSpecs;
  dictionary: number;
}

export const title = 'Introduction';
const DatasetIntroduction: FunctionComponent<IIntroduction> = ({ summaryText, techSpecs, dictionary }) => {
  return (
    <DatasetSectionContainer title={title} id="introduction">
      <DetailPills techSpecs={techSpecs} dictionary={dictionary} />
      <MarkdownTransform content={summaryText} isBanner={false} />
    </DatasetSectionContainer>
  );
};
export default DatasetIntroduction;
