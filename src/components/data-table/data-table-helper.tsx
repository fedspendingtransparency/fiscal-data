import { ColumnDef } from '@tanstack/react-table';
import React from 'react';
import moment from 'moment';
import { currencyFormatter, numberFormatter } from '../../helpers/text-format/text-format';
import SingleDateFilter from './data-table-header/single-date-filter/single-date-filter';
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

export const columnsConstructor = (rawData: any, dateRangeColumns): any => {
  if (rawData.meta) {
    return Object.entries(rawData.meta.labels).map(([field, label]) => {
      if (field === 'record_date') {
        return {
          accessorKey: field,
          header: label,
          filterFn: 'equalsString',
          cell: ({ getValue }) => {
            return moment(getValue()).format('M/D/YYYY');
          },
        } as ColumnDef<string, Date>;
      } else if (rawData.meta.dataTypes[field] === 'DATE') {
        if (dateRangeColumns.includes(field)) {
          return {
            accessorKey: field,
            header: label,
            filterFn: 'arrIncludesSome',
            cell: ({ getValue }) => {
              return moment(getValue()).format('M/D/YYYY');
            },
          } as ColumnDef<string, Date>;
        }
        return {
          accessorKey: field,
          header: label,
          cell: ({ getValue }) => {
            return moment(getValue()).format('M/D/YYYY');
          },
        } as ColumnDef<string, Date>;
      } else if (rawData.meta.dataTypes[field] === 'NUMBER') {
        return {
          accessorKey: field,
          header: label,
          cell: ({ getValue }) => {
            return numberFormatter.format(getValue());
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
      } else if (rawData.meta.dataTypes[field].includes('CURRENCY') && /\d/.test(rawData.meta.dataTypes[field].split('CURRENCY')[1])) {
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
    });
  } else {
    return [];
  }
};

export const Filter: FunctionComponent<any> = ({
  column,
  resetFilters,
  setAllActiveFilters,
  allActiveFilters,
}: {
  column: Column<any, any>;
  resetFilters: boolean;
  allActiveFilters: string[];
  setAllActiveFilters: (value: string[]) => void;
}) => {
  const [active, setActive] = useState(false);
  const [filterDisplay, setFilterDisplay] = useState('');
  const clearFilter = () => {
    // fire artificial event to reset field
    onFilterChange({
      target: {
        value: '',
      },
    });
    column.setFilterValue('');
    setFilterDisplay('');
  };

  const onFilterChange = event => {
    const val = event && event.target ? event.target.value : '';
    column.setFilterValue(val);
    setFilterDisplay(val);
    if (val.length > 0) {
      if (!allActiveFilters.includes(column.id)) {
        setAllActiveFilters([...allActiveFilters, column.id]);
      }
    } else {
      if (allActiveFilters.includes(column.id)) {
        const currentFilters = allActiveFilters.filter(value => value !== column.id);
        setAllActiveFilters(currentFilters);
      }
    }
  };

  useEffect(() => {
    clearFilter();
  }, [resetFilters]);

  return <SearchBar onChange={onFilterChange} filter={filterDisplay} handleClear={clearFilter} height="28px" active={active} setActive={setActive} />;
};

export const getColumnFilter = (header, dateRangeColumns: string[], table, resetFilters: boolean, setFiltersActive: (val: boolean) => void) => {
  if (header.column.getCanFilter() && header.id === 'record_date') {
    return <SingleDateFilter column={header.column} />;
  } else if (dateRangeColumns.includes(header.id)) {
    return <DateRangeFilter column={header.column} resetFilters={resetFilters} setFiltersActive={setFiltersActive} table={table} />;
  } else {
    return <TextFilter column={header.column} resetFilters={resetFilters} setFiltersActive={setFiltersActive} />;
  }
};

export const rightAlign = (type: string): boolean => {
  const types = ['DATE', 'CURRENCY', 'NUMBER', 'PERCENTAGE'];
  return types.includes(type) || type?.includes('CURRENCY');
};
