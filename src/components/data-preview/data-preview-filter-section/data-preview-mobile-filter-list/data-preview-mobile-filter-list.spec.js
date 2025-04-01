import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import DataPreviewMobileFilterList from '../data-preview-mobile-filter-list/data-preview-mobile-filter-list';

const mockFilters = [
  { name: 'Record Date', secondary: 'Last 5 years', selected: false, active: true },
  { name: 'Parent ID', secondary: 'No filter applied', selected: true, active: false },
  { name: 'Classification ID', secondary: 'No filter applied', selected: false, active: false },
  { name: 'Classification Description', secondary: 'No filter applied', selected: false, active: false },
  { name: 'Record Type Code', secondary: 'No filter applied', selected: false, active: false },
  { name: 'Current Month Budget Amount', secondary: 'No filter applied', selected: false, active: false },
];

describe('Data preview mobile filter list', () => {
  it('Renders a list of buttons', () => {
    const { getAllByRole } = render(<DataPreviewMobileFilterList filterOptions={mockFilters} />);
    const buttons = getAllByRole('button');
    // expect(buttons.length).toBeGreaterThan(1);
    expect(buttons.length).toEqual(6);
  });

  it('Renders the parts of each button', () => {
    const { getByText } = render(<DataPreviewMobileFilterList filterOptions={mockFilters} />);
    expect(getByText('Record Date')).toBeInTheDocument();
    expect(getByText('Last 5 years')).toBeInTheDocument();
  });

  it('Adds the selected class onto selected filters', () => {
    const { getByRole } = render(<DataPreviewMobileFilterList filterOptions={mockFilters} />);
    expect(getByRole('button', { name: 'Parent ID No filter applied' })).toHaveClass('selected');
    expect(getByRole('button', { name: 'Record Date Last 5 years' })).not.toHaveClass('selected');
  });

  it('Adds the active class onto active filters', () => {
    const { getByRole } = render(<DataPreviewMobileFilterList filterOptions={mockFilters} />);
    expect(getByRole('button', { name: 'Record Date Last 5 years' })).toHaveClass('active');
    expect(getByRole('button', { name: 'Parent ID No filter applied' })).not.toHaveClass('active');
  });

  it('Calls the onClick handle upon button click', () => {
    const clickHandlerSpy = jest.fn();
    const { getByRole } = render(<DataPreviewMobileFilterList onClick={clickHandlerSpy} filterOptions={mockFilters} />);
    const button = getByRole('button', { name: 'Record Date Last 5 years' });
    fireEvent.click(button);
    expect(clickHandlerSpy).toHaveBeenCalled();
  });
});
