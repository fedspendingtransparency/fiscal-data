export const mockReleaseCalendarEntries = [
  {
    datasetId: '015-BFS-2020Q4-xx',
    dataset: {
      name: 'Test Dataset 9',
      slug: '/test-dataset-9',
    },
    date: '2021-06-01',
    time: '1600',
    released: true,
  },
  {
    datasetId: '015-BFS-2014Q3-071',
    dataset: {
      name: 'Test Dataset 8',
      slug: '/test-dataset-8',
    },
    date: '2021-06-01',
    time: '2300',
    released: true,
  },
  {
    datasetId: '015-BFS-2014Q3-074',
    dataset: {
      name: 'Test Dataset 7',
      slug: '/test-dataset-7',
    },
    date: '2021-06-02',
    time: '1600',
    released: false,
  },
  {
    datasetId: '015-BFS-2014Q3-056',
    dataset: {
      name: 'Test Dataset 5',
      slug: '/test-dataset-5',
    },
    date: '2021-06-03',
    time: '1659',
    released: false,
  },
  {
    datasetId: '015-BFS-2014Q1-13',
    dataset: {
      name: 'Test Dataset 4',
      slug: '/test-dataset-4',
    },
    date: '2021-06-03',
    time: '1659',
    released: false,
  },
  {
    datasetId: '015-BFS-2014Q3-096',
    dataset: {
      name: 'Test Dataset 3',
      slug: '/test-dataset-3',
    },
    date: '2021-06-04',
    time: '1400',
    released: false,
  },
  {
    datasetId: '015-BFS-2014Q1-11',
    dataset: {
      name: 'Test Dataset 2',
      slug: '/test-dataset-2',
    },
    date: '2021-06-04',
    time: '1159',
    released: false,
  },
  {
    datasetId: '015-BFS-2014Q3-065',
    dataset: {
      name: 'Test Dataset 1',
      slug: '/test-dataset-1',
    },
    date: '2021-06-05',
    time: '1400',
    released: false,
  },
];

export const mockDatasetsForReleaseCalendar = [
  {
    datasetId: '015-BFS-2014Q3-065',
    name: 'Test Dataset 1',
    slug: '/test-dataset-1',
  },
  {
    datasetId: '015-BFS-2014Q1-11',
    name: 'Test Dataset 2',
    slug: '/test-dataset-2',
  },
  {
    datasetId: '015-BFS-2014Q3-096',
    name: 'Test Dataset 3',
    slug: '/test-dataset-3',
  },
  {
    datasetId: '015-BFS-2014Q1-13',
    name: 'Test Dataset 4',
    slug: '/test-dataset-4',
  },
  {
    datasetId: '015-BFS-2014Q3-056',
    name: 'Test Dataset 5',
    slug: '/test-dataset-5',
  },
  {
    datasetId: '015-BFS-2014Q3-074',
    name: 'Test Dataset 7',
    slug: '/test-dataset-7',
  },
  {
    datasetId: '015-BFS-2014Q3-071',
    name: 'Test Dataset 8',
    slug: '/test-dataset-8',
  },
  {
    datasetId: '015-BFS-2020Q4-xx',
    name: 'Test Dataset 9',
    slug: '/test-dataset-9',
  },
];

export const updatedEntries = [
  {
    datasetId: '015-BFS-2014Q3-056',
    date: '2021-06-03',
    time: '16:59',
    released: true,
  },
  {
    datasetId: '015-BFS-2014Q1-13',
    date: '2021-06-03',
    time: '16:59',
    released: true,
  },
  {
    datasetId: '015-BFS-2014Q3-096',
    date: '2021-06-04',
    time: '14:00',
    released: true,
  },
];

export const mockUpdatedDatasets = [
  ...mockReleaseCalendarEntries.map(entry => {
    const entryKey = `${entry.datasetId}_${entry.date}_${entry.time}`;

    const updated = updatedEntries.filter(updated => `${updated.datasetId}_${updated.date}_${updated.time.replace(/:/g, '')}` === entryKey)[0];

    if (updated)
      return {
        ...entry,
        released: true,
      };

    return entry;
  }),
];
