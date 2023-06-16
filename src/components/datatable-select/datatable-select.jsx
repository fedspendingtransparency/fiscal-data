import React, { useState, useEffect } from 'react';
import * as styles from './datatable-select.module.scss';
import SelectControl from "../select-control/select-control";
import LocationAware from '../location-aware/location-aware';

export const allTablesOption = {
  allDataTables: true,
  pathName: 'all-data-tables',
  tableName: 'All Data Tables',
  valueFieldOptions: null,
}

export const DataTableSelect = ({
  apis,
  selectedTable,
  setSelectedTable,
  allTablesSelected,
  earliestDate,
  latestDate
}) => {
  const label = 'Data Table';
  const [showDatasetDropdown, setShowDatasetDropdown] = useState(false);

  useEffect(() => {
    if (apis && apis.length > 1) {
      setShowDatasetDropdown(true);
    }
  });

  const options = [{
    ...allTablesOption,
    earliestDate,
    latestDate
  }].concat(apis);

  return (
    <>
      {showDatasetDropdown &&
        <div className={ `${styles.dataTableSelectWrapper} dataTableSelectWrapper` } data-test-id="dataTableSelectWrapper">
          <h3 className={styles.header}>Choose Data Table:</h3>
          <SelectControl
            options={options}
            label={label}
            optionLabelKey="tableName"
            selectedOption={allTablesSelected ? options[0] : selectedTable}
            changeHandler={setSelectedTable}
          />
        </div>
      }
    </>
  )
}

export default LocationAware(DataTableSelect);
