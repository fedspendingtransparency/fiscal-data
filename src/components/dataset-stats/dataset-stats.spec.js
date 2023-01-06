import React from 'react';
import renderer from 'react-test-renderer';
import DatasetStats from './dataset-stats';
import {add, format} from "date-fns";

describe('DatasetStats', () => {
  const mockDataset = {
    techSpecs: {
      earliestDate: '12/12/2019',
      latestDate: '02/07/2020',
      lastUpdated: '12/12/19',
      updateFrequency: 'Updated Monthly'
    }
  };
  const mockDataset2 = {techSpecs: {lastUpdated: '12/12/19', updateFrequency: 'Updated Monthly'}, dictionary: true};
  const tomorrowObj = add(new Date(), {days: 1});
  const tomorrowString = format(tomorrowObj, 'MM/dd/yyyy');
  const mockDataset3 = {
    "name": "Future Dataset",
    "techSpecs": {
      "latestDate": tomorrowString,
      "earliestDate": "10/03/2005",
      "lastUpdated": "04/11/2020",
      "fileFormat": "JSON, CSV, XML",
      "updateFrequency": "Updated Daily"
    }
  };
  const tree = renderer.create(
    <DatasetStats dataset={mockDataset} />
  );
  const instance = tree.root;

  it('renders a ul element', () => {
    const ul = instance.findByType('ul');
    expect(ul).toBeDefined();
  });

  it('should contain an li that displays the date range with a calendar week icon', () => {
    const lastUpdatedLi = instance.findByProps({'data-test-id': 'dateRange-li'});
    const calendarWeekIcon = lastUpdatedLi.findByProps({'data-test-id': 'calendar-week-icon'});
    expect(lastUpdatedLi).toBeDefined();
    expect(lastUpdatedLi.children[0]).toEqual(calendarWeekIcon);
    expect(lastUpdatedLi.children[1]).toEqual('12/12/2019 - 02/07/2020');
  });

  it('should show the futureDateIcon when the latestDate is in the future', () => {
    const tree3 = renderer.create(
      <DatasetStats dataset={mockDataset3} />
    );
    const instance3 = tree3.root;
    const lastUpdatedLi = instance3.findByProps({'data-test-id': 'dateRange-li'});
    expect(lastUpdatedLi.findByProps({'data-test-id': 'futureDateIcon'})).toBeDefined();
  });

  it('should contain an li that displays the update frequency with a sync-alt icon', () => {
    const fileTypeLi = instance.findByProps({'data-testid': 'updateFrequency-li'});
    const syncAltIcon = instance.findByProps({'data-testid': 'sync-alt-icon'});
    expect(fileTypeLi.children[0]).toEqual(syncAltIcon);
    expect(fileTypeLi.children[1]).toEqual('Updated Monthly');
  });

  it('should contain an li that displays the lastUpdated date with a calendarCheck icon', () => {
    const lastUpdatedLi = instance.findByProps({'data-test-id': 'lastUpdated'});
    const calendarCheckIcon = instance.findByProps({'data-test-id': 'calendarCheckIcon'});
    expect(lastUpdatedLi.children[0]).toEqual(calendarCheckIcon);
    expect(lastUpdatedLi.children[1]).toEqual('Last Updated 12/12/19');
  });

  it('should contain an li that displays the hard-coded text "CSV, JSON, XML" with a page icon', () => {
    const fileTypeLi = instance.findByProps({'data-testid': 'fileType-li'});
    const pageIcon = instance.findByProps({'data-testid': 'page-icon'});
    expect(fileTypeLi.children[0]).toEqual(pageIcon);
    expect(fileTypeLi.children[1]).toEqual('CSV, JSON, XML');
  });

  it('should contain an li that displays the hard-coded text "Data Dictionary", and an icon depending on the presence of a data dictionary in the dataset', () => {
    const dictionaryLi = instance.findByProps({'data-testid': 'dictionary-li'});
    const dictionaryIcon = instance.findByProps({'data-testid': 'dictionary-icon'});
    expect(dictionaryLi.children[0]).toEqual(dictionaryIcon);
    expect(dictionaryLi.children[1]).toBe('Data Dictionary');
    // make new instance with the dictionary prop true
    const tree2 = renderer.create(
      <DatasetStats dataset={mockDataset2} />
    );
    const instance2 = tree2.root;
    const dictionary2Li = instance2.findByProps({'data-testid': 'dictionary-li'});
    const dictionary2Icon = instance2.findByProps({'data-testid': 'dictionary-icon'});
    expect(dictionary2Li.children[0]).toEqual(dictionary2Icon);
  });
});
