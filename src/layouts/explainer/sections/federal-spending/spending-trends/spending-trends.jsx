import React from "react";
import {
  spendingTrends,
  comingSoon,
  rectangle
} from "./spending-trends.scss"

export const SpendingTrends = () => {
  return (
    <div className={rectangle}>
      <p className={comingSoon}>Coming Soon</p>
    </div>
  );
}

