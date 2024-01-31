import React, { useEffect, useState } from 'react';
import { completeDate } from './date-range-helper';
import { format, isValid, isAfter } from 'date-fns';
import moment from 'moment';
import { useIMask, IMask } from 'react-imask';
import { inputDisplayContainer, inputDisplay, inputBox, currentDate } from './date-range-filter.module.scss';

const DateRangeTextInput = ({ setStartDate, setEndDate, selected, setSelected, setText, text, setInvalidDate, invalidDate }) => {
  const [inputText, setInputText] = useState('mm/dd/yyyy - mm/dd/yyyy');
  const [display, setDisplay] = useState(['mm/dd/yyyy', 'mm/dd/yyyy']);
  const [highlight, setHighlight] = useState('from');

  const [opts] = useState({
    mask: 'mm/dd/yyyy - mm/dd/yyyy',
    lazy: false,
    parse: str => {
      const dateRange = str.split(' - ');
      setDisplay(dateRange);
      setText(str);
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
        setStartDate(moment(from));
        setInvalidDate(false);
        setSelected({ from: from, to: undefined });
        setHighlight('to');
      } else {
        setInvalidDate(true);
      }
    }
    if (completeDate(toInput)) {
      if (isValid(to) && (isAfter(to, from) || toInput === fromInput)) {
        setEndDate(to);
        setInvalidDate(false);
        setSelected({ from: from, to: to });
        setHighlight(null);
      } else {
        setInvalidDate(true);
      }
    }
  };

  useEffect(() => {
    ref.current.value = inputText;
    setText(inputText);
  }, [inputText]);

  useEffect(() => {
    if (text.length === 0) {
      setInputText('mm/dd/yyyy - mm/dd/yyyy');
      setDisplay(['mm/dd/yyyy', 'mm/dd/yyyy']);
      setHighlight('from');
      setInvalidDate(false);
    }
  }, [text]);

  useEffect(() => {
    if (!!selected?.from) {
      if (!!selected?.to) {
        setInputText(format(selected?.from, 'MM/dd/yyyy') + ' - ' + format(selected?.to, 'MM/dd/yyyy'));
      } else {
        setInputText(format(selected?.from, 'MM/dd/yyyy') + ' - mm/dd/yyyy');
      }
    }
  }, [selected]);

  useEffect(() => {
    if (!!selected?.to) {
      setInputText(format(selected?.from, 'MM/dd/yyyy') + ' - ' + format(selected?.to, 'MM/dd/yyyy'));
    }
  }, [selected?.to]);

  return (
    <div className={inputDisplayContainer}>
      <input ref={ref} spellCheck={false} className={inputBox} aria-hidden={true} />
      <div className={inputDisplay}>
        <span className={highlight === 'from' ? currentDate : undefined}>{display[0]}</span>
        {' - '}
        <span className={highlight === 'to' ? currentDate : undefined}>{display[1]}</span>
      </div>
    </div>
  );
};

export default DateRangeTextInput;
