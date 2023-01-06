import { renderHelper } from "../../../../../helpers/renderHelper";
import React from "react";
import FilterCount from './filterCount';

const maxWidth = 40;

describe('filter count', () => {
    let component, instance, renderer, bar;

    beforeEach(() => {
        ({ component, instance, renderer } = renderHelper(
            <FilterCount
                count={{
                    count: 5,
                    of: 18
                }}
            />));
        bar = instance.findByProps({ 'data-testid': 'filter-count-bar' });
    })

    it('displays the number passed to it', () => {
        const count = instance.findByProps({ 'data-testid': 'filter-count' });
        expect(count.children).toContain("5")
    })

    it('sets the bar styles', () => {
        const w = Math.ceil(5 / 18);
        expect(bar.props.style.width).toBe('28%');
        expect(bar.props.style.minWidth).toBe(12);
    })

    it('sets minWidth to zero when there are no matches', () => {
        renderer.act(() => {
            component.update(<FilterCount
                count={{
                    count: 0,
                    of: 18
                }}
            />)
        })

        expect(bar.props.style.minWidth).toBe(0);
    })

    it('raises minWidth when count is two digits', () => {
        renderer.act(() => {
            component.update(<FilterCount
                count={{
                    count: 10,
                    of: 18
                }}
            />)
        })

        expect(bar.props.style.minWidth).toBe(19);
    })
})