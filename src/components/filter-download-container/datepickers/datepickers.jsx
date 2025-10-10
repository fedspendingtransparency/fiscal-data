import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { time_range_filter, time_range_filter_datePicker } from './datepickers.module.scss';
import { isBefore, isValid } from 'date-fns';
import { ThemeProvider } from '@mui/material';
import { theme } from '../../../theme';
import { generateAnalyticsEvent, generateFormattedDate } from '../range-presets/helpers/helper';

const DatePickers = ({ availableDateRange, selectedDateRange, setSelectedDates }) => {
  const [beginDate, setBeginDate] = useState(null);
  const [earliestDate, setEarliestDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [latestDate, setLatestDate] = useState(null);
  const [selecting, setSelecting] = useState(false);
  const [isPristine, setIsPristine] = useState(true);

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
      if (isBefore(endDate, beginDate)) {
        setSelecting(true);
        swapDates();
      } else {
        if (isValid(beginDate) && isValid(endDate)) {
          const curDateRange = {
            from: beginDate,
            to: endDate,
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
        setBeginDate(selectedDateRange.from || null);
        setEndDate(selectedDateRange.to || null);
      }
    }
  }, [availableDateRange]);

  useEffect(() => {
    if (selectedDateRange) {
      setBeginDate(selectedDateRange.from || null);
      setEndDate(selectedDateRange.to || null);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <div className={time_range_filter} data-testid="time-range-filter">
          <div className={time_range_filter_datePicker}>
            <label htmlFor="date-picker-from">
              From:
              <KeyboardDatePicker
                id="date-picker-from"
                value={beginDate}
                onChange={dateVal => handleSelectingDates(dateVal, setBeginDate)}
                autoOk={true}
                variant="inline"
                inputVariant="outlined"
                placeholder="MM / DD / YYYY"
                onOpen={() => setSelecting(true)}
                onClose={() => setSelecting(false)}
                format="MM/dd/yyyy"
                minDate={earliestDate}
                maxDate={latestDate}
                keyboardIcon={<FontAwesomeIcon icon={faCalendar} size="xs" />}
                KeyboardButtonProps={{
                  'aria-label': 'Open calendar view to pick date',
                }}
                inputProps={{ 'aria-label': 'From Date' }}
                PopoverProps={{
                  anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'center',
                  },
                  transformOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                  },
                }}
              />
            </label>
          </div>
          <div className={time_range_filter_datePicker}>
            <label htmlFor="date-picker-to">
              To:
              <KeyboardDatePicker
                id="date-picker-to"
                autoOk={true}
                value={endDate}
                onChange={dateVal => handleSelectingDates(dateVal, setEndDate)}
                variant="inline"
                inputVariant="outlined"
                placeholder="MM / DD / YYYY"
                onOpen={() => setSelecting(true)}
                onClose={() => setSelecting(false)}
                format="MM/dd/yyyy"
                minDate={earliestDate}
                maxDate={latestDate}
                keyboardIcon={<FontAwesomeIcon icon={faCalendar} size="xs" />}
                KeyboardButtonProps={{
                  'aria-label': 'Open calendar view to pick date',
                }}
                inputProps={{ 'aria-label': 'To Date' }}
                PopoverProps={{
                  anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'center',
                  },
                  transformOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                  },
                }}
              />
            </label>
          </div>
        </div>
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  );
};
export default DatePickers;
