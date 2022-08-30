import React, { FunctionComponent } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  iconContainer,
  iconBackground,
  iconBackdrop,
  offsetIcon,
  quoteContainer
} from "./quote-box.module.scss";

type QuoteBoxProps = {
  icon: any,
  primaryColor: string,
  secondaryColor: string
  children: any
}

const QuoteBox: FunctionComponent<QuoteBoxProps> = (
  {icon, primaryColor, secondaryColor, children}) => {
  return (
    <>
      <div className={iconContainer} data-testid="quote-box">
        <div
          className={iconBackground}
          style={{
            backgroundColor: secondaryColor
          }}
        >
          <FontAwesomeIcon icon={icon} className={iconBackdrop} />
          <FontAwesomeIcon icon={icon} className={offsetIcon} style={{color: primaryColor}} />
        </div>
      </div>
      <div
        className={quoteContainer}
        style={{
          borderColor: secondaryColor,
          boxShadow: `.25rem .25rem ${secondaryColor}`
        }}
      >
        {children}
      </div>
    </>
  );
}

export default QuoteBox;
