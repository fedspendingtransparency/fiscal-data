import React, { useEffect, useState } from 'react';
import { inputAddOn, inputValidation } from './date-range-helper';
import { format, isValid } from 'date-fns';
import moment from 'moment';

const DateRangeTextInput = ({ setStartDate, setEndDate, selected, setSelected, setText, text, setInvalidDate }) => {
  const [textEntry, setTextEntry] = useState('');

  const change = e => {
    const prevLength = textEntry.length; //TODO: if length is decreasing, correctly remove slashes
    const input = e.target.value;
    const length = input.length;

    if (length <= 23 && inputValidation[length]?.test(input)) {
      if (length === 10) {
        const from = new Date(input);
        if (isValid(from)) {
          setStartDate(moment(from));
          setSelected({ from: from, to: undefined });
        } else {
          setInvalidDate(true);
        }
      } else if (length === 23) {
        const from = new Date(input.substring(0, 10));
        const to = new Date(input.substring(13));
        if (isValid(to)) {
          setEndDate(moment(to));
          setSelected({ from: from, to: to });
        } else {
          setInvalidDate(true);
        }
      }

      if (length === 1 && Number(input) > 1 && length > prevLength) {
        setTextEntry('0' + input + '/');
      } else if (length === 14 && Number(input.substring(13)) > 1) {
        setTextEntry(input.substring(0, 13) + 0 + input.substring(13) + '/');
      } else if (inputAddOn[length] && length > prevLength) {
        setTextEntry(input + inputAddOn[length]);
      } else {
        setTextEntry(input);
      }
    } else if (length === 0) {
      setTextEntry('');
    }
  };

  useEffect(() => {
    setText(textEntry);
  }, [textEntry]);

  useEffect(() => {
    if (text.length === 0) {
      setTextEntry('');
    }
  }, [text]);

  useEffect(() => {
    if (!!selected?.from) {
      if (!!selected?.to) {
        setTextEntry(format(selected?.from, 'MM/dd/yyyy') + ' - ' + format(selected?.to, 'MM/dd/yyyy'));
      } else {
        setTextEntry(format(selected?.from, 'MM/dd/yyyy') + ' - ');
      }
    }
  }, [selected]);

  useEffect(() => {
    if (!!selected?.to) {
      setTextEntry(format(selected?.from, 'MM/dd/yyyy') + ' - ' + format(selected?.to, 'MM/dd/yyyy'));
    }
  }, [selected?.to]);

  return (
    <>
      <input value={textEntry} onChange={change} placeholder="mm/dd/yyyy - mm/dd/yyyy" />
    </>
  );
};

export default DateRangeTextInput;
