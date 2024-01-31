import React, { useEffect, useState } from 'react';
import { completeDate } from './date-range-helper';
import { format, isValid, isAfter } from 'date-fns';
import moment from 'moment';
import { useIMask, IMask } from 'react-imask';

const DateRangeTextInput = ({ setStartDate, setEndDate, selected, setSelected, setText, text, setInvalidDate, invalidDate }) => {
  const [inputText, setInputText] = useState('mm/dd/yyyy - mm/dd/yyyy');

  const [opts] = useState({
    mask: 'mm/dd/yyyy - mm/dd/yyyy',
    lazy: false,
    parse: str => {
      const dateRange = str.split(' - ');
      parseDates(dateRange);
    },
    blocks: {
      dd: { mask: IMask.MaskedRange, placeholderChar: 'd', from: 1, to: 31, maxLength: 2, autofix: 'pad' },
      mm: { mask: IMask.MaskedRange, placeholderChar: 'm', from: 1, to: 12, maxLength: 2, autofix: 'pad' },
      yyyy: { mask: IMask.MaskedRange, placeholderChar: 'y', from: 1900, to: 2999, maxLength: 4 },
    },
    // overwrite: true,
  });
  const { ref } = useIMask(opts);

  let dateInvalid = '';

  const parseDates = dateRange => {
    const fromInput = dateRange[0];
    const toInput = dateRange[1];
    const from = new Date(fromInput);
    const to = new Date(toInput);
    if (completeDate(fromInput)) {
      if (isValid(from)) {
        setStartDate(moment(from));
        setInvalidDate(false);
        if (isValid(to)) {
          setSelected({ from: from, to: to });
        } else {
          setSelected({ from: from, to: undefined });
        }
      } else {
        console.log('invalid from');
        dateInvalid = 'from';
        setInvalidDate(true);
      }
    } else if (dateInvalid === 'from') {
      console.log('reset from');
      // setInvalidDate(false);
      // dateInvalid = '';
    }
    if (completeDate(toInput)) {
      if (isValid(to) && (isAfter(to, from) || toInput === fromInput)) {
        setEndDate(to);
        setInvalidDate(false);
        setSelected({ from: from, to: to });
      } else {
        dateInvalid = 'to';
        console.log('invalid to');

        setInvalidDate(true);
      }
    } else if (dateInvalid === 'to') {
      // setInvalidDate(false);
      console.log('reset to');
      // dateInvalid = '';
    }
  };

  useEffect(() => {
    console.log('text', inputText, 'ref', ref.current.value);
    ref.current.value = inputText;
    setText(inputText);
  }, [inputText]);

  useEffect(() => {
    if (text.length === 0) {
      setInputText('mm/dd/yyyy - mm/dd/yyyy');
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

  return <input ref={ref} spellCheck={false} />;
};

export default DateRangeTextInput;
