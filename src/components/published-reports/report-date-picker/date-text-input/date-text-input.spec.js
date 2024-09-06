import DateTextInput, { helpText, invalidDateText } from './date-text-input';
import { fireEvent, render, waitForElementToBeRemoved } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';

describe('Date Text Entry', () => {
  it('displays input label', () => {
    const { getByText } = render(<DateTextInput label="Report Date" />);
    expect(getByText('Report Date')).toBeInTheDocument();
  });

  it('renders an input box', () => {
    const { getByRole } = render(<DateTextInput label="Report Date" />);
    expect(getByRole('textbox')).toBeInTheDocument();
  });

  it('display help text when focus is on input field', () => {
    const { getByRole, getByText } = render(<DateTextInput label="Report Date" />);
    const inputBox = getByRole('textbox');
    fireEvent.focus(inputBox);
    expect(getByText(helpText));
  });

  it('validates the entry on enter key press and removes help text if valid', () => {
    const setSelectedMonthSpy = jest.fn();
    const setSelectedYearSpy = jest.fn();
    const setValidInputSpy = jest.fn();
    const { getByRole, getByText } = render(
      <DateTextInput
        label="Report Date"
        setInputFocus={jest.fn()}
        setSelectedMonth={setSelectedMonthSpy}
        setSelectedYear={setSelectedYearSpy}
        setValidInput={setValidInputSpy}
      />
    );
    const inputBox = getByRole('textbox');
    expect(getByText(helpText));

    userEvent.type(inputBox, 'June 2021');
    userEvent.keyboard('{Enter}');

    expect(setSelectedYearSpy).toHaveBeenCalledWith('2021');
    expect(setSelectedMonthSpy).toHaveBeenCalledWith('June');
    expect(setValidInputSpy).toHaveBeenCalledWith(true);
  });

  it('validates the entry on enter key press for numerical date entry', () => {
    const setSelectedMonthSpy = jest.fn();
    const setSelectedYearSpy = jest.fn();
    const setValidInputSpy = jest.fn();
    const { getByRole, getByText } = render(
      <DateTextInput
        label="Report Date"
        setInputFocus={jest.fn()}
        setSelectedMonth={setSelectedMonthSpy}
        setSelectedYear={setSelectedYearSpy}
        setValidInput={setValidInputSpy}
      />
    );
    const inputBox = getByRole('textbox');
    expect(getByText(helpText));

    userEvent.type(inputBox, '06/2021');
    userEvent.keyboard('{Enter}');

    expect(setSelectedYearSpy).toHaveBeenCalledWith('2021');
    expect(setSelectedMonthSpy).toHaveBeenCalledWith('June');
    expect(setValidInputSpy).toHaveBeenCalledWith(true);
  });

  it('validates the entry on enter key press and shows error text if invalid', () => {
    const setSelectedMonthSpy = jest.fn();
    const setSelectedYearSpy = jest.fn();
    const setValidInputSpy = jest.fn();
    const { getByRole, getByText } = render(
      <DateTextInput
        label="Report Date"
        setInputFocus={jest.fn()}
        setSelectedMonth={setSelectedMonthSpy}
        setSelectedYear={setSelectedYearSpy}
        setValidInput={setValidInputSpy}
      />
    );
    const inputBox = getByRole('textbox');
    expect(getByText(helpText));

    userEvent.type(inputBox, 'jun 20211');
    userEvent.keyboard('{Enter}');

    expect(setSelectedYearSpy).not.toHaveBeenCalled();
    expect(setSelectedMonthSpy).not.toHaveBeenCalled();
    expect(setValidInputSpy).toHaveBeenCalledWith(false);
    expect(getByText(invalidDateText)).toBeInTheDocument();
  });
});
