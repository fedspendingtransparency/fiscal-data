import { format } from 'date-fns';

export const formatCellGenerativeValue = (value: any, colConfig: { columnName: string; dataType?: string }, customFormatting: any[] = []) => {
  if (value === null || value === undefined || value === '' || value === 'null') {
    return '';
  }

  switch (colConfig.dataType) {
    case 'DATE': {
      const [year, month, day] = String(value)
        .split('-')
        .map(Number);
      const parsed = new Date(year, month - 1, day);
      return !isNaN(parsed.getTime()) ? format(parsed, 'MM/dd/yyyy') : String(value);
    }

    case 'NUMBER': {
      const isCurrency = customFormatting?.some(field => field.type === 'NUMBER' && field.currency && field.fields.includes(colConfig.columnName));
      if (isCurrency) {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
        }).format(Number(value));
      }
      return String(value);
    }

    default:
      return String(value);
  }
};
