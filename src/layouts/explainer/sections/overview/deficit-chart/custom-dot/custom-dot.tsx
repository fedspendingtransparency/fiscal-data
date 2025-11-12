import React, { FunctionComponent } from 'react';
import { spendingExplainerPrimary, revenueExplainerPrimary } from '../../../../../../../src/variables.module.scss';

interface ICustomDot {
  cx?: number;
  cy?: number;
  r?: number;
  payload?;
  focusedYear: string;
}
const CustomDotNoAnimation: FunctionComponent<ICustomDot> = ({ cx, cy, payload, r, focusedYear }) => {
  const color = payload?.type === 'spending' ? spendingExplainerPrimary : revenueExplainerPrimary;
  const opacity = payload?.year === focusedYear || focusedYear === null ? 1 : 0.5;
  return (
    <>
      <circle fill="white" r={r} strokeWidth={4} stroke="white" cx={cx} cy={cy} />
      <circle
        fill={color}
        r={r + 1}
        strokeWidth={2}
        stroke="transparent"
        strokeOpacity={0}
        fillOpacity={opacity}
        cx={cx}
        cy={cy}
        data-testid="customDot"
      />
    </>
  );
};

export default CustomDotNoAnimation;
