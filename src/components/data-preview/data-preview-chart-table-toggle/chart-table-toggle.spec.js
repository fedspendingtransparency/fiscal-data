import React from 'react';
import ChartTableToggle from './chart-table-toggle';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Chart table toggle', () => {
  it('Renders toggle button', () => {
    const { getAllByRole, getByRole } = render(<ChartTableToggle />);
    expect(getAllByRole('radio')).toHaveLength(2);
    expect(getByRole('radio', { name: 'Table' })).toBeInTheDocument();
    expect(getByRole('radio', { name: 'Chart' })).toBeInTheDocument();
  });

  it('Calls onChange function', () => {
    const onChangeSpy = jest.fn();
    const { getByRole } = render(<ChartTableToggle onChange={onChangeSpy} />);
    const chartButton = getByRole('radio', { name: 'Chart' });
    userEvent.click(chartButton);
    expect(onChangeSpy).toHaveBeenCalledWith('chart');
    const tableButton = getByRole('radio', { name: 'Table' });
    userEvent.click(tableButton);
    expect(onChangeSpy).toHaveBeenCalledWith('chart');
  });
});
