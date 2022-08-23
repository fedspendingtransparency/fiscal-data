import {deficitBox, deficitBoxContainer, deficitBoxPercent, explainerArrow} from "../hero-image/hero-image.module.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDownLong, faUpLong} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import {numberWithCommas} from "../../../helpers/simplify-number/simplifyNumber";


export const getShortForm = (
  value: string,
  fractionDigits: number = 0,
  abbreviate: boolean = true
): string => {

  const trimmed = Math.abs(Number(value)).toFixed();
  const inTrillions = trimmed.length > 12;
  const divisor = inTrillions ? 1000000000000 : 1000000000;
  const appendix = inTrillions ? (abbreviate ? ' T' : ' trillion') :
    (abbreviate ? ' B' : ' billion');

  return Math.abs(
    (parseFloat(value) / divisor)).toFixed(fractionDigits) + appendix;
};

export const getFootNotesDateRange = (
  priorFY: string,
  currentFY: string,
  currentRecordMonth: string): string => {
  const date = new Date();
  date.setMonth(parseInt(currentRecordMonth) - 1);
  const currentMonth = date.toLocaleString('en-US', {month: 'short',});
  return (currentRecordMonth === 'Oct' ? (
    `Oct ${priorFY}`
  ) : (
    `Oct ${priorFY} - ${currentMonth} ${currentFY}`
  ));
};

export const getPillData = (
  value: number,
  percent: number,
  changeLabel: string,
  desktop: boolean,
  color: string): JSX.Element => {

  return (
    <div className={deficitBoxContainer}>
      <div className={deficitBox} style={{background:color}}>
        ${getShortForm(value.toString(), 0)}
      </div>
      {
        changeLabel === 'increased' ? (
            <div className={explainerArrow}>
              <FontAwesomeIcon icon={faUpLong} title={"up arrow"} />
            </div>
          )
          : (
            <div className={explainerArrow}>
              <FontAwesomeIcon icon={faDownLong} title={"down arrow"} />
            </div>
          )
      }
      <div className={deficitBoxPercent} style={{background:color}}>
        {percent.toFixed()}%
      </div>
    </div>
  )
};
