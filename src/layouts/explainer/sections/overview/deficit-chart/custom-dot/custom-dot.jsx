import React from 'react';
import { spendingExplainerPrimary } from '../../../federal-spending/federal-spending.module.scss';
import { revenueExplainerPrimary } from '../../../government-revenue/revenue.module.scss';

const CustomDotNoAnimation = ({ cx, cy, payload, r }) => {
  const color = payload?.type === 'spending' ? spendingExplainerPrimary : revenueExplainerPrimary;

  return (
    <>
      <circle fill="white" r={r} strokeWidth={4} stroke="white" fillOpacity={1} cx={cx} cy={cy} />
      <circle fill={color} r={r} strokeWidth={2} stroke={color} fillOpacity={1} cx={cx} cy={cy} data-testid="customDot" />
    </>
  );
};

export default CustomDotNoAnimation;
