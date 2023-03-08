import React, {FunctionComponent} from "react";
import {
  currencyBody,
  currencyBox,
  currencyHeader,
  currencyHeaderDropdown,
  icon,
  dropdownIcon,
  dropdownLabel,
  currencyText
} from './currency-entry-box.module.scss';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleDown} from "@fortawesome/free-solid-svg-icons";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import SelectControl from "../../select-control/select-control";

interface ICurrencyEntryBox  {
  defaultCurrency: string,
  currencyValue: string,
  dropdown ? : boolean,
  onCurrencyChange,
  clickFunction ?,
}
const CurrencyEntryBox:FunctionComponent<ICurrencyEntryBox> = (
  {defaultCurrency, dropdown=false, currencyValue, onCurrencyChange, clickFunction}) => {
  return (
    <>
      {dropdown ?
        <div className={currencyBox} >
          {/*<div className={currencyHeaderDropdown} onClick={clickFunction} role={'button'} onKeyPress={clickFunction} tabIndex={0}>*/}
          {/*  <span>{defaultCurrency}</span>*/}
          {/*  <FontAwesomeIcon icon={faAngleDown as IconProp} className={icon} name={'angle-down'} />*/}
          {/*</div>*/}
          <SelectControl
            buttonClassName={currencyHeaderDropdown}
            iconClassName={dropdownIcon}
            labelClassName={dropdownLabel}
            styledText={true}
            label={''}
            options={[]}
            selectedOption={{label: 'Euro Zone-Euro', value: ''}}
          />
          <div className={currencyBody}>
            <div className={currencyText}>
              <input type='number' inputMode="numeric" onChange={onCurrencyChange} value={currencyValue} />
            </div>
          </div>
        </div> :
        <div className={currencyBox} >
          <div className={currencyHeader}>
            <span>{defaultCurrency}</span>
          </div>
          <div className={currencyBody}>
            <div className={currencyText}>
              <input type='number' inputMode="numeric" onChange={onCurrencyChange} value={currencyValue} />
            </div>
          </div>
        </div>
      }
    </>
  );
}

export default CurrencyEntryBox;
