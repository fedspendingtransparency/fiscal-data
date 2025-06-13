import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SelectControl, { ariaLabeler } from './select-control';

describe('DropdownOptions', () => {
  const mockOptions = [
    { label: 'Alphabetical (A to Z)', by: 'name', asc: false },
    { label: 'Alphabetical (Z to A)', by: 'name', asc: true },
  ];

  const setup = () => render(<SelectControl options={mockOptions} selectedOption={mockOptions[1]} changeHandler={() => null} />);

  it('does not initially render the option list to the dom tree', () => {
    setup();
    expect(screen.queryByRole('list')).toBeNull();
  });

  it('opens a list of options when the control is clicked', async () => {
    setup();

    const toggleBtn = screen.getByRole('button', {
      name: ariaLabeler(mockOptions[1].label),
    });
    expect(screen.queryByTestId('selector-option')).toBeNull();

    await userEvent.click(toggleBtn);

    const optionButtons = await screen.findAllByTestId('selector-option');
    expect(optionButtons).toHaveLength(2);
  });

  it('removes the option list from the dom tree when the toggle button is clicked a second time', async () => {
    setup();

    const toggleBtn = screen.getByRole('button', {
      name: ariaLabeler(mockOptions[1].label),
    });

    await userEvent.click(toggleBtn);
    const optionButtons = await screen.findAllByTestId('selector-option');
    expect(optionButtons).toHaveLength(2);

    await userEvent.click(toggleBtn);
    await waitFor(() => expect(screen.queryAllByTestId('selector-option')).toHaveLength(0));
  });
});
