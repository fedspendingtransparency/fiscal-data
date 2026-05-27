import { format } from 'date-fns';

export const buildNestedDateOptions = (
  isDates: string[],
  isByDay: boolean
): Array<{ label: string; isLabel: true; children: Array<{ label: string; value: string }> }> => {
  const groups: Record<string, { label: string; children: Array<{ label: string; value: string }> }> = {};

  isDates.forEach(iso => {
    const d = new Date(`${iso}T00:00:00`);
    const year = String(d.getFullYear());
    const childLabel = isByDay ? format(d, 'MMMM d, yyyy') : format(d, 'MMMM yyyy');

    if (!groups[year]) groups[year] = { label: year, children: [] };
    if (!groups[year].children.some(c => c.value === iso)) {
      groups[year].children.push({ label: childLabel, value: iso });
    }
  });

  return Object.values(groups)
    .sort((a, b) => Number(b.label) - Number(a.label))
    .map(group => ({
      label: group.label,
      isLabel: true as const,
      children: group.children.sort((a, b) => new Date(b.value).getTime() - new Date(a.value).getTime()),
    }));
};
