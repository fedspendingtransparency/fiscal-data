import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import DropdownContainer from './dropdown-container';
import userEvent from '@testing-library/user-event';
describe('Dropdown Container', () => {
  const childElement = <>Test!</>;
  const button = <button>Dropdown Button</button>;
  let mockSetActive;

  beforeEach(() => {
    mockSetActive = jest.fn();
  });

  it('renders the dropdown', () => {
    const { getByRole, getByText } = render(
      <DropdownContainer dropdownButton={button} setActive={mockSetActive}>
        {childElement}
      </DropdownContainer>
    );

    const dropdownButton = getByRole('button', { name: 'Dropdown Button' });
    dropdownButton.click();
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

  it('handles blur when focus leaves the container', () => {
    const { container } = render(
      <DropdownContainer dropdownButton={button} setActive={mockSetActive}>
        {childElement}
      </DropdownContainer>
    );

    fireEvent.blur(container.firstChild, { relatedTarget: null });
    expect(mockSetActive).toHaveBeenCalledWith(false);
  });

  it('does not close on blur if pointer was inside', () => {
    const { container } = render(
      <DropdownContainer dropdownButton={button} setActive={mockSetActive}>
        {childElement}
      </DropdownContainer>
    );

    fireEvent.pointerDown(container.firstChild);
    fireEvent.blur(container.firstChild, { relatedTarget: null });
    expect(mockSetActive).not.toHaveBeenCalled();
  });

  it('closes on Escape key press', () => {
    const { container } = render(
      <DropdownContainer dropdownButton={button} setActive={mockSetActive}>
        {childElement}
      </DropdownContainer>
    );

    fireEvent.keyDown(container.firstChild, { key: 'Escape' });
    expect(mockSetActive).toHaveBeenCalledWith(false);
  });
});
