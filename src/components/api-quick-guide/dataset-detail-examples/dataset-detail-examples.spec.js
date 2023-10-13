import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';
import React from 'react';
import * as ApiQuickGuideSection from '../api-quick-guide-section';
import DatasetDetailExamples, { errorMessage } from './dataset-detail-examples';
import { selectedTable } from '../test-helpers/test-helpers';
import { act, render, waitForElementToBeRemoved } from '@testing-library/react';

jest.useFakeTimers();
describe('Dataset Detail Examples, no response', () => {
  // mock and spy on child components as an alternative to findByType
  jest.mock('../api-quick-guide-section', () => jest.fn());
  const apiGuideSpy = jest.spyOn(ApiQuickGuideSection, 'default');

  let fetchSpy;
  let rendered;
  let exampleRequest;

  beforeEach(() => {
    rendered = render(<DatasetDetailExamples isAccordionOpen={false} selectedTable={selectedTable} />);

    exampleRequest = rendered.getByTestId('exampleRequest').textContent;
    fetchSpy = jest.spyOn(global, 'fetch');
  });

  it('passes the desired title to ApiQuickGuideSection', () => {
    expect(apiGuideSpy.mock.calls[0][0].title).toBe('Example Request & Response');
  });

  it('sorts the example request by the primary date field', () => {
    expect(exampleRequest).toContain(`sort=-${selectedTable.dateField}`);
  });

  it('formats the example request by the JSON data type', () => {
    expect(exampleRequest).toContain('format=json');
  });

  it('sets the page[size] and page[number] to 1 within the example request', () => {
    expect(exampleRequest).toContain('page[size]=1');
    expect(exampleRequest).toContain('page[number]=1');
  });

  it('does not call the API until the accordion is open', () => {
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('shows the loading icon when a response is not set', () => {
    expect(rendered.getByTestId('loadingIcon')).toBeDefined();
  });
});

describe('Example Response', () => {
  enableFetchMocks();

  let rendered;
  let originalError;

  beforeAll(() => {
    originalError = console.error;
    console.error = jest.fn();
  });

  beforeEach(() => {
    rendered = render(<DatasetDetailExamples isAccordionOpen={false} selectedTable={selectedTable} />);
  });

  afterAll(() => {
    console.error = originalError;
  });

  it('displays the content of the API response', async () => {
    const exampleResponse = {
      data: [{ record_date: '2020-03-01', unstripped_amt: '123456789.00' }],
      meta: { record_date: 'DATE', unstripped_amt: 'CURRENCY' },
    };
    fetchMock.mockResponse(JSON.stringify(exampleResponse));

    rendered.rerender(<DatasetDetailExamples isAccordionOpen selectedTable={selectedTable} />);

    await waitForElementToBeRemoved(() => rendered.getByTestId('loadingIcon'));
    expect(fetchMock).toBeCalled();
    const responseEl = rendered.getByTestId('exampleResponse').textContent;

    expect(responseEl).toContain(`"record_date": "2020-03-01"`);
    expect(responseEl).toContain(`"unstripped_amt": "123456789.00"`);
    expect(responseEl).toContain(`"record_date": "DATE"`);
    expect(responseEl).toContain(`"unstripped_amt": "CURRENCY"`);
  });

  it('shows the proper message when the API call fails', async () => {
    fetchMock.mockReject();

    rendered.rerender(<DatasetDetailExamples isAccordionOpen selectedTable={{}} />);

    await waitForElementToBeRemoved(() => rendered.getByTestId('loadingIcon'));
    const responseEl = rendered.getByTestId('exampleResponse').textContent;
    expect(responseEl).toBe(errorMessage);
  });

  it('only calls the API once if multiple useEffect triggers take place simultaneously to ' + 'call the fetchAPI', async () => {
    // first open the accordion without changing the table...
    rendered.rerender(<DatasetDetailExamples isAccordionOpen selectedTable={{ endpoint: 'Ignored table' }} />);

    fetchMock.resetMocks();
    // ...then change the table several times.
    // React state management does not fire the relevant useEffect until after a rapid succession
    // of simultaneous updates like this reaches its final change
    await act(() => {
      rendered.rerender(<DatasetDetailExamples isAccordionOpen selectedTable={{ endpoint: 'Ignored table' }} />);
      rendered.rerender(<DatasetDetailExamples isAccordionOpen selectedTable={{ endpoint: 'Another ignored table' }} />);
      rendered.rerender(<DatasetDetailExamples isAccordionOpen selectedTable={{ endpoint: 'Finally a...oh wait...this table is also ignored' }} />);
      rendered.rerender(<DatasetDetailExamples isAccordionOpen selectedTable={{ endpoint: 'NOT IGNORED' }} />);
    });

    await waitForElementToBeRemoved(() => rendered.getByTestId('loadingIcon'));
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it(
    'sets API response if API call is not canceled and it has a "data" field, sets error ' +
      'response if successful response does not have "data" field',
    async () => {
      // The first call is successful AND has a data field; but, it's not current, so it is ignored.
      // The second call is successful, is current; however, it does NOT have a data field, so it
      // displays an error message.

      fetchMock
        .mockResponses([
          async () =>
            await new Promise(resolve => setTimeout(() => resolve(JSON.stringify({ data: 'This is bad data', meta: 'This is bad meta' })), 100)),
          {},
        ])
        .mockResponse(JSON.stringify({ meta: 'This is GOOD meta; but, no data object' }));

      rendered.rerender(
        <DatasetDetailExamples
          isAccordionOpen
          selectedTable={{ dummy: 'Does not match any previous tests', endpoint: 'Testing', dateField: '1900-01-01' }}
        />
      );

      rendered.rerender(<DatasetDetailExamples isAccordionOpen selectedTable={selectedTable} />);

      await waitForElementToBeRemoved(() => rendered.getByTestId('loadingIcon'));
      const responseEl = rendered.getByTestId('exampleResponse').textContent;
      expect(responseEl).toBe(errorMessage);
    }
  );

  it('prevents setting an error response if the loadCanceled is triggered before the ' + 'response returns', async () => {
    fetchMock
      .mockResponses([async () => await new Promise(res => setTimeout(() => res(new Error('invalid-json')), 100)), {}])
      .mockResponse(JSON.stringify({ data: 'This is GOOD data', meta: 'This is GOOD meta' }));

    await act(() => {
      rendered.rerender(
        <DatasetDetailExamples
          isAccordionOpen
          selectedTable={{
            dummy: 'Does not match any previous tests',
            endpoint: 'Testing',
            dateField: '1900-01-01',
          }}
        />
      );
      jest.runAllTimers();
      rendered.rerender(<DatasetDetailExamples isAccordionOpen selectedTable={selectedTable} />);
    });

    await waitForElementToBeRemoved(() => rendered.getByTestId('loadingIcon'));
    const responseEl = rendered.getByTestId('exampleResponse').textContent;
    expect(responseEl).toContain('This is GOOD data');
    expect(responseEl).toContain('This is GOOD meta');
  });
});
