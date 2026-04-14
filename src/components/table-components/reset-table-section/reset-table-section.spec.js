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

  it('display warning banner when text filtering is disabled', () => {
    const mockResetColumns = jest.fn();
    const { getByText } = render(<ResetTableSection resetColumns={mockResetColumns} active={true} textFilteringDisabled={true} />);
    const banner = getByText('Text filtering has been limited due to large table size');
    expect(banner).toBeInTheDocument();
  });

  it('does not display warning banner when text filtering is enabled', () => {
    const mockResetColumns = jest.fn();
    const { queryByText } = render(<ResetTableSection resetColumns={mockResetColumns} active={true} />);
    const banner = queryByText('Text filtering has been limited due to large table size');
    expect(banner).not.toBeInTheDocument();
  });
});
