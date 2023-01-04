import React from 'react';
import {render, fireEvent} from '@testing-library/react';
import renderer from 'react-test-renderer';
import BarGraph from './bar';
import {staggeredData} from '../helpers/helpersData';
import {ResponsiveBar} from "@nivo/bar";
import helpers from './helpers/helpers';

describe('BarGraph component', () => {

  it('does not render anything if invalid params are detected', () => {
    const {queryByTestId} = render(<BarGraph />);
    expect(queryByTestId('barGraph')).toBeNull();
  });

  it('renders a bar graph if valid params are detected', () => {
    const {queryByTestId} = render(<BarGraph graphData={staggeredData} graphIndex='year' valueKeys={['value']} />);
    expect(queryByTestId('barGraph')).toBeDefined();
  });

  it('sets left and bottom axis attributes each to null by default to prevent unwanted tick marks along the axes', async () => {
    let component = renderer.create();
    let instance = null;
    await renderer.act(async () => {
      component = await renderer.create(
        <BarGraph graphData={staggeredData} graphIndex='year' valueKeys={['value']} />);
      instance = component.root;
    });

    const barGraphCanvas = instance.findByType(ResponsiveBar);
    expect(barGraphCanvas.props.axisLeft).toBeNull();
    expect(barGraphCanvas.props.axisBottom).toBeNull();
  });
});

describe('BarGraph component - Custom bar graph', () => {
  const barGraph = <BarGraph graphData={staggeredData} graphIndex='year' valueKeys={['value']} useCustomBarComponent />;
  const mouseEnterSpy = jest.spyOn(helpers, 'mouseEnterEvent');
  const mouseLeaveSpy = jest.spyOn(helpers, 'mouseLeaveEvent');

  it('creates a customBarGraph', () => {
    let component = renderer.create();
    renderer.act(() => {
      component = renderer.create(barGraph);
    });
    const instance = component.root;
    const responsiveBar = instance.findByType(ResponsiveBar);
    expect(responsiveBar.props.barComponent).toBeDefined();
  });

  it('triggers mouseEnter and mouseLeave events', () => {
    jest.clearAllMocks();
    const {getByTestId} = render(barGraph);
    const container = getByTestId('barGraph');
    fireEvent.mouseEnter(container);
    expect(mouseEnterSpy).toHaveBeenCalledTimes(1);

    fireEvent.mouseLeave(container);
    expect(mouseLeaveSpy).toHaveBeenCalledTimes(1);
  });

});
