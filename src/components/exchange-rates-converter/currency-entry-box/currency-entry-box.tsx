import React, {FunctionComponent} from "react";
import {
  currencyBody,
  currencyBox,
  currencyHeader,
  icon,
  currencyText
} from './currency-entry-box.module.scss';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleDown} from "@fortawesome/free-solid-svg-icons";
import {IconProp} from "@fortawesome/fontawesome-svg-core";

interface ICurrencyEntryBox  {
  defaultCurrency: string,
  currencyValue: string,
  dropdown ? : boolean,
}
const CurrencyEntryBox:FunctionComponent<ICurrencyEntryBox> = (
  {defaultCurrency, dropdown=false, currencyValue}) => {
  return (
    <>
      <div className={currencyBox} >
        <div className={currencyHeader}>
          <span>{defaultCurrency}</span>
          { dropdown ?
            <FontAwesomeIcon icon={faAngleDown as IconProp} className={icon} name={'angle-down'}/> : null
          }
        </div>
        <div className={currencyBody}>
          <div className={currencyText}>{currencyValue}</div>
        </div>
      </div>
    </>
  );
}

export default CurrencyEntryBox;
