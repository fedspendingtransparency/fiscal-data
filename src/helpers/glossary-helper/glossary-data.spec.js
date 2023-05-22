import React from 'react';
import { getSortedGlossaryList } from './glossary-data';
import { testGlossaryData } from '../../components/glossary/test-helper';

describe('Glossary Data', () => {

  it('creates a glossary map with letter groups sorted alphabetically', () => {
    const result = getSortedGlossaryList(testGlossaryData);
    expect(result[0]).toStrictEqual([testGlossaryData[3], testGlossaryData[2]]);
    expect(result[1]).toStrictEqual([testGlossaryData[0]]);
    expect(result[2]).toStrictEqual([testGlossaryData[1]]);
  })

  it('will not contain vales for starting letters not present in the list', () => {
    const result = getSortedGlossaryList(testGlossaryData);
    expect(result['Z']).toBeFalsy();
  })

  it('adds a slug for each glossary term', () => {
    const result = getSortedGlossaryList(testGlossaryData);

    expect(result[0][0].slug).toBe('another-apple');
  })
})
