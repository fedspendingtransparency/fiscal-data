/* istanbul ignore file */

/* ^^ File is ignored for coverage report since this exists purely as a helper to
 * spec files and should not have unit tests written against it */

import { sub, format, parseISO } from 'date-fns';

export const todayForTests = parseISO(format(new Date(), 'yyyy-MM-dd'));
export const testVariables = {
  dateFormats: {
    isoDate: 'yyyy-MM-dd',
    displayFormat: 'MM/dd/yyyy',
  },
  dates: {
    withinNinetyDays: sub(todayForTests, { days: 87 }),
    withinNinetyDays_Updated: sub(todayForTests, { days: 86 }),
    outsideNinetyDays: sub(todayForTests, { days: 150 }),
    outsideNinetyDays_Updated: sub(todayForTests, { days: 149 }),
    withinSixtyDays: sub(todayForTests, { days: 55 }),
    withinSixtyDays_Updated: sub(todayForTests, { days: 54 }),
    withinThirtyDays: sub(todayForTests, { days: 25 }),
    withinThirtyDays_Updated: sub(todayForTests, { days: 24 }),
  },
};

/**
 * Mocks fetch to return a given output
 * @param jest - Jest reference in spec file
 * @param jsonResponse - Desired output from mocked fetch call
 */
export const setGlobalFetchResponse = (
  jest: { fn: (unknown) => unknown },
  jsonResponse: Record<string, unknown> | [Record<string, unknown>]
): void => {
  global.fetch = jest.fn(() => {
    return Promise.resolve({
      ok: true,
      ready: true,
      json: () => {
        return Promise.resolve(jsonResponse);
      },
    });
  }) as (input: RequestInfo, init?: RequestInit) => Promise<Response>;
};

export const determineBEAFetchResponse = (
  jest: { fn: (unknown) => unknown },
  jsonResponse: Record<string, unknown> | [Record<string, unknown>]
): void => {
  global.fetch = jest.fn(url => {
    if (url.includes('https://apps.bea.gov/api/')) {
      return Promise.resolve({
        ok: true,
        ready: true,
        json: () => {
          return Promise.resolve({
            BEAAPI: {
              Request: {
                RequestParam: {
                  ParameterName: 'FREQUENCY',
                  ParameterValue: 'Q',
                },
              },
              Results: {
                Data: [
                  {
                    TableName: 'T10105',
                    SeriesCode: 'A191RC',
                    LineNumber: '1',
                    LineDescription: 'Gross domestic product',
                    TimePeriod: '2014Q1',
                    METRIC_NAME: 'Current Dollars',
                    CL_UNIT: 'Level',
                    UNIT_MULT: '6',
                    DataValue: '17,144,281',
                    NoteRef: 'T10105',
                  },
                  {
                    TableName: 'T10105',
                    SeriesCode: 'A191RC',
                    LineNumber: '1',
                    LineDescription: 'Gross domestic product',
                    TimePeriod: '2014Q2',
                    METRIC_NAME: 'Current Dollars',
                    CL_UNIT: 'Level',
                    UNIT_MULT: '6',
                    DataValue: '17,462,703',
                    NoteRef: 'T10105',
                  },
                  {
                    TableName: 'T10105',
                    SeriesCode: 'A191RC',
                    LineNumber: '1',
                    LineDescription: 'Gross domestic product',
                    TimePeriod: '2014Q3',
                    METRIC_NAME: 'Current Dollars',
                    CL_UNIT: 'Level',
                    UNIT_MULT: '6',
                    DataValue: '17,743,227',
                    NoteRef: 'T10105',
                  },
                  {
                    TableName: 'T10105',
                    SeriesCode: 'A191RC',
                    LineNumber: '1',
                    LineDescription: 'Gross domestic product',
                    TimePeriod: '2014Q4',
                    METRIC_NAME: 'Current Dollars',
                    CL_UNIT: 'Level',
                    UNIT_MULT: '6',
                    DataValue: '17,852,540',
                    NoteRef: 'T10105',
                  },
                  {
                    TableName: 'T10105',
                    SeriesCode: 'A191RC',
                    LineNumber: '1',
                    LineDescription: 'Gross domestic product',
                    TimePeriod: '2015Q1',
                    METRIC_NAME: 'Current Dollars',
                    CL_UNIT: 'Level',
                    UNIT_MULT: '6',
                    DataValue: '17,991,348',
                    NoteRef: 'T10105',
                  },
                  {
                    TableName: 'T10105',
                    SeriesCode: 'A191RC',
                    LineNumber: '1',
                    LineDescription: 'Gross domestic product',
                    TimePeriod: '2015Q2',
                    METRIC_NAME: 'Current Dollars',
                    CL_UNIT: 'Level',
                    UNIT_MULT: '6',
                    DataValue: '18,193,707',
                    NoteRef: 'T10105',
                  },
                  {
                    TableName: 'T10105',
                    SeriesCode: 'A191RC',
                    LineNumber: '1',
                    LineDescription: 'Gross domestic product',
                    TimePeriod: '2015Q3',
                    METRIC_NAME: 'Current Dollars',
                    CL_UNIT: 'Level',
                    UNIT_MULT: '6',
                    DataValue: '18,306,960',
                    NoteRef: 'T10105',
                  },
                  {
                    TableName: 'T10105',
                    SeriesCode: 'A191RC',
                    LineNumber: '1',
                    LineDescription: 'Gross domestic product',
                    TimePeriod: '2015Q4',
                    METRIC_NAME: 'Current Dollars',
                    CL_UNIT: 'Level',
                    UNIT_MULT: '6',
                    DataValue: '18,332,079',
                    NoteRef: 'T10105',
                  },
                  {
                    TableName: 'T10105',
                    SeriesCode: 'A191RC',
                    LineNumber: '1',
                    LineDescription: 'Gross domestic product',
                    TimePeriod: '2016Q1',
                    METRIC_NAME: 'Current Dollars',
                    CL_UNIT: 'Level',
                    UNIT_MULT: '6',
                    DataValue: '18,425,306',
                    NoteRef: 'T10105',
                  },
                  {
                    TableName: 'T10105',
                    SeriesCode: 'A191RC',
                    LineNumber: '1',
                    LineDescription: 'Gross domestic product',
                    TimePeriod: '2016Q2',
                    METRIC_NAME: 'Current Dollars',
                    CL_UNIT: 'Level',
                    UNIT_MULT: '6',
                    DataValue: '18,611,617',
                    NoteRef: 'T10105',
                  },
                  {
                    TableName: 'T10105',
                    SeriesCode: 'A191RC',
                    LineNumber: '1',
                    LineDescription: 'Gross domestic product',
                    TimePeriod: '2016Q3',
                    METRIC_NAME: 'Current Dollars',
                    CL_UNIT: 'Level',
                    UNIT_MULT: '6',
                    DataValue: '18,775,459',
                    NoteRef: 'T10105',
                  },
                  {
                    TableName: 'T10105',
                    SeriesCode: 'A191RC',
                    LineNumber: '1',
                    LineDescription: 'Gross domestic product',
                    TimePeriod: '2016Q4',
                    METRIC_NAME: 'Current Dollars',
                    CL_UNIT: 'Level',
                    UNIT_MULT: '6',
                    DataValue: '18,968,041',
                    NoteRef: 'T10105',
                  },
                  {
                    TableName: 'T10105',
                    SeriesCode: 'A191RC',
                    LineNumber: '1',
                    LineDescription: 'Gross domestic product',
                    TimePeriod: '2017Q1',
                    METRIC_NAME: 'Current Dollars',
                    CL_UNIT: 'Level',
                    UNIT_MULT: '6',
                    DataValue: '19,148,194',
                    NoteRef: 'T10105',
                  },
                  {
                    TableName: 'T10105',
                    SeriesCode: 'A191RC',
                    LineNumber: '1',
                    LineDescription: 'Gross domestic product',
                    TimePeriod: '2017Q2',
                    METRIC_NAME: 'Current Dollars',
                    CL_UNIT: 'Level',
                    UNIT_MULT: '6',
                    DataValue: '19,304,506',
                    NoteRef: 'T10105',
                  },
                  {
                    TableName: 'T10105',
                    SeriesCode: 'A191RC',
                    LineNumber: '1',
                    LineDescription: 'Gross domestic product',
                    TimePeriod: '2017Q3',
                    METRIC_NAME: 'Current Dollars',
                    CL_UNIT: 'Level',
                    UNIT_MULT: '6',
                    DataValue: '19,561,896',
                    NoteRef: 'T10105',
                  },
                  {
                    TableName: 'T10105',
                    SeriesCode: 'A191RC',
                    LineNumber: '1',
                    LineDescription: 'Gross domestic product',
                    TimePeriod: '2017Q4',
                    METRIC_NAME: 'Current Dollars',
                    CL_UNIT: 'Level',
                    UNIT_MULT: '6',
                    DataValue: '19,894,750',
                    NoteRef: 'T10105',
                  },
                  {
                    TableName: 'T10105',
                    SeriesCode: 'A191RC',
                    LineNumber: '1',
                    LineDescription: 'Gross domestic product',
                    TimePeriod: '2018Q1',
                    METRIC_NAME: 'Current Dollars',
                    CL_UNIT: 'Level',
                    UNIT_MULT: '6',
                    DataValue: '20,155,486',
                    NoteRef: 'T10105',
                  },
                  {
                    TableName: 'T10105',
                    SeriesCode: 'A191RC',
                    LineNumber: '1',
                    LineDescription: 'Gross domestic product',
                    TimePeriod: '2018Q2',
                    METRIC_NAME: 'Current Dollars',
                    CL_UNIT: 'Level',
                    UNIT_MULT: '6',
                    DataValue: '20,470,197',
                    NoteRef: 'T10105',
                  },
                  {
                    TableName: 'T10105',
                    SeriesCode: 'A191RC',
                    LineNumber: '1',
                    LineDescription: 'Gross domestic product',
                    TimePeriod: '2018Q3',
                    METRIC_NAME: 'Current Dollars',
                    CL_UNIT: 'Level',
                    UNIT_MULT: '6',
                    DataValue: '20,687,278',
                    NoteRef: 'T10105',
                  },
                  {
                    TableName: 'T10105',
                    SeriesCode: 'A191RC',
                    LineNumber: '1',
                    LineDescription: 'Gross domestic product',
                    TimePeriod: '2018Q4',
                    METRIC_NAME: 'Current Dollars',
                    CL_UNIT: 'Level',
                    UNIT_MULT: '6',
                    DataValue: '20,819,269',
                    NoteRef: 'T10105',
                  },
                  {
                    TableName: 'T10105',
                    SeriesCode: 'A191RC',
                    LineNumber: '1',
                    LineDescription: 'Gross domestic product',
                    TimePeriod: '2019Q1',
                    METRIC_NAME: 'Current Dollars',
                    CL_UNIT: 'Level',
                    UNIT_MULT: '6',
                    DataValue: '21,013,085',
                    NoteRef: 'T10105',
                  },
                  {
                    TableName: 'T10105',
                    SeriesCode: 'A191RC',
                    LineNumber: '1',
                    LineDescription: 'Gross domestic product',
                    TimePeriod: '2019Q2',
                    METRIC_NAME: 'Current Dollars',
                    CL_UNIT: 'Level',
                    UNIT_MULT: '6',
                    DataValue: '21,272,448',
                    NoteRef: 'T10105',
                  },
                  {
                    TableName: 'T10105',
                    SeriesCode: 'A191RC',
                    LineNumber: '1',
                    LineDescription: 'Gross domestic product',
                    TimePeriod: '2019Q3',
                    METRIC_NAME: 'Current Dollars',
                    CL_UNIT: 'Level',
                    UNIT_MULT: '6',
                    DataValue: '21,531,839',
                    NoteRef: 'T10105',
                  },
                  {
                    TableName: 'T10105',
                    SeriesCode: 'A191RC',
                    LineNumber: '1',
                    LineDescription: 'Gross domestic product',
                    TimePeriod: '2019Q4',
                    METRIC_NAME: 'Current Dollars',
                    CL_UNIT: 'Level',
                    UNIT_MULT: '6',
                    DataValue: '21,706,532',
                    NoteRef: 'T10105',
                  },
                  {
                    TableName: 'T10105',
                    SeriesCode: 'A191RC',
                    LineNumber: '1',
                    LineDescription: 'Gross domestic product',
                    TimePeriod: '2020Q1',
                    METRIC_NAME: 'Current Dollars',
                    CL_UNIT: 'Level',
                    UNIT_MULT: '6',
                    DataValue: '21,538,032',
                    NoteRef: 'T10105',
                  },
                  {
                    TableName: 'T10105',
                    SeriesCode: 'A191RC',
                    LineNumber: '1',
                    LineDescription: 'Gross domestic product',
                    TimePeriod: '2020Q2',
                    METRIC_NAME: 'Current Dollars',
                    CL_UNIT: 'Level',
                    UNIT_MULT: '6',
                    DataValue: '19,636,731',
                    NoteRef: 'T10105',
                  },
                  {
                    TableName: 'T10105',
                    SeriesCode: 'A191RC',
                    LineNumber: '1',
                    LineDescription: 'Gross domestic product',
                    TimePeriod: '2020Q3',
                    METRIC_NAME: 'Current Dollars',
                    CL_UNIT: 'Level',
                    UNIT_MULT: '6',
                    DataValue: '21,362,428',
                    NoteRef: 'T10105',
                  },
                  {
                    TableName: 'T10105',
                    SeriesCode: 'A191RC',
                    LineNumber: '1',
                    LineDescription: 'Gross domestic product',
                    TimePeriod: '2020Q4',
                    METRIC_NAME: 'Current Dollars',
                    CL_UNIT: 'Level',
                    UNIT_MULT: '6',
                    DataValue: '21,704,706',
                    NoteRef: 'T10105',
                  },
                  {
                    TableName: 'T10105',
                    SeriesCode: 'A191RC',
                    LineNumber: '1',
                    LineDescription: 'Gross domestic product',
                    TimePeriod: '2021Q1',
                    METRIC_NAME: 'Current Dollars',
                    CL_UNIT: 'Level',
                    UNIT_MULT: '6',
                    DataValue: '22,313,850',
                    NoteRef: 'T10105',
                  },
                  {
                    TableName: 'T10105',
                    SeriesCode: 'A191RC',
                    LineNumber: '1',
                    LineDescription: 'Gross domestic product',
                    TimePeriod: '2021Q2',
                    METRIC_NAME: 'Current Dollars',
                    CL_UNIT: 'Level',
                    UNIT_MULT: '6',
                    DataValue: '23,046,934',
                    NoteRef: 'T10105',
                  },
                  {
                    TableName: 'T10105',
                    SeriesCode: 'A191RC',
                    LineNumber: '1',
                    LineDescription: 'Gross domestic product',
                    TimePeriod: '2021Q3',
                    METRIC_NAME: 'Current Dollars',
                    CL_UNIT: 'Level',
                    UNIT_MULT: '6',
                    DataValue: '23,550,420',
                    NoteRef: 'T10105',
                  },
                  {
                    TableName: 'T10105',
                    SeriesCode: 'A191RC',
                    LineNumber: '1',
                    LineDescription: 'Gross domestic product',
                    TimePeriod: '2021Q4',
                    METRIC_NAME: 'Current Dollars',
                    CL_UNIT: 'Level',
                    UNIT_MULT: '6',
                    DataValue: '24,349,121',
                    NoteRef: 'T10105',
                  },
                  {
                    TableName: 'T10105',
                    SeriesCode: 'A191RC',
                    LineNumber: '1',
                    LineDescription: 'Gross domestic product',
                    TimePeriod: '2022Q1',
                    METRIC_NAME: 'Current Dollars',
                    CL_UNIT: 'Level',
                    UNIT_MULT: '6',
                    DataValue: '24,740,480',
                    NoteRef: 'T10105',
                  },
                ],
              },
            },
          });
        },
      });
    }
    return Promise.resolve({
      ok: true,
      ready: true,
      json: () => {
        return Promise.resolve(jsonResponse);
      },
    });
  }) as (input: RequestInfo, init?: RequestInit) => Promise<Response>;
};
export type ResponseMapEntry = {
  matcher: (url: string) => boolean;
  jsonResponse: Record<string, unknown>;
};
export const setGlobalFetchMatchingResponse = (jest: { fn: (unknown) => unknown }, responseMap: ResponseMapEntry[]): void => {
  global.fetch = jest.fn((input: RequestInfo) => {
    return Promise.resolve({
      ok: true,
      ready: true,
      json: () => {
        let response;

        const respSrc = responseMap.find(value => value.matcher(`${input}`));

        if (respSrc) {
          response = respSrc.jsonResponse; // return first match found
        } else {
          response = null;
        }

        return Promise.resolve(response);
      },
    });
  }) as (input: RequestInfo, init?: RequestInit) => Promise<Response>;
};

export const mockFetchApi = (sequence, delay) => async () => {
  const sleep = async delay => new Promise(resolve => setTimeout(() => resolve('success'), delay));
  const timeCalled = new Date().getTime();
  await sleep(delay);
  const timeReturned = new Date().getTime();
  return Promise.resolve({
    ok: true,
    status: 200,
    json: async () => {
      return Promise.resolve({
        data: [
          {
            pageNumber: sequence,
            timeCalled,
            timeReturned,
          },
        ],
        links: { next: '&page%5Bnumber%5D=2&page%5Bsize%5D=10000' },
        meta: { 'total-pages': 3 },
      });
    },
  });
};

export const setWindowMockFontSize = (size: string): void => {
  Object.defineProperty(window, 'getComputedStyle', {
    value: (el, pseudoEl) => {
      return {
        getPropertyValue: prop => {
          const out = { 'font-size': size };
          return out[prop];
        },
      };
    },
  });
};
