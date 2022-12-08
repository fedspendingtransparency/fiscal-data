import { MultichartRenderer } from './multichart-renderer';
import { mockChartConfigs } from "../../../layouts/explainer/multichart/multichart.spec"

describe('MultichartRenderer class', () => {

  it(`sets timeouts for animation steps to cycle through each of the hoverable
  datapoints from left to right when its animateChart() method is called`, () => {
    const timeoutDelays = [];
    global.setTimeout = jest.fn((callback, delayMillis) => {
      callback();
      timeoutDelays.push(delayMillis);
    });
    const mockElem =  document.createElement('div');
    const mockAnimationCallback = jest.fn();
    const multichart = new MultichartRenderer(mockChartConfigs, mockElem, "mockMulti");

    multichart.animateChart(mockAnimationCallback);

    expect(timeoutDelays).toStrictEqual([
      3100,
      2880,
      2660,
      2440,
      2220,
      2000,
      1780,
      1560,
      1340,
      1120,]);

    expect(mockAnimationCallback.mock.calls).toEqual([
      [ '2021-12-31' ],
      [ '2020-12-31' ],
      [ '2019-12-31' ],
      [ '2018-12-31' ],
      [ '2017-12-31' ],
      [ '2016-12-31' ],
      [ '2015-12-31' ],
      [ '2014-12-31' ],
      [ '2013-12-31' ],
      [ '2012-12-31' ]]);
  });
});
