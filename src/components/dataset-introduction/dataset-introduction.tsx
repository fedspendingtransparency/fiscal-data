import React, { FunctionComponent } from 'react';
import DatasetSectionContainer from '../dataset-section-container/dataset-section-container';
import DetailPills from '../detail-pills/detail-pills';
import { IDatasetTechSpecs } from '../../models/IDatasetTechSpecs';
import { MarkdownTransform } from '../markdown-transform/markdown-transform';
import { noMargin } from './dataset-introduction.module.scss';

interface IIntroduction {
  summaryText: string;
  techSpecs: IDatasetTechSpecs;
  dictionary: number;
  numTables: number;
  hideRawDataTable?: boolean;
}

export const title = 'Introduction';
const DatasetIntroduction: FunctionComponent<IIntroduction> = ({
  summaryText,
  techSpecs,
  numTables,
  dateExpected,
  timeExpected,
  config,
  hideRawDataTable,
}) => {
  return (
    <DatasetSectionContainer title={title} id="introduction">
      <DetailPills
        techSpecs={techSpecs}
        numTables={numTables}
        dateExpected={dateExpected}
        timeExpected={timeExpected}
        config={config}
        hideRawDataTable={hideRawDataTable}
      />
      <MarkdownTransform content={summaryText} isBanner={false} customClass={noMargin} />
    </DatasetSectionContainer>
  );
};
export default DatasetIntroduction;
