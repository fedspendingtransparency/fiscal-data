import DateRangeTextInput from './date-range-text-input';
import { act, fireEvent, render } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';

describe('date range input', () => {
  const mockSetInputDisplay = jest.fn();
  const mockSetSelected = jest.fn();

  it('initially renders a placeholder for the date range', () => {
    const { getAllByText, getByText } = render(
      <DateRangeTextInput
        selected={{}}
        setSelected={jest.fn()}
        setInputDisplay={jest.fn()}
        setInvalidDate={jest.fn()}
        inputDisplay={['mm/dd/yyyy', 'mm/dd/yyyy']}
        active={false}
      />
    );

    expect(getAllByText('mm/dd/yyyy').length).toBe(2);
    expect(getByText('-')).toBeInTheDocument();
  });

  it('updates selected range when a valid date is entered', () => {
    const { getByRole } = render(
      <DateRangeTextInput
        selected={{}}
        setSelected={mockSetSelected}
        setInputDisplay={mockSetInputDisplay}
        inputDisplay={['mm/dd/yyyy', 'mm/dd/yyyy']}
        active={false}
        setInvalidDate={jest.fn()}
      />
    );

    const dateRangeEntry = getByRole('textbox', { hidden: true });
    fireEvent.click(dateRangeEntry);
    act(() => {
      userEvent.keyboard('12012022');
      userEvent.keyboard('12102024');
    });
    expect(mockSetInputDisplay).toHaveBeenCalled();
  });
});
