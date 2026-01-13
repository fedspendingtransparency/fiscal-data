/* istanbul ignore file */
// This component never made it to prod - keeping around in case of future use but excluding from coverage report

import React, { useEffect, useState } from 'react';
import { completeDate, dateFilterMaxYear, dateFilterMinYear } from '../date-range-helper';
import { format, isValid, isAfter } from 'date-fns';
import { useIMask, IMask } from 'react-imask';
import { inputDisplayContainer, inputTextDisplay, inputBox, currentDate } from './date-range-text-input.module.scss';
import { dateFormat, dateRangePlaceholder, datePlaceholder } from '../date-range-helper';

const DateRangeTextInput = ({ selected, setSelected, inputDisplay, setInputDisplay, setInvalidDate, active, setMonth }) => {
  const [highlight, setHighlight] = useState(null);

  const [opts] = useState({
    mask: dateRangePlaceholder,
    lazy: false,
    eager: true,
    parse: str => {
      const dateRange = str.split(' - ');
      setInputDisplay(dateRange);
      parseDates(dateRange);
    },
    blocks: {
      dd: { mask: IMask.MaskedRange, placeholderChar: 'd', from: 1, to: 31, maxLength: 2, autofix: 'pad' },
      mm: { mask: IMask.MaskedRange, placeholderChar: 'm', from: 1, to: 12, maxLength: 2, autofix: 'pad' },
      yyyy: { mask: IMask.MaskedRange, placeholderChar: 'y', from: dateFilterMinYear, to: dateFilterMaxYear, maxLength: 4 },
    },
  });
  const { ref } = useIMask(opts);

  const parseDates = dateRange => {
    const fromInput = dateRange[0];
    const toInput = dateRange[1];
    const from = new Date(fromInput);
    const to = new Date(toInput);
    if (completeDate(fromInput)) {
      if (isValid(from)) {
        setInvalidDate(false);
        setSelected({ from: from, to: undefined });
        setHighlight('to');
        setMonth(from);
      } else {
        setInvalidDate(true);
      }
    } else {
      if (fromInput !== datePlaceholder) {
        setHighlight('from');
      } else {
        setHighlight(null);
      }
      setSelected(undefined);
    }
    if (completeDate(toInput)) {
      if (isValid(to) && (isAfter(to, from) || toInput === fromInput)) {
        setInvalidDate(false);
        setSelected({ from: from, to: to });
        setHighlight(null);
        setMonth(to);
      } else {
        setInvalidDate(true);
      }
    }
  };

  useEffect(() => {
    if (!!selected?.from) {
      if (!!selected?.to) {
        setInputDisplay([format(selected?.from, dateFormat), format(selected?.to, dateFormat)]);
        setHighlight(null);
      } else if (format(selected.from, dateFormat) !== inputDisplay[0]) {
        setInputDisplay([format(selected?.from, dateFormat), datePlaceholder]);
        setHighlight('to');
      }
    } else if (!selected) {
      ref.current.value = dateRangePlaceholder;
      setInputDisplay([datePlaceholder, datePlaceholder]);
      setInvalidDate(false);
      setMonth();
    }
  }, [selected]);

  useEffect(() => {
    const currentInputRange = ref.current?.value?.split(' - ');
    if (inputDisplay !== currentInputRange) {
      ref.current.value = inputDisplay[0] + ' - ' + inputDisplay[1];
    }
  }, [inputDisplay]);

  useEffect(() => {
    if (!completeDate(inputDisplay[0])) {
      if (active) {
        setHighlight('from');
      } else {
        setHighlight(null);
      }
    } else if (!active && !completeDate(inputDisplay[1])) {
      setHighlight(null);
    }
  }, [active]);

  return (
    <div className={inputDisplayContainer}>
      <input ref={ref} spellCheck={false} className={inputBox} aria-hidden={true} />
      <div className={inputTextDisplay}>
        <span className={highlight === 'from' ? currentDate : undefined}>{inputDisplay[0]}</span>
        {' - '}
        <span className={highlight === 'to' ? currentDate : undefined}>{inputDisplay[1]}</span>
      </div>
    </div>
  );
};

export default DateRangeTextInput;
