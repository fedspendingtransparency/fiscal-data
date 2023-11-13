import React, { FunctionComponent } from 'react';
import DatasetSectionContainer from '../dataset-section-container/dataset-section-container';
import DetailPills from '../detail-pills/detail-pills';

interface IIntroduction {
  summaryText: string;
  techSpecs: object;
  dictionary: number;
}

export const title = 'Introduction';
const DatasetIntroduction: FunctionComponent<IIntroduction> = ({ summaryText, techSpecs, dictionary }) => {
  return (
    <DatasetSectionContainer title={title} id="introduction">
      <DetailPills techSpecs={techSpecs} dictionary={dictionary} />
      <p style={{ marginBlockEnd: '-1rem' }}>{summaryText}</p>
    </DatasetSectionContainer>
  );
};
export default DatasetIntroduction;
