import { buildNestedDateOptions } from './date-options';

describe('date-options helper', () => {
  it('groups by year and sorts years desc, children desc by date', () => {
    const isoDates = ['2024-06-30', '2024-09-30', '2023-01-01', '2024-01-31', '2023-12-31'];
    const out = buildNestedDateOptions(isoDates, false);

    expect(out.map(g => g.label)).toEqual(['2024', '2023']);

    const year2024 = out[0].children.map(c => c.value);
    expect(year2024).toEqual(['2024-09-30', '2024-06-30', '2024-01-31']);

    const year2023 = out[1].children.map(c => c.value);
    expect(year2023).toEqual(['2023-12-31', '2023-01-01']);
  });
});
