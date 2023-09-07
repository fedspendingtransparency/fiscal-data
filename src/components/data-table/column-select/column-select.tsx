import React, { ReactElement, useEffect, useState } from 'react';

const ColumnSelect = ({ defaultSelectedColumns, defaultInvisibleColumns, table, setColumnVisibility, allColumns }): ReactElement => {
  const [defaultColumns, setDefaultColumns] = useState([]);
  const [additionalColumns, setAdditionalColumns] = useState([]);

  // We need to be able to access the accessorKey (which is a type violation) hence the ts ignore
  if (defaultSelectedColumns) {
    for (const column of allColumns) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (!defaultSelectedColumns.includes(column.accessorKey)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        defaultInvisibleColumns[column.accessorKey] = false;
      }
    }
  }

  const constructDefaultColumnsFromTableData = () => {
    const constructedDefaultColumns = [];
    const constructedAdditionalColumns = [];
    for (const column of table.getAllLeafColumns()) {
      if (defaultSelectedColumns.includes(column.id)) {
        constructedDefaultColumns.push(column);
      } else if (!defaultSelectedColumns.includes(column.id)) {
        constructedAdditionalColumns.push(column);
      }
    }
    constructedAdditionalColumns.sort((a, b) => {
      return a.id.localeCompare(b.id);
    });
    setDefaultColumns(constructedDefaultColumns);
    setAdditionalColumns(constructedAdditionalColumns);
  };

  useEffect(() => {
    if (defaultSelectedColumns) {
      constructDefaultColumnsFromTableData();
    }
  }, []);

  return (
    <div className="inline-block border border-black shadow rounded">
      <div className="px-1 border-b border-black">
        <label>
          <input
            {...{
              type: 'checkbox',
              checked: table.getIsAllColumnsVisible(),
              onChange: table.getToggleAllColumnsVisibilityHandler(),
            }}
          />{' '}
          Select All
        </label>
      </div>
      {defaultSelectedColumns ? (
        <div>
          <div>
            <span> Defaults </span>
            {defaultColumns.map(column => {
              return (
                <div key={column.id} className="px-1">
                  <label>
                    <input
                      {...{
                        type: 'checkbox',
                        checked: column.getIsVisible(),
                        onChange: column.getToggleVisibilityHandler(),
                      }}
                    />{' '}
                    {column.columnDef.header}
                  </label>
                </div>
              );
            })}
            <span> ---------------------- </span>
          </div>
          <div>
            <span> Additional </span>
            {additionalColumns.map(column => {
              return (
                <div key={column.id} className="px-1">
                  <label>
                    <input
                      {...{
                        type: 'checkbox',
                        checked: column.getIsVisible(),
                        onChange: column.getToggleVisibilityHandler(),
                      }}
                    />{' '}
                    {column.columnDef.header}
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div>
          {table.getAllLeafColumns().map(column => {
            return (
              <div key={column.id} className="px-1">
                <label>
                  <input
                    {...{
                      type: 'checkbox',
                      checked: column.getIsVisible(),
                      onChange: column.getToggleVisibilityHandler(),
                    }}
                  />{' '}
                  {column.columnDef.header}
                </label>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ColumnSelect;
