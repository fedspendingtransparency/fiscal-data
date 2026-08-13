import React, { useEffect, useState } from 'react';
import helpers from './helpers/helpers';
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
    // setTempDate(curData['record_date']);
    // setTempValue(curData[key]);
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

  const resetValue = () => {
    // setActiveBarIndex(-1);
    handleTempValueChange(null, null);
  };

  useEffect(() => {
    setData(graphData);
    setKeys(valueKeys);
    setIndex(graphIndex);
    checkIfValidChart(graphData, valueKeys, graphIndex);
  }, [graphData, valueKeys, graphIndex]);

  const onMouseEnter = cardId => {
    helpers.mouseEnterEvent(cardId);
    if (mouseEnter) {
      mouseEnter();
    }
  };

  //bars too short

  const CustomTooltip = ({ payload = [] }) => {
    if (payload.length > 0) {
      console.log(payload);
      const key = payload[0].dataKey;
      console.log(payload[0].payload[key]);
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
      // <div
      //   data-testid="barGraph"
      //   className={divClass || barDiv}
      //   onMouseLeave={() => helpers.mouseLeaveEvent(cardId, resetValue)}
      //   onMouseEnter={() => onMouseEnter(cardId)}
      //   role="presentation"
      // >
      <div
        role="presentation"
        data-testid="barGraph"
        className={divClass || barDiv}
        onFocus={() => setChartFocus(true)}
        onMouseOver={() => setChartHover(true)}
        onMouseLeave={() => {
          setTimeout(() => {
            setChartHover(false);
            resetValue();
          }, 500);
        }}
        onBlur={() => {
          setTimeout(() => {
            setChartFocus(false);
            resetValue();
          }, 500);
        }}
      >
        <BarChart
          margin={{
            top: 0,
            right: 2,
            bottom: 0,
            left: 2,
          }}
          style={{ width: '100%', height: '100%', maxHeight: '226px' }}
          responsive
          data={data}
          barCategoryGap={1}
          isAnimationActive={false}
          accessibilityLayer
        >
          <Bar
            dataKey={keys[0]}
            fill="#0176c6"
            opacity={chartFocus || chartHover ? 0.2 : 1}
            activeBar={chartFocus || chartHover ? { opacity: 1 } : false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ opacity: 0 }} active={chartFocus || chartHover} />
          {/*<Tooltip*/}
          {/*  cursor={{*/}
          {/*    // stroke: '#00796B20',*/}
          {/*    width: 'calc(100% - 2px)',*/}
          {/*    // strokeWidth: 32,*/}
          {/*  }}*/}
          {/*  content={<CustomTooltip />}*/}
          {/*  isAnimationActive={false}*/}
          {/*  active={chartFocus || chartHover}*/}
          {/*/>*/}
        </BarChart>
      </div>
    )
  );
};

export default BarGraph;
