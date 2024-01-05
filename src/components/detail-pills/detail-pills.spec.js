import React from 'react';
import renderer from 'react-test-renderer';
import DetailPills from './detail-pills';
import { pill } from './detail-pills.module.scss';
import { add, format } from 'date-fns';

describe('Detail-Pills component', () => {
  const internalData = require('../../testData/__dataConfig_for_tests.json');
  const profilerConfigMockData = { dataJson: internalData };
  let pills;
  beforeAll(() => {
    const component = renderer.create(<DetailPills techSpecs={profilerConfigMockData.dataJson.datasets[0].techSpecs} dictionary={false} />);
    const instance = component.root;
    pills = instance.findAllByProps({ className: pill });
  });

  it('displays a date range pill containing a calendar-week icon and a MM/DD/YYYY — MM/DD/YYYY label', () => {
    pills[0].findByProps({ 'data-test-id': 'calendar-week-icon' });
    expect(pills[0].findByProps({ className: 'pillText' }).props.children).toEqual('10/03/2005 — 04/09/2020');
  });

  it('displays a pill containing a repeat icon and a Frequency label', () => {
    pills[1].findByProps({ 'data-test-id': 'repeat-icon' });
    expect(pills[1].findByProps({ className: 'pillText' }).props.children).toEqual(['Released ', 'Daily']);
  });

  it('displays a pill containing the pen icon, the text "Last Updated ", and the lastUpdated string', () => {
    pills[2].findByProps({ 'data-test-id': 'lastUpdatedIcon' });
    expect(pills[2].findByProps({ className: 'pillText' }).props.children[0]).toBe('Last Updated ');
    expect(pills[2].findByProps({ className: 'pillText' }).props.children[1]).toBe('04/11/2020');
  });
});

describe('DetailPills component with a dataset with a latestDate in the future', () => {
  const tomorrowObj = add(new Date(), { days: 1 });
  const tomorrowString = format(tomorrowObj, 'MM/dd/yyyy');
  const mockData = {
    name: 'Future Dataset',
    techSpecs: {
      latestDate: tomorrowString,
      earliestDate: '10/03/2005',
      lastUpdated: '04/11/2020',
      updateFrequency: 'Updated Daily',
    },
  };
  let pills;
  beforeAll(() => {
    const component2 = renderer.create(<DetailPills techSpecs={mockData.techSpecs} dictionary={false} />);
    const instance2 = component2.root;
    pills = instance2.findAllByProps({ className: pill });
  });

  it('shows the futureDateIcon when the latestDate is in the future', () => {
    expect(pills[0].findByProps({ 'data-test-id': 'futureDateIcon' })).toBeDefined();
  });
});
