import React from 'react';
import { act, fireEvent, render } from '@testing-library/react';
import MonthPicker from './month-picker';

describe('Month Picker', () => {
  const mockMonthDropdownOptions = ['March', 'April', 'May'];
  const mockYearDropdownOptions = ['2020', '2019', 2018];
  const mockReportDates = ['March 2020', 'April 2019', 'March 2018', 'May 2018'];
  const scrollIntoViewMock = jest.fn();
  beforeAll(() => {
    window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;
  });

  let setSelectedDateMock;
  let handleCloseMock;
  beforeEach(() => {
    setSelectedDateMock = jest.fn();
    handleCloseMock = jest.fn();
    scrollIntoViewMock.mockClear();
  });

  it('Renders provided month options as buttons', () => {
    const { getByRole } = render(
      <MonthPicker
        allReportYears={mockYearDropdownOptions}
        setSelectedDate={jest.fn()}
        handleClose={jest.fn()}
        selectedDate={new Date('4/8/2018')}
        active={true}
        allReportDates={mockReportDates}
      />
    );
    const marchButton = getByRole('button', { name: mockMonthDropdownOptions[0] });
    act(() => {
      fireEvent.click(marchButton);
    });
    expect(scrollIntoViewMock).toBeCalled();
    expect(marchButton).toBeInTheDocument();
    expect(getByRole('button', { name: mockMonthDropdownOptions[1] })).toBeInTheDocument();
    expect(getByRole('button', { name: mockMonthDropdownOptions[2] })).toBeInTheDocument();
  });

  it('Renders year button', () => {
    const { getByRole, queryByRole } = render(
      <MonthPicker
        allReportYears={mockYearDropdownOptions}
        setSelectedDate={jest.fn()}
        handleClose={jest.fn()}
        selectedDate={new Date('3/8/2018')}
        active={true}
        allReportDates={mockReportDates}
      />
    );
    const yearButton = getByRole('button', { name: 'Toggle Year Dropdown' });
    expect(yearButton).toBeInTheDocument();
    act(() => {
      fireEvent.click(yearButton);
    });
    // The months dropdown is hidden / replaced by the years dropdown
    expect(queryByRole('button', { name: mockMonthDropdownOptions[0] })).not.toBeInTheDocument();
    const yearButton2020 = getByRole('button', { name: mockYearDropdownOptions[0] });
    act(() => {
      fireEvent.click(yearButton2020);
    });
    // Switches back to the months dropdown
    expect(getByRole('button', { name: mockMonthDropdownOptions[0] })).toBeInTheDocument();
  });

  it('Disables unavailable year and month selections', () => {
    const { getByRole, queryByRole } = render(
      <MonthPicker
        allReportYears={mockYearDropdownOptions}
        setSelectedDate={jest.fn()}
        handleClose={jest.fn()}
        selectedDate={new Date('3/8/2018')}
        active={true}
        allReportDates={mockReportDates}
      />
    );
    const yearButton = getByRole('button', { name: 'Toggle Year Dropdown' });
    const monthButton = getByRole('button', { name: mockMonthDropdownOptions[1] });
    expect(monthButton).toBeDisabled();
    act(() => {
      fireEvent.click(yearButton);
    });
    // The months dropdown is hidden / replaced by the years dropdown
    expect(queryByRole('button', { name: mockMonthDropdownOptions[0] })).not.toBeInTheDocument();
    const yearButton2019 = getByRole('button', { name: mockYearDropdownOptions[1] });
    expect(yearButton2019).toBeDisabled();
  });
  it('ignores disabling logic when ignoreDisabled prop is true', () => {
    const { getByRole } = render(
      <MonthPicker
        allReportYears={mockYearDropdownOptions}
        setSelectedDate={jest.fn()}
        handleClose={jest.fn()}
        selectedDate={new Date('3/8/2018')}
        active={true}
        allReportDates={mockReportDates}
        ignoreDisabled={true}
      />
    );
    const aprilButton = getByRole('button', { name: mockMonthDropdownOptions[1] });
    expect(aprilButton).not.toBeDisabled();

    const yearToggleButton = getByRole('button', { name: 'Toggle Year Dropdown' });
    act(() => {
      fireEvent.click(yearToggleButton);
    });
    const yearButton2019 = getByRole('button', { name: mockYearDropdownOptions[1] });
    expect(yearButton2019).not.toBeDisabled();

    act(() => {
      fireEvent.click(yearButton2019);
    });
    const marchButton = getByRole('button', { name: mockMonthDropdownOptions[0] });
    expect(marchButton).not.toBeDisabled();
  });

  it('steps year using chevrons', () => {
    const { getByLabelText, findByTestId, getByRole } = render(
      <MonthPicker
        allReportYears={mockYearDropdownOptions}
        setSelectedDate={setSelectedDateMock}
        handleClose={handleCloseMock}
        selectedDate={new Date('3/8/2019')}
        active={true}
        allReportDates={mockReportDates}
      />
    );

    const prevButton = getByLabelText('Previous Year');
    const nextButton = getByLabelText('Next Year');

    act(() => fireEvent.click(nextButton));
    const yearButton = getByRole('button', { name: 'Toggle Year Dropdown' });
    expect(yearButton).toHaveTextContent('2018');

    act(() => fireEvent.click(prevButton));
    expect(yearButton).toHaveTextContent('2018');
  });
});
