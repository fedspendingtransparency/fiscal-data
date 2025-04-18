import React from 'react';
import { fireEvent, render, within } from '@testing-library/react';
import GenerativeReportsSection from './generative-reports-section';
import { mockApiConfig } from './generative-report-section-test-helper';
import fetchMock from 'fetch-mock';

describe('Generative Report Footer', () => {
  window.HTMLElement.prototype.scrollIntoView = jest.fn();

  jest.useFakeTimers();
  beforeEach(() => {
    const mockEndpointBase = 'https://www.transparency.treasury.gov/services/api/fiscal_service/';
    fetchMock.get(
      mockEndpointBase + 'v1/table1/mockendpoint?filter=eff_date:gte:2024-07-01,eff_date:lte:2024-07-31,acct_desc:eq:option1&sort=-eff_date,memo_nbr',
      { data: [{ eff_date: '1/3/2024' }] }
    );
    fetchMock.get(
      mockEndpointBase + 'v1/table1/mockendpoint?filter=eff_date:gte:2024-07-01,eff_date:lte:2024-07-31,acct_desc:eq:option2&sort=-eff_date,memo_nbr',
      { data: [{ eff_date: '1/3/2024' }] }
    );
    fetchMock.get(
      mockEndpointBase + 'v1/table2/mockendpoint?filter=eff_date:gte:2024-07-01,eff_date:lte:2024-07-31,acct_desc:eq:option1&sort=-eff_date,memo_nbr',
      { data: [] }
    );
    fetchMock.get(
      mockEndpointBase + 'v1/table2/mockendpoint?filter=eff_date:gte:2024-07-01,eff_date:lte:2024-07-31,acct_desc:eq:option2&sort=-eff_date,memo_nbr',
      { data: [] }
    );
  });

  afterEach(() => {
    fetchMock.restore();
  });

  it('renders empty table with default banner messaging', async () => {
    const { getByRole, getByText } = render(<GenerativeReportsSection apisProp={mockApiConfig} />);

    expect(getByRole('table')).toBeInTheDocument();
    expect(getByText('This table requires additional filters')).toBeInTheDocument();
    expect(getByText('Select an account in the filter section above to display the reports.'));
  });

  it('renders a published date filter', () => {
    const { getByRole, queryByRole } = render(<GenerativeReportsSection apisProp={mockApiConfig} />);
    const publishedDateFilter = getByRole('button', { name: 'Select Published Report Date' });
    //defaults to latest date
    expect(within(publishedDateFilter).getByText('July 2024'));
    fireEvent.click(publishedDateFilter);
    expect(getByRole('button', { name: 'July' })).toBeInTheDocument();
    const yearsButton = getByRole('button', { name: 'Toggle Year Dropdown' });

    fireEvent.click(yearsButton);
    //available dates span the date range for the dataset
    expect(getByRole('button', { name: '2024' })).toBeInTheDocument();
    expect(getByRole('button', { name: '2012' })).toBeInTheDocument();
    expect(getByRole('button', { name: '2003' })).toBeInTheDocument();
    expect(queryByRole('button', { name: '2002' })).not.toBeInTheDocument();
  });

  it('renders an account filter', () => {
    const { getByRole, getByText } = render(<GenerativeReportsSection apisProp={mockApiConfig} />);
    const accountFilter = getByRole('button', { name: 'Account: (None selected)' });
    fireEvent.click(accountFilter);
    // filter section headers are available within the dropdown
    expect(getByText('Federal')).toBeInTheDocument();
    expect(getByText('State')).toBeInTheDocument();
    //filter buttons are available within the dropdown
    expect(getByRole('button', { name: 'option1' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'option6' })).toBeInTheDocument();
  });

  it('renders download buttons for any reports matching the selected filters', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');

    const { getByRole, findByRole } = render(<GenerativeReportsSection apisProp={mockApiConfig} />);
    const accountFilter = getByRole('button', { name: 'Account: (None selected)' });
    fireEvent.click(accountFilter);
    const accountOption = getByRole('button', { name: 'option2' });
    fireEvent.click(accountOption);
    expect(fetchSpy).toHaveBeenCalled();
    const downloadLink = await findByRole('link');
    expect(downloadLink).toBeInTheDocument();
    expect(within(downloadLink).getByText('Table 1 - opt')).toBeInTheDocument(); // file name is split between two elements
    expect(within(downloadLink).getByText('ion2.pdf')).toBeInTheDocument();
    expect(within(downloadLink).getByText('July 2024')).toBeInTheDocument();
  });

  it('renders the error message when an api error is encountered', async () => {
    fetchMock.restore();
    const mockEndpointBase = 'https://www.transparency.treasury.gov/services/api/fiscal_service/';
    fetchMock.get(
      mockEndpointBase + 'v1/table1/mockendpoint?filter=eff_date:gte:2024-07-01,eff_date:lte:2024-07-31,acct_desc:eq:option1&sort=-eff_date,memo_nbr',
      { throws: new Error('api error') }
    );
    const { getByRole, getByText } = render(<GenerativeReportsSection apisProp={mockApiConfig} />);
    fireEvent.click(getByRole('button', { name: 'Account: (None selected)' }));
    fireEvent.click(getByRole('button', { name: 'option2' }));
    expect(await getByText('Table failed to load.')).toBeInTheDocument();
  });
});
