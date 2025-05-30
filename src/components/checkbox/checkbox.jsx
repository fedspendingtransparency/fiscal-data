import React from 'react';
import { additionalSection, checkbox_container, sectionHeading } from './checkbox.module.scss';
import CheckboxLabel from './checkbox-label/checkbox-label';

const Checkbox = ({ onHover, changeHandler, checkboxData }) => {
  const defaultData = checkboxData.filter(field => field?.default === true);
  const additionalData = checkboxData.filter(field => field?.default === false);
  if (defaultData.length && defaultData[0]?.label) {
    additionalData.sort((a, b) => {
      const stripCommas = label => {
        return label.replace(/[,]/g, '');
      };
      return stripCommas(a.label).localeCompare(stripCommas(b.label));
    });
  }

  const currentCheckboxData = defaultData.length ? defaultData.concat(additionalData) : checkboxData;

  const handleClick = (e, isKeyPress, checkedValue) => {
    if (isKeyPress) {
      currentCheckboxData[e.target.value].active = checkedValue;
    } else {
      currentCheckboxData[e.target.value].active = e.target.checked;
    }
    changeHandler(currentCheckboxData.filter(obj => obj.active));
  };

  return (
    <div className={checkbox_container}>
      {defaultData.length ? <div className={sectionHeading}>DEFAULTS</div> : ''}
      {currentCheckboxData.map((obj, index) => (
        <>
          {defaultData.length && defaultData.length === index ? <div className={[sectionHeading, additionalSection].join(' ')}>ADDITIONAL</div> : ''}
          <React.Fragment key={index}>
            <CheckboxLabel obj={obj} handleClick={handleClick} onHover={onHover} index={index} />
          </React.Fragment>
        </>
      ))}
    </div>
  );
};

export default Checkbox;
