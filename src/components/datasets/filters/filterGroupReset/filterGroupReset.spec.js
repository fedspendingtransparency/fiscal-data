import { renderHelper } from "../../../../helpers/renderHelper";
import React from "react";
import FilterGroupReset from "./filterGroupReset";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactDOM from 'react-dom';
import { act } from 'react-test-renderer';
import { mockFilters } from "../../mockData/mockFilters"

describe('filter group reset', () => {
    const groupResetMock = jest.fn();

    let component, instance, renderer, filters;

    beforeEach(() => {
      filters = mockFilters;
        ({ component, instance, renderer } = renderHelper(
            <FilterGroupReset
                groupId='lastUpdated'
                onGroupReset={groupResetMock}
                activeFilters={['ninetyDays', 'sevenDays']}
                filters={filters}
            />));
    })

    it('displays the count for this group', () => {
        const count = instance.findByProps({ 'data-testid': 'count' })
        expect(count.children).toContain('2');
    })

    it('includes the icon', () => {
        const icon = instance.findByType(FontAwesomeIcon);
        expect(icon).toBeDefined();
    })

    it('hides the button when there are no matches', () => {
        renderer.act(() => {
            component.update(
                <FilterGroupReset
                    groupId='lastUpdated'
                    activeFilters={['foo', 'bar']}
                />
            )
        })

        expect(component.toJSON()).toBeNull();
    })

    it('calls the group reset callback when clicked', () => {
        let container = document.createElement('div');
        document.body.appendChild(container);

        act(() => {
            ReactDOM.render(<FilterGroupReset
                groupId='lastUpdated'
                onGroupReset={groupResetMock}
                activeFilters={['ninetyDays', 'sevenDays']}
                filters={filters}
                            />, container);
        });

        const button = container.querySelector('button');

        act(() => {
            button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        });

        expect(groupResetMock).toHaveBeenCalledWith('lastUpdated');

        document.body.removeChild(container);
        container = null;
    })
});
