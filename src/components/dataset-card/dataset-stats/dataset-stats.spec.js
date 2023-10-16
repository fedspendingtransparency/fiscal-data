import React from 'react';
import DatasetStats from './dataset-stats';
import { add, format } from 'date-fns';
import { render } from '@testing-library/react';

describe('DatasetStats', () => {
  const mockDataset = {
    techSpecs: {
      earliestDate: '12/12/2019',
      latestDate: '02/07/2020',
      lastUpdated: '12/12/19',
      updateFrequency: 'Updated Monthly',
    },
    apis: [1, 2, 3, 4, 5],
  };
  const tomorrowObj = add(new Date(), { days: 1 });
  const tomorrowString = format(tomorrowObj, 'MM/dd/yyyy');
  const mockDataset2 = {
    name: 'Future Dataset',
    techSpecs: {
      latestDate: tomorrowString,
      earliestDate: '10/03/2005',
      lastUpdated: '04/11/2020',
      fileFormat: 'JSON, CSV, XML',
      updateFrequency: 'Updated Daily',
    },
    apis: [1, 2, 3, 4, 5],
  };

  it('should contain an li that displays the date range with a calendar week icon', () => {
    const instance = render(<DatasetStats dataset={mockDataset} />);
    const lastUpdatedLi = instance.getByTestId('dateRange-li');
    const calendarWeekIcon = instance.getByTestId('calendar-week-icon');
    expect(lastUpdatedLi).toBeDefined();
    expect(calendarWeekIcon).toBeDefined();
    expect(instance.getByText('12/12/2019 - 02/07/2020')).toBeInTheDocument();
  });

  it('should show the futureDateIcon when the latestDate is in the future', () => {
    const instance = render(<DatasetStats dataset={mockDataset2} />);
    const lastUpdatedLi = instance.getByTestId('futureDateIcon');
    expect(lastUpdatedLi).toBeDefined();
  });

  it('should contain an li that displays the update frequency with a sync-alt icon', () => {
    const instance = render(<DatasetStats dataset={mockDataset} />);
    const fileTypeLi = instance.getByTestId('updateFrequency-li');
    const repeatIcon = instance.getByTestId('repeat-icon');
    expect(fileTypeLi).toBeDefined();
    expect(repeatIcon).toBeDefined();
    expect(instance.getByText('Updated Monthly')).toBeInTheDocument();
  });

  it('should contain an li that displays the lastUpdated date with a calendarCheck icon', () => {
    const instance = render(<DatasetStats dataset={mockDataset} />);
    const lastUpdatedLi = instance.getByTestId('lastUpdated');
    const penIcon = instance.getByTestId('pen-icon');
    expect(lastUpdatedLi).toBeDefined();
    expect(penIcon).toBeDefined();
    expect(instance.getByText('12/12/19')).toBeInTheDocument();
  });

  it('should contain an li that displays the number of tables with a database icon', () => {
    const instance = render(<DatasetStats dataset={mockDataset} />);
    const numTables = instance.getByTestId('numTables-li');
    const databaseIcon = instance.getByTestId('database-icon');
    expect(numTables).toBeDefined();
    expect(databaseIcon).toBeDefined();
    expect(instance.getByText('5 Data Tables')).toBeInTheDocument();
  });
});
