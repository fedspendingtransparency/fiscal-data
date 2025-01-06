import React from 'react';
import DetailPills from './detail-pills';
import { add, format } from 'date-fns';
import { render } from '@testing-library/react';

describe('Detail-Pills component', () => {
  const internalData = require('../../testData/__dataConfig_for_tests.json');
  const profilerConfigMockData = { dataJson: internalData };

  it('displays pills containing all the proper icons and labels', () => {
    const { getByTestId, getByText } = render(
      <DetailPills techSpecs={profilerConfigMockData.dataJson.datasets[0].techSpecs} dictionary={false} numTables={1} />
    );
    expect(getByTestId('calendar-week-icon')).toBeInTheDocument();
    expect(getByText('10/03/2005 — 04/09/2020')).toBeInTheDocument();

    expect(getByTestId('repeat-icon')).toBeInTheDocument();
    expect(getByText('Released Daily')).toBeInTheDocument();

    expect(getByTestId('lastUpdatedIcon')).toBeInTheDocument();
    expect(getByText('Last Updated', { exact: false })).toBeInTheDocument();
    expect(getByText('04/11/2020', { exact: false })).toBeInTheDocument();

    expect(getByTestId('numTables')).toBeInTheDocument();
    expect(getByText('1 Data Table')).toBeInTheDocument();
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

  it('shows the futureDateIcon when the latestDate is in the future', () => {
    const { getByTestId } = render(<DetailPills techSpecs={mockData.techSpecs} dictionary={false} />);
    expect(getByTestId('futureDateIcon')).toBeDefined();
  });
});
