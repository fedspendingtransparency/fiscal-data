import { render } from '@testing-library/react';
import React from 'react';
import ResetTableSection from './reset-table-section';

describe('reset table section', () => {
  it('renders the section', () => {
    const instance = render(<ResetTableSection resetColumns={jest.fn()} active={true} />);
    expect(instance).toBeTruthy();
  });

  it('renders the reset button', () => {
    const mockResetColumns = jest.fn();
    const { getByRole } = render(<ResetTableSection resetColumns={mockResetColumns} active={true} />);
    const resetButton = getByRole('button', { name: 'Reset Filters' });
    expect(resetButton).toBeInTheDocument();
    resetButton.click();
    expect(mockResetColumns).toHaveBeenCalled();
  });
});
