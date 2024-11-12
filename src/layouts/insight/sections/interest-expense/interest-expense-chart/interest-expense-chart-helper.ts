export const CustomTooltip = ({ payload = [], setYear, setExpense, setRate }) => {
  if (payload.length > 0) {
    setYear(payload[0]?.payload.year);
    const rate = payload.find(x => x.dataKey === 'avgInterestRate');
    setRate(rate.payload.avgInterestRate);
    const expense = payload.find(x => x.dataKey === 'interestExpense');
    setExpense(expense.payload.interestExpense);
  }
  return null;
};

export const mockChartData = [
  {
    year: 2010,
    interestExpense: 320000000000,
    avgInterestRate: 3.0,
  },
  {
    year: 2011,
    interestExpense: 380000000000,
    avgInterestRate: 2.8,
  },
  {
    year: 2012,
    interestExpense: 260000000000,
    avgInterestRate: 2.7,
  },
  {
    year: 2013,
    interestExpense: 450000000000,
    avgInterestRate: 2.6,
  },
  {
    year: 2014,
    interestExpense: 500000000000,
    avgInterestRate: 2.6,
  },
  {
    year: 2015,
    interestExpense: 600000000000,
    avgInterestRate: 2.6,
  },
  {
    year: 2016,
    interestExpense: 650000000000,
    avgInterestRate: 2.7,
  },
  {
    year: 2017,
    interestExpense: 700000000000,
    avgInterestRate: 2.7,
  },
  {
    year: 2018,
    interestExpense: 250000000000,
    avgInterestRate: 2.8,
  },
  {
    year: 2019,
    interestExpense: 450000000000,
    avgInterestRate: 2.9,
  },
  {
    year: 2020,
    interestExpense: 550000000000,
    avgInterestRate: 3.0,
  },
  {
    year: 2021,
    interestExpense: 580000000000,
    avgInterestRate: 3.4,
  },
  {
    year: 2022,
    interestExpense: 610000000000,
    avgInterestRate: 3.6,
  },
  {
    year: 2023,
    interestExpense: 680000000000,
    avgInterestRate: 3.7,
  },
  {
    year: 2024,
    interestExpense: 890000000000,
    avgInterestRate: 3.8,
  },
];
