const glossaryData = [
  {
    "term": "Apple",
    "definition": "An Apple",
    "site_page": "Debt",
    "id":"1",
    "url_display": "",
    "url_path": "",
  }
]

export const mockUseStaticGlossaryData = {
  allGlossaryCsv: {
    nodes: glossaryData
  }
}

export const glossaryMapExample = {
  'A': [
    {
      id: 3,
      term: 'Apple',
      site_page: 'spending',
      definition: 'An apple',
      urlDisplay: 'example.com',
      urlPath: 'example.com'
    },
    {
      id: 4,
      term: 'Another Apple',
      site_page: 'spending',
      definition: 'An apple',
      urlDisplay: 'example.com',
      urlPath: 'example.com'
    }
  ],
  'B': [
    {
      id: 1,
      term: 'Banana',
      site_page: 'debt',
      definition: 'A banana',
      urlDisplay: 'example.com',
      urlPath: 'example.com'
    },
  ],
  'P': [
    {
      id: 2,
      term: 'Pear',
      site_page: 'debt',
      definition: 'A pear',
      urlDisplay: 'example.com',
      urlPath: 'example.com'
    },
  ],
}
