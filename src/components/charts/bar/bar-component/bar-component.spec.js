import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import CustomBarComponent from './bar-component';

describe('Custom Bar Component', () => {
  const x = '0';
  const y = '0';
  const width = '5';
  const height = '10';
  const color = '#0071bc';

  const index = 1;
  const value = 100;

  const data = {
    index,
    value
  }

  const bar = {
    x,
    y,
    width,
    height,
    color,
    data
  }

  const setActiveIndex = jest.fn();
  const handleTempValueChange = jest.fn();

  let BarComponent;

  beforeEach(() => {
    BarComponent = (
      <svg>
        <CustomBarComponent
          bar={bar}
          activeIndex={0}
          setActiveIndex={setActiveIndex}
          handleTempValueChange={handleTempValueChange}
        />
      </svg>
    );
  })

  it('renders a <rect> inside a <g> with the proper dimensions', () => {
    BarComponent = (
      <svg>
        <CustomBarComponent
          bar={bar}
          activeIndex={-1}
          setActiveIndex={setActiveIndex}
          handleTempValueChange={handleTempValueChange}
        />
      </svg>
    );
    const { getByTestId } = render(BarComponent);

    const container = getByTestId('container');
    const rect = getByTestId('rect');

    expect(container).toHaveAttribute('transform', `translate(${x},${y})`);
    expect(rect).toHaveAttribute('width', width);
    expect(rect).toHaveAttribute('height', height);
    expect(rect).toHaveAttribute('fill', color);
    expect(rect).toHaveAttribute('opacity', '1');
  });

  it('renders the <rect> with .25 opacity when not active', () => {
    const { getByTestId } = render(BarComponent);
    expect(getByTestId('rect')).toHaveAttribute('opacity', '0.25');
  });

  it('sets the value when clicked', () => {
    const { getByTestId } = render(BarComponent);
    const container = getByTestId('container');

    fireEvent.click(container);

    expect(setActiveIndex).toHaveBeenCalledWith(index);
    expect(handleTempValueChange).toHaveBeenCalledWith(index, value);
  });
});
