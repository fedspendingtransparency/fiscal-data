/* istanbul ignore file */
export const testGlossaryData = [
  {
    id: '1',
    term: 'Banana',
    site_page: 'debt',
    definition: 'A banana',
    urlDisplay: 'example.com',
    urlPath: 'example.com'
  },
  {
    id: '2',
    term: 'Pear',
    site_page: 'debt',
    definition: 'A pear',
    urlDisplay: 'example.com',
    urlPath: 'example.com'
  },
  {
    id: '3',
    term: 'apple',
    site_page: 'spending',
    definition: 'An apple',
    urlDisplay: 'example.com',
    urlPath: 'example.com'
  },
  {
    id: '4',
    term: 'Another Apple',
    site_page: 'spending',
    definition: 'An apple',
    urlDisplay: 'example.com',
    urlPath: 'example.com'
  }
]

export const testSortedGlossaryData = [
  [
    {
      id: 4,
      term: 'Another Apple',
      site_page: 'spending',
      definition: 'An apple',
      urlDisplay: 'example.com',
      urlPath: 'example.com'
    },
    {
    id: 3,
    term: 'Apple',
    site_page: 'spending',
    definition: 'An apple',
    urlDisplay: 'example.com',
    urlPath: 'example.com'
  },
  ],
 [ {
    id: 1,
    term: 'Banana',
    site_page: 'debt',
    definition: 'A banana',
    urlDisplay: 'example.com',
    urlPath: 'example.com'
  }],
  [{
    id: 2,
    term: 'Pear',
    site_page: 'debt',
    definition: 'A pear',
    urlDisplay: 'example.com',
    urlPath: 'example.com'
  }],
]

export const mockUseStaticGlossaryData = {
  allGlossaryCsv: {
    nodes: testGlossaryData
  }
}
