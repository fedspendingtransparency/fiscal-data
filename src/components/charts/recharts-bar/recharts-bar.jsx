import React, { useEffect, useState } from 'react';
// import helpers from './helpers/helpers';
import { Bar, BarChart, Tooltip } from 'recharts';
import { barDiv } from '../bar/bar.module.scss';

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
  chartTitle,
  graphData,
  graphIndex,
  valueKeys,
  divClass,
  colors = '#0071bc',
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
  const [isValidChart, setIsValidChart] = useState(false);
  const [chartFocus, setChartFocus] = useState(false);
  const [chartHover, setChartHover] = useState(false);

  const checkIfValidChart = (data, keys, index) => {
    let isValid = false;
    if (data && data instanceof Array && data?.length && index && keys && keys instanceof Array && keys.length) {
      isValid = true;
    }
    setIsValidChart(isValid);
  };

  // Used for the homepage cards
  const handleTempValueChange = (payload, value) => {
    // The mouse is leaving the bar and the homepage card should show the original value
    if (!value) {
      setTempValue(null);
      setTempDate(null);
      // The bar chart has two bars combining for a net value, which is the value that should
      // be displayed
    } else {
      const curData = payload[0].payload;
      if (curData.combinedValue) {
        setTempValue(curData.combinedValue);
        setTempDate(curData[dateField]);
        // The mouse is entering the bar and the homepage card should show that bar's value
      } else {
        const key = payload[0].dataKey;
        setTempValue(curData[key]);
        setTempDate(curData[dateField]);
      }
    }
  };

  const resetValue = callback => {
    handleTempValueChange(null, null);
    if (callback) {
      setTimeout(() => {
        callback(false);
      }, 500);
    }
  };

  useEffect(() => {
    console.log(chartTitle, colors);
    setData(graphData);
    setKeys(valueKeys);
    checkIfValidChart(graphData, valueKeys, graphIndex);
  }, [graphData, valueKeys, graphIndex]);

  const onMouseEnter = () => {
    // helpers.mouseEnterEvent(cardId);
    setChartHover(true);
    if (mouseEnter) {
      mouseEnter();
    }
  };

  const CustomTooltip = ({ payload = [] }) => {
    if (payload.length > 0) {
      const key = payload[0].dataKey;
      const curData = payload[0].payload;
      setTempDate(curData['record_date']);
      setTempValue(curData[key]);
      handleTempValueChange(payload, !!payload);
    }
    return null;
  };

  //remove active bar when chart is not in focus
  const activeBar = chartFocus || chartHover ? { opacity: 1 } : false;

  return (
    isValidChart && (
      <div
        role="presentation"
        data-testid="barGraph"
        className={divClass || barDiv}
        onFocus={() => setChartFocus(true)}
        onMouseEnter={() => onMouseEnter(cardId)}
        onMouseLeave={() => resetValue(setChartHover)}
        onBlur={() => resetValue(setChartFocus)}
      >
        <BarChart
          margin={{
            top: 0,
            right: 2,
            bottom: 0,
            left: 2,
          }}
          style={{ width: '100%', height: '100%' }}
          responsive
          data={data}
          barCategoryGap={1}
          isAnimationActive={false}
          accessibilityLayer
          ariaLabel={`${chartTitle} bar chart`}
          stackOffset="sign"
        >
          {keys.map((key, index) => (
            <Bar
              dataKey={key}
              fill={colors[index] || '#0071bc'}
              stackId="stack"
              opacity={chartFocus || chartHover ? 0.2 : 1}
              activeBar={activeBar}
              key={index}
            />
          ))}
          <Tooltip content={<CustomTooltip />} cursor={{ opacity: 0 }} active={chartFocus || chartHover} />
        </BarChart>
      </div>
    )
  );
};

export default BarGraph;
