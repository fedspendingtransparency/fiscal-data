/* eslint-disable */

import React, { useState } from 'react';
import './year-range-filter.scss';

export default function YearRangeFilter(props) {
  const years = [];
  const startYear = props.startYear || 2010;
  const endYear = props.endYear || new Date().getFullYear();

  const startYearHandleChange = event => {
    const selectedYear = event.target.value;
    if (selectedYear !== props.filterStartYear) {
      if (!props.filterEndYear || props.filterEndYear < selectedYear) {
        props.changeHandler(selectedYear, selectedYear);
      } else {
        props.changeHandler(selectedYear, props.filterEndYear);
      }
    }
  };

  const endYearHandleChange = event => {
    const selectedYear = event.target.value;
    if (selectedYear !== props.filterEndYear) {
      const selectedYear = event.target.value;
      if (!props.filterStartYear || props.filterStartYear > selectedYear) {
        props.changeHandler(selectedYear, selectedYear);
      } else {
        props.changeHandler(props.filterStartYear, selectedYear);
      }
    }
  };

  for (let yr = startYear; yr <= endYear; yr++) {
    years.push(yr);
  }

  return (
    <div className="Filter FilterGroup_filter">
      <label className={'Filter_label'}>Year</label>
      <select name={'startYear'} onChange={startYearHandleChange} value={props.filterStartYear} aria-label={'Filter start year'}>
        {years.map(year => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
      -
      <select name={'endYear'} onChange={endYearHandleChange} value={props.filterEndYear} aria-label={'Filter end year'}>
        {years.map(year => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
}
