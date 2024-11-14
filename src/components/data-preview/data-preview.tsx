import React, { FunctionComponent, useState } from 'react';
import DatasetSectionContainer from '../dataset-section-container/dataset-section-container';
import DataPreviewFilterSection from './filters/data-preview-filter-section';
import DataPreviewTableSelectDropdown from './data-preview-dropdown/data-preview-table-select-dropdown';
import { dataPreview, dataPreviewHeader, dataPreviewTitle, selectedTableName } from './data-preview.module.scss';

type DataPreviewProp = {
  placeholder: string;
};

const DataPreview: FunctionComponent<DataPreviewProp> = ({ placeholder: string }) => {
  const [selectedTable, setSelectedTable] = useState('Summary of Budget and Off-Budget Results and Financing of the U.S. Government');
  return (
    <DatasetSectionContainer id="data-preview" title="">
      <div className={dataPreview}>
        <div className={dataPreviewHeader}>
          <span className={dataPreviewTitle}>Data Preview</span>
        </div>
        <DataPreviewTableSelectDropdown tableName={selectedTable} />
      </div>
      <div>
        <div className={selectedTableName}>{selectedTable}</div>
      </div>
      <DataPreviewFilterSection />
      <p>Data Preview Placeholder</p>
    </DatasetSectionContainer>
  );
};

export default DataPreview;
