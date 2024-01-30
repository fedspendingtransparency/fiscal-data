import React, { useEffect, useState } from 'react';
import { inputAddOn, inputValidation } from './date-range-helper';
import { format, isValid, isAfter } from 'date-fns';
import moment from 'moment';

const DateRangeTextInput = ({ setStartDate, setEndDate, selected, setSelected, setText, text, setInvalidDate, invalidDate }) => {
  const [inputText, setInputText] = useState('');

  const change = e => {
    const prevLength = inputText.length; //TODO: if length is decreasing, correctly remove slashes
    const input = e.target.value;
    const length = input.length;

    if (length <= 23 && inputValidation[length]?.test(input)) {
      if (length === 10 && length > prevLength) {
        //Validate the first date
        const from = new Date(input);
        if (isValid(from)) {
          setStartDate(moment(from));
          setSelected({ from: from, to: undefined });
        } else {
          setInvalidDate(true);
        }
      } else if ((length < 10 || (length < 23 && length > 13)) && prevLength > length) {
        // reset invalid date flag when corrections have been made
        setInvalidDate(false);
      } else if (length === 23) {
        //Validate the second date
        const fromInput = input.substring(0, 10);
        const toInput = input.substring(13);
        const from = new Date(fromInput);
        const to = new Date(toInput);
        if (isValid(to) && (isAfter(to, from) || toInput === fromInput)) {
          setEndDate(moment(to));
          setSelected({ from: from, to: to });
        } else {
          setInvalidDate(true);
        }
      }

      if (length === 1 && Number(input) > 1 && length > prevLength) {
        setInputText('0' + input + '/');
      } else if (length === 14 && Number(input.substring(13)) > 1) {
        setInputText(input.substring(0, 13) + 0 + input.substring(13) + '/');
      } else if (inputAddOn[length] && length > prevLength) {
        setInputText(input + inputAddOn[length]);
      } else {
        setInputText(input);
      }
    } else if (length === 0) {
      setInputText('');
    }
  };

  useEffect(() => {
    setText(inputText);
  }, [inputText]);

  useEffect(() => {
    if (text.length === 0) {
      setInputText('');
      setInvalidDate(false);
    }
  }, [text]);

  useEffect(() => {
    if (!!selected?.from) {
      if (!!selected?.to) {
        setInputText(format(selected?.from, 'MM/dd/yyyy') + ' - ' + format(selected?.to, 'MM/dd/yyyy'));
      } else {
        setInputText(format(selected?.from, 'MM/dd/yyyy') + ' - ');
      }
    }
  }, [selected]);

  useEffect(() => {
    if (!!selected?.to) {
      setInputText(format(selected?.from, 'MM/dd/yyyy') + ' - ' + format(selected?.to, 'MM/dd/yyyy'));
    }
  }, [selected?.to]);

  return (
    <>
      <input value={inputText} onChange={change} placeholder="mm/dd/yyyy - mm/dd/yyyy" />
    </>
  );
};

export default DateRangeTextInput;
