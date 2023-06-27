import React from 'react';
import * as styles from './checkbox.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

const Checkbox = ({ onHover, changeHandler, checkboxData }) => {
  const defaultData = checkboxData.filter(field => field?.default === true);

  const handleClick = (e) => {
    checkboxData[e.target.value].active = e.target.checked;
    changeHandler(checkboxData.filter(obj => obj.active));
  }

  const handleHover = (enter, obj) => {
    if (onHover) {
      onHover(enter, obj)
    }
  }

  return (
      <div className={styles.checkbox_container}>
      { defaultData && <div className={styles.sectionHeading}>DEFAULTS</div> }

        {checkboxData.map((obj, index) => (
          <>
          {defaultData && defaultData.length === index && <div className={[styles.sectionHeading, styles.additionalSection].join(' ')}>ADDITIONAL</div>}
            <React.Fragment key={index}>
              <label
                className={styles.checkbox_label}
                data-testid="checkbox-label-element"
                onMouseEnter={() => handleHover(true, obj)}
                onMouseLeave={() => handleHover(false, obj)}
                role={'presentation'}
              >
                <div className={styles.checkbox_wrapper}>
                  <input
                    className={styles.optionCheckbox}
                    type="checkbox"
                    name={obj.label}
                    value={index}
                    onChange={handleClick}
                    data-testid="checkbox-input-element"
                    checked={obj.active}
                  />
                  <span className={styles.label_checkmark_container}>
                    <span className={styles.label_checkmark_text}>
                      <FontAwesomeIcon icon={faCheck} size="sm" />
                    </span>
                  </span>
                </div>
                <div className={styles.label_text} data-testid="optionLabelText">{obj.label}</div>
              </label>
            </React.Fragment>
          </>
          
        ))}
      </div> 
  )
}

export default Checkbox;
