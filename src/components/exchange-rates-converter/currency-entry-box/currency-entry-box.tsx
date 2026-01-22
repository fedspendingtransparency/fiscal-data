import React, { FunctionComponent, ReactElement, useState } from 'react';
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
import { faDollarSign } from '@fortawesome/free-solid-svg-icons/faDollarSign';
import { faGlobe } from '@fortawesome/free-solid-svg-icons/faGlobe';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import classNames from 'classnames';
import {
  noNonNumericChar,
  handleHoverInfoTipAnalytics,
} from '../../../helpers/currency-exchange-rates-converter/currency-exchange-rates-converter-helper';
import EntryBoxLabel from '../entry-box-label/entry-box-label';
import { DropdownOption } from '../currency-exchange-rates-converter/currency-exchange-rates-converter';

let gaInfoTipTimer: NodeJS.Timeout;

interface ICurrencyEntryBox {
  defaultCurrency: string;
  currencyValue: string;
  dropdown?: boolean;
  selectedCurrency?: { label: string; value: number };
  onCurrencyChange?: (selectedCurrency: DropdownOption) => void;
  onCurrencyValueChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  options?: [];
  testId: string;
  header: string;
  tooltip?: ReactElement | string;
}

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
  tooltip,
}) => {
  const [active, setActive] = useState(false);
  const ariaLabelValue = header === 'U.S. DOLLAR' ? 'U.S. Dollar' : selectedCurrency?.label;

  const handleInfoTipClose = () => {
    clearTimeout(gaInfoTipTimer);
  };

  const handleInfoTipHover = () =>
    (gaInfoTipTimer = setTimeout(() => {
      handleHoverInfoTipAnalytics('Additional Foreign Currency Info', 'foreign-curr');
    }, 3000));

  const currencyEntryLabel = (
    <EntryBoxLabel
      label="Country-Currency"
      tooltipBody={tooltip}
      dataTestID="foreign-currency-info-tip"
      handleMouseEnter={handleInfoTipHover}
      handleTooltipClose={handleInfoTipClose}
    />
  );

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
        <div className={boxLabel}>{currencyEntryLabel}</div>
        {dropdown && options ? (
          <div className={comboCurrencySelection}>
            <ComboCurrencySelect
              selectedOption={selectedCurrency}
              options={options}
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
