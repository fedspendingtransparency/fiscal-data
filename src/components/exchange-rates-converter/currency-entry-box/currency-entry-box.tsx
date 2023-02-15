import React, {FunctionComponent} from "react";
import {
  currencyBody,
  currencyBox,
  currencyHeader,
  icon
} from './currency-entry-box.module.scss';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleDown} from "@fortawesome/free-solid-svg-icons";

interface ICurrencyEntryBox  {
  defaultCurrency: string,
  dropdown ? : boolean,
}
const CurrencyEntryBox:FunctionComponent<ICurrencyEntryBox> = (
  {defaultCurrency, dropdown=false}) => {
  return (
    <>
      <div className={currencyBox} >
        <div className={currencyHeader}>
          <span>{defaultCurrency}</span>
          { dropdown ?
            <FontAwesomeIcon icon={faAngleDown} className={icon} name={'angle-down'}/> : null
          }
        </div>
        <div className={currencyBody}>

        </div>
      </div>
    </>
  );
}

export default CurrencyEntryBox;
