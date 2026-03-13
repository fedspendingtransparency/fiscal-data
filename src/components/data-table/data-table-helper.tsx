import { ColumnDef, Table } from '@tanstack/react-table';
import React from 'react';
import { currencyFormatter, customNumberFormatter, numberFormatter } from '../../helpers/text-format/text-format';
import TextFilter from './data-table-header/text-filter/text-filter';
import DateRangeFilter from './data-table-header/date-range-filter/date-range-filter';
import CustomLink from '../links/custom-link/custom-link';
import { downloadLinkContainer, downloadLinkIcon } from './data-table.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudArrowDown } from '@fortawesome/free-solid-svg-icons/faCloudArrowDown';
import dayjs from 'dayjs';

const customFormat = (stringValue, decimalPlaces) => {
  // if block is to show "-$123,123.23" instead of "$-123,123.23"
  const absVal = Math.abs(stringValue);
  let returnString = '$' + absVal.toFixed(decimalPlaces).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  if (Number(stringValue) < 0) {
    returnString = '-' + returnString;
  }
  return returnString;
};

const tablesWithPublishedReportLinks = [
  'Treasury Securities Auctions Data',
  'Reference CPI Numbers and Daily Index Ratios Summary Table',
  'Buybacks Operations',
];

const publishedReportsLinkWrapper = (url: string, value: string, alias?: string) => {
  const multiLinks: string[] = value.split(',');

  return (
    <>
      {multiLinks.map((l: string) => {
        const link = l.trim();

        // checking for buybacks to determine between summary and detail pdfs
        // if another dataset is set up with this logic, let's revisit how to build this
        if (url.includes('buybacks')) {
          if (
            (link.toLowerCase().startsWith('ofbbr') && link.toLowerCase().endsWith('p1.pdf')) ||
            (link.toUpperCase().startsWith('BBSR_') && link.toLowerCase().endsWith('_1.pdf'))
          ) {
            alias = 'Summary';
          } else if (
            (link.toLowerCase().startsWith('ofbbr') && link.toLowerCase().endsWith('p2.pdf')) ||
            (link.toUpperCase().startsWith('BBDR_') && link.toLowerCase().endsWith('_1.pdf'))
          ) {
            alias = 'Detail';
          }
        }

        return (
          <CustomLink url={`${url}${link.trim()}`}>
            <div className={downloadLinkContainer}>
              <div className={downloadLinkIcon}>
                <FontAwesomeIcon icon={faCloudArrowDown} />
              </div>
              {alias ? alias : link.trim()}
            </div>
          </CustomLink>
        );
      })}
    </>
  );
};

const publishedReportsLinksProcessor = (tableName, property, value) => {
  if (tableName === 'Treasury Securities Auctions Data') {
    switch (property) {
      case 'pdf_filenm_announcemt':
      case 'xml_filenm_announcemt':
        return publishedReportsLinkWrapper(`/static-data/published-reports/auctions-query/announcements/`, value);
      case 'pdf_filenm_comp_results':
      case 'xml_filenm_comp_results':
        return publishedReportsLinkWrapper(`/static-data/published-reports/auctions-query/results/`, value);
      case 'pdf_filenm_noncomp_results':
        return publishedReportsLinkWrapper(`/static-data/published-reports/auctions-query/ncr/`, value);
      case 'pdf_filenm_spec_announcemt':
        return publishedReportsLinkWrapper(`/static-data/published-reports/auctions-query/spec-ann/`, value);
      default:
        return value;
    }
  }
  if (tableName === 'Reference CPI Numbers and Daily Index Ratios Summary Table') {
    if (property === 'pdf_link' || property === 'xml_link') {
      return publishedReportsLinkWrapper(`/static-data/published-reports/tips-cpi/`, value);
    } else {
      return value;
    }
  }
  if (tableName === 'Buybacks Operations') {
    switch (property) {
      case 'results_pdf':
        return publishedReportsLinkWrapper(`/static-data/published-reports/buybacks/result/`, value, 'PDF');
      case 'results_xml':
        return publishedReportsLinkWrapper(`/static-data/published-reports/buybacks/result/`, value, 'XML');
      case 'final_ann_pdf':
        return publishedReportsLinkWrapper(`/static-data/published-reports/buybacks/announcement/`, value, 'PDF');
      case 'final_ann_xml':
        return publishedReportsLinkWrapper(`/static-data/published-reports/buybacks/announcement/`, value, 'XML');
      case 'preliminary_ann_xml':
        return publishedReportsLinkWrapper(`/static-data/published-reports/buybacks/preliminary/`, value, 'XML');
      case 'preliminary_ann_pdf':
        return publishedReportsLinkWrapper(`/static-data/published-reports/buybacks/preliminary/`, value, 'PDF');
      case 'special_ann_pdf':
        return publishedReportsLinkWrapper(`/static-data/published-reports/buybacks/special-announcement/`, value, 'PDF');
      default:
        return value;
    }
  } else {
    return value;
  }
};

export const columnsConstructorData = (
  rawData: Record<string, Record<string, unknown>>,
  hideColumns: string[],
  tableName: string,
  columnConfig: { property: string; name: string }[],
  customFormatConfig: { type: string; fields: string[]; dateFormat: string }[]
): ColumnDef<string, string | Date | number>[] => {
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
                const customFormat = customFormatConfig?.find(config => config.type === 'DATE' && config.fields.includes(property));
                return dayjs(getValue()).format(customFormat?.dateFormat ? customFormat.dateFormat : 'M/D/YYYY');
              },
            } as ColumnDef<string, Date>;
          } else if (rawData.meta.dataTypes[property] === 'NUMBER') {
            return {
              accessorKey: property,
              header: name,
              accessorFn: value => (value[property] === 'null' ? '' : value[property]),
              cell: ({ getValue }) => {
                const value = getValue();
                let formattedValue;
                const customFormat = customFormatConfig?.find(config => config.type === 'NUMBER' && config.fields.includes(property));
                if (!!customFormat && !customFormat.noFormatting) {
                  formattedValue = customNumberFormatter.format(value, customFormat.decimalPlaces);
                } else if (customFormat?.noFormatting) {
                  formattedValue = value ? value : '';
                } else if (tableName === 'FRN Daily Indexes' && property === 'spread') {
                  formattedValue = value ? Number(value).toFixed(3) : '';
                } else {
                  formattedValue = numberFormatter.format(value);
                }

                if (tableName === 'Demand Deposit Rate' && property === 'daily_factor') {
                  formattedValue = Number(value);
                }

                return formattedValue;
              },
            } as ColumnDef<string, number>;
          } else if (rawData.meta.dataTypes[property] === 'PERCENTAGE') {
            return {
              accessorKey: property,
              header: name,
              accessorFn: value => (value[property] === 'null' ? '' : value[property]),
              cell: ({ getValue }) => {
                const value = getValue();
                return value === undefined ? '' : `${getValue()}%`;
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
              accessorFn: value => (value[property] === 'null' ? '' : value[property]),
              cell: ({ getValue }) => {
                const val = getValue();
                return val === '*' || val === '(*)' ? '*' : currencyFormatter.format(getValue());
              },
            } as ColumnDef<string, string>;
          } else if (rawData.meta.dataTypes[property]?.includes('CURRENCY') && /\d/.test(rawData.meta.dataTypes[property].split('CURRENCY')[1])) {
            const decimalPlaces = parseInt(rawData.meta.dataTypes[property].split('CURRENCY')[1]);
            return {
              accessorKey: property,
              header: name,
              accessorFn: value => (value[property] === 'null' ? '' : value[property]),
              cell: ({ getValue }) => {
                const val = getValue();
                return val === '*' || val === '(*)' ? '*' : customFormat(getValue(), decimalPlaces);
              },
            } as ColumnDef<string, string>;
          } else if (rawData.meta.dataTypes[property] === 'STRING') {
            return {
              accessorKey: property,
              header: name,
              accessorFn: value => (value[property] === 'null' ? '' : value[property]),
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
                        formattedValue = formattedValue + ', ' + dayjs(date).format('M/D/YYYY');
                      } else {
                        formattedValue = formattedValue + dayjs(date).format('M/D/YYYY');
                      }
                    });
                  } else {
                    if (tablesWithPublishedReportLinks.includes(tableName)) {
                      formattedValue = publishedReportsLinksProcessor(tableName, property, value);
                    } else {
                      formattedValue = value;
                    }
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

export const columnsConstructorGeneric = (
  columns: { property: string; name: string; type: string }[],
  customFormatting: { type: string; fields: string[]; dateFormat: string }[]
): ColumnDef<string, string | Date>[] => {
  return columns.map(
    ({ property, name, type }): ColumnDef<string, string | Date> => {
      let colConfig;
      if (type === 'DATE') {
        colConfig = {
          accessorKey: property,
          header: name,
          filterFn: 'arrIncludesSome',
          cell: ({ getValue }) => {
            const customFormat = customFormatting?.find(config => config.type === 'DATE' && config.fields.includes(property));
            return dayjs(getValue()).format(customFormat?.dateFormat ? customFormat.dateFormat : 'M/D/YYYY');
          },
        } as ColumnDef<string, Date>;
      } else {
        colConfig = { accessorKey: property, header: name, property: property, type: type } as ColumnDef<string, string>;
      }
      return colConfig;
    }
  );
};

export const getColumnFilter: (
  header,
  type: string,
  resetFilters: boolean,
  allActiveFilters: string[],
  setAllActiveFilters: (val: string[]) => void,
  manualPagination: boolean,
  isLastColumn: boolean,
  disableDateRangeFilter: boolean
) => JSX.Element = (header, type, resetFilters, allActiveFilters, setAllActiveFilters, manualPagination, isLastColumn, disableDateRangeFilter) => {
  if (type === 'DATE') {
    return (
      <DateRangeFilter
        column={header.column}
        resetFilters={resetFilters}
        allActiveFilters={allActiveFilters}
        setAllActiveFilters={setAllActiveFilters}
        isLastColumn={isLastColumn}
        disableDateRangeFilter={disableDateRangeFilter}
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

export const columnHeaderFilterActive = (activeFilters, columnName) => {
  if (!!activeFilters) {
    for (let i = 0; i < activeFilters.length; i++) {
      const name = activeFilters[i].split('-')[0];
      if (name === columnName) {
        return true;
      }
    }
  }
};

export const columnHeaderFilterApplied = (appliedFilters, columnName) => {
  if (!!appliedFilters) {
    for (let i = 0; i < appliedFilters.length; i++) {
      if (appliedFilters[i] === columnName) {
        return true;
      }
    }
  }
};

export const columnBodyFilterActive = (activeFilters, columnName) => {
  if (!!activeFilters) {
    for (let i = 0; i < activeFilters.length; i++) {
      const name = activeFilters[i].split('-')[0];
      if (columnName.includes(name)) {
        return true;
      }
    }
  }
};

export const columnBodyFilterApplied = (appliedFilters, columnName) => {
  if (!!appliedFilters) {
    for (let i = 0; i < appliedFilters.length; i++) {
      if (columnName.includes(appliedFilters[i])) {
        return true;
      }
    }
  }
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

export const constructDateHeader = (datasetName, dateRange) => {
  const timestampData = [];
  timestampData.push(`${datasetName}.`);
  const date = new Date(dateRange.to.toString());
  const dateFormatted = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
  const lastDateOfMonth = `${dateFormatted}`;
  timestampData.push(`As of ${lastDateOfMonth}`);
  return timestampData;
};
