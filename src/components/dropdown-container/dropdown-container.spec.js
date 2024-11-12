import React from 'react';
import { render } from '@testing-library/react';
import DropdownContainer from './dropdown-container';
import userEvent from '@testing-library/user-event';

describe('Dropdown Container', () => {
  const childElement = <>Test!</>;
  const button = <button>Dropdown Button</button>;
  const mockSetActive = jest.fn();

  it('renders the dropdown', () => {
    const { getByRole, getByText } = render(
      <DropdownContainer dropdownButton={button} setActive={mockSetActive}>
        {childElement}
      </DropdownContainer>
    );

    const dropdownButton = getByRole('button', { name: 'Dropdown Button' });
    userEvent.click(dropdownButton);
    expect(getByText('Test!')).toBeInTheDocument();
  });

  it('closes the dropdown on click outside', () => {
    jest.useFakeTimers();
    const { getByRole } = render(
      <DropdownContainer dropdownButton={button} setActive={mockSetActive}>
        {childElement}
      </DropdownContainer>
    );

    const dropdownButton = getByRole('button', { name: 'Dropdown Button' });
    userEvent.click(dropdownButton);
    userEvent.click(document.body);
    jest.runAllTimers();
    expect(mockSetActive).toHaveBeenCalledWith(false);
  });
});
