import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { time_range_filter, time_range_filter_datePicker } from './datepickers.module.scss';
import { isBefore, isValid } from 'date-fns';
import { ThemeProvider } from '@mui/material';
import { theme } from '../../../theme';
import { generateAnalyticsEvent, generateFormattedDate } from '../range-presets/helpers/helper';
import dayjs from 'dayjs';

const DatePickers = ({ availableDateRange, selectedDateRange, setSelectedDates }) => {
  const [beginDate, setBeginDate] = useState(null);
  const [earliestDate, setEarliestDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [latestDate, setLatestDate] = useState(null);
  const [selecting, setSelecting] = useState(false);
  const [isPristine, setIsPristine] = useState(true);
  const [beginErrorMessage, setBeginErrorMessage] = useState('');
  const [endErrorMessage, setEndErrorMessage] = useState('');

  const handleSelectingDates = (dateVal, callback) => {
    if (callback && typeof callback === 'function') {
      callback(dateVal);
    }
    if (isPristine) {
      setIsPristine(false);
    }
  };

  const swapDates = () => {
    const startDate = beginDate;
    setBeginDate(endDate);
    setEndDate(startDate);
    setSelecting(false);
  };

  const prepDateFilterValue = () => {
    if (!isPristine && !selecting && endDate !== null && beginDate !== null) {
      const start = beginDate.toDate();
      const end = endDate.toDate();
      if (isBefore(end, start)) {
        setSelecting(true);
        swapDates();
      } else {
        if (isValid(start) && isValid(end)) {
          const curDateRange = {
            from: start,
            to: end,
          };
          generateAnalyticsEvent(generateFormattedDate(curDateRange));
          setSelectedDates(Object.assign({}, selectedDateRange, curDateRange));
        }
      }
    }
  };

  useEffect(() => {
    prepDateFilterValue();
  }, [selecting, endDate, beginDate]);

  useEffect(() => {
    if (availableDateRange) {
      if (availableDateRange.from instanceof Date) {
        setEarliestDate(new Date(availableDateRange.from.setHours(0, 0, 0, 0)));
      } else {
        setEarliestDate(null);
      }

      setLatestDate(availableDateRange.to || null);

      if (selectedDateRange) {
        setBeginDate(dayjs(selectedDateRange.from) || null);
        setEndDate(dayjs(selectedDateRange.to) || null);
      }
    }
  }, [availableDateRange]);

  useEffect(() => {
    if (selectedDateRange) {
      setBeginDate(dayjs(selectedDateRange.from) || null);
      setEndDate(dayjs(selectedDateRange.to) || null);
    }
  }, []);

  const pickerIcon = () => <FontAwesomeIcon icon={faCalendar} size="xs" />;

  const handleError = error => {
    switch (error) {
      case 'minDate':
        return 'Date should not be before minimal date';
      case 'maxDate':
        return 'Date should not be after maximal date';
      case 'invalidDate':
        return 'Invalid Date Format';
      default:
        return '';
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className={time_range_filter} data-testid="time-range-filter">
          <div className={time_range_filter_datePicker}>
            <label htmlFor="date-picker-from">
              From:
              <DatePicker
                id="date-picker-from"
                value={beginDate}
                onChange={dateVal => handleSelectingDates(dateVal, setBeginDate)}
                autoOk={true}
                onOpen={() => setSelecting(true)}
                onClose={() => setSelecting(false)}
                onError={error => setBeginErrorMessage(handleError(error))}
                inputFormat="MM/dd/yyyy"
                minDate={dayjs(earliestDate)}
                maxDate={dayjs(latestDate)}
                // disableFuture={true}
                slotProps={{
                  textField: props => ({
                    ...props,
                    variant: 'outlined',
                    // placeholder: 'MM/DD/YYYY',
                    helperText: beginErrorMessage,
                    sx: { '& .MuiIconButton-root': { marginRight: '0' }, '& .MuiOutlinedInput-input': { padding: '10px 0 10px 10px' } },
                    inputProps: {
                      ...props.inputProps,
                      'aria-label': 'From Date',
                    },
                  }),
                  popover: {
                    anchorOrigin: {
                      vertical: 'bottom',
                      horizontal: 'center',
                    },
                    transformOrigin: {
                      vertical: 'top',
                      horizontal: 'center',
                    },
                  },
                }}
                slots={{ openPickerIcon: pickerIcon }}
              />
            </label>
          </div>
          <div className={time_range_filter_datePicker}>
            <label htmlFor="date-picker-to">
              To:
              <DatePicker
                id="date-picker-to"
                autoOk={true}
                value={endDate}
                onChange={dateVal => handleSelectingDates(dateVal, setEndDate)}
                onOpen={() => setSelecting(true)}
                onClose={() => setSelecting(false)}
                onError={error => setEndErrorMessage(handleError(error))}
                inputFormat="MM/dd/yyyy"
                minDate={dayjs(earliestDate)}
                maxDate={dayjs(latestDate)}
                slotProps={{
                  textField: props => ({
                    variant: 'outlined',
                    // placeholder: 'MM/DD/YYYY',
                    helperText: endErrorMessage,
                    sx: { '& .MuiIconButton-root': { marginRight: '0' }, '& .MuiOutlinedInput-input': { padding: '10px 0 10px 10px' } },
                    inputProps: {
                      ...props.inputProps,
                      'aria-label': 'To Date',
                    },
                  }),
                  popover: {
                    anchorOrigin: {
                      vertical: 'bottom',
                      horizontal: 'center',
                    },
                    transformOrigin: {
                      vertical: 'top',
                      horizontal: 'center',
                    },
                  },
                }}
                slots={{ openPickerIcon: pickerIcon }}
              />
            </label>
          </div>
        </div>
      </LocalizationProvider>
    </ThemeProvider>
  );
};
export default DatePickers;
