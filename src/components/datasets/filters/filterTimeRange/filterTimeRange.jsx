import React, { useContext, useEffect, useState } from 'react';
import { isBefore, isValid } from 'date-fns';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { siteContext } from '../../../persist/persist';
import InfoTip, { infoTipAnalyticsObject } from '../../../info-tip/info-tip';
import Checkbox from '../../../checkbox/checkbox';
import {
  checkBoxDiv,
  time_range_filter,
  time_range_filter_datePicker,
  time_range_filter_label,
  time_range_filter_label_text,
} from './filterTimeRange.module.scss';
import Analytics from '../../../../utils/analytics/analytics';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';

export const timeRangeCompleteAnalyticsObject = {
  category: 'Dataset Search Page',
  action: 'Time Range Entry',
  label: 'Complete Time Range',
};

export const spanTimeRangeAnalyticsObject = {
  category: 'Dataset Search Page',
  action: 'Time Range Click',
  label: 'Span Time Range',
};

export const timeRangeInfoTipAnalyticsObject = {
  ...infoTipAnalyticsObject,
  label: 'Time Range',
};

const FilterTimeRange = ({ dateRangeFilter, maxAllowedDate, resetApplied }) => {
  const context = useContext(siteContext);
  const [beginDate, setBeginDate] = useState(context && context.beginDate ? dayjs(context.beginDate) : null);
  const [endDate, setEndDate] = useState(context && context.endDate ? dayjs(context.endDate) : null);
  const [checked, setChecked] = useState((context && context.exactRange) || false);
  const [selecting, setSelecting] = useState(false);
  const [beginErrorMessage, setBeginErrorMessage] = useState('');
  const [endErrorMessage, setEndErrorMessage] = useState('');

  const minAllowedDate = new Date(1790, 0, 1);
  minAllowedDate.setHours(0, 0, 0, 0);

  const handleBeginDate = date => {
    if (date?.year() >= 1000 || date === null) {
      setBeginDate(date);
      context.setBeginDate(date ? date.toDate() : null);
    }
  };
  const handleEndDate = date => {
    if (date?.year() >= 1000 || date === null) {
      setEndDate(date);
      context.setEndDate(date ? date.toDate() : null);
    }
  };

  const swapDates = () => {
    const startDate = beginDate;
    handleBeginDate(endDate);
    handleEndDate(startDate);
    setSelecting(false);
  };

  const handleCheckbox = () => {
    if (!checked) {
      Analytics.event(spanTimeRangeAnalyticsObject);
      // GA4 - Span Time Range
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'Time Range Click',
      });
    }

    context.setExactRange(!checked);
    setChecked(!checked);
  };

  const prepDateFilterValue = onlyCheckboxChange => {
    if (!selecting && endDate !== null && beginDate !== null) {
      const start = beginDate.toDate();
      const end = endDate.toDate();
      if (isBefore(end, start)) {
        setSelecting(true);
        swapDates();
      } else {
        if (isValid(start) && isValid(end)) {
          dateRangeFilter(
            {
              endDate: end,
              startDate: start,
              exactRange: checked,
              active: true,
            },
            onlyCheckboxChange
          );
        }
      }
    }
  };

  const handleInfoTipClick = () => {
    Analytics.event(timeRangeInfoTipAnalyticsObject);

    // GA4 event
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'Info Button Click',
      eventLabel: 'Time Range',
    });
  };

  useEffect(() => {
    prepDateFilterValue();
    if (beginDate && endDate && !selecting) {
      // GA4 - Time Range Entry
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'Time Range Entry',
        eventLabel: `${beginDate.toDate()} - ${endDate.toDate()}`,
      });
    }
  }, [selecting, endDate, beginDate]);

  useEffect(() => {
    // if only the checkbox value changes, we don't want to trigger the wrong analytics event
    prepDateFilterValue(true);
  }, [checked]);

  useEffect(() => {
    if (resetApplied) {
      handleBeginDate(null);
      handleEndDate(null);
      context.setExactRange(false);
      setChecked(false);
    }
  }, [resetApplied]);

  const checkboxData = [
    {
      label: (
        <>
          Limit results to datasets spanning entire time range
          <InfoTip title="Time Range" clickEvent={handleInfoTipClick}>
            <p>
              Select <strong>Limit results to datasets spanning entire time range</strong> to return only datasets whose start date is equal to or
              before the submitted start ("From") date and the end date is equal to or later than the submitted end ("To") date.
            </p>
          </InfoTip>
        </>
      ),
      active: checked,
    },
  ];

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

  const pickerIcon = () => <FontAwesomeIcon icon={faCalendar} size="xs" />;
  return (
    // <LocalizationProvider dateAdapter={AdapterDayjs}>
    <div className={time_range_filter} data-testid="time-range-filter">
      <div className={time_range_filter_label} data-testid="time_range_filter_label">
        <p className={time_range_filter_label_text}>From</p>
        <div className={time_range_filter_datePicker}>
          {/*<DatePicker*/}
          {/*  value={beginDate}*/}
          {/*  onChange={handleBeginDate}*/}
          {/*  onOpen={() => setSelecting(true)}*/}
          {/*  onClose={() => setSelecting(false)}*/}
          {/*  onError={error => setBeginErrorMessage(handleError(error))}*/}
          {/*  inputFormat="MM/dd/yyyy"*/}
          {/*  minDate={dayjs(minAllowedDate)}*/}
          {/*  maxDate={dayjs(maxAllowedDate)}*/}
          {/*  slotProps={{*/}
          {/*    textField: props => ({*/}
          {/*      variant: 'outlined',*/}
          {/*      placeholder: 'MM/DD/YYYY',*/}
          {/*      helperText: beginErrorMessage,*/}
          {/*      sx: { '& .MuiIconButton-root': { marginRight: '0' }, '& .MuiOutlinedInput-input': { padding: '10px 0 10px 10px' } },*/}
          {/*      inputProps: {*/}
          {/*        ...props.inputProps,*/}
          {/*        'aria-label': 'From Date',*/}
          {/*      },*/}
          {/*    }),*/}
          {/*    popover: {*/}
          {/*      anchorOrigin: {*/}
          {/*        vertical: 'bottom',*/}
          {/*        horizontal: 'center',*/}
          {/*      },*/}
          {/*      transformOrigin: {*/}
          {/*        vertical: 'top',*/}
          {/*        horizontal: 'center',*/}
          {/*      },*/}
          {/*    },*/}
          {/*  }}*/}
          {/*  slots={{ openPickerIcon: pickerIcon }}*/}
          {/*  views={['year', 'month', 'day']}*/}
          {/*/>*/}
        </div>
      </div>
      <div className={time_range_filter_label}>
        <p className={time_range_filter_label_text}>To</p>
        <div className={time_range_filter_datePicker}>
          {/*<DatePicker*/}
          {/*  value={endDate}*/}
          {/*  onChange={handleEndDate}*/}
          {/*  onOpen={() => setSelecting(true)}*/}
          {/*  onClose={() => setSelecting(false)}*/}
          {/*  onError={error => setEndErrorMessage(handleError(error))}*/}
          {/*  inputFormat="MM/dd/yyyy"*/}
          {/*  inputVariant="outlined"*/}
          {/*  minDate={dayjs(minAllowedDate)}*/}
          {/*  maxDate={dayjs(maxAllowedDate)}*/}
          {/*  KeyboardButtonProps={{*/}
          {/*    'aria-label': 'Open calendar view to pick date',*/}
          {/*  }}*/}
          {/*  slotProps={{*/}
          {/*    textField: props => ({*/}
          {/*      variant: 'outlined',*/}
          {/*      placeholder: 'MM/DD/YYYY',*/}
          {/*      helperText: endErrorMessage,*/}
          {/*      sx: { '& .MuiIconButton-root': { marginRight: '0' }, '& .MuiOutlinedInput-input': { padding: '10px 0 10px 10px' } },*/}
          {/*      inputProps: {*/}
          {/*        ...props.inputProps,*/}
          {/*        'aria-label': 'To Date',*/}
          {/*      },*/}
          {/*    }),*/}
          {/*    popover: {*/}
          {/*      anchorOrigin: {*/}
          {/*        vertical: 'bottom',*/}
          {/*        horizontal: 'center',*/}
          {/*      },*/}
          {/*      transformOrigin: {*/}
          {/*        vertical: 'top',*/}
          {/*        horizontal: 'center',*/}
          {/*      },*/}
          {/*    },*/}
          {/*  }}*/}
          {/*  slots={{ openPickerIcon: pickerIcon }}*/}
          {/*/>*/}
        </div>
      </div>
      <div className={checkBoxDiv} data-testid="checkbox">
        <Checkbox checkboxData={checkboxData} changeHandler={handleCheckbox} />
      </div>
    </div>
    // </LocalizationProvider>
  );
};

export default FilterTimeRange;
