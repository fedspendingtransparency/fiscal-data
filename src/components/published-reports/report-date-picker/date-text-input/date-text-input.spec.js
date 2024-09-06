import DateTextInput, { helpText, invalidDateText } from './date-text-input';
import { fireEvent, render } from '@testing-library/react';
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
    const { getByRole, getByText } = render(<DateTextInput label="Report Date" setInputFocus={jest.fn()} validInput={false} />);
    const inputBox = getByRole('textbox');
    userEvent.tab();
    expect(inputBox).toHaveFocus();
    expect(getByText(helpText));
  });

  it('hides help text on input field blur', () => {
    const { getByRole, queryByText } = render(<DateTextInput label="Report Date" setInputFocus={jest.fn()} />);
    const inputBox = getByRole('textbox');
    userEvent.tab();
    expect(inputBox).toHaveFocus();
    userEvent.tab();
    expect(queryByText(helpText)).not.toBeInTheDocument();
  });

  it('validates the entry on enter key press', () => {
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

    userEvent.tab();
    userEvent.keyboard('jun 20211');
    userEvent.keyboard('{Enter}');

    expect(setSelectedYearSpy).not.toHaveBeenCalled();
    expect(setSelectedMonthSpy).not.toHaveBeenCalled();
    expect(setValidInputSpy).toHaveBeenCalledWith(false);
    expect(getByText(invalidDateText)).toBeInTheDocument();
  });
});
