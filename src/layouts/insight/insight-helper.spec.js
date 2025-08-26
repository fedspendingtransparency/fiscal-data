import { sortRowsForDownload } from './insight-helper';

describe('sortRowsForDownload', () => {
  const columns = [
    { property: 'date', type: 'DATE' },
    { property: 'amount', type: 'NUMBER' },
    { property: 'label', type: 'STRING' },
  ];

  const rows = [
    { date: '2024-03-01', amount: '$2,000.00', label: 'b' },
    { date: new Date('2023-12-01'), amount: 100, label: 'a' },
    { date: '2024-01-15', amount: '$1,500.50', label: 'c' },
  ];

  it('returns original rows when no sorting provided', () => {
    const out = sortRowsForDownload(rows, [], columns);
    expect(out).toEqual(rows);
  });

  it('sorts by DATE ascending (mixed ISO and Date objects)', () => {
    const sorting = [{ id: 'date', desc: false }];
    const out = sortRowsForDownload(rows, sorting, columns);
    expect(out.map(r => r.date)).toEqual([new Date('2023-12-01'), '2024-01-15', '2024-03-01']);
  });

  it('sorts by NUMBER descending (handles currency strings)', () => {
    const sorting = [{ id: 'amount', desc: true }];
    const out = sortRowsForDownload(rows, sorting, columns);
    expect(out.map(r => r.amount)).toEqual(['$2,000.00', '$1,500.50', 100]);
  });

  it('sorts by STRING ascending', () => {
    const sorting = [{ id: 'label', desc: false }];
    const out = sortRowsForDownload(rows, sorting, columns);
    expect(out.map(r => r.label)).toEqual(['a', 'b', 'c']);
  });

  it('supports multi-column sort (tie-breaker)', () => {
    const rowsWithTies = [
      { date: '2024-01-01', amount: 10, label: 'b' },
      { date: '2024-01-01', amount: 10, label: 'a' },
      { date: '2024-01-01', amount: 5, label: 'z' },
    ];
    const sorting = [
      { id: 'amount', desc: true },
      { id: 'label', desc: false },
    ];
    const out = sortRowsForDownload(rowsWithTies, sorting, columns);
    expect(out.map(r => `${r.amount}-${r.label}`)).toEqual(['10-a', '10-b', '5-z']);
  });

  it('handles null/undefined values safely', () => {
    const weird = [
      { date: null, amount: '$1,000', label: 'x' },
      { date: '2020-01-01', amount: null, label: 'x' },
    ];
    const out = sortRowsForDownload(weird, [{ id: 'date' }], columns);
    expect(out).toHaveLength(2);
  });
});
