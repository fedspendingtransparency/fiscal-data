import React from 'react';
import DetailPills from './detail-pills';
import { add, format } from 'date-fns';
import { render, waitForElementToBeRemoved } from '@testing-library/react';
import fetchMock from 'fetch-mock';

describe('Detail-Pills component', () => {
  const internalData = require('../../testData/__dataConfig_for_tests.json');
  const profilerConfigMockData = { dataJson: internalData };

  beforeAll(() => {
    const mockEndpoint = 'https://www.transparency.treasury.gov/services/calendar/release';
    fetchMock.get(mockEndpoint, [
      { datasetId: '015-BFS-2014Q3-051', date: '2025-05-02', time: '21:00', released: 'false' },
      { datasetId: '015-BFS-2014Q3-051', date: '2025-05-01', time: '21:00', released: 'false' },
      { datasetId: '015-BFS-2014Q3-051', date: '2025-03-01', time: '21:00', released: 'true' },
      { datasetId: '015-BFS-2014Q3-052', date: '2025-05-01', time: '21:00', released: 'false' },
    ]);
  });
  // two objects with dif date times, make sure correct one has been updated
  it('displays pills containing all the proper icons and labels', () => {
    const { getByTestId, getByText } = render(
      <DetailPills
        techSpecs={profilerConfigMockData.dataJson.datasets[0].techSpecs}
        dictionary={false}
        numTables={1}
        dateExpected={'2025-04-01'}
        timeExpected={'1600'}
        config={{ datasetId: '015-BFS-2014Q3-051' }}
      />
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

    expect(getByTestId('timerIcon')).toBeInTheDocument();
    expect(getByText('New Data Expected 04/01/2025')).toBeInTheDocument();
  });

  it('does not render the Date Expected pill when the dataset has an undefined expected date', () => {
    const { queryByTestId, queryByText } = render(<DetailPills dateExpected={undefined} config={{ datasetId: '015-BFS-2014Q3-051' }} />);
    expect(queryByTestId('timerIcon')).not.toBeInTheDocument();
    expect(queryByText('New Data Expected')).not.toBeInTheDocument();
  });

  it('updates date expected pill when newer data is available', async () => {
    const { findByText, queryByText } = render(
      <DetailPills
        techSpecs={profilerConfigMockData.dataJson.datasets[0].techSpecs}
        dictionary={false}
        numTables={1}
        dateExpected={'2025-04-01'}
        timeExpected={'1600'}
        config={{ datasetId: '015-BFS-2014Q3-051' }}
      />
    );
    await waitForElementToBeRemoved(() => queryByText('New Data Expected 04/01/2025'));
    expect(await findByText('New Data Expected 05/01/2025')).toBeInTheDocument();
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
    const { getByTestId } = render(<DetailPills techSpecs={mockData.techSpecs} dictionary={false} config={{ datasetId: '015-BFS-2014Q3-051' }} />);
    expect(getByTestId('futureDateIcon')).toBeDefined();
  });
});
