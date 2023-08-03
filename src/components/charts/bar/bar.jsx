import React, { useEffect, useState } from 'react';
import { ResponsiveBar } from "@nivo/bar";
import * as styles from './bar.module.scss';
import CustomBarComponent from './bar-component/bar-component';
import helpers from './helpers/helpers';

/**
 * Generates a bar graph based on data passed into the component.
 * @param graphData {Object[]} - Compressed array of data where each index represents a new x value
 * (index) with one or more y values (valueKeys).
 *                    Note - For help with compression, consider using the reducer function
 *                    in "../helpers/helpers".
 * @param valueKeys {String[]} - Column names of which values should be plotted (Y-Axis values).
 * @param index {String} - Column name specifying the X-Axis grouping.
 * @param axisBottom {Object} - defaulted to null, because when this property is undefined, the
 * Chart will be rendered with tick marks
 * @param axisLeft {Object} - defaulted to null, because when this property is undefined, the
 * Chart will be rendered with tick marks
 * @returns {*} - Bar graph of plotted data
 */

const BarGraph = ({
  cardId,
  graphData,
  graphIndex,
  valueKeys,
  divClass,
  colors = ['#0071bc'],
  enableGridY = false,
  enableLabel = false,
  isInteractive = true,
  axisBottom = null,
  axisLeft = null,
  setTempValue,
  setTempDate,
  dateField,
  useCustomBarComponent,
  mouseEnter,
  ...props
}) => {
  const [data, setData] = useState([]);
  const [keys, setKeys] = useState([]);
  const [index, setIndex] = useState('');
  const [isValidChart, setIsValidChart] = useState(false);
  const [activeBarIndex, setActiveBarIndex] = useState(-1);

  const checkIfValidChart = (data, keys, index) => {
    let isValid = false;
    if (data && data instanceof Array && data.length && index
      && keys && keys instanceof Array && keys.length) {
      isValid = true;
    }
    setIsValidChart(isValid);
  };

  // Used for the homepage cards
  const handleTempValueChange = (i, value) => {
    // The mouse is leaving the bar and the homepage card should show the original value
    if (!value) {
      setTempValue(null);
      setTempDate(null);
    // The bar chart has two bars combining for a net value, which is the value that should
      // be displayed
    } else if (data[i].combinedValue) {
      setTempValue(data[i].combinedValue);
      setTempDate(data[i][dateField]);
      // The mouse is entering the bar and the homepage card should show that bar's value
    } else {
      setTempValue(value);
      setTempDate(data[i][dateField]);
    }
  };

  const resetValue = () => {
    setActiveBarIndex(-1);
    handleTempValueChange(data.index, null);
  };

  useEffect(() => {
    setData(graphData);
    setKeys(valueKeys);
    setIndex(graphIndex);
    checkIfValidChart(graphData, valueKeys, graphIndex);
  }, [graphData, valueKeys, graphIndex]);

  const BarComponent = (props) => useCustomBarComponent && (
    <CustomBarComponent
      setActiveIndex={setActiveBarIndex}
      activeIndex={activeBarIndex}
      handleTempValueChange={handleTempValueChange}
      {...props}
    />
  );

  const onMouseEnter = (cardId) => {
    helpers.mouseEnterEvent(cardId);
    if (mouseEnter) {
      mouseEnter();
    }
  }

  return isValidChart && (
    <div
      data-testid="barGraph" className={divClass || styles.barDiv}
      onMouseLeave={() => helpers.mouseLeaveEvent(cardId, resetValue)}
      onMouseEnter={() => onMouseEnter(cardId)}
      role={'presentation'}
    >
      <ResponsiveBar
        data={data}
        keys={keys}
        indexBy={index}
        colors={colors}
        enableGridY={enableGridY}
        enableLabel={enableLabel}
        isInteractive={isInteractive}
        axisBottom={axisBottom}
        axisLeft={axisLeft}
        barComponent={useCustomBarComponent && BarComponent}
        {...props}
      />
    </div>
  );
};

export default BarGraph;
