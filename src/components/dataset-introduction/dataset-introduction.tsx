import React, { FunctionComponent } from 'react';
import DatasetSectionContainer from '../dataset-section-container/dataset-section-container';
import DetailPills from '../detail-pills/detail-pills';
import { IDatasetTechSpecs } from '../../models/IDatasetTechSpecs';

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
      <div>{summaryText}</div>
    </DatasetSectionContainer>
  );
};
export default DatasetIntroduction;
