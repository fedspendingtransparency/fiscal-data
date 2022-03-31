import React from 'react';
import { setColumns } from './dtg-table-helper';
import { ColumnConfig } from './test-data';

const dataProperties = {
    keys: ['foo', 'bar', 'zoo', 'zar', 'first', 'middle', 'last'],
    excluded: [],
};

describe('DTG table helper', () => {
    const output = setColumns(dataProperties, ColumnConfig);

    it('merges config with properies that have no config', () => {
        expect(output.length).toEqual(dataProperties.keys.length);
    })
    
    it('observes specified sort', () => {
        const position = 3;
        expect(output[position-1].order).toEqual(position);
    })
    
    it('does not blow up when there is no config', () => {
        expect(setColumns(dataProperties).length).toBe(dataProperties.keys.length);
    })

    it('filters out columns that are excluded by the dataProperties', () => {
        dataProperties.excluded.push('foo');
        expect(setColumns(dataProperties, ColumnConfig).length).toBe(dataProperties.keys.length - dataProperties.excluded.length);
    })
    
});
