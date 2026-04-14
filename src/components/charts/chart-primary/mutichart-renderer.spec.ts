import { MultichartRenderer } from './multichart-renderer';
import { mockChartConfigs } from '../../../layouts/explainer/multichart/multichart.spec';

describe('MultichartRenderer class', () => {
  it(`sets timeouts for animation steps to cycle through each of the hoverable
  datapoints from left to right when its animateChart() method is called`, () => {
    const timeoutDelays = [];
    global.setTimeout = jest.fn((callback, delayMillis) => {
      callback();
      timeoutDelays.push(delayMillis);
    });
    const mockElem = document.createElement('div');
    const mockAnimationCallback = jest.fn();
    const multichart = new MultichartRenderer(mockChartConfigs, mockElem, 'mockMulti');

    multichart.animateChart(mockAnimationCallback);

    // timeout ms delay values based on calculating 500ms intervals starting with 1600
    // in reverse order as ordered in the animation loop
    expect(timeoutDelays).toStrictEqual([6100, 5600, 5100, 4600, 4100, 3600, 3100, 2600, 2100, 1600]);

    expect(mockAnimationCallback.mock.calls).toEqual([
      ['2021-12-31'],
      ['2020-12-31'],
      ['2019-12-31'],
      ['2018-12-31'],
      ['2017-12-31'],
      ['2016-12-31'],
      ['2015-12-31'],
      ['2014-12-31'],
      ['2013-12-31'],
      ['2012-12-31'],
    ]);
  });

  it('resets hover state on mouseOut after timeout', () => {
    jest.useFakeTimers();

    const mockElem: HTMLElement = document.createElement('div');
    const multichart = new MultichartRenderer(mockChartConfigs, mockElem, 'mockMulti');

    multichart.hoverFunction = jest.fn();
    multichart.placeMarker = jest.fn();
    multichart.connectMarkers = jest.fn();

    multichart.mouseout();

    expect(multichart.hoverFunction).not.toHaveBeenCalled();
    expect(multichart.placeMarker).not.toHaveBeenCalled();
    expect(multichart.connectMarkers).not.toHaveBeenCalled();

    jest.advanceTimersByTime(500);

    expect(multichart.hoverFunction).toHaveBeenCalledWith(null);
    expect(multichart.placeMarker).toHaveBeenCalledWith(expect.any(Object), 0);
    expect(multichart.connectMarkers).toHaveBeenCalledWith(0);
  });
});
