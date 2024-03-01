import React from 'react';
import ChartLegend from './chart-legend';
import { savingsBonds, savingsBondsMap } from '../savings-bonds-sold-by-type-chart-helper';
import { render } from '@testing-library/react';

describe('Chart legend', () => {
  it('renders the legend', () => {
    const { getByText, getAllByRole } = render(
      <ChartLegend lines={savingsBonds} lineMap={savingsBondsMap} setHiddenFields={jest.fn()} hiddenFields={[]} />
    );
    expect(getByText('A - D')).toBeInTheDocument();
    expect(getAllByRole('checkbox', { hidden: true }).length).toBe(11);
  });

  it('calls click handler', () => {
    const setHiddenFieldsSpy = jest.fn();
    const { getAllByRole } = render(
      <ChartLegend lines={savingsBonds} lineMap={savingsBondsMap} setHiddenFields={setHiddenFieldsSpy} hiddenFields={[]} />
    );
    const checkBox = getAllByRole('checkbox', { hidden: true })[0];
    checkBox.click();
    expect(setHiddenFieldsSpy).toHaveBeenCalledWith(['AD']);
    checkBox.click();
    expect(setHiddenFieldsSpy).toHaveBeenCalledWith([]);
  });
});
