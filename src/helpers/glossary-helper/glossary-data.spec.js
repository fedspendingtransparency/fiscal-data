import React from 'react';
import { getGlossaryData } from './glossary-data';

describe('Glossary Data', () => {
  const glossaryExample = [
    {
      id: 1,
      term: 'Banana',
      site_page: 'debt',
      definition: 'A banana',
      urlDisplay: 'example.com',
      urlPath: 'example.com'
    },
    {
      id: 2,
      term: 'Pear',
      site_page: 'debt',
      definition: 'A pear',
      urlDisplay: 'example.com',
      urlPath: 'example.com'
    },
    {
      id: 3,
      term: 'apple',
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
  ]

  it('creates a glossary map with letter groups sorted alphabetically', () => {
    const result = getGlossaryData(glossaryExample);
    expect(result['A']).toStrictEqual([glossaryExample[3], glossaryExample[2]]);
    expect(result['B']).toStrictEqual([glossaryExample[0]]);
    expect(result['P']).toStrictEqual([glossaryExample[1]]);
  })

  it('will not contain vales for starting letters not present in the list', () => {
    const result = getGlossaryData(glossaryExample);
    expect(result['Z']).toBeFalsy();
  })
})
