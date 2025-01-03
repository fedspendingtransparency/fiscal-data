import React, { useState, useEffect } from 'react';
import { dataTableSelectWrapper, dropdownDisplay, header, placeholderDropdown, placeholderText } from './datatable-select.module.scss';
import LocationAware from '../location-aware/location-aware';
import ComboCurrencySelect from '../combo-select/combo-currency-select/combo-currency-select';

export const allTablesOption = {
  allDataTables: true,
  pathName: 'all-data-tables',
  tableName: 'All Data Tables',
  valueFieldOptions: null,
};

export const DataTableSelect = ({ apis, selectedTable, setSelectedTable, allTablesSelected, earliestDate, latestDate, disableAllTables }) => {
  const label = 'Data Table';
  const [showDatasetDropdown, setShowDatasetDropdown] = useState(false);
  const changeHandler = updatedTable => {
    if (updatedTable !== null) {
      setSelectedTable(updatedTable);
    }
  };

  useEffect(() => {
    if (apis && apis.length > 1) {
      setShowDatasetDropdown(true);
    }
  });

  const options = disableAllTables
    ? apis
    : [
        {
          ...allTablesOption,
          earliestDate,
          latestDate,
        },
      ].concat(apis);

  return (
    <>
      {(apis?.length > 1 || showDatasetDropdown) && (
        <div className={`${dataTableSelectWrapper} dataTableSelectWrapper`} data-test-id="dataTableSelectWrapper">
          <h3 className={header}>Choose Data Table:</h3>
          <div className={dropdownDisplay}>
            {selectedTable && (
              <ComboCurrencySelect
                changeHandler={changeHandler}
                options={options}
                label={label}
                optionLabelKey="tableName"
                selectedOption={allTablesSelected ? options[0] : selectedTable}
                searchBarLabel="Search data tables"
                containerBorder
              />
            )}
            {!selectedTable && (
              <div data-testid="tableSelectPlaceholder">
                <div className={placeholderText}>Data Table</div>
                <div className={placeholderDropdown} />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default LocationAware(DataTableSelect);
