import React, {FunctionComponent} from 'react';
import DatasetSectionContainer from '../dataset-section-container/dataset-section-container';
import DetailPills from '../detail-pills/detail-pills';
import {IDatasetTechSpecs} from '../../models/IDatasetTechSpecs';
import {MarkdownTransform} from '../markdown-transform/markdown-transform';
import {noMargin} from './dataset-introduction.module.scss';

interface IIntroduction {
  summaryText: string;
  techSpecs: IDatasetTechSpecs;
  dictionary: number;
  numTables: number;
}

export const title = 'Introduction';
const DatasetIntroduction: FunctionComponent<IIntroduction> = ({ summaryText, techSpecs, dictionary, numTables, config }) => {
  return (
    <DatasetSectionContainer title={title} id="introduction">
      <DetailPills techSpecs={techSpecs} dictionary={dictionary} numTables={numTables} config={config} />
      <MarkdownTransform content={summaryText} isBanner={false} customClass={noMargin} />
    </DatasetSectionContainer>
  );
};
export default DatasetIntroduction;
