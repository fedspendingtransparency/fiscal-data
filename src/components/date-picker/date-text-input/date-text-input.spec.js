import DateTextInput, { helpText, invalidDateText, noMatchDefaultMessage } from './date-text-input';
import { render } from '@testing-library/react';
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
    const { getByRole, getByText } = render(
      <DateTextInput label="Report Date" setInputFocus={jest.fn()} validInput={false} inputFocus={true} helpText={helpText} />
    );
    const inputBox = getByRole('textbox', { name: 'Enter date' });
    userEvent.tab();
    expect(inputBox).toHaveFocus();
    expect(getByText(helpText));
  });

  it('hides help text on input field blur', () => {
    const { getByRole, queryByText } = render(<DateTextInput label="Report Date" setInputFocus={jest.fn()} helpText={helpText} />);
    const inputBox = getByRole('textbox');
    userEvent.tab();
    expect(inputBox).toHaveFocus();
    userEvent.tab();
    expect(queryByText(helpText)).not.toBeInTheDocument();
  });
});

describe('Monthly Date Text Entry', () => {
  it('validates the entry on enter key press', () => {
    const setSelectedMonthSpy = jest.fn();
    const setSelectedYearSpy = jest.fn();
    const setValidInputSpy = jest.fn();
    const setInputFocusSpy = jest.fn();
    const { getByRole } = render(
      <DateTextInput
        label="Report Date"
        setSelectedMonth={setSelectedMonthSpy}
        setSelectedYear={setSelectedYearSpy}
        selectedDate=""
        allDates={['June 2021']}
        setValidInput={setValidInputSpy}
        inputFocus={false}
        setInputFocus={setInputFocusSpy}
      />
    );
    const inputBox = getByRole('textbox');
    userEvent.tab();
    userEvent.type(inputBox, 'June 2021{Enter}');

    expect(setSelectedYearSpy).toHaveBeenCalledWith('2021');
    expect(setSelectedMonthSpy).toHaveBeenCalledWith('June');
  });

  it('validates the entry on enter key press for lower case month', () => {
    const setSelectedMonthSpy = jest.fn();
    const setSelectedYearSpy = jest.fn();
    const setValidInputSpy = jest.fn();
    const setInputFocusSpy = jest.fn();
    const { getByRole } = render(
      <DateTextInput
        label="Report Date"
        setSelectedMonth={setSelectedMonthSpy}
        setSelectedYear={setSelectedYearSpy}
        selectedDate=""
        allDates={['June 2021']}
        setValidInput={setValidInputSpy}
        inputFocus={false}
        setInputFocus={setInputFocusSpy}
      />
    );
    const inputBox = getByRole('textbox');
    userEvent.tab();
    userEvent.type(inputBox, 'june 2021{Enter}');

    expect(setSelectedYearSpy).toHaveBeenCalledWith('2021');
    expect(setSelectedMonthSpy).toHaveBeenCalledWith('June');
  });

  it('validates the entry on enter key press for abbreviated month', () => {
    const setSelectedMonthSpy = jest.fn();
    const setSelectedYearSpy = jest.fn();
    const setValidInputSpy = jest.fn();
    const setInputFocusSpy = jest.fn();
    const { getByRole } = render(
      <DateTextInput
        label="Report Date"
        setSelectedMonth={setSelectedMonthSpy}
        setSelectedYear={setSelectedYearSpy}
        selectedDate=""
        allDates={['June 2021']}
        setValidInput={setValidInputSpy}
        inputFocus={false}
        setInputFocus={setInputFocusSpy}
      />
    );
    const inputBox = getByRole('textbox');
    userEvent.tab();
    userEvent.type(inputBox, 'Jun 2021{Enter}');

    expect(setSelectedYearSpy).toHaveBeenCalledWith('2021');
    expect(setSelectedMonthSpy).toHaveBeenCalledWith('June');
  });

  it('validates the entry on enter key press for numerical date entry', () => {
    const setSelectedMonthSpy = jest.fn();
    const setSelectedYearSpy = jest.fn();
    const setValidInputSpy = jest.fn();

    const { getByRole } = render(
      <DateTextInput
        label="Report Date"
        setInputFocus={jest.fn()}
        setSelectedMonth={setSelectedMonthSpy}
        setSelectedYear={setSelectedYearSpy}
        selectedDate=""
        setValidInput={setValidInputSpy}
        allDates={['June 2021']}
      />
    );
    const inputBox = getByRole('textbox');

    userEvent.type(inputBox, '06/2021{Enter}');

    expect(setSelectedYearSpy).toHaveBeenCalledWith('2021');
    expect(setSelectedMonthSpy).toHaveBeenCalledWith('June');
    expect(inputBox).toHaveValue('June 2021');
  });

  it('validates the entry on enter key press and shows error text if invalid', () => {
    const setSelectedMonthSpy = jest.fn();
    const setSelectedYearSpy = jest.fn();
    const setValidInputSpy = jest.fn();
    const { getByText } = render(
      <DateTextInput
        label="Report Date"
        setInputFocus={jest.fn()}
        setSelectedMonth={setSelectedMonthSpy}
        setSelectedYear={setSelectedYearSpy}
        setValidInput={setValidInputSpy}
        allDates={['June 2021']}
        selectedDate=""
        inputFocus={true}
      />
    );

    userEvent.tab();
    userEvent.keyboard('jun 20211{Enter}');

    expect(setSelectedYearSpy).not.toHaveBeenCalled();
    expect(setSelectedMonthSpy).not.toHaveBeenCalled();
    expect(setValidInputSpy).toHaveBeenCalledWith(false);
    expect(getByText(invalidDateText)).toBeInTheDocument();
  });

  it('validates the entry on enter key press and shows error when no date match is found', () => {
    const setSelectedMonthSpy = jest.fn();
    const setSelectedYearSpy = jest.fn();
    const setValidInputSpy = jest.fn();
    const { getByText } = render(
      <DateTextInput
        label="Report Date"
        setInputFocus={jest.fn()}
        setSelectedMonth={setSelectedMonthSpy}
        setSelectedYear={setSelectedYearSpy}
        setValidInput={setValidInputSpy}
        allDates={['June 2022']}
        selectedDate=""
        inputFocus={true}
        fromDate={'June, 2001'}
        toDate={'June, 2025'}
      />
    );

    userEvent.tab();
    userEvent.keyboard('June 2000{Enter}');

    expect(setSelectedYearSpy).not.toHaveBeenCalled();
    expect(setSelectedMonthSpy).not.toHaveBeenCalled();
    expect(setValidInputSpy).toHaveBeenCalledWith(false);
    expect(getByText(noMatchDefaultMessage)).toBeInTheDocument();
  });

  it('resets incomplete date entry on blur', () => {});
});

describe('Daily Date Text Entry', () => {
  it('validates the entry on enter key press', () => {
    const setCurrentDateSpy = jest.fn();
    const setValidInputSpy = jest.fn();
    const setInputFocusSpy = jest.fn();
    const { getByRole } = render(
      <DateTextInput
        label="Report Date"
        setCurrentDate={setCurrentDateSpy}
        selectedDate=""
        allDates={['June 1, 2021']}
        setValidInput={setValidInputSpy}
        inputFocus={false}
        setInputFocus={setInputFocusSpy}
      />
    );
    const inputBox = getByRole('textbox');
    userEvent.tab();
    userEvent.keyboard('June 01, 2021{Enter}');

    expect(setCurrentDateSpy).toHaveBeenCalled();
    expect(inputBox).toHaveValue('June 1, 2021');
  });

  it('validates the entry on enter key press for lower case month', () => {
    const setCurrentDateSpy = jest.fn();
    const setValidInputSpy = jest.fn();
    const setInputFocusSpy = jest.fn();
    const { getByRole } = render(
      <DateTextInput
        label="Report Date"
        setCurrentDate={setCurrentDateSpy}
        selectedDate=""
        allDates={['June 1, 2021']}
        setValidInput={setValidInputSpy}
        inputFocus={false}
        setInputFocus={setInputFocusSpy}
      />
    );
    const inputBox = getByRole('textbox');
    userEvent.tab();
    userEvent.keyboard('june 01 2021{Enter}');

    expect(setCurrentDateSpy).toHaveBeenCalled();
    expect(inputBox).toHaveValue('June 1, 2021');
  });

  it('validates the entry on enter key press for abbreviated month', () => {
    const setCurrentDateSpy = jest.fn();
    const setValidInputSpy = jest.fn();
    const setInputFocusSpy = jest.fn();
    const { getByRole } = render(
      <DateTextInput
        label="Report Date"
        setCurrentDate={setCurrentDateSpy}
        selectedDate=""
        allDates={['June 1, 2021']}
        setValidInput={setValidInputSpy}
        inputFocus={false}
        setInputFocus={setInputFocusSpy}
      />
    );
    const inputBox = getByRole('textbox');
    userEvent.tab();
    userEvent.keyboard('Jun 01 2021{Enter}');

    expect(setCurrentDateSpy).toHaveBeenCalled();
    expect(inputBox).toHaveValue('June 1, 2021');
  });

  it('validates the entry on enter key press for numerical date entry', () => {
    const setCurrentDateSpy = jest.fn();
    const setValidInputSpy = jest.fn();
    const setInputFocusSpy = jest.fn();
    const { getByRole } = render(
      <DateTextInput
        label="Report Date"
        setCurrentDate={setCurrentDateSpy}
        selectedDate=""
        allDates={['June 1, 2021']}
        setValidInput={setValidInputSpy}
        inputFocus={false}
        setInputFocus={setInputFocusSpy}
      />
    );
    const inputBox = getByRole('textbox');

    userEvent.tab();
    userEvent.keyboard('06/01/2021{Enter}');

    expect(setCurrentDateSpy).toHaveBeenCalled();
    expect(inputBox).toHaveValue('June 1, 2021');
  });

  it('validates the entry on enter key press and shows error text if invalid', () => {
    const setCurrentDateSpy = jest.fn();
    const setValidInputSpy = jest.fn();
    const setInputFocusSpy = jest.fn();
    const { getByRole, getByText } = render(
      <DateTextInput
        label="Report Date"
        setCurrentDate={setCurrentDateSpy}
        selectedDate=""
        allDates={['June 1, 2021']}
        setValidInput={setValidInputSpy}
        inputFocus={true}
        setInputFocus={setInputFocusSpy}
      />
    );

    userEvent.tab();
    userEvent.keyboard('jun 01 20211{Enter}');

    expect(setCurrentDateSpy).not.toHaveBeenCalled();
    expect(setValidInputSpy).toHaveBeenCalledWith(false);
    expect(getByText(invalidDateText)).toBeInTheDocument();
  });

  it('validates the entry on enter key press and shows error when no date match is found', () => {
    const setCurrentDateSpy = jest.fn();
    const setValidInputSpy = jest.fn();
    const setInputFocusSpy = jest.fn();
    const { getByText } = render(
      <DateTextInput
        label="Report Date"
        setCurrentDate={setCurrentDateSpy}
        selectedDate=""
        allDates={['June 1, 2022']}
        setValidInput={setValidInputSpy}
        inputFocus={true}
        setInputFocus={setInputFocusSpy}
        fromDate={'June 1, 2001'}
        toDate={'June 1, 2025'}
      />
    );

    userEvent.tab();
    userEvent.keyboard('June 02, 2000{Enter}');

    expect(setCurrentDateSpy).not.toHaveBeenCalled();
    expect(setValidInputSpy).toHaveBeenCalledWith(false);
    expect(getByText(noMatchDefaultMessage)).toBeInTheDocument();
  });

  it('resets incomplete date entry on blur', () => {
    const setCurrentDateSpy = jest.fn();
    const setValidInputSpy = jest.fn();
    const setInputFocusSpy = jest.fn();
    const { getByRole } = render(
      <DateTextInput
        label="Report Date"
        setCurrentDate={setCurrentDateSpy}
        selectedDate="June 1, 2021"
        allDates={['June 1, 2021', 'June 1, 2022']}
        setValidInput={setValidInputSpy}
        inputFocus={false}
        setInputFocus={setInputFocusSpy}
      />
    );
    const inputBox = getByRole('textbox');
    expect(inputBox).toHaveValue('June 1, 2021');
    userEvent.tab();
    userEvent.keyboard('June 01');
    userEvent.tab();

    expect(inputBox).toHaveValue('June 1, 2021');
  });
});
