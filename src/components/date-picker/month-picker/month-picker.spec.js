import React from 'react';
import { act, fireEvent, render } from '@testing-library/react';
import MonthPicker from './month-picker';

jest.mock('../../scroll-container/scroll-container', () => {
  return function MockScrollContainer({ children }) {
    return <div data-testid="scroll-container">{children}</div>;
  };
});

jest.mock('../date-dropdown/date-dropdown', () => {
  return function MockDateDropdown(props) {
    return (
      <div data-testid="date-dropdown">
        <button aria-label="MOCK Close" onClick={props.handleClose}>
          x
        </button>
        <button aria-label="MOCK Set Month May" onClick={() => props.setSelectedMonth('May')}>
          set-month
        </button>
        <button aria-label="MOCK Set Year 2018" onClick={() => props.setSelectedYear('2018')}>
          set-year
        </button>
        {props.children}
      </div>
    );
  };
});

describe('Month Picker', () => {
  const mockMonthDropdownOptions = ['March', 'April', 'May'];
  const mockYearDropdownOptions = ['2020', '2019', 2018];
  const mockReportDates = ['March 2020', 'April 2019', 'March 2018', 'May 2018'];
  const scrollIntoViewMock = jest.fn();
  const earliest = new Date('01/01/2018');
  const latest = new Date('12/31/2020');

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
    expect(queryByRole('button', { name: mockMonthDropdownOptions[0] })).not.toBeInTheDocument();
    const yearButton2020 = getByRole('button', { name: mockYearDropdownOptions[0] });
    act(() => {
      fireEvent.click(yearButton2020);
    });
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
    const { getByLabelText, getByRole } = render(
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
    expect(yearButton).toHaveTextContent('2020');

    act(() => fireEvent.click(prevButton));
    expect(yearButton).toHaveTextContent('2019');
  });

  it('renders month buttons and scrolls to the selected month', () => {
    const setSelectedDate = jest.fn();

    const { getByRole } = render(
      <MonthPicker
        allReportYears={mockYearDropdownOptions}
        setSelectedDate={setSelectedDate}
        handleClose={jest.fn()}
        selectedDate={new Date('03/08/2018')}
        active={true}
        allReportDates={mockReportDates}
        earliestDate={earliest}
        latestDate={latest}
      />
    );

    const marchBtn = getByRole('button', { name: 'March' });
    const aprilBtn = getByRole('button', { name: 'April' });
    const mayBtn = getByRole('button', { name: 'May' });

    expect(aprilBtn).toBeDisabled();

    act(() => fireEvent.click(marchBtn));
    expect(setSelectedDate).toHaveBeenCalledTimes(1);
    const appliedDate = setSelectedDate.mock.calls[0][0];
    expect(appliedDate).toBeInstanceOf(Date);
    expect(appliedDate.getFullYear()).toBe(2018);
    expect(appliedDate.getMonth()).toBe(2);

    expect(scrollIntoViewMock).toHaveBeenCalled();
    expect(mayBtn).toBeInTheDocument();
  });

  it('toggles to years list and back clicking a valid year applies', () => {
    const setSelectedDate = jest.fn();

    const { getByRole, queryByRole } = render(
      <MonthPicker
        allReportYears={mockYearDropdownOptions}
        setSelectedDate={setSelectedDate}
        handleClose={jest.fn()}
        selectedDate={new Date('03/08/2019')}
        active={true}
        allReportDates={mockReportDates}
        earliestDate={earliest}
        latestDate={latest}
      />
    );

    const yearToggle = getByRole('button', { name: 'Toggle Year Dropdown' });
    expect(yearToggle).toHaveTextContent('2019');

    act(() => fireEvent.click(yearToggle));
    expect(queryByRole('button', { name: 'March' })).not.toBeInTheDocument();

    const y2018 = getByRole('button', { name: '2018' });
    expect(y2018).not.toBeDisabled();

    act(() => fireEvent.click(y2018));

    expect(getByRole('button', { name: 'March' })).toBeInTheDocument();
    expect(setSelectedDate).toHaveBeenCalledTimes(1);
    const d = setSelectedDate.mock.calls[0][0];
    expect(d.getFullYear()).toBe(2018);
    expect(d.getMonth()).toBe(2);
  });

  it('resets internal state when active goes false, then true with a new selectedDate', () => {
    const { getByRole, rerender } = render(
      <MonthPicker
        allReportYears={mockYearDropdownOptions}
        setSelectedDate={jest.fn()}
        handleClose={jest.fn()}
        selectedDate={new Date('03/08/2018')}
        active={true}
        allReportDates={mockReportDates}
        earliestDate={earliest}
        latestDate={latest}
      />
    );

    act(() => fireEvent.click(getByRole('button', { name: 'Toggle Year Dropdown' })));

    rerender(
      <MonthPicker
        allReportYears={mockYearDropdownOptions}
        setSelectedDate={jest.fn()}
        handleClose={jest.fn()}
        selectedDate={new Date('04/08/2019')}
        active={false}
        allReportDates={mockReportDates}
        earliestDate={earliest}
        latestDate={latest}
      />
    );

    rerender(
      <MonthPicker
        allReportYears={mockYearDropdownOptions}
        setSelectedDate={jest.fn()}
        handleClose={jest.fn()}
        selectedDate={new Date('04/08/2019')}
        active={true}
        allReportDates={mockReportDates}
        earliestDate={earliest}
        latestDate={latest}
      />
    );

    const yearToggle = getByRole('button', { name: 'Toggle Year Dropdown' });
    expect(yearToggle).toHaveTextContent('2019');
    expect(getByRole('button', { name: 'April' })).toBeInTheDocument();
  });

  it('passes handleClose through to DateDropdown ', () => {
    const handleClose = jest.fn();

    const { getByLabelText } = render(
      <MonthPicker
        allReportYears={mockYearDropdownOptions}
        setSelectedDate={jest.fn()}
        handleClose={handleClose}
        selectedDate={new Date('03/08/2019')}
        active={true}
        allReportDates={mockReportDates}
        earliestDate={earliest}
        latestDate={latest}
      />
    );

    act(() => fireEvent.click(getByLabelText('MOCK Close')));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('responds to the DateDropdown-provided setters', () => {
    const { getByLabelText, getByRole } = render(
      <MonthPicker
        allReportYears={mockYearDropdownOptions}
        setSelectedDate={jest.fn()}
        handleClose={jest.fn()}
        selectedDate={new Date('03/08/2019')}
        active={true}
        allReportDates={mockReportDates}
        earliestDate={earliest}
        latestDate={latest}
      />
    );

    act(() => fireEvent.click(getByLabelText('MOCK Set Year 2018')));
    const yearToggle = getByRole('button', { name: 'Toggle Year Dropdown' });
    expect(yearToggle).toHaveTextContent('2018');

    act(() => fireEvent.click(getByLabelText('MOCK Set Month May')));
    expect(getByRole('button', { name: 'May' })).toBeInTheDocument();
  });
});
