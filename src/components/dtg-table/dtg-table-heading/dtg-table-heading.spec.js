import React from 'react';
import renderer from 'react-test-renderer';
import DtgTableHeading from './dtg-table-heading';
import {ColumnConfig, ColumnConfig2} from '../test-data';

describe('Data Table Heading component', () => {
    const component = renderer.create(<DtgTableHeading
        columns={ColumnConfig}
                                      />);
    const instance = component.root;

    it('places a heading for each item in the config', () => {
        expect(instance.findAllByType('th').length).toEqual(ColumnConfig.length);
    });

    it('labels each heading with the item name', () => {
        expect(instance.findAllByType('th')[0].children).toEqual([ColumnConfig[0].name]);
    });

    it('sets a column width when configured', () => {
        const columnWithWidth = ColumnConfig[1];

        expect(instance.findAllByType('th')[0].props.style.width).toBe('auto');
        expect(instance.findAllByType('th')[1].props.style.width).toBe(`${columnWithWidth.width}%`);
    });

    it('sets the text-align property to right if the datatype is "DATE", "CURRENCY", "PERCENTAGE", "NUMBER" or contains the word CURRENCY followed by a number', () => {
      const component = renderer.create(<DtgTableHeading
        columns={ColumnConfig2}
                                        />);
      const instance = component.root;
      expect(instance.findAllByType('th')[0].props.style.textAlign).not.toBeDefined();
      expect(instance.findAllByType('th')[1].props.style.textAlign).toBe('right');
      expect(instance.findAllByType('th')[2].props.style.textAlign).toBe('right');
      expect(instance.findAllByType('th')[3].props.style.textAlign).toBe('right');
      expect(instance.findAllByType('th')[4].props.style.textAlign).toBe('right');
      expect(instance.findAllByType('th')[5].props.style.textAlign).toBe('right');
      expect(instance.findAllByType('th')[6].props.style.textAlign).toBe('right');
    });

    it('sets all th scope to "col"', () => {
      instance.findAllByType("th").forEach(h => {
        expect(h.props.scope).toBe("col")
      })
    })
});
