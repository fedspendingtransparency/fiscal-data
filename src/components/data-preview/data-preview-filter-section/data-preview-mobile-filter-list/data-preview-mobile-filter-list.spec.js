import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import DataPreviewMobileFilterList from '../data-preview-mobile-filter-list/data-preview-mobile-filter-list';

const mockFilters = [
  { name: 'Record Date', secondary: 'Last 5 years', selected: false, active: true },
  { name: 'Parent ID', selected: true, active: false },
];

const mockDataTables = [{ name: 'Operating Cash Balance' }, { name: 'Public Debt Transactions' }];

describe('Data preview mobile filter list', () => {
  it('Renders a list of buttons', () => {
    const { getAllByRole } = render(<DataPreviewMobileFilterList filterOptions={mockFilters} optionLabelKey="name" secondaryLabelKey="secondary" />);
    const buttons = getAllByRole('button');
    expect(buttons.length).toEqual(2);
  });

  it('Renders the parts of each button', () => {
    const { getByText } = render(<DataPreviewMobileFilterList filterOptions={mockFilters} optionLabelKey="name" secondaryLabelKey="secondary" />);
    expect(getByText('Record Date')).toBeInTheDocument();
    expect(getByText('Last 5 years')).toBeInTheDocument();
  });

  it('Adds the selected class onto selected tables', () => {
    const { getByRole } = render(
      <DataPreviewMobileFilterList filterOptions={mockDataTables} optionLabelKey="name" selectedTable="Operating Cash Balance" />
    );
    expect(getByRole('button', { name: 'Operating Cash Balance' })).toHaveClass('selected');
    expect(getByRole('button', { name: 'Public Debt Transactions' })).not.toHaveClass('selected');
  });

  it('Adds the active class onto active filters', () => {
    const { getByRole } = render(<DataPreviewMobileFilterList filterOptions={mockFilters} optionLabelKey="name" secondaryLabelKey="secondary" />);
    expect(getByRole('button', { name: 'Record Date Last 5 years' })).toHaveClass('active');
    expect(getByRole('button', { name: 'Parent ID No filter selected' })).not.toHaveClass('active');
  });

  it('Calls the onClick handle upon button click', () => {
    const clickHandlerSpy1 = jest.fn();
    const clickHandlerSpy2 = jest.fn();
    const { getByRole } = render(
      <DataPreviewMobileFilterList
        filterOptions={mockFilters}
        optionLabelKey="name"
        secondaryLabelKey="secondary"
        onTableSelected={clickHandlerSpy1}
        onDataTableSelected={clickHandlerSpy2}
      />
    );
    const button = getByRole('button', { name: 'Record Date Last 5 years' });
    fireEvent.click(button);
    expect(clickHandlerSpy1).toHaveBeenCalled();
    expect(clickHandlerSpy2).toHaveBeenCalled();
  });
});
