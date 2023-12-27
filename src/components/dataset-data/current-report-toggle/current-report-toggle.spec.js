import React from 'react';
import CurrentReportToggle from './current-report-toggle';
import { fireEvent, render } from '@testing-library/react';
import { getDateWithoutTimeZoneAdjust } from '../../../utils/date-utils';
export const mockReportGroup = [
  {
    path: '/downloads/mts_reports/mts0720.pdf',
    report_group_desc: 'Monthly Treasury Statement',
    report_date: getDateWithoutTimeZoneAdjust('2020-07-31'),
    filesize: '1921283',
    report_group_id: 1,
  },
  {
    path: '/downloads/mts_reports/mts0620.pdf',
    report_group_desc: 'Monthly Treasury Statement',
    report_date: getDateWithoutTimeZoneAdjust('2020-06-30'),
    filesize: '3475040',
    report_group_id: 1,
  },
  {
    path: '/downloads/mts_reports/mts0520.pdf',
    report_group_desc: 'Monthly Treasury Statement',
    report_date: getDateWithoutTimeZoneAdjust('2020-05-31'),
    filesize: '3259273',
    report_group_id: 1,
  },
];

describe('CurrentReportToggle component', () => {
  const mockReports = {
    id: 100,
    value: mockReportGroup,
  };
  const mockDailyReports = {
    id: 100,
    value: mockReportGroup,
    daily: true,
  };
  const toggleFn = jest.fn();
  const activeFn = jest.fn();

  it('contains two radio buttons', () => {
    const { getAllByRole } = render(<CurrentReportToggle reports={mockReports} onChange={toggleFn} setActiveState={activeFn} />);
    expect(getAllByRole('radio').length).toStrictEqual(2);
  });

  it('defaults to having the first radio button selected', () => {
    const { getAllByRole } = render(<CurrentReportToggle reports={mockReports} onChange={toggleFn} setActiveState={activeFn} activeState={1} />);
    const allRadioButtons = getAllByRole('radio');
    expect(allRadioButtons[0]).toBeChecked();
    expect(allRadioButtons[1]).not.toBeChecked();
  });

  it('updates the selected button when the radio button is toggled', () => {
    const { getAllByRole } = render(<CurrentReportToggle reports={mockReports} onChange={toggleFn} setActiveState={activeFn} />);
    const allRadioButtons = getAllByRole('radio');

    fireEvent.click(allRadioButtons[1]);

    expect(activeFn).toHaveBeenCalledWith(2);
  });

  it('triggers the onToggle event when a radio button is clicked', () => {
    toggleFn.mockClear();
    const { getAllByRole } = render(<CurrentReportToggle reports={mockReports} onChange={toggleFn} setActiveState={activeFn} />);
    const allRadioButtons = getAllByRole('radio');

    fireEvent.click(allRadioButtons[1]);
    fireEvent.click(allRadioButtons[0]);

    expect(toggleFn).toBeCalledTimes(2); // includes call made at initialization
    expect(toggleFn).toHaveBeenNthCalledWith(1, false);
    expect(toggleFn).toHaveBeenNthCalledWith(2, mockReportGroup[0]);
  });

  it('labels its first button with the latest report\'s date formatted like "Jun 2010"', () => {
    const { getByLabelText } = render(<CurrentReportToggle reports={mockReports} onChange={toggleFn} />);

    expect(getByLabelText('Jul 2020')).toBeInTheDocument();
  });

  it(`labels its first button with the latest report's date formatted like "Jul 31, 2020"
  when the reportGroup has daily reports`, () => {
    const { getByLabelText } = render(<CurrentReportToggle reports={mockDailyReports} onChange={toggleFn} setActiveState={activeFn} />);

    expect(getByLabelText('Jul 31, 2020')).toBeInTheDocument();
  });

  it(`latest report button is updated when the user is not viewing latest`, async () => {
    const { getAllByRole, queryByLabelText, getByLabelText, rerender } = render(
      <CurrentReportToggle reports={mockReports} onChange={toggleFn} setActiveState={activeFn} />
    );
    const allRadioButtons = getAllByRole('radio');

    fireEvent.click(allRadioButtons[1]); // 2nd button in DOM is 'Previous'

    expect(queryByLabelText('Aug 2020')).toBeNull();

    const updatedReports = {
      value: [
        ...mockReportGroup,
        {
          path: '/downloads/mts_reports/mts0820.pdf',
          report_group_desc: 'Monthly Treasury Statement',
          report_date: new Date(2020, 7, 31),
          filesize: '1921283',
        },
      ],
    };
    await rerender(<CurrentReportToggle reports={updatedReports} onChange={toggleFn} setActiveState={activeFn} />);

    expect(queryByLabelText('Jul 2020')).toBeNull();
    expect(getByLabelText('Aug 2020')).toBeInTheDocument();
  });

  it(`new report button is added when user is looking at original 'current' report`, async () => {
    const { queryByLabelText, getByLabelText, rerender } = render(
      <CurrentReportToggle reports={mockReports} onChange={toggleFn} setActiveState={activeFn} />
    );

    expect(queryByLabelText('Aug 2020')).toBeNull();

    const updatedReports = {
      id: 100,
      value: [
        ...mockReportGroup,
        {
          path: '/downloads/mts_reports/mts0820.pdf',
          report_group_desc: 'Monthly Treasury Statement',
          report_date: new Date(2020, 7, 31),
          filesize: '1921283',
        },
      ],
    };

    await rerender(<CurrentReportToggle reports={updatedReports} onChange={toggleFn} setActiveState={activeFn} />);

    expect(getByLabelText('Jul 2020')).toBeInTheDocument();
    expect(getByLabelText('Aug 2020')).toBeInTheDocument();
  });
});
