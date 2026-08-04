export const sortOptions = [
  {
    id: 'date',
    label: 'Date',
  },
  {
    id: 'name',
    label: 'Name',
  },
];

export const removeDuplicateReleases = entries => {
  const uniqueEntries = new Map();

  entries.forEach(entry => {
    const key = `${entry.datasetId}-${entry.date}-${entry.time}`;

    if (!uniqueEntries.has(key)) {
      uniqueEntries.set(key, entry);
    }
  });

  return [...uniqueEntries.values()];
}
