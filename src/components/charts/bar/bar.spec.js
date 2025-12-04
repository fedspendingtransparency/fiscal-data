import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import BarGraph from './bar';
import { staggeredData } from '../helpers/helpersData';
import helpers from './helpers/helpers';

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

describe('BarGraph component', () => {
  window.ResizeObserver = ResizeObserver;
  it('does not render anything if invalid params are detected', () => {
    const { queryByTestId } = render(<BarGraph />);
    expect(queryByTestId('barGraph')).toBeNull();
  });

  it('renders a bar graph if valid params are detected', () => {
    const { queryByTestId } = render(<BarGraph graphData={staggeredData} graphIndex="year" valueKeys={['value']} />);
    expect(queryByTestId('barGraph')).toBeDefined();
  });
});

describe('BarGraph component - Custom bar graph', () => {
  window.ResizeObserver = ResizeObserver;
  const mouseEnterPropSpy = jest.fn();

  const barGraph = (
    <BarGraph
      graphData={staggeredData}
      graphIndex="year"
      valueKeys={['value']}
      useCustomBarComponent
      mouseEnter={mouseEnterPropSpy}
    />
  );
  const mouseEnterSpy = jest.spyOn(helpers, 'mouseEnterEvent');
  const mouseLeaveSpy = jest.spyOn(helpers, 'mouseLeaveEvent');

  it('triggers mouseEnter and mouseLeave events', () => {
    jest.clearAllMocks();
    const { getByTestId } = render(barGraph);
    const container = getByTestId('barGraph');
    fireEvent.mouseEnter(container);
    expect(mouseEnterSpy).toHaveBeenCalledTimes(1);
    expect(mouseEnterPropSpy).toHaveBeenCalled();
    fireEvent.mouseLeave(container);
    expect(mouseLeaveSpy).toHaveBeenCalledTimes(1);
  });
});
