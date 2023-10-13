import React from 'react';
import renderer from 'react-test-renderer';
import YearRangeFilter from '../data-preview/year-range-filter/year-range-filter';

let component;
let instance;
let startYear;
let endYear;
let startYearOpts;
let endYearOpts;
let outboundStartYear;
let outboundEndYear;

const mockChangeHandler = (startYear, endYear) => {
  outboundStartYear = startYear;
  outboundEndYear = endYear;
  return { startYear, endYear };
};

beforeEach(() => {
  component = renderer.create();
  renderer.act(() => {
    component = renderer.create(
      <YearRangeFilter startYear={2011} endYear={2020} changeHandler={mockChangeHandler} filterStartYear={2015} filterEndYear={2016} />
    );
  });
  instance = component.root;
  [startYear, endYear] = instance.findAllByType('select');
  startYearOpts = startYear.findAllByType('option');
  endYearOpts = endYear.findAllByType('option');
});
describe('YearRangeFilter', () => {
  it('contains to and from selectable year options for all years within range passed in', () => {
    expect(startYearOpts.length).toBe(10);
    expect(startYearOpts[5].props.value).toBe(2016);
    expect(endYearOpts.length).toBe(10);
    expect(startYearOpts[5].props.value).toBe(2016);
  });

  it('selects correct initial values based on incoming props', () => {
    expect(startYear.props.value).toBe(2015);
    expect(endYear.props.value).toBe(2016);
  });

  it('hands the correct values to its changeHandler when user updates start year', () => {
    renderer.act(() => {
      startYear.props.onChange({
        target: { value: 2014 },
      });
    });
    expect(outboundStartYear).toBe(2014);
    expect(outboundEndYear).toBe(2016);
  });

  it('hands the correct values to its changeHandler when user updates end year', () => {
    renderer.act(() => {
      return endYear.props.onChange({
        target: { value: 2017 },
      });
    });
    expect(outboundStartYear).toBe(2015);
    expect(outboundEndYear).toBe(2017);
  });

  it('if start-year selected is greater than end year, end-year will update to same value as start-year', () => {
    renderer.act(() => {
      return startYear.props.onChange({
        target: { value: 2019 },
      });
    });
    expect(outboundStartYear).toBe(2019);
    expect(outboundEndYear).toBe(2019);
  });

  it('if end-year selected is less than end year, start-year will update to same value as end-year', () => {
    renderer.act(() =>
      endYear.props.onChange({
        target: { value: 2013 },
      })
    );
    expect(outboundStartYear).toBe(2013);
    expect(outboundEndYear).toBe(2013);
  });
});
