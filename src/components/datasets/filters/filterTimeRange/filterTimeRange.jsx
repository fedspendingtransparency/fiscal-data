import React, { useState, useEffect, useContext } from "react";
import { isBefore, isValid } from "date-fns";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DateFnsUtils from "@date-io/date-fns";
import { siteContext } from "../../../persist/persist";
import InfoTip, { infoTipAnalyticsObject } from "../../../info-tip/info-tip";
import Checkbox from '../../../checkbox/checkbox';
import * as styles from "./filterTimeRange.module.scss";
import Analytics from "../../../../utils/analytics/analytics";

export const timeRangeCompleteAnalyticsObject = {
  category: 'Dataset Search Page',
  action: 'Time Range Entry',
  label: 'Complete Time Range'
}

export const spanTimeRangeAnalyticsObject = {
  category: 'Dataset Search Page',
  action: 'Time Range Click',
  label: 'Span Time Range'
}

export const timeRangeInfoTipAnalyticsObject = {
  ...infoTipAnalyticsObject,
  label: 'Time Range'
}

const FilterTimeRange = ({ dateRangeFilter, maxAllowedDate, resetApplied }) => {
  const context = useContext(siteContext);

  const [beginDate, setBeginDate] = useState(
    (context && context.beginDate) ? context.beginDate : null
  );
  const [endDate, setEndDate] = useState((context && context.endDate) ? context.endDate : null);
  const [checked, setChecked] = useState((context && context.exactRange) || false);
  const [selecting, setSelecting] = useState(false);

  const minAllowedDate = new Date(1790, 0, 1);
  minAllowedDate.setHours(0, 0, 0, 0);

  const handleBeginDate = (date) => {
    setBeginDate(date);
    context.setBeginDate(date);
  }
  const handleEndDate = (date) => {
    setEndDate(date);
    context.setEndDate(date);
  }

  const swapDates = () => {
    const startDate = beginDate;
    handleBeginDate(endDate);
    handleEndDate(startDate);
    setSelecting(false);
  }

  const handleCheckbox = () => {
    if (!checked) {
      Analytics.event(spanTimeRangeAnalyticsObject);
      // GA4 - Span Time Range
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'Time Range Click'
      });
    }

    context.setExactRange(!checked);
    setChecked(!checked);
  };

  const prepDateFilterValue = (onlyCheckboxChange) => {
    if (!selecting && endDate !== null && beginDate !== null) {
      if (isBefore(endDate, beginDate)) {
        setSelecting(true);
        swapDates();
      } else {
        if (isValid(beginDate) && isValid(endDate)) {
          dateRangeFilter({
            endDate: endDate,
            startDate: beginDate,
            exactRange: checked,
            active: true,
          }, onlyCheckboxChange);
        }
      }
    }
  };

  const handleInfoTipClick = () => {
    Analytics.event(timeRangeInfoTipAnalyticsObject);

    // GA4 event
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'Info Button Click',
      'eventLabel': 'Time Range'
    });
  }

  useEffect(() => {
    prepDateFilterValue();
    if(beginDate && endDate && !selecting){
      // GA4 - Time Range Entry
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'Time Range Entry',
        'eventLabel': `${beginDate} - ${endDate}`
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

  const checkboxData = [{
    label: (
      <>
        Limit results to datasets spanning entire time range
        <InfoTip
          title="Time Range"
          clickEvent={handleInfoTipClick}
        >
          <p>
            Select{" "}
            <strong>
              Limit results to datasets spanning entire time range
            </strong>{" "}
            to return only datasets whose start date is equal to or before
            the submitted start ("From") date and the end date is equal to
            or later than the submitted end ("To") date.
          </p>
        </InfoTip>
      </>
    ),
    active: checked
  }];

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <div className={styles.time_range_filter} data-testid="time-range-filter">
        <div
          className={styles.time_range_filter_label}
          data-testid="time_range_filter_label"
        >
          <p className={styles.time_range_filter_label_text}>From</p>
          <div className={styles.time_range_filter_datePicker}>
            <KeyboardDatePicker
              value={beginDate}
              onChange={handleBeginDate}
              variant="inline"
              inputVariant="outlined"
              placeholder="MM / DD / YYYY"
              onOpen={() => setSelecting(true)}
              onClose={() => setSelecting(false)}
              format="MM/dd/yyyy"
              minDate={minAllowedDate}
              maxDate={maxAllowedDate}
              keyboardIcon={<FontAwesomeIcon icon={faCalendar} size="xs" />}
              KeyboardButtonProps={{
                "aria-label": "Open calendar view to pick date",
              }}
              inputProps={{ "aria-label": "From Date" }}
              PopoverProps={{
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "center",
                },
                transformOrigin: {
                  vertical: "top",
                  horizontal: "center",
                },
              }}
            />
          </div>
        </div>
        <div className={styles.time_range_filter_label}>
          <p className={styles.time_range_filter_label_text}>To</p>
          <div className={styles.time_range_filter_datePicker}>
            <KeyboardDatePicker
              value={endDate}
              onChange={handleEndDate}
              variant="inline"
              inputVariant="outlined"
              placeholder="MM / DD / YYYY"
              format="MM/dd/yyyy"
              minDate={minAllowedDate}
              maxDate={maxAllowedDate}
              onOpen={() => setSelecting(true)}
              onClose={() => setSelecting(false)}
              keyboardIcon={<FontAwesomeIcon icon={faCalendar} size="xs" />}
              KeyboardButtonProps={{
                "aria-label": "Open calendar view to pick date",
              }}
              inputProps={{ "aria-label": "To Date" }}
              PopoverProps={{
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "right",
                },
                transformOrigin: {
                  vertical: "top",
                  horizontal: "right",
                },
              }}
            />
          </div>
        </div>
        <div className={styles.checkBoxDiv} data-testid={'checkbox'}>
          <Checkbox checkboxData={checkboxData} changeHandler={handleCheckbox}/>
        </div>
      </div>
    </MuiPickersUtilsProvider>
  )
}

export default FilterTimeRange;
