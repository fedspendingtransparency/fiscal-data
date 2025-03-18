import React from 'react';
import DatasetStats from './dataset-stats';
import { add, format } from 'date-fns';
import { render, within } from '@testing-library/react';

describe('DatasetStats', () => {
  const mockDataset = {
    techSpecs: {
      earliestDate: '12/12/2019',
      latestDate: '02/07/2020',
      lastUpdated: '12/12/19',
      updateFrequency: 'Updated Monthly',
    },
  };
  const mockDataset2 = { techSpecs: { lastUpdated: '12/12/19', updateFrequency: 'Updated Monthly' }, dictionary: true };
  const tomorrowObj = add(new Date(), { days: 1 });
  const tomorrowString = format(tomorrowObj, 'MM/dd/yyyy');
  const mockDataset3 = {
    name: 'Future Dataset',
    techSpecs: {
      latestDate: tomorrowString,
      earliestDate: '10/03/2005',
      lastUpdated: '04/11/2020',
      fileFormat: 'JSON, CSV, XML',
      updateFrequency: 'Updated Daily',
    },
  };

  it('renders a ul element', () => {
    const { getByRole } = render(<DatasetStats dataset={mockDataset} />);
    const ulElement = getByRole('list');
    expect(ulElement).toBeInTheDocument();
  });

  it('should contain an li that displays the date range with a calendar week icon', () => {
    const { getByRole } = render(<DatasetStats dataset={mockDataset} />);
    const dateRangeLi = getByRole('listitem', { name: 'Date Range: 12/12/2019 - 02/07/2020' });
    const calendarWeekIcon = within(dateRangeLi).getByTestId('calendar-week-icon');
    const dateRangeText = within(dateRangeLi).getByText('12/12/2019 - 02/07/2020');
    expect(calendarWeekIcon).toBeInTheDocument();
    expect(dateRangeText).toBeInTheDocument();
  });

  it('should contain an li that displays the futureDateIcon when the latestDate is in the future', () => {
    const { getByRole } = render(<DatasetStats dataset={mockDataset3} />);
    const lastUpdatedLi = getByRole('listitem', { name: 'Date Range: 10/03/2005 - ' + tomorrowString });
    const futureDateIcon = within(lastUpdatedLi).getByTestId('futureDateIcon');
    expect(futureDateIcon).toBeInTheDocument();
  });

  it('should contain an li that displays the update frequency with a sync-alt icon', () => {
    const { getByRole } = render(<DatasetStats dataset={mockDataset} />);
    const frequencyLi = getByRole('listitem', { name: 'Updated Monthly' });
    const syncAltIcon = within(frequencyLi).getByTestId('sync-alt-icon');
    const lastUpdatedText = within(frequencyLi).getByText('Updated Monthly');
    expect(syncAltIcon).toBeInTheDocument();
    expect(lastUpdatedText).toBeInTheDocument();
  });

  it('should contain an li that displays the lastUpdated date with a calendarCheck icon', () => {
    const { getByRole } = render(<DatasetStats dataset={mockDataset} />);
    const lastUpdatedLi = getByRole('listitem', { name: 'Last Updated: 12/12/19' });
    const calendarCheckIcon = within(lastUpdatedLi).getByTestId('calendarCheckIcon');
    const lastUpdatedText = within(lastUpdatedLi).getByText('Last Updated 12/12/19');
    expect(calendarCheckIcon).toBeInTheDocument();
    expect(lastUpdatedText).toBeInTheDocument();
  });

  it('should contain an li that displays the hard-coded text "CSV, JSON, XML" with a page icon', () => {
    const { getByRole } = render(<DatasetStats dataset={mockDataset} />);
    const fileTypeLi = getByRole('listitem', { name: 'CSV, JSON, XML' });
    const pageIcon = within(fileTypeLi).getByTestId('page-icon');
    const downloadText = within(fileTypeLi).getByText('CSV, JSON, XML');
    expect(pageIcon).toBeInTheDocument();
    expect(downloadText).toBeInTheDocument();
  });

  it('should contain an li that displays the hard-coded text "Data Dictionary", and an icon for a data dictionary in the dataset', () => {
    const { getByRole } = render(<DatasetStats dataset={mockDataset2} />);
    const dictionaryLi1 = getByRole('listitem', { name: 'data dictionary complete' });
    const dictionaryIcon1 = within(dictionaryLi1).getByTestId('dictionary-icon');
    const dictionaryText1 = within(dictionaryLi1).getByText('Data Dictionary');
    expect(dictionaryIcon1).toBeInTheDocument();
    expect(dictionaryText1).toBeInTheDocument();
  });

  it('should contain an li that displays the hard-coded text "Data Dictionary", and an icon for a data dictionary not in the dataset', () => {
    const { getByRole } = render(<DatasetStats dataset={mockDataset} />);
    const dictionaryLi2 = getByRole('listitem', { name: 'data dictionary incomplete' });
    const dictionaryIcon2 = within(dictionaryLi2).getByTestId('dictionary-icon');
    const dictionaryText2 = within(dictionaryLi2).getByText('Data Dictionary');
    expect(dictionaryIcon2).toBeInTheDocument();
    expect(dictionaryText2).toBeInTheDocument();
  });
});
