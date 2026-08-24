import { deficitExplainerSecondary } from '../../national-deficit.module.scss';
import { boldWeight, fontSize_12, fontSize_16, semiBoldWeight } from '../../../../../../variables.module.scss';

export const desktopHeight = 288;
export const mobileHeight = 208;

const spendingBarColor = '#00766c';
const revenueBarColor = '#0a2f5a';
const deficitBarColor = deficitExplainerSecondary;
export const barChartColors = [revenueBarColor, deficitBarColor, spendingBarColor];

export const stackGrowthDuration = 1200;
export const spendingGrowthBegin = stackGrowthDuration;
export const spendingGrowthDuration = 800;
const labelFadeDuration = 400; // keep in sync with the .barLabel animation in the stylesheet
export const entranceComplete = spendingGrowthBegin + spendingGrowthDuration + labelFadeDuration + 250;

export const desktopConfig = {
  width: 408,
  height: desktopHeight,
  margin: { top: 0, right: 74, bottom: 0, left: 74 },
  barSize: 92,
  barGap: 38,
  labelOffsetLeft: 65,
  labelOffsetRight: 62,
  labelBaselineOffset: -5,
  labelLineHeight: 25,
  labelFontSize: fontSize_16,
  labelNameWeight: boldWeight,
};

export const mobileConfig = {
  width: 304,
  height: mobileHeight,
  margin: { top: 0, right: 65, bottom: 0, left: 65 },
  barSize: 70,
  barGap: 17,
  labelOffsetLeft: 42,
  labelOffsetRight: 40,
  labelBaselineOffset: -3,
  labelLineHeight: 15,
  labelFontSize: fontSize_12,
  labelNameWeight: semiBoldWeight,
};
