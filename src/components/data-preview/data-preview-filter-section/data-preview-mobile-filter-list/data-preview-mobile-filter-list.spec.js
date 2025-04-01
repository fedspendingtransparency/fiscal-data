import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import DataPreviewMobileFilterList from '../data-preview-mobile-filter-list/data-preview-mobile-filter-list';

describe('Data preview mobile filter list', () => {
  it('Renders a list of buttons', () => {
    const { getAllByRole } = render(<DataPreviewMobileFilterList />);
    expect(getAllByRole('button')).toBeGreaterThan(1);
  });

  it('Renders the parts of each button', () => {
    const { getByText } = render(<DataPreviewMobileFilterList />);
    expect(getByText('Record Date')).toBeInTheDocument();
    expect(getByText('Last 5 years')).toBeInTheDocument();
  });

  it('Adds the selected class onto selected filters', () => {
    const { getByRole } = render(<DataPreviewMobileFilterList />);
    expect(getByRole('button', { name: 'Record Date Last 5 years' })).toHaveClass('selected');
    expect(getByRole('button', { name: 'Parent ID No filter applied' })).not.toHaveClass('selected');
  });

  it('Adds the active class onto active filters', () => {
    const { getByRole } = render(<DataPreviewMobileFilterList />);
    expect(getByRole('button', { name: 'Record Date Last 5 years' })).toHaveClass('active');
    expect(getByRole('button', { name: 'Parent ID No filter applied' })).not.toHaveClass('active');
  });

  it('Calls the onClick handle upon button click', () => {
    const clickHandlerSpy = jest.fn();
    const { getByRole } = render(<DataPreviewMobileFilterList onClick={clickHandlerSpy} />);
    const button = getByRole('button', { name: 'Record Date Last 5 years' });
    fireEvent.click(button);
    expect(clickHandlerSpy()).toBeCalled();
  });
});
