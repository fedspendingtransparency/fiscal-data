import React from 'react';
import DtgTableHeading from './dtg-table-heading';
import { ColumnConfig, ColumnConfig2 } from '../test-data';
import { render } from '@testing-library/react';

describe('Data Table Heading component', () => {
  it('places a heading for each item in the config', () => {
    const { getAllByRole } = render(<DtgTableHeading columns={ColumnConfig} />);
    expect(getAllByRole('columnheader').length).toEqual(ColumnConfig.length);
  });

  it('labels each heading with the item name', () => {
    const { getByRole } = render(<DtgTableHeading columns={ColumnConfig} />);
    expect(getByRole('columnheader', { name: ColumnConfig[0].name })).toBeInTheDocument();
  });

  it('sets a column width when configured', () => {
    const columnWithWidth = ColumnConfig[1];
    const { getAllByRole } = render(<DtgTableHeading columns={ColumnConfig} />);

    expect(getAllByRole('columnheader')[0]).toHaveStyle({ width: 'auto' });
    expect(getAllByRole('columnheader')[1]).toHaveStyle({ width: `${columnWithWidth.width}%` });
  });

  it('sets the text-align property to right if the datatype is "DATE", "CURRENCY", "PERCENTAGE", "NUMBER" or contains the word CURRENCY followed by a number', () => {
    const { getAllByRole } = render(<DtgTableHeading columns={ColumnConfig2} />);

    expect(getAllByRole('columnheader')[0]).not.toHaveStyle({ textAlign: 'right' });
    expect(getAllByRole('columnheader')[1]).toHaveStyle({ textAlign: 'right' });
    expect(getAllByRole('columnheader')[2]).toHaveStyle({ textAlign: 'right' });
    expect(getAllByRole('columnheader')[3]).toHaveStyle({ textAlign: 'right' });
    expect(getAllByRole('columnheader')[4]).toHaveStyle({ textAlign: 'right' });
    expect(getAllByRole('columnheader')[5]).toHaveStyle({ textAlign: 'right' });
    expect(getAllByRole('columnheader')[6]).toHaveStyle({ textAlign: 'right' });
  });

  it('sets all th scope to "col"', () => {
    const { getAllByRole } = render(<DtgTableHeading columns={ColumnConfig} />);

    getAllByRole('columnheader').forEach(h => {
      expect(h).toHaveAttribute('scope', 'col');
    });
  });
});
