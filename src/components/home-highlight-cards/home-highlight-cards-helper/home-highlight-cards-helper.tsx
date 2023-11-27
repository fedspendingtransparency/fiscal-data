import React from 'react';
import simplifyNumber from '../../../helpers/simplify-number/simplifyNumber';
import { DatasetFieldDataType } from '../../../models/fdg-types';

import { negative, positive, labelContainer, labelPrefix, valueClass } from './home-highlight-cards-helper.module.scss';

export interface ColorCoding {
  primaryColor: string;
  secondaryColor: string;
}

export const formatCardValue = (
  value: number,
  prefix?: string,
  dataType: DatasetFieldDataType = 'CURRENCY', // should only be 'CURRENCY' or 'PERCENTAGE'
  colorCoding: ColorCoding = { primaryColor: '', secondaryColor: '' }
): JSX.Element => {
  const valueClassName = value < 0 ? negative : positive;
  const label = dataType && dataType.indexOf('CURRENCY') > -1 ? simplifyNumber(value, dataType) : `${Math.round(+value * 100) / 100}%`;

  return (
    <div className={labelContainer}>
      {prefix ? (
        <span className={labelPrefix} style={{ color: colorCoding.primaryColor }} data-testid="prefix">
          {prefix}
        </span>
      ) : null}
      <span className={`${valueClass} ${valueClassName}`} style={{ color: colorCoding.secondaryColor }} data-testid="label">
        {label}
      </span>
    </div>
  );
};
