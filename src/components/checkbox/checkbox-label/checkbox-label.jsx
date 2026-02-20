import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import React from 'react';
import {
  checkbox_label,
  checkbox_wrapper,
  label_checkmark_container,
  label_checkmark_text,
  label_text,
  optionCheckbox,
} from '../checkbox.module.scss';

const CheckboxLabel = ({ obj, handleClick, onHover, index, boxColor }) => {
  const handleHover = (enter, obj) => {
    if (onHover) {
      onHover(enter, obj);
    }
  };
  return (
    <label
      className={checkbox_label}
      data-testid="checkbox-label-element"
      onMouseEnter={() => handleHover(true, obj)}
      onMouseLeave={() => handleHover(false, obj)}
      role="presentation"
    >
      <div className={checkbox_wrapper}>
        <input
          className={optionCheckbox}
          type="checkbox"
          name={obj.label}
          value={index}
          onKeyDown={e => e.key === 'Enter' && handleClick(e, true, !e.target.checked)}
          onChange={handleClick}
          data-testid="checkbox-input-element"
          checked={obj.active}
        />
        <span
          className={label_checkmark_container}
          style={obj.active ? { borderColor: boxColor, backgroundColor: boxColor } : undefined}
          data-testid="checkboxLabelContainer"
        >
          <span className={label_checkmark_text}>
            <FontAwesomeIcon icon={faCheck} size="sm" />
          </span>
        </span>
      </div>
      <div className={label_text} data-testid="optionLabelText">
        {obj.label}
      </div>
    </label>
  );
};

export default CheckboxLabel;
