import React from 'react';
import renderer from 'react-test-renderer';
import ChartLegend from './chartLegend';
import Checkbox from '../../checkbox/checkbox';

const mockFieldConfig = [
    {
        field: 'a',
        displayName: 'A'
    },
    {
        field: 'b',
        displayName: 'B'
    },
    {
        field: 'c',
        displayName: 'C'
    }
]

describe('Chart Legend', () => {
    let component, checkboxComponent, instance, checkboxProps;

    renderer.act(() => {
        component = renderer.create(<ChartLegend
            fields={mockFieldConfig}
            onHover={jest.fn()}
            onLabelChange={jest.fn()}
                                    />)
    })

    instance = component.root;
    checkboxComponent = instance.findByType(Checkbox);
    checkboxProps = checkboxComponent.props

    it('passes options to the checkbox', () => {
        expect(checkboxProps.checkboxData.length).toBe(mockFieldConfig.length)
    })

    it('passes change handler to the checkbox', () => {
        expect(checkboxProps.changeHandler).toBeDefined()
    })

    it('passes hover handler to the checkbox', () => {
        expect(checkboxProps.onHover).toBeDefined()
    })

    it('places a heading with the total count of labels', () => {
        expect(instance.findByType('h1').props.children[1]).toBe(mockFieldConfig.length)
    })
})