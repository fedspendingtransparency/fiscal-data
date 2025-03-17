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

  it('renders a ul element', async () => {
    const { getByTestId } = render(<DatasetStats dataset={mockDataset} />);
    const ulElement = await getByTestId('dataset-ul');
    expect(ulElement).toBeInTheDocument();
  });

  it('should contain an li that displays the date range with a calendar week icon', async () => {
    const { getByTestId, getByText } = render(<DatasetStats dataset={mockDataset} />);
    const lastUpdatedLi = await getByTestId('dateRange-li');
    expect(lastUpdatedLi).toBeInTheDocument();
    const calendarWeekIcon = getByTestId('calendar-week-icon');
    expect(calendarWeekIcon).toBeInTheDocument();
    const dateRangeText = await getByText('12/12/2019 - 02/07/2020');
    expect(dateRangeText).toBeInTheDocument();
  });

  it('should show the futureDateIcon when the latestDate is in the future', async () => {
    const { getByTestId } = render(<DatasetStats dataset={mockDataset3} />);
    const lastUpdatedLi = await getByTestId('dateRange-li');
    expect(lastUpdatedLi).toBeInTheDocument();
    const futureDateIcon = getByTestId('futureDateIcon');
    expect(futureDateIcon).toBeInTheDocument();
  });

  it('should contain an li that displays the update frequency with a sync-alt icon', async () => {
    const { getByTestId } = render(<DatasetStats dataset={mockDataset} />);
    const fileTypeLi = await getByTestId('updateFrequency-li');
    expect(fileTypeLi).toBeInTheDocument();
    const syncAltIcon = await getByTestId('sync-alt-icon');
    expect(syncAltIcon).toBeInTheDocument();
  });

  it('should contain an li that displays the lastUpdated date with a calendarCheck icon', async () => {
    const { getByTestId, getByText } = render(<DatasetStats dataset={mockDataset} />);
    const lastUpdatedLi = await getByTestId('lastUpdated');
    expect(lastUpdatedLi).toBeInTheDocument();
    const calendarCheckIcon = await getByTestId('calendarCheckIcon');
    expect(calendarCheckIcon).toBeInTheDocument();
    const lastUpdatedText = await getByText('Last Updated 12/12/19');
    expect(lastUpdatedText).toBeInTheDocument();
  });

  it('should contain an li that displays the hard-coded text "CSV, JSON, XML" with a page icon', async () => {
    const { getByTestId, getByText } = render(<DatasetStats dataset={mockDataset} />);
    const fileTypeLi = await getByTestId('fileType-li');
    expect(fileTypeLi).toBeInTheDocument();
    const pageIcon = await getByTestId('page-icon');
    expect(pageIcon).toBeInTheDocument();
    const downloadText = await getByText('CSV, JSON, XML');
    expect(downloadText).toBeInTheDocument();
  });

  it('should contain an li that displays the hard-coded text "Data Dictionary", and an icon depending on the presence of a data dictionary in the dataset', async () => {
    const { getByTestId, getByText } = render(<DatasetStats dataset={mockDataset2} />);
    const dictionaryLi = await getByTestId('dictionary-li');
    expect(dictionaryLi).toBeInTheDocument();
    const dictionaryIcon = await getByTestId('dictionary-icon');
    expect(dictionaryIcon).toBeInTheDocument();
    const dictionaryText = await getByText('Data Dictionary');
    expect(dictionaryText).toBeInTheDocument();
  });

  // it('should contain an li that displays the hard-coded text "Data Dictionary", and an icon depending on the presence of a data dictionary in the dataset', () => {
  //   const dictionaryLi = instance.findByProps({ 'data-testid': 'dictionary-li' });
  //   const dictionaryIcon = instance.findByProps({ 'data-testid': 'dictionary-icon' });
  //   expect(dictionaryLi.children[0]).toEqual(dictionaryIcon);
  //   expect(dictionaryLi.children[1]).toBe('Data Dictionary');
  //   // make new instance with the dictionary prop true
  //   const tree2 = renderer.create(<DatasetStats dataset={mockDataset2} />);
  //   const instance2 = tree2.root;
  //   const dictionary2Li = instance2.findByProps({ 'data-testid': 'dictionary-li' });
  //   const dictionary2Icon = instance2.findByProps({ 'data-testid': 'dictionary-icon' });
  //   expect(dictionary2Li.children[0]).toEqual(dictionary2Icon);
  // });
});
