import React from 'react';
import {
  corpRectTooltip,
  customsRectTooltip,
  estateRectTooltip,
  exciseRectTooltip,
  indvRectTooltip,
  miscRectTooltip,
  socialSecRectTooltip,
  tooltipColumn,
  tooltipContainer,
  tooltipItem,
  tooltipItemCategory,
  tooltipItemText,
  tooltipYearHeader,
} from '../revenue-trends-line-chart.module.scss';

const CustomTooltip = (currentSlice, totalRevByYear) => {
  const { slice } = currentSlice;
  const getPercentofTotalRevByYear = (value, year) => {
    const match = totalRevByYear.find(element => element.year === year.toString());
    const percent = (value / match.value) * 100;
    if (percent < 0.5) {
      return '<1';
    } else {
      return Math.round((value / match.value) * 100);
    }
  };

  const determineIfZeroNeeded = value => {
    if (value.toString().split('.')[1].length < 2) {
      return `${value}0`;
    }
    return value;
  };

  return (
    <div className={tooltipContainer}>
      <p className={tooltipYearHeader}>{slice.points[0].data.x}</p>
      <div className={tooltipColumn}>
        <div className={tooltipItem}>
          <div className={estateRectTooltip} />
          <div className={tooltipItemText}>
            <div className={tooltipItemCategory}> {slice.points[0].seriesId}: </div>${determineIfZeroNeeded(slice.points[0].data.y)}T (
            {getPercentofTotalRevByYear(slice.points[0].data.raw, slice.points[0].data.x)}%)
          </div>
        </div>
        <div className={tooltipItem}>
          <div className={customsRectTooltip} />
          <div className={tooltipItemText}>
            <div className={tooltipItemCategory}> {slice.points[1].seriesId}: </div>${determineIfZeroNeeded(slice.points[1].data.y)}T (
            {getPercentofTotalRevByYear(slice.points[1].data.raw, slice.points[1].data.x)}%)
          </div>
        </div>
        <div className={tooltipItem}>
          <div className={exciseRectTooltip} />
          <div className={tooltipItemText}>
            <div className={tooltipItemCategory}> {slice.points[2].seriesId}: </div>${determineIfZeroNeeded(slice.points[2].data.y)}T (
            {getPercentofTotalRevByYear(slice.points[2].data.raw, slice.points[2].data.x)}%)
          </div>
        </div>
        <div className={tooltipItem}>
          <div className={miscRectTooltip} />
          <div className={tooltipItemText}>
            <div className={tooltipItemCategory}> {slice.points[3].seriesId}: </div>${determineIfZeroNeeded(slice.points[3].data.y)}T (
            {getPercentofTotalRevByYear(slice.points[3].data.raw, slice.points[3].data.x)}%)
          </div>
        </div>
        <div className={tooltipItem}>
          <div className={corpRectTooltip} />
          <div className={tooltipItemText}>
            <div className={tooltipItemCategory}> {slice.points[4].seriesId}: </div>${determineIfZeroNeeded(slice.points[4].data.y)}T (
            {getPercentofTotalRevByYear(slice.points[4].data.raw, slice.points[4].data.x)}%)
          </div>
        </div>
        <div className={tooltipItem}>
          <div className={socialSecRectTooltip} />
          <div className={tooltipItemText}>
            <div className={tooltipItemCategory}> {slice.points[5].seriesId}: </div>${determineIfZeroNeeded(slice.points[5].data.y)}T (
            {getPercentofTotalRevByYear(slice.points[5].data.raw, slice.points[5].data.x)}%)
          </div>
        </div>
        <div className={tooltipItem}>
          <div className={indvRectTooltip} />
          <div className={tooltipItemText}>
            <div className={tooltipItemCategory}> {slice.points[6].seriesId}: </div>${determineIfZeroNeeded(slice.points[6].data.y.toFixed(2))}T (
            {getPercentofTotalRevByYear(slice.points[6].data.raw, slice.points[6].data.x)}%)
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomTooltip;
