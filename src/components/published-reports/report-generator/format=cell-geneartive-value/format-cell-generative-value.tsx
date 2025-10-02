import { format } from 'date-fns';

interface ICustomFormatting {
  type: string;
  fields: string[];
  currency?: boolean;
}

export const formateCellGenerativeValue = (value: any, config: { columnName: string }, customFormatting: ICustomFormatting[]) => {
  if (value === null || value === 'null') return '';

  if (config.columnName === 'eff_date') {
    const parsed = new Date(value);
    if (!isNaN(parsed.getTime())) {
      return format(parsed, 'MM/dd/yyyy');
    }
  }

  const isCurrency = customFormatting?.some(field => field.type === 'NUMBER' && field.currency && field.fields.includes(config.columnName));

  if (isCurrency) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(Number(value));
  }

  return String(value);
};
