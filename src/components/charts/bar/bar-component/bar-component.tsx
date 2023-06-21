import React, { FunctionComponent } from 'react';
import { bar } from './bar-component.module.scss';

type CustomBarComponentBarDataProps = {
  index: number,
  value: number
}
type CustomBarComponentBarProps = {
  x: string,
  y: string,
  width: string,
  height: string,
  color: string,
  data: CustomBarComponentBarDataProps
}
type CustomBarComponentProps = {
  bar: CustomBarComponentBarProps,
  activeIndex: number,
  setActiveIndex: (index: number) => void,
  handleTempValueChange: (index: number, value: number) => void
}

/**
 *
 * @param bar {Object} - contains the coordinates and data for the given bar
 *        Note: all the values in the bar object are provided by Nivo
 * @param activeIndex {Number} - the index of the bar that is being hovered over
 * @param setActiveIndex {Function} - sets the index of the bar when it is hovered over
 * @param setTempValue {Number} - temporarily sets the main homepage card value to that of the hovered bar
 * @returns {*} - returns an SVG rectangle element to be used in the reusable bar graph component
 */
const CustomBarComponent: FunctionComponent<CustomBarComponentProps> = ({
  bar: {
    x,
    y,
    width,
    height,
    color,
    data
  },
  activeIndex,
  setActiveIndex,
  handleTempValueChange
}) => {
  const setValue: () => void = () => {
    setActiveIndex(data.index);
    handleTempValueChange(data.index, data.value);
  };

  // The active index represents the bar that is being hovered over
  // If no bar is being hovered over, all bars should be in the "active" state
  const isActive: boolean = activeIndex === data.index || activeIndex === -1;

  return (
    <g
      transform={`translate(${x},${y})`}
      onClick={setValue}
      onMouseEnter={setValue}
      className={bar}
      data-testid="container"
      role="presentation"
    >
      <rect
        width={width}
        height={height}
        fill={color}
        opacity={isActive ? 1 : .25}
        data-testid="rect"
      />
    </g>
  )
}

export default CustomBarComponent;
