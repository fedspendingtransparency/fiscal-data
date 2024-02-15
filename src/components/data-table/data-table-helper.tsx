import { ColumnDef, Table } from '@tanstack/react-table';
import React from 'react';
import moment from 'moment';
import { currencyFormatter, numberFormatter, customNumberFormatter } from '../../helpers/text-format/text-format';
import TextFilter from './data-table-header/text-filter/text-filter';
import DateRangeFilter from './data-table-header/date-range-filter/date-range-filter';
import { updateTableButton } from './data-table.module.scss';

const customFormat = (stringValue, decimalPlaces) => {
  // if block is to show "-$123,123.23" instead of "$-123,123.23"
  const absVal = Math.abs(stringValue);
  let returnString = '$' + absVal.toFixed(decimalPlaces).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  if (Number(stringValue) < 0) {
    returnString = '-' + returnString;
  }
  return returnString;
};

export const columnsConstructorData = (
  rawData: Record<string, Record<string, unknown>>,
  hideColumns: string[],
  tableName: string,
  columnConfig,
  customFormatConfig
): any => {
  if (rawData.meta && columnConfig) {
    return columnConfig
      .filter(x => !hideColumns?.includes(x.property))
      .map(({ property, name }) => {
        if (!hideColumns?.includes(property)) {
          if (property === 'cusip') {
            return {
              accessorKey: property,
              header: name,
              sortingFn: 'basic',
            } as ColumnDef<string, string>;
          }
          if (rawData.meta.dataTypes[property] === 'DATE') {
            return {
              accessorKey: property,
              header: name,
              filterFn: 'arrIncludesSome',
              cell: ({ getValue }) => {
                return moment(getValue()).format('M/D/YYYY');
              },
            } as ColumnDef<string, Date>;
          } else if (rawData.meta.dataTypes[property] === 'NUMBER') {
            return {
              accessorKey: property,
              header: name,
              cell: ({ getValue }) => {
                const value = getValue();
                let formattedValue;
                const customFormat = customFormatConfig?.find(config => config.type === 'NUMBER' && config.fields.includes(property));
                if (!!customFormat) {
                  formattedValue = customNumberFormatter.format(value, customFormat.decimalPlaces);
                } else if (tableName === 'FRN Daily Indexes' && (property === 'daily_index' || property === 'daily_int_accrual_rate')) {
                  formattedValue = value ? value : '';
                } else if (tableName === 'FRN Daily Indexes' && property === 'spread') {
                  formattedValue = value ? Number(value).toFixed(3) : '';
                } else {
                  formattedValue = numberFormatter.format(value);
                }

                if (tableName === 'Demand Deposit Rate' && property === 'daily_factor') {
                  formattedValue = Number(value).toFixed(8);
                }

                return formattedValue;
              },
            } as ColumnDef<string, number>;
          } else if (rawData.meta.dataTypes[property] === 'PERCENTAGE') {
            return {
              accessorKey: property,
              header: name,
              cell: ({ getValue }) => {
                if (getValue() !== undefined) {
                  return `${getValue()}%`;
                } else {
                  return '';
                }
              },
            } as ColumnDef<string, string>;
          } else if (rawData.meta.dataTypes[property] === 'SMALL_FRACTION') {
            return {
              accessorKey: property,
              header: name,
              cell: ({ getValue }) => {
                return new Intl.NumberFormat('en-US', { maximumSignificantDigits: 5 }).format(getValue());
              },
            } as ColumnDef<string, number>;
          } else if (rawData.meta.dataTypes[property] === 'CURRENCY') {
            return {
              accessorKey: property,
              header: name,
              cell: ({ getValue }) => {
                return currencyFormatter.format(getValue());
              },
            } as ColumnDef<string, string>;
          } else if (rawData.meta.dataTypes[property]?.includes('CURRENCY') && /\d/.test(rawData.meta.dataTypes[property].split('CURRENCY')[1])) {
            const decimalPlaces = parseInt(rawData.meta.dataTypes[property].split('CURRENCY')[1]);
            return {
              accessorKey: property,
              header: name,
              cell: ({ getValue }) => {
                return customFormat(getValue(), decimalPlaces);
              },
            } as ColumnDef<string, string>;
          } else if (rawData.meta.dataTypes[property] === 'STRING') {
            return {
              accessorKey: property,
              header: name,
              cell: ({ getValue }) => {
                const value = getValue();
                let formattedValue;
                const customFormat = customFormatConfig?.find(config => config.type === 'STRING' && config.fields.includes(property));
                if (value !== undefined) {
                  if (value.includes('%')) {
                    formattedValue = value.replace(/-/g, '\u2011');
                  } else if (customFormat && customFormat.customType === 'dateList') {
                    const dates = value.split(customFormat.breakChar);
                    formattedValue = '';
                    dates.forEach((date, index) => {
                      if (index > 0) {
                        formattedValue = formattedValue + ', ' + moment(date).format('M/DD/YYYY');
                      } else {
                        formattedValue = formattedValue + moment(date).format('M/DD/YYYY');
                      }
                    });
                  } else {
                    formattedValue = value;
                  }
                }
                return formattedValue;
              },
            } as ColumnDef<string, string>;
          }
          return { accessorKey: property, header: name } as ColumnDef<string, string>;
        }
        return null;
      });
  } else {
    return [];
  }
};

export const columnsConstructorGeneric = (columns: Record<string, string>[]): ColumnDef<string, string>[] => {
  return columns.map(({ property, name }) => {
    return { accessorKey: property, header: name } as ColumnDef<string, string>;
  });
};

export const getColumnFilter: (
  header,
  type: string,
  resetFilters: boolean,
  setFiltersActive: (val: boolean) => void,
  allActiveFilters: string[],
  setAllActiveFilters: (val: string[]) => void,
  manualPagination: boolean,
  isLastColumn: boolean
) => JSX.Element = (header, type, resetFilters, setFiltersActive, allActiveFilters, setAllActiveFilters, manualPagination, isLastColumn) => {
  if (type === 'DATE') {
    return (
      <DateRangeFilter
        column={header.column}
        resetFilters={resetFilters}
        allActiveFilters={allActiveFilters}
        setAllActiveFilters={setAllActiveFilters}
        isLastColumn={isLastColumn}
      />
    );
  } else {
    return (
      <TextFilter
        column={header.column}
        resetFilters={resetFilters}
        allActiveFilters={allActiveFilters}
        setAllActiveFilters={setAllActiveFilters}
        disabled={manualPagination}
      />
    );
  }
};

export const rightAlign = (type: string): boolean => {
  const types = ['DATE', 'CURRENCY', 'NUMBER', 'PERCENTAGE'];
  return types.includes(type) || type?.includes('CURRENCY');
};

export const modifiedColumnsDetailView = (columns: any[], handleClick, columnKey: string) => {
  return columns.map(column => {
    if (column.accessorKey.toLowerCase() === columnKey) {
      return {
        ...column,
        cell: ({ getValue }) => {
          const columnValue = getValue();
          return (
            <button onClick={e => handleClick(e, columnValue)} className={updateTableButton}>
              {columnValue}
            </button>
          );
        },
      };
    }
    return column;
  });
};

export const getSortedColumnsData = (
  table: Table<Record<string, unknown>>,
  setTableColumnSortData: (map: Record<string, string>) => void,
  hideColumns: string[],
  dataTypes
): void => {
  if (setTableColumnSortData) {
    const columns = table.getVisibleFlatColumns();
    const mapped = columns.map(column => ({
      id: column.id,
      sorted: column.getIsSorted(),
      filterValue: column.getFilterValue(),
      downloadFilter: dataTypes[column.id] !== 'DATE',
      rowValues: table.getFilteredRowModel().flatRows.map(row => row.original[column.id]),
      allColumnsSelected: hideColumns ? false : table.getIsAllColumnsVisible(),
    }));
    setTableColumnSortData(mapped);
  }
};
