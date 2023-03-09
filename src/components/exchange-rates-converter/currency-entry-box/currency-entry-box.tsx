import React, {FunctionComponent} from "react";
import {
  currencyBody,
  currencyBox,
  currencyHeader,
  dropdownIcon,
  currencyText,
  dropdownInput,
  dropdownInputContainer
} from './currency-entry-box.module.scss';
import ComboSelect from "../../combo-select/combo-select";

interface ICurrencyEntryBox  {
  defaultCurrency: string,
  currencyValue: string,
  dropdown ? : boolean,
  selectedCurrency ?,
  onCurrencyChange ?,
  onCurrencyValueChange,
  options ? : [],
}
const CurrencyEntryBox:FunctionComponent<ICurrencyEntryBox> = (
  {defaultCurrency, dropdown=false, currencyValue, onCurrencyValueChange, onCurrencyChange, options, selectedCurrency}) => {
  return (
    <>
      {dropdown ?
        <div className={currencyBox} >
          <ComboSelect
            selectedOption={selectedCurrency}
            label={''}
            options={options}
            iconStyle={dropdownIcon}
            inputStyle={dropdownInput}
            scrollable={true}
            inputContainerStyle={dropdownInputContainer}
            labelDisplay={true}
            changeHandler={onCurrencyChange}
          />
          <div className={currencyBody}>
            <div className={currencyText}>
              <input type='number' inputMode="numeric" onChange={onCurrencyValueChange} value={currencyValue} />
            </div>
          </div>
        </div> :
        <div className={currencyBox} >
          <div className={currencyHeader}>
            <span>{defaultCurrency}</span>
          </div>
          <div className={currencyBody}>
            <div className={currencyText}>
              <input type='number' inputMode="numeric" onChange={onCurrencyValueChange} value={currencyValue} />
            </div>
          </div>
        </div>
      }
    </>
  );
}

export default CurrencyEntryBox;
