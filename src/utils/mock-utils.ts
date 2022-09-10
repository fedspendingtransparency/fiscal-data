/* istanbul ignore file */

/* ^^ File is ignored for coverage report since this exists purely as a helper to
* spec files and should not have unit tests written against it */

import {sub, format, parseISO} from 'date-fns';

export const todayForTests = parseISO(format(new Date(), "yyyy-MM-dd"));
export const testVariables = {
  dateFormats: {
    isoDate: "yyyy-MM-dd",
    displayFormat: "MM/dd/yyyy"
  },
  dates: {
    withinNinetyDays: sub(todayForTests, { days: 87 }),
    withinNinetyDays_Updated: sub(todayForTests, { days: 86 }),
    outsideNinetyDays: sub(todayForTests, { days: 150 }),
    outsideNinetyDays_Updated: sub(todayForTests, { days: 149 }),
    withinSixtyDays: sub(todayForTests, { days: 55 }),
    withinSixtyDays_Updated: sub(todayForTests, { days: 54 }),
    withinThirtyDays: sub(todayForTests, { days: 25 }),
    withinThirtyDays_Updated: sub(todayForTests, { days: 24 })
  }
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
      }
    });
  }) as (input: RequestInfo, init?: RequestInit) => Promise<Response>;
};

export const determineBEAFetchResponse = (
  jest: { fn: (unknown) => unknown },
  jsonResponse: Record<string, unknown> | [Record<string, unknown>]
): void => {
  global.fetch = jest.fn((url) => {
    if(url.includes('https://apps.bea.gov/api/')) {
      return Promise.resolve({
        ok: true,
        ready: true,
        json: () => {
          return Promise.resolve({
              "BEAAPI": {
                "Request": {
                  "RequestParam": {
                    "ParameterName": "FREQUENCY",
                    "ParameterValue": "Q"
                  }
                },
                "Results": {
                  "Data": [
                    {
                      "TableName": "T10105",
                      "SeriesCode": "A191RC",
                      "LineNumber": "1",
                      "LineDescription": "Gross domestic product",
                      "TimePeriod": "2021Q1",
                      "METRIC_NAME": "Current Dollars",
                      "CL_UNIT": "Level",
                      "UNIT_MULT": "6",
                      "DataValue": "243,164",
                      "NoteRef": "T10105"
                    },
                    {
                      "TableName": "T10105",
                      "SeriesCode": "A191RC",
                      "LineNumber": "1",
                      "LineDescription": "Gross domestic product",
                      "TimePeriod": "2021Q2",
                      "METRIC_NAME": "Current Dollars",
                      "CL_UNIT": "Level",
                      "UNIT_MULT": "6",
                      "DataValue": "243,164",
                      "NoteRef": "T10105"
                    },
                    {
                      "TableName": "T10105",
                      "SeriesCode": "A191RC",
                      "LineNumber": "1",
                      "LineDescription": "Gross domestic product",
                      "TimePeriod": "2021Q3",
                      "METRIC_NAME": "Current Dollars",
                      "CL_UNIT": "Level",
                      "UNIT_MULT": "6",
                      "DataValue": "243,164",
                      "NoteRef": "T10105"
                    },
                    {
                      "TableName": "T10105",
                      "SeriesCode": "A191RC",
                      "LineNumber": "1",
                      "LineDescription": "Gross domestic product",
                      "TimePeriod": "2020Q4",
                      "METRIC_NAME": "Current Dollars",
                      "CL_UNIT": "Level",
                      "UNIT_MULT": "6",
                      "DataValue": "243,164",
                      "NoteRef": "T10105"
                    },
                    {
                      "TableName": "T10105",
                      "SeriesCode": "A191RC",
                      "LineNumber": "1",
                      "LineDescription": "Gross domestic product",
                      "TimePeriod": "2020Q1",
                      "METRIC_NAME": "Current Dollars",
                      "CL_UNIT": "Level",
                      "UNIT_MULT": "6",
                      "DataValue": "243,164",
                      "NoteRef": "T10105"
                    },
                    {
                      "TableName": "T10105",
                      "SeriesCode": "A191RC",
                      "LineNumber": "1",
                      "LineDescription": "Gross domestic product",
                      "TimePeriod": "2019Q1",
                      "METRIC_NAME": "Current Dollars",
                      "CL_UNIT": "Level",
                      "UNIT_MULT": "6",
                      "DataValue": "243,164",
                      "NoteRef": "T10105"
                    },
                    {
                      "TableName": "T10105",
                      "SeriesCode": "A191RC",
                      "LineNumber": "1",
                      "LineDescription": "Gross domestic product",
                      "TimePeriod": "2018Q1",
                      "METRIC_NAME": "Current Dollars",
                      "CL_UNIT": "Level",
                      "UNIT_MULT": "6",
                      "DataValue": "243,164",
                      "NoteRef": "T10105"
                    },
                    {
                      "TableName": "T10105",
                      "SeriesCode": "A191RC",
                      "LineNumber": "1",
                      "LineDescription": "Gross domestic product",
                      "TimePeriod": "2017Q1",
                      "METRIC_NAME": "Current Dollars",
                      "CL_UNIT": "Level",
                      "UNIT_MULT": "6",
                      "DataValue": "243,164",
                      "NoteRef": "T10105"
                    },
                    {
                      "TableName": "T10105",
                      "SeriesCode": "A191RC",
                      "LineNumber": "1",
                      "LineDescription": "Gross domestic product",
                      "TimePeriod": "2016Q1",
                      "METRIC_NAME": "Current Dollars",
                      "CL_UNIT": "Level",
                      "UNIT_MULT": "6",
                      "DataValue": "243,164",
                      "NoteRef": "T10105"
                    },
                    {
                      "TableName": "T10105",
                      "SeriesCode": "A191RC",
                      "LineNumber": "1",
                      "LineDescription": "Gross domestic product",
                      "TimePeriod": "2015Q1",
                      "METRIC_NAME": "Current Dollars",
                      "CL_UNIT": "Level",
                      "UNIT_MULT": "6",
                      "DataValue": "243,164",
                      "NoteRef": "T10105"
                    },
                    {
                      "TableName": "T10105",
                      "SeriesCode": "A191RC",
                      "LineNumber": "1",
                      "LineDescription": "Gross domestic product",
                      "TimePeriod": "2014Q1",
                      "METRIC_NAME": "Current Dollars",
                      "CL_UNIT": "Level",
                      "UNIT_MULT": "6",
                      "DataValue": "243,164",
                      "NoteRef": "T10105"
                    },
                    {
                      "TableName": "T10105",
                      "SeriesCode": "A191RC",
                      "LineNumber": "1",
                      "LineDescription": "Gross domestic product",
                      "TimePeriod": "2013Q1",
                      "METRIC_NAME": "Current Dollars",
                      "CL_UNIT": "Level",
                      "UNIT_MULT": "6",
                      "DataValue": "243,164",
                      "NoteRef": "T10105"
                    },
                    {
                      "TableName": "T10105",
                      "SeriesCode": "A191RC",
                      "LineNumber": "1",
                      "LineDescription": "Gross domestic product",
                      "TimePeriod": "2012Q1",
                      "METRIC_NAME": "Current Dollars",
                      "CL_UNIT": "Level",
                      "UNIT_MULT": "6",
                      "DataValue": "243,164",
                      "NoteRef": "T10105"
                    },
                    {
                      "TableName": "T10105",
                      "SeriesCode": "A191RC",
                      "LineNumber": "1",
                      "LineDescription": "Gross domestic product",
                      "TimePeriod": "2011Q1",
                      "METRIC_NAME": "Current Dollars",
                      "CL_UNIT": "Level",
                      "UNIT_MULT": "6",
                      "DataValue": "243,164",
                      "NoteRef": "T10105"
                    }
                  ]
                }
              }
            }
          );
        }
      })
    }
    return Promise.resolve({
      ok: true,
      ready: true,
      json: () => {
        return Promise.resolve(jsonResponse);
      }
    });
  }) as (input: RequestInfo, init?: RequestInit) => Promise<Response>;
}

export const setGlobalFetchMatchingResponse = (
  jest: { fn: (unknown) => unknown },
  responseMap: [
    {
      matcher: (url: string) => boolean,
      jsonResponse: Record<string, unknown>
    }
    ]): void => {
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
      }
    });
  }) as (input: RequestInfo, init?: RequestInit) => Promise<Response>;
}

export const mockFetchApi = (sequence, delay) => async () => {
  const sleep = async (delay) => new Promise(resolve =>
    setTimeout(() => resolve('success'), delay));
  const timeCalled = new Date().getTime();
  await sleep(delay);
  const timeReturned = new Date().getTime();
  return Promise.resolve({
    ok: true,
    status: 200,
    json: async () => {
      return Promise.resolve({
        data: [{
          pageNumber: sequence,
          timeCalled,
          timeReturned
        }],
        links: { next: '&page%5Bnumber%5D=2&page%5Bsize%5D=10000' },
        meta: { 'total-pages': 3 }
      });
    }
  });
};

export const setWindowMockFontSize = (size: string): void => {
  Object.defineProperty(window, 'getComputedStyle', {
    value: (el, pseudoEl) => {
      return ({
        getPropertyValue: (prop) => {
          const out = {"font-size": size};
          return out[prop];
        }
      });
    }
  });

};
