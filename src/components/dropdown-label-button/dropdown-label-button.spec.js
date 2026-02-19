import React from 'react';
import { render } from '@testing-library/react';
import DropdownLabelButton from './dropdown-label-button';
import { faArrowRightArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowRightArrowLeft';
import userEvent from '@testing-library/user-event';

describe('Dropdown Container', () => {
  const label = 'Menu Items';
  const selectedOption = 'Cheeseburger';
  const icon = faArrowRightArrowLeft;
  const mockSetActive = jest.fn();
  const ariaLabel = 'Open menu';

  it('renders the dropdown', () => {
    const { getByRole, getAllByRole, getByText } = render(
      <DropdownLabelButton label={label} selectedOption={selectedOption} icon={icon} setActive={mockSetActive} active={false} ariaLabel={ariaLabel} />
    );
    const dropdownButton = getByRole('button', { name: 'Open menu' });
    expect(dropdownButton).toBeInTheDocument();
    expect(getByText(label + ':')).toBeInTheDocument();
    const icons = getAllByRole('img', { hidden: true });
    expect(icons[0]).toHaveClass('fa-arrow-right-arrow-left');
    expect(icons[1]).toHaveClass('fa-caret-down');
  });

  it('dropdown click', () => {
    const { getByRole } = render(
      <DropdownLabelButton label={label} selectedOption={selectedOption} icon={icon} setActive={mockSetActive} active={false} ariaLabel={ariaLabel} />
    );
    const dropdownButton = getByRole('button', { name: 'Open menu' });
    userEvent.click(dropdownButton);
    expect(mockSetActive).toHaveBeenCalledWith(true);
  });
});
