import React from 'react';
import renderer from 'react-test-renderer';
import SortDatasets from './sort-datasets';
import { SortOptions } from '../search-results-helper';
import SelectControl from '../../../select-control/select-control';

const searchIsActive = true;
const onSort = jest.fn();

describe('Sort Datasets', () => {
    const component = renderer.create(
        <SortDatasets 
            setSort={onSort} 
            searchIsActive={searchIsActive} 
            sortOptions={SortOptions}
        />
    );
    const instance = component.root;

    it('passes the sort options to the select control', () => {
        expect(instance.findByType(SelectControl).props.options).toBe(SortOptions);
    })

    it('passes the callback to the sort control', () => {
        expect(instance.findByType(SelectControl).props.changeHandler).toBe(onSort);
    })
})