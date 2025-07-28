import React from 'react';
import SelectAll from './selectAll';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Select All component', () => {
  const mockFields = [
    {
      active: true,
      field: 'field_1',
      label: 'Field 1',
    },
    {
      active: true,
      field: 'field_2',
      label: 'Field 2',
    },
    {
      active: true,
      field: 'field_3',
      label: 'Field 3',
    },
  ];
  const uncheckedMockFields = [
    {
      active: false,
      field: 'field_1',
      label: 'Field 1',
    },
    {
      active: false,
      field: 'field_2',
      label: 'Field 2',
    },
    {
      active: false,
      field: 'field_3',
      label: 'Field 3',
    },
  ];
  const indeterminateMockFields = [
    {
      active: false,
      field: 'field_1',
      label: 'Field 1',
    },
    {
      active: false,
      field: 'field_2',
      label: 'Field 2',
    },
    {
      active: false,
      field: 'field_3',
      label: 'Field 3',
    },
  ];

  const mockOnUpdateFields = jest.fn();

  it('renders when fields are visible', () => {
    const { getByRole } = render(<SelectAll isVisible fields={mockFields} onUpdateFields={mockOnUpdateFields} />);
    expect(getByRole('checkbox', { name: 'Select All' })).toBeInTheDocument();
  });

  it('sets checked to true when all are selected', () => {
    const { getByRole } = render(<SelectAll isVisible fields={mockFields} onUpdateFields={mockOnUpdateFields} />);
    const checkbox = getByRole('checkbox', { name: 'Select All' });
    expect(checkbox).toBeChecked();
  });

  it('sets checked to false when only one field is unchecked', () => {
    const updatedField = Object.assign({}, mockFields[1], { active: false });
    const updated = Object.assign([], mockFields, { 1: updatedField });
    const { getByRole } = render(<SelectAll isVisible fields={updated} />);
    const checkbox = getByRole('checkbox', { name: 'Select All' });
    expect(checkbox).not.toBeChecked();
  });

  it('Updates fields on click', () => {
    const { getByRole } = render(<SelectAll isVisible fields={uncheckedMockFields} onUpdateFields={mockOnUpdateFields} resetToFalse={true} />);
    const checkbox = getByRole('checkbox', { name: 'Select All' });
    expect(checkbox).not.toBeChecked();
    userEvent.click(checkbox);
    expect(mockOnUpdateFields).toHaveBeenCalled();
  });
});
