import React from 'react';
import { getGlossaryMap } from './glossary-data';
import { testGlossaryData } from '../../components/glossary/test-helper';

describe('Glossary Data', () => {

  it('creates a glossary map with letter groups sorted alphabetically', () => {
    const result = getGlossaryMap(testGlossaryData);
    expect(result['A']).toStrictEqual([testGlossaryData[3], testGlossaryData[2]]);
    expect(result['B']).toStrictEqual([testGlossaryData[0]]);
    expect(result['P']).toStrictEqual([testGlossaryData[1]]);
  })

  it('will not contain vales for starting letters not present in the list', () => {
    const result = getGlossaryMap(testGlossaryData);
    expect(result['Z']).toBeFalsy();
  })
})
