import React from 'react';
import DataPreviewTableFilters from './data-preview-table-filters';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Table filters dropdown', () => {
  it('renders the dropdown button', () => {
    const { getByRole } = render(<DataPreviewTableFilters />);
    const dropdownButton = getByRole('button', { name: 'Filters: 0 applied' });
    userEvent.click(dropdownButton);
    //Filters dropdown opens on click
    const applyButton = getByRole('button', { name: 'Apply' });
    expect(applyButton).toBeInTheDocument();
  });
});
