import React, { FunctionComponent, useState } from 'react';
import {
  currencyBox,
  currencySelection,
  currencyText,
  headerIcon,
  boxLabel,
  headerContainer,
  comboCurrencySelection,
  activeBorder,
  activeLabel,
} from './currency-entry-box.module.scss';
import ComboCurrencySelect from '../../combo-select/combo-currency-select/combo-currency-select';
import { faDollarSign, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import classNames from 'classnames';
import { labelIcon } from '../../../layouts/currency-exchange-rates-converter/currency-exchange-rates-converter-helper';


interface ICurrencyEntryBox {
  defaultCurrency: string;
  currencyValue: string;
  dropdown?: boolean;
  selectedCurrency?;
  onCurrencyChange?;
  onCurrencyValueChange;
  options?: [];
  testId: string;
  header: string;
  tooltipDiplay: boolean;
  tooltip: any;
}

const noNonNumericChar = event => {
  // Prevents users from typing 'e', 'E', or '-'
  return (event.key === 'e' || event.key === 'E' || event.key === '-') && event.preventDefault();
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
  header,
  tooltipDiplay = false,
  tooltip
}) => {
  const [active, setActive] = useState(false);
  const ariaLabelValue = header === 'U.S. DOLLAR' ? 'U.S. Dollar' : selectedCurrency?.label;

  return (
    <>
      <div className={currencyBox} data-testid={testId}>
        <div className={headerContainer}>
          <FontAwesomeIcon icon={(header === 'U.S. DOLLAR' ? faDollarSign : faGlobe) as IconProp} className={headerIcon} />
          <span>{header}</span>
        </div>
        <div className={classNames([boxLabel, active ? activeLabel : null])}>Amount</div>
        <div className={classNames([currencyText, active ? activeBorder : null])}>
          {currencyValue === '--' ? (
            <span>{currencyValue}</span>
          ) : (
            <input
              type="number"
              inputMode="decimal"
              step="any"
              onKeyDown={noNonNumericChar}
              onChange={onCurrencyValueChange}
              value={currencyValue}
              data-testid="input"
              onClick={() => setActive(true)}
              onFocus={() => setActive(true)}
              onBlur={() => setActive(false)}
              aria-label={'Enter ' + ariaLabelValue + ' Amount'}
            />
          )}
        </div>
        <div className={boxLabel}>{labelIcon('Current Currency', tooltip, tooltipDiplay)}</div>
        {dropdown && options ? (
          <div className={comboCurrencySelection}>
            <ComboCurrencySelect
              selectedOption={selectedCurrency}
              options={options}
              labelDisplay
              changeHandler={onCurrencyChange}
              isExchangeTool
              required
              disabledMessage="This option has no data for the selected quarter."
              containerBorder
            />
          </div>
        ) : (
          <div className={currencySelection}>
            <span>{defaultCurrency}</span>
          </div>
        )}
      </div>
    </>
  );
};

export default CurrencyEntryBox;
