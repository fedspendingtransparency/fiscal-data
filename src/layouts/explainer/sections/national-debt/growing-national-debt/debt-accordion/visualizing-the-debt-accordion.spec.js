import fetchMock from 'fetch-mock';
import { render, waitForElementToBeRemoved } from '@testing-library/react';
import { VisualizingTheDebtAccordion } from './visualizing-the-debt-accordion';
import React from 'react';
import { mockBeaGDPData } from '../../../../explainer-test-helper';

jest.mock('../../../../../../hooks/useBeaGDP', () => {
  return () => mockBeaGDPData;
});

describe('Visualing the debt accordion values', () => {
  beforeAll(() => {
    fetchMock.mockGlobal().route(`begin:https://www.transparency.treasury.gov/services/api/fiscal_service/`, {
      data: [
        {
          tot_pub_debt_out_amt: '28908004857445.12',
          record_date: '2021-12-13',
        },
      ],
    });
  });

  afterAll(() => {
    fetchMock.hardReset();
  });

  it('makes api call for debt data', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');

    const { getByText } = render(
      <>
        <VisualizingTheDebtAccordion />
      </RecoilRoot>
    );
    expect(fetchSpy).toHaveBeenCalled;
    await waitForElementToBeRemoved(() => getByText(/--/i));
    expect(await getByText('Visualizing the debt - How much is $29 trillion dollars?', { exact: false })).toBeInTheDocument();
  });
});
