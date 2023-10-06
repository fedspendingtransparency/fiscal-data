import { ColumnDef } from '@tanstack/react-table';
import React from 'react';
import moment from 'moment';
import { currencyFormatter, numberFormatter } from '../../helpers/text-format/text-format';
import TextFilter from './data-table-header/text-filter/text-filter';
import DateRangeFilter from './data-table-header/date-range-filter/date-range-filter';

const customFormat = (stringValue, decimalPlaces) => {
  // if block is to show "-$123,123.23" instead of "$-123,123.23"
  const absVal = Math.abs(stringValue);
  let returnString = '$' + absVal.toFixed(decimalPlaces).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  if (Number(stringValue) < 0) {
    returnString = '-' + returnString;
  }
  return returnString;
};

export const columnsConstructor = (rawData: any, hideColumns: string[], tableName: string): any => {
  if (rawData.meta) {
    return Object.entries(rawData.meta.labels)
      .filter(x => !hideColumns?.includes(x[0]))
      .map(([field, label]) => {
        if (!hideColumns?.includes(field)) {
          if (rawData.meta.dataTypes[field] === 'DATE') {
            return {
              accessorKey: field,
              header: label,
              filterFn: 'arrIncludesSome',
              cell: ({ getValue }) => {
                return moment(getValue()).format('M/D/YYYY');
              },
            } as ColumnDef<string, Date>;
          } else if (rawData.meta.dataTypes[field] === 'NUMBER') {
            return {
              accessorKey: field,
              header: label,
              cell: ({ getValue }) => {
                const value = getValue();
                let formattedValue;

                if (tableName === 'FRN Daily Indexes' && (field === 'daily_index' || field === 'daily_int_accrual_rate' || field === 'spread')) {
                  formattedValue = value;
                } else {
                  formattedValue = numberFormatter.format(value);
                }

                return formattedValue;
              },
            } as ColumnDef<string, number>;
          } else if (rawData.meta.dataTypes[field] === 'PERCENTAGE') {
            return {
              accessorKey: field,
              header: label,
              cell: ({ getValue }) => {
                return `${getValue()}%`;
              },
            } as ColumnDef<string, string>;
          } else if (rawData.meta.dataTypes[field] === 'SMALL_FRACTION') {
            return {
              accessorKey: field,
              header: label,
              cell: ({ getValue }) => {
                return new Intl.NumberFormat('en-US', { maximumSignificantDigits: 5 }).format(getValue());
              },
            } as ColumnDef<string, number>;
          } else if (rawData.meta.dataTypes[field] === 'CURRENCY') {
            return {
              accessorKey: field,
              header: label,
              cell: ({ getValue }) => {
                return currencyFormatter.format(getValue());
              },
            } as ColumnDef<string, string>;
          } else if (rawData.meta.dataTypes[field]?.includes('CURRENCY') && /\d/.test(rawData.meta.dataTypes[field].split('CURRENCY')[1])) {
            const decimalPlaces = parseInt(rawData.meta.dataTypes[field].split('CURRENCY')[1]);
            return {
              accessorKey: field,
              header: label,
              cell: ({ getValue }) => {
                return customFormat(getValue(), decimalPlaces);
              },
            } as ColumnDef<string, string>;
          } else if (rawData.meta.dataTypes[field] === 'STRING') {
            return {
              accessorKey: field,
              header: label,
              cell: ({ getValue }) => {
                if (getValue().includes('%')) {
                  return getValue().replace(/-/g, '\u2011');
                } else {
                  return getValue();
                }
              },
            } as ColumnDef<string, string>;
          }
          return { accessorKey: field, header: label } as ColumnDef<string, string>;
        }
      });
  } else {
    return [];
  }
};

export const getColumnFilter: (
  header,
  type: string,
  resetFilters: boolean,
  setFiltersActive: (val: boolean) => void,
  allActiveFilters: string[],
  setAllActiveFilters: (val: string[]) => void
) => JSX.Element = (header, type, resetFilters, setFiltersActive, allActiveFilters, setAllActiveFilters) => {
  if (type === 'DATE') {
    return (
      <DateRangeFilter
        column={header.column}
        resetFilters={resetFilters}
        allActiveFilters={allActiveFilters}
        setAllActiveFilters={setAllActiveFilters}
      />
    );
  } else {
    return (
      <TextFilter
        column={header.column}
        resetFilters={resetFilters}
        setFiltersActive={setFiltersActive}
        allActiveFilters={allActiveFilters}
        setAllActiveFilters={setAllActiveFilters}
      />
    );
  }
};

export const rightAlign = (type: string): boolean => {
  const types = ['DATE', 'CURRENCY', 'NUMBER', 'PERCENTAGE'];
  return types.includes(type) || type?.includes('CURRENCY');
};
