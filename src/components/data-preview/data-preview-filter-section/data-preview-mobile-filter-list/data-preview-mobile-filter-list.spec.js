import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import DataPreviewMobileFilterList from '../data-preview-mobile-filter-list/data-preview-mobile-filter-list';

const mockFilters = [
  { name: 'Record Date', secondary: 'Last 5 years', selected: false, active: true },
  { name: 'Parent ID', secondary: 'No filter applied', selected: true, active: false },
];

const mockDataTables = [{ name: 'Operating Cash Balance' }, { name: 'Public Debt Transactions' }];

describe('Data preview mobile filter list', () => {
  it('Renders a list of buttons', () => {
    const { getAllByRole } = render(
      <DataPreviewMobileFilterList filterOptions={mockFilters} getName={option => option.name} getSecondary={option => option.secondary} />
    );
    const buttons = getAllByRole('button');
    expect(buttons.length).toEqual(2);
  });

  it('Renders the parts of each button', () => {
    const { getByText } = render(
      <DataPreviewMobileFilterList filterOptions={mockFilters} getName={option => option.name} getSecondary={option => option.secondary} />
    );
    expect(getByText('Record Date')).toBeInTheDocument();
    expect(getByText('Last 5 years')).toBeInTheDocument();
  });

  it('Adds the selected class onto selected tables', () => {
    const { getByRole } = render(
      <DataPreviewMobileFilterList filterOptions={mockDataTables} getName={option => option.name} selectedTable="Operating Cash Balance" />
    );
    expect(getByRole('button', { name: 'Operating Cash Balance' })).toHaveClass('selected');
    expect(getByRole('button', { name: 'Public Debt Transactions' })).not.toHaveClass('selected');
  });

  it('Adds the active class onto active filters', () => {
    const { getByRole } = render(
      <DataPreviewMobileFilterList
        filterOptions={mockFilters}
        getName={option => option.name}
        getSecondary={option => option.secondary}
        selectedFilter="Record Date"
      />
    );
    expect(getByRole('button', { name: 'Record Date Last 5 years' })).toHaveClass('active');
    expect(getByRole('button', { name: 'Parent ID No filter applied' })).not.toHaveClass('active');
  });

  it('Calls the onClick handle upon button click', () => {
    const clickHandlerSpy = jest.fn();
    const { getByRole, getByText } = render(
      <DataPreviewMobileFilterList filterOptions={mockFilters} getName={option => option.name} onTableSelected={clickHandlerSpy} />
    );
    const button = getByRole('button', { name: 'Record Date Last 5 years' });
    fireEvent.click(button);
    expect(clickHandlerSpy).toHaveBeenCalled();
  });
});
