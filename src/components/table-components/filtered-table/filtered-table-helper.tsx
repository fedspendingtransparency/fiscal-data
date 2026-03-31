import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';

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
