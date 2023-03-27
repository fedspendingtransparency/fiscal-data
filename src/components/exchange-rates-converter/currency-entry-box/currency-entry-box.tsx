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
  resetFilterCount: number,
  testId: string,
}
const CurrencyEntryBox:FunctionComponent<ICurrencyEntryBox> = (
  {
    defaultCurrency,
    dropdown=false,
    currencyValue,
    onCurrencyValueChange,
    onCurrencyChange,
    options,
    selectedCurrency,
    resetFilterCount,
    testId
  }) => {
  return (
    <>
      {dropdown ?
        <div className={currencyBox} data-testid={testId}>
          {options && (
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
              isExchangeTool={true}
              required={true}
              disabledMessage="This option has no data for the selected quarter."
              resetFilterCount={resetFilterCount}
            />
          )}
          <div className={currencyBody}>
            <div className={currencyText}>
              <input type='number' inputMode="numeric" step="any" onChange={onCurrencyValueChange} value={currencyValue} data-testid={'input-dropdown'} />
            </div>
          </div>
        </div> :
        <div className={currencyBox} >
          <div className={currencyHeader}>
            <span>{defaultCurrency}</span>
          </div>
          <div className={currencyBody}>
            <div className={currencyText}>
              <input type='number' inputMode="numeric" step="any" onChange={onCurrencyValueChange} value={currencyValue} data-testid={'input'} />
            </div>
          </div>
        </div>
      }
    </>
  );
}

export default CurrencyEntryBox;
