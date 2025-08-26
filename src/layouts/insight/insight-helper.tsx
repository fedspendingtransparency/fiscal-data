export type SortingState = Array<{ id; desc? }>;

type Col = { property: string; type?: 'NUMBER' | 'DATE' | 'STRING' };

const normalize = (value, type?) => {
  if (value == null) return null;

  if (type === 'NUMBER') {
    if (typeof value === 'string') {
      const num = Number(value.replace(/[^0-9.\-]/g, ''));
      return Number.isNaN(num) ? 0 : num;
    }
    return Number(value);
  }

  if (type === 'DATE') {
    const dateValue = value instanceof Date ? value : new Date(value);
    return dateValue.getTime();
  }
  return String(value);
};

export const sortRowsForDownload = <T extends Record<string, any>>(rows: T[], sorting: SortingState, columns): T[] => {
  if (!rows?.length || !sorting?.length) return rows ?? [];

  const colMap = new Map(columns.map(c => [c.property, c]));
  const sorters = sorting.map(s => ({
    id: s.id,
    desc: !!s.desc,
    type: colMap.get(s.id)?.type ?? 'STRING',
  }));

  const compare = (a: T, b: T) => {
    for (const { id, desc, type } of sorters) {
      const valueA = normalize(a[id], type as Col['type']);
      const valueB = normalize(b[id], type as Col['type']);
      if (valueA < valueB) return desc ? 1 : -1;
      if (valueA > valueB) return desc ? -1 : 1;
    }
    return 0;
  };

  return [...rows].sort(compare);
};
