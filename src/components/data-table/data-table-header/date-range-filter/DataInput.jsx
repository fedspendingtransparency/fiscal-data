import React, { useState } from 'react';
import moment from 'moment';

const DateInput = ({ value, onChange, placeholder, onFocus, onBlur, id }) => {
  const [internalValue, setInternalValue] = useState(value || '');

  const handleChange = e => {
    const { value } = e.target;
    // Allow only numbers and slashes
    if (/^[0-9\/]*$/.test(value)) {
      setInternalValue(value);
      if (moment(value, 'MM/DD/YYYY', true).isValid()) {
        onChange(value);
      }
    }
  };

  const handleBlur = e => {
    if (!moment(internalValue, 'MM/DD/YYYY', true).isValid()) {
      setInternalValue('');
      onChange('');
    }
    if (onBlur) onBlur(e);
  };

  return <input type="text" value={internalValue} onChange={handleChange} onFocus={onFocus} onBlur={handleBlur} placeholder={placeholder} id={id} />;
};

export default DateInput;
