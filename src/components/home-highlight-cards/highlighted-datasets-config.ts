import { getMonth, getYear, lastDayOfMonth } from 'date-fns';
import { convertDate } from '../dataset-data/dataset-data-helper/dataset-data-helper';
import { ENV_ID } from 'gatsby-env-variables';

const primaryColor = 'rgb(1, 118, 198)';
const negativeColor = 'rgb(242, 108, 98)';
const today = new Date();

export type ChartType = 'BAR' | 'LINE' | 'IMAGE';
export type DataFormat = 'CURRENCY' | 'CURRENCY_NET' | 'PERCENTAGE';
export interface ImageFormat {
  src: string;
  alt: string;
  sparklePoints?: (string | number)[][];
}
export interface IDataChartConfigData {
  api_id: number;
  chartType: ChartType;
  fields: string[];
  noRecordDateInFields?: boolean;
  filters: any[];
  sorts?: string[];
  format: DataFormat;
  limit: number;
  index?: string;
  transform?: (...any) => any[];
  colors?: ((...any) => string | string[]) | string[];
  value_fields?: string[];
  valueField?: string;
  image?: ImageFormat;
}
export interface IDataChartConfig {
  datasetId: string;
  title: string;
  displayOrder: number;
  data: IDataChartConfigData;
}
export type IDatasetChartConfigs = IDataChartConfig[];

export const filterUniqueValues: (arr: [], field: string) => any[] = (
  arr,
  field
) => {
  if (!arr || !field) {
    return arr || [];
  }

  return arr
    .map(d => d[field])
    .filter((value, index, self) => self.indexOf(value) === index);
};

export const api120UniqueAggregation = d => {
  const curMonthVal = Number(d.current_month_budget_amt);
  return d.classification_desc.toUpperCase() === 'TOTAL OUTLAYS'
    ? curMonthVal
    : -curMonthVal;
};

/**
 *
 * @param res {object} - The response from the API which contains a "data" array field
 * @param yearField {string} - The year on each data entry (used for categorizing the data).
 * @param monthField {string} - The month on each data entry (used for summation within each year).
 * @param aggregationField {string} - The field to aggregate the data on.
 * @param _aggFunction {function} - (optional) A unique function to calculate the aggregation (eg.
 *                                  add or subtract given data value under a certain condition).
 */
export const annualAggregation: (
  res: any,
  yearField: string,
  monthField: string,
  aggregationField: string,
  _aggFunction: any
) => any[] = (res, yearField, monthField, aggregationField, _aggFunction) => {
  if (!res || !res.data || !yearField || !monthField || !aggregationField) {
    console.warn('annualAggregation called with invalid params');
    return [];
  }

  const data = res.data;
  const years = filterUniqueValues(data, yearField);
  const firstVal = data[0];
  const lastVal = data[data.length - 1];
  let dataArr = [];

  if (lastVal[monthField] !== '12') {
    years.pop();
  }
  if (firstVal[monthField] !== '01') {
    years.shift();
  }
  dataArr = data.filter(d => years.some(val => val === d[yearField]));

  const aggFunction = d => {
    return Number(d[aggregationField]);
  };
  const returnArr = [];

  const aggregate = _aggFunction || aggFunction;
  years.forEach(year => {
    let curVal = 0;
    const filteredArr = dataArr.filter(d => d[yearField] === year);
    const lastIdx = filteredArr.length - 1;
    filteredArr.forEach(d => {
      curVal += aggregate(d);
    });

    filteredArr[lastIdx].chartedValue = curVal;
    returnArr.push(filteredArr[lastIdx]);
  });
  return returnArr;
};

export const transformAPI143: (res: any) => any[] = res => {
  if (!res || !res.data) {
    console.warn('transformAPI143 called with invalid params');
    return [];
  }

  const data = res.data;
  const years = filterUniqueValues(data, 'record_calendar_year');
  const dataArr = data.filter(d =>
    years.some(val => val === d.record_calendar_year)
  );

  // Date range should span from 5 years before this month of current year
  const mostRecentMonth = dataArr[dataArr.length - 1].record_calendar_month;

  const returnArr = [];
  years.forEach(year => {
    const curVal = 0;
    const filteredArr = dataArr.filter(d => d.record_calendar_year === year);
    let lastIdx = filteredArr.length - 1;

    filteredArr.forEach(m => {
      if (m.record_calendar_month === mostRecentMonth) {
        lastIdx = filteredArr.indexOf(m);
      }
    });

    filteredArr[lastIdx].chartedValue = curVal;
    returnArr.push(filteredArr[lastIdx]);
  });
  return returnArr;
};

/**
 * Transform function for DTS - API 130
 * This completely replaces the data from the API call because the format out
 * of the API will not render with the multiple bars per year for this card.
 * This process also normalizes the data die
 * @param res
 */
export const transformAPI130 = (res: {
  data: any[];
  links: Record<string, never>;
  meta: Record<string, never>;
}): any[] => {
  const combinedValueForYear = (yearMonth, array) => {
    return array
      .filter(
        e => `${e.record_calendar_year}${e.record_calendar_month}` === yearMonth
      )
      .reduce((total: number, currElement: number) => {
        return total + currElement['transaction_today_amt'];
      }, 0);
  };

  const countByMonth = {};
  const valuesByMonth = {};
  const outputData = [];
  const withdrawalsByMonth = {};
  const depositsByMonth = {};

  const data = [];
  const nowDate = new Date(Date.now());

  // make 6 digit string of year and month
  const currentYearMonth = `${getYear(nowDate) * 100 + getMonth(nowDate) + 1}`;
  res.data
    .filter(
      e =>
        `${e.record_calendar_year}${e.record_calendar_month}` !==
        currentYearMonth
    )
    .forEach(e => {
      const yearMonth = `${e.record_calendar_year}${e.record_calendar_month}`;

      let amt = Number(e.transaction_today_amt);
      amt = amt * 1000000;
      if (e.transaction_type === 'Withdrawals') {
        amt = amt * -1;
        withdrawalsByMonth[yearMonth] = amt;
      } else {
        depositsByMonth[yearMonth] = amt;
      }
      e.transaction_today_amt = amt;
      data[data.length] = e;

      if (!countByMonth[yearMonth]) countByMonth[yearMonth] = 0;

      countByMonth[yearMonth]++;

      if (countByMonth[yearMonth] === 2) {
        valuesByMonth[yearMonth] = combinedValueForYear(yearMonth, data);

        outputData[outputData.length] = {
          deposits: depositsByMonth[yearMonth],
          withdrawals: withdrawalsByMonth[yearMonth],
          yearMonth: Number(yearMonth),
          combinedValue: valuesByMonth[yearMonth],
          record_date: `${e.record_calendar_year}-${e.record_calendar_month}-01`,
        };
      }
    });
  // sort by date and take last 6
  return outputData.sort((a, b) => a.yearMonth - b.yearMonth).slice(-6);
};

/**
 * Transform function for DTS - API 129
 * Finds the month ending values (and sums if different account types are represented),
 * and returns them as snapshots for each of the last 6 months, not counting this one.
 * @param res
 */
export const transformAPI129 = (res: {
  data: any[];
  links: Record<string, never>;
  meta: Record<string, never>;
}): any[] => {
  const valuesPerMonth: any = {};
  const nowDate = new Date(Date.now());
  const curYear = nowDate.getFullYear();
  const curMonth = nowDate.getMonth() + 1;
  // since the highlight card logic presumes to invert the data before transforming it
  res.data.reverse().forEach(row => {
    const [year, month] = row.record_date.split('-');
    const monthNum = Number(month.charAt(0) === '0' ? month.charAt(1) : month);
    if (
      Number(year) < curYear ||
      (Number(year) === curYear && monthNum < curMonth)
    ) {
      const lastDay = lastDayOfMonth(convertDate(row.record_date)).getDate();
      const monthKey = `${year}-${month}-${lastDay}`;
      if (valuesPerMonth[monthKey] === undefined) {
        valuesPerMonth[monthKey] = {};
        valuesPerMonth[monthKey].total = 0;
      }
      if (valuesPerMonth[monthKey][row['account_type']] === undefined) {
        valuesPerMonth[monthKey][row['account_type']] = row.account_type;
        valuesPerMonth[monthKey].total += Number(row.open_today_bal);
        valuesPerMonth[monthKey].record_calendar_year = year;
        valuesPerMonth[monthKey].record_calendar_month = month;
      }
    }
  });
  const data = Object.entries(valuesPerMonth).map(([dateKey, valObj]) => {
    return {
      record_date: dateKey,
      record_calendar_year: valObj['record_calendar_year'],
      record_calendar_month: valObj['record_calendar_month'],
      open_today_bal: `${valObj['total']}000000`,
    };
  });
  const sorted = data.sort((a, b) =>
    a.record_date.localeCompare(b.record_date)
  );
  return sorted.slice(-6); // only take the latest 6 complete months
};

/**
 * Transform function for Avg Interest Rates - API 146
 * Breaks data into the 5 most recent complete calendar year periods and provides averaged values
 * for each
 * @param res
 */
export const transformAPI146 = (res: {
  data: any[];
  links: Record<string, never>;
  meta: Record<string, never>;
}): any[] => {
  const dataByYear: { [key: string]: number[] } = {};

  const sortedData = res.data
    .slice()
    .sort((a, b) =>
      `${a.record_calendar_year}${a.record_calendar_month}`.localeCompare(
        `${b.record_calendar_year}${b.record_calendar_month}`
      )
    );
  const currentYear = Number(new Date(Date.now()).getFullYear());
  sortedData
    .filter(r => Number(r.record_calendar_year) < currentYear)
    .forEach(row => {
      // break into calendar year periods
      if (!dataByYear[row.record_calendar_year]) {
        dataByYear[row.record_calendar_year] = [];
      }
      dataByYear[row.record_calendar_year].push(row.avg_interest_rate_amt);
    });

  const data: any[] = [];
  Object.entries(dataByYear).forEach(([yearKey, rates]) => {
    data.push({
      // represent dates in terms of the ending of each calendar year
      record_date: `${yearKey}-12-31`,

      // compute the average across records for each calendar year
      avg_interest_rate_amt: (
        rates.reduce((a, b) => Number(a) + Number(b)) / rates.length
      ).toFixed(3),
    });
  });
  const yearRows = data.sort((a, b) =>
    a.record_date.localeCompare(b.record_date)
  );
  return yearRows.slice(-5); // make sure to not pick up any more than 5 year records.
};

/**
 * Transform function for U.S. Treasury-Owned Gold
 * Returns the sum of the value of gold held at various location
 * @param res
 */
export const transformAPI144 = (res: {
  data: any[];
  links: Record<string, never>;
  meta: Record<string, never>;
}): any[] => {
  let sum = 0;
  const latestDate = res.data[0].record_date;
  for (const record of res.data) {
    if (record.record_date === latestDate) {
      sum += +record.book_value_amt;
    }
  }

  return [
    {
      book_value_amt: sum,
      record_date: latestDate,
    },
  ];
};

const datasets: IDatasetChartConfigs = [
  {
    datasetId: '015-BFS-2014Q3-065',
    title: 'What is the current national debt?',
    displayOrder: 1,
    data: {
      api_id: 143,
      chartType: 'LINE',
      fields: [
        'tot_pub_debt_out_amt',
        'record_calendar_day',
        'record_calendar_year',
        'record_calendar_month',
      ],
      index: 'record_calendar_year',
      filters: [
        {
          key: 'record_calendar_year',
          operator: 'gte',
          // data for this API call should go back 5 years (including current year)
          value: getYear(today) - 4,
        },
      ],
      format: 'CURRENCY',
      limit: 10000,
      transform: transformAPI143,
    },
  },
  {
    datasetId: '015-BFS-2014Q1-13',
    title: 'What is the national deficit by year?',
    displayOrder: 2,
    data: {
      api_id: 120,
      chartType: 'BAR',
      fields: [
        'current_month_budget_amt',
        'classification_desc',
        'record_calendar_year',
        'record_calendar_month',
      ],
      index: 'record_calendar_year',
      filters: [
        {
          // Add filters that translate to the API calls' &filters params.
          key: 'classification_desc',
          operator: 'in',
          value: 'Total%20Outlays,Total%20Receipts',
        },
      ],
      format: 'CURRENCY',
      limit: 142,
      // "transform" takes the data from the API and transforms it to be read into the desired chart
      transform: res =>
        annualAggregation(
          res,
          'record_calendar_year',
          'record_calendar_month',
          'current_month_budget_amt',
          d => {
            const curMonthVal = Number(d.current_month_budget_amt);
            return d.classification_desc.toUpperCase() === 'TOTAL OUTLAYS'
              ? curMonthVal
              : -curMonthVal;
          }
        ),
      // indicates which colors are to be used with charting (currently used with Nivo's bar graphs)
      colors: d => (Number(d.value) >= 0 ? primaryColor : negativeColor),
      // indicates which fields in the data array will be used to chart the values in the graphs
      // (currently used with Nivo's bar graphs)
      value_fields: ['chartedValue'],
    },
  },
  {
    datasetId: '015-BFS-2014Q1-03',
    title: 'How much money goes into/out of the federal government?',
    displayOrder: 3,
    data: {
      api_id: 220,
      chartType: 'BAR',
      noRecordDateInFields: true,
      fields: [
        'transaction_type',
        'transaction_today_amt',
        'record_calendar_month',
        'record_calendar_year',
      ],
      filters: [
        {
          key: 'transaction_type',
          operator: 'in',
          value: 'Deposits,Withdrawals',
        },
        {
          key: 'record_date',
          operator: 'mostRecentDatePeriod',
          unit: 'MONTH',
          amount: 7,
        },
      ],
      value_fields: ['deposits', 'withdrawals'],
      index: 'yearMonth',
      sorts: ['-record_calendar_year', '-record_calendar_month'],
      format: 'CURRENCY_NET',
      limit: 16,
      transform: transformAPI130,
      valueField: 'combinedValue',
      colors: [primaryColor, negativeColor],
    },
  },
  {
    datasetId: '015-BFS-2014Q1-09',
    title: 'What is the value of the U.S. Treasury-owned gold?',
    displayOrder: 4,
    data: {
      api_id: 144,
      chartType: 'IMAGE',
      noRecordDateInFields: true,
      fields: ['book_value_amt', 'record_date'],
      filters: [],
      format: 'CURRENCY',
      limit: 8, // currently 8 locations where gold is held
      transform: transformAPI144,
      image: {
        src: '/images/gold-bars.webp',
        alt: 'Image of gold bars',
        sparklePoints: [
          ['4.6rem', '-1.2rem'],
          ['6.5rem', '-0.5rem'],
          ['2.5rem', '0.8rem'],
          ['6.5rem', '1.2rem'],
          ['8.1rem', '1.1rem'],
          ['3rem', '2.3rem'],
          ['7rem', '2.1rem'],
          ['9.7rem', '2.6rem'],
          ['-0.5rem', '3.75rem'],
          ['1.5rem', '3.6rem'],
          ['4.5rem', '3.6rem'],
          ['8rem', '3.6rem'],
          ['2.3rem', '4.2rem'],
          ['5.3rem', '4.5rem'],
        ],
      },
    },
  },
  {
    datasetId: '015-BFS-2014Q1-03',
    title: 'How much money does the U.S. have on hand?',
    displayOrder: 5,
    data: {
      api_id: 219,
      chartType: 'LINE',
      fields: [
        'open_today_bal',
        'record_calendar_day',
        'account_type',
        'record_date',
      ],
      filters: [
        {
          key: 'record_calendar_day',
          operator: 'gte',
          value: '26',
        },
        {
          key: 'account_type',
          operator: 'eq',
          value: 'Treasury General Account (TGA) Closing Balance',
        },
      ],
      sorts: ['-record_date'],
      format: 'CURRENCY',
      limit: 30,
      transform: transformAPI129,
    },
  },
  {
    datasetId: '015-BFS-2014Q3-056',
    title:
      'How has the average interest rate on national debt changed over time?',
    displayOrder: 6,
    data: {
      api_id: 146,
      chartType: 'LINE',
      noRecordDateInFields: true,
      fields: [
        'avg_interest_rate_amt',
        'record_calendar_year',
        'record_calendar_month',
      ],
      filters: [
        {
          key: 'security_type_desc',
          operator: 'eq',
          value: 'Interest-bearing Debt',
        },
      ],
      index: 'year',
      sorts: ['-record_calendar_year'],
      format: 'PERCENTAGE',
      limit: 72,
      transform: transformAPI146,
    },
  },
  {
    datasetId: '015-BFS-2014Q1-13',
    title: 'How much does the federal government borrow from the public?',
    displayOrder: 7,
    data: {
      api_id: 120,
      chartType: 'LINE',
      fields: [
        'current_month_budget_amt',
        'classification_desc',
        'record_calendar_year',
        'record_calendar_month',
      ],
      index: 'record_calendar_year',
      filters: [
        {
          // Add filters that translate to the API calls' &filters params.
          key: 'classification_desc',
          operator: 'eq',
          value: 'Borrowing from the Public',
        },
      ],
      format: 'CURRENCY',
      limit: 6,
    },
  },
  {
    datasetId: '015-BFS-2014Q1-13',
    title: 'How much money does the government spend?',
    displayOrder: 8,
    data: {
      api_id: 109,
      chartType: 'BAR',
      fields: [
        'record_date',
        'current_month_gross_outly_amt',
        'record_calendar_year',
        'record_calendar_month',
      ],
      filters: [
        {
          key: 'classification_desc',
          operator: 'eq',
          value: 'Total Outlays',
        },
      ],
      sorts: ['-record_calendar_year', '-record_calendar_month'],
      format: 'CURRENCY',
      limit: 6,
      value_fields: ['current_month_gross_outly_amt'],
      valueField: 'current_month_gross_outly_amt',
      index: 'record_date',
      colors: d => (Number(d.value) >= 0 ? primaryColor : negativeColor),
    },
  },
];

export default datasets;
