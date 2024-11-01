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
import { faDollarSign, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import classNames from 'classnames';
import { ga4DataLayerPush } from '../../../helpers/google-analytics/google-analytics-helper';
import {
  labelIcon,
  noNonNumericChar,
  handleMouseEnterInfoTip,
} from '../../../helpers/currency-exchange-rates-converter/currency-exchange-rates-converter-helper';
import Analytics from '../../../utils/analytics/analytics';

let gaInfoTipTimer: NodeJS.Timeout;
let ga4Timer: NodeJS.Timeout;

interface ICurrencyEntryBox {
  defaultCurrency: string;
  currencyValue: string;
  dropdown?: boolean;
  selectedCurrency?: { label: string; value: number };
  onCurrencyChange?;
  onCurrencyValueChange;
  options?: [];
  testId: string;
  header: string;
  tooltipDisplay: boolean;
  tooltip: ReactElement | string;
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
  tooltipDisplay = false,
  tooltip,
}) => {
  const [active, setActive] = useState(false);
  const ariaLabelValue = header === 'U.S. DOLLAR' ? 'U.S. Dollar' : selectedCurrency?.label;

  const handleInfoTipClose = () => {
    clearTimeout(gaInfoTipTimer);
    clearTimeout(ga4Timer);
  };

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
        <div className={boxLabel}>
          {labelIcon(
            'Country-Currency',
            tooltip,
            'foreign-currency-info-tip',
            tooltipDisplay,
            () => handleMouseEnterInfoTip('Additional Foreign Currency Info', 'foreign-curr', gaInfoTipTimer, ga4Timer),
            handleInfoTipClose
          )}
        </div>
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
