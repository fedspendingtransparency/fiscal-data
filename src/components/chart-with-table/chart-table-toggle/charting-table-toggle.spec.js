import React from 'react';
import ChartTableToggle from './charting-table-toggle';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('ChartTableToggle', () => {
  it('renders two radio inputs with labels', () => {
    render(<ChartTableToggle />);
    const tableRadio = screen.getByLabelText('Table');
    const chartRadio = screen.getByLabelText('Chart');

    expect(tableRadio).toBeInTheDocument();
    expect(chartRadio).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(2);
  });

  it('calls onChange function when radio selection changes', async () => {
    const onChangeSpy = jest.fn();
    render(<ChartTableToggle onChange={onChangeSpy} />);

    const chartRadio = screen.getByLabelText('Chart');
    await userEvent.click(chartRadio);
    expect(onChangeSpy).toHaveBeenCalledWith('chart');

    const tableRadio = screen.getByLabelText('Table');
    await userEvent.click(tableRadio);
    expect(onChangeSpy).toHaveBeenCalledWith('table');
  });
});
