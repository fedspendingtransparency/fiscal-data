import React, { FunctionComponent } from 'react';
import {
  currencyBody,
  currencyBox,
  currencyHeader,
  currencyText,
} from './currency-entry-box.module.scss';
import ComboCurrencySelect from '../../combo-select/combo-currency-select/combo-currency-select';
import { faDollarSign, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface ICurrencyEntryBox {
  defaultCurrency: string;
  currencyValue: string;
  dropdown?: boolean;
  selectedCurrency?;
  onCurrencyChange?;
  onCurrencyValueChange;
  options?: [];
  testId: string;
}

const noNonNumericChar = event => {
  // Prevents users from typing 'e', 'E', or '-'
  return (
    (event.key === 'e' || event.key === 'E' || event.key === '-') &&
    event.preventDefault()
  );
};

const CurrencyEntryBox: FunctionComponent<ICurrencyEntryBox> = ({
  defaultCurrency,
  dropdown = false,
  currencyValue,
  onCurrencyValueChange,
  onCurrencyChange,
  options,
  selectedCurrency,
  testId,
}) => {
  return (
    <>
      {dropdown ? (
        <div className={currencyBox} data-testid={testId}>
          <div>
            <FontAwesomeIcon icon={faGlobe as IconProp} />
            FOREIGN CURRENCY
          </div>
          <div>Amount</div>
          <div className={currencyBody}>
            <div className={currencyText}>
              {currencyValue === '--' ? (
                <div>{currencyValue}</div>
              ) : (
                <input
                  type="number"
                  inputMode="numeric"
                  step="any"
                  onKeyDown={noNonNumericChar}
                  onChange={onCurrencyValueChange}
                  value={currencyValue}
                  data-testid="input-dropdown"
                />
              )}
            </div>
          </div>
          <span>Country-Currency</span>
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
        </div>
      ) : (
        <div className={currencyBox}>
          <div>
            <FontAwesomeIcon icon={faDollarSign as IconProp} />
            U.S. DOLLAR
          </div>
          <div>Amount</div>
          <div className={currencyBody}>
            <div className={currencyText}>
              {currencyValue === '--' ? (
                <div>{currencyValue}</div>
              ) : (
                <input
                  type="number"
                  inputMode="numeric"
                  step="any"
                  onKeyDown={noNonNumericChar}
                  onChange={onCurrencyValueChange}
                  value={currencyValue}
                  data-testid="input"
                />
              )}
            </div>
          </div>
          <span>Country-Currency</span>
          <div className={currencyHeader}>
            <span>{defaultCurrency}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default CurrencyEntryBox;
