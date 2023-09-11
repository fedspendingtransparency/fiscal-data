import React, { useState, useEffect } from 'react';
import * as styles from './select-all.module.scss';
import { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faMinus } from '@fortawesome/free-solid-svg-icons';

const SelectAll = ({ fields, onUpdateFields, isVisible, resetToFalse }) => {
  const [allSelected, setAllSelected] = useState(true);
  const [indeterminate, setIndeterminate] = useState(true);
  const inputRef = useRef();
  const allFieldsChecked = fields.every(f => f.active);
  const allFieldsUnchecked = fields.every(f => !f.active);

  useEffect(() => {
    if (isVisible) {
      if (allFieldsChecked && !allSelected) {
        setAllSelected(true);
      }

      if (allFieldsUnchecked && allSelected) {
        setAllSelected(false);
      }

      if (inputRef.current !== null) {
        if (allSelected && !allFieldsChecked && !allFieldsUnchecked) {
          if (resetToFalse) {
            inputRef.current.indeterminate = false;
            setIndeterminate(false);
            setAllSelected(false);
          } else {
            inputRef.current.indeterminate = true;
            setIndeterminate(true);
          }
        } else {
          inputRef.current.indeterminate = false;
          setIndeterminate(false);
        }
      }
    }
  }, [isVisible, fields]);

  const updateFields = arr => {
    const updated = [];
    arr.forEach(f => {
      const n = Object.assign({}, f, { active: true });
      updated.push(n);
    });
    return updated;
  };
  const handleToggleSelectAll = toggle => {
    setAllSelected(toggle);
    const updated = toggle ? updateFields(fields) : [];
    onUpdateFields(updated);
  };

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <label>
          <input
            name="selectAll"
            onKeyDown={e => e.key === 'Enter' && handleToggleSelectAll(!allSelected)}
            onChange={() => handleToggleSelectAll(!allSelected)}
            id="selectAll"
            value={allSelected}
            type="checkbox"
            ref={inputRef}
            checked={allSelected && allFieldsChecked}
          />
          <span className={styles.labelCheckmarkContainer}>
            <span className={styles.checkmarkText}>
              <FontAwesomeIcon icon={indeterminate ? faMinus : faCheck} size="sm" />
            </span>
          </span>
          Select All
        </label>
      </div>
    </div>
  );
};

export default SelectAll;
