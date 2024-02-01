import React, { useEffect, useState } from 'react';
import { completeDate } from './date-range-helper';
import { format, isValid, isAfter } from 'date-fns';
import { useIMask, IMask } from 'react-imask';
import { inputDisplayContainer, inputTextDisplay, inputBox, currentDate } from './date-range-filter.module.scss';

const DateRangeTextInput = ({ selected, setSelected, inputDisplay, setInputDisplay, setInvalidDate, active }) => {
  // const [inputDisplay, setInputDisplay] = useState(['mm/dd/yyyy', 'mm/dd/yyyy']);
  const [highlight, setHighlight] = useState('from');

  const [opts] = useState({
    mask: 'mm/dd/yyyy - mm/dd/yyyy',
    lazy: false,
    parse: str => {
      const dateRange = str.split(' - ');
      console.log(str, dateRange);
      setInputDisplay(dateRange);
      // setText(str);
      parseDates(dateRange);
    },
    blocks: {
      dd: { mask: IMask.MaskedRange, placeholderChar: 'd', from: 1, to: 31, maxLength: 2, autofix: 'pad' },
      mm: { mask: IMask.MaskedRange, placeholderChar: 'm', from: 1, to: 12, maxLength: 2, autofix: 'pad' },
      yyyy: { mask: IMask.MaskedRange, placeholderChar: 'y', from: 1900, to: 2999, maxLength: 4 },
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
      } else {
        setInvalidDate(true);
      }
    } else {
      console.log(4);
      setSelected(undefined);
    }
    if (completeDate(toInput)) {
      if (isValid(to) && (isAfter(to, from) || toInput === fromInput)) {
        setInvalidDate(false);
        setSelected({ from: from, to: to });
        setHighlight(null);
      } else {
        setInvalidDate(true);
      }
    }
  };

  useEffect(() => {
    if (!!selected?.from) {
      if (!!selected?.to) {
        console.log(1);
        setInputDisplay([format(selected?.from, 'MM/dd/yyyy'), format(selected?.to, 'MM/dd/yyyy')]);
      } else if (format(selected.from, 'MM/dd/yyyy') !== inputDisplay[0]) {
        console.log(2, selected.from, inputDisplay[0]);

        setInputDisplay([format(selected?.from, 'MM/dd/yyyy'), 'mm/dd/yyyy']);
      }
    } else if (!selected) {
      console.log(3);
      ref.current.value = 'mm/dd/yyyy - mm/dd/yyyy';
      setInputDisplay(['mm/dd/yyyy', 'mm/dd/yyyy']);
      setHighlight('from');
      setInvalidDate(false);
    }
  }, [selected]);

  return (
    <div className={inputDisplayContainer}>
      <input ref={ref} spellCheck={false} className={inputBox} aria-hidden={true} />
      <div className={inputTextDisplay}>
        <span className={active && highlight === 'from' ? currentDate : undefined}>{inputDisplay[0]}</span>
        {' - '}
        <span className={active && highlight === 'to' ? currentDate : undefined}>{inputDisplay[1]}</span>
      </div>
    </div>
  );
};

export default DateRangeTextInput;
