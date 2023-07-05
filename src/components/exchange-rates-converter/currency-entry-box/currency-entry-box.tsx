import React, {FunctionComponent} from "react";
import {
  currencyBody,
  currencyBox,
  currencyHeader,
  currencyText,
} from './currency-entry-box.module.scss';
import ComboCurrencySelect from '../../combo-select/combo-currency-select/combo-currency-select';

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

const noNonNumericChar = (event) => {
  // Prevents users from typing 'e', 'E', or '-'
  return (event.key === 'e' || event.key === 'E' || event.key === '-') && event.preventDefault();
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
            <ComboCurrencySelect
              selectedOption={selectedCurrency}
              options={options}
              labelDisplay={true}
              changeHandler={onCurrencyChange}
              isExchangeTool={true}
              required={true}
              disabledMessage="This option has no data for the selected quarter."
            />
          )}
          <div className={currencyBody}>
            <div className={currencyText}>
              <input type="number" inputMode="numeric" step="any" onKeyDown={noNonNumericChar}
                     onChange={onCurrencyValueChange} value={currencyValue} data-testid="input-dropdown"
              />
            </div>
          </div>
        </div> :
        <div className={currencyBox} >
          <div className={currencyHeader}>
            <span>{defaultCurrency}</span>
          </div>
          <div className={currencyBody}>
            <div className={currencyText}>
              <input type="number" inputMode="numeric" step="any" onKeyDown={noNonNumericChar}
                     onChange={onCurrencyValueChange}
                     value={currencyValue} data-testid="input"
              />
            </div>
          </div>
        </div>
      }
    </>
  );
}

export default CurrencyEntryBox;
