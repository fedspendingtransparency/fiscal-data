

// The PRE-2015 deficit data has been sourced from the following file
// static/data/deficit/federal_deficit_trends_2001_2014.xlsx
// The initial deficit values were divided by 1 trillion, then rounded to the nearest tenth value
// The empty entry for 2000 is to provide needed left margin on the chart

 import {deficitExplainerPrimary} from "../../national-deficit.module.scss";

const fields = 'fields=current_fytd_net_outly_amt,record_date,record_calendar_month,record_fiscal_year';
 const sort = 'sort=record_date';
 export const endpointUrl = `v1/accounting/mts/mts_table_5?${fields}&filter=line_code_nbr:eq:5694,record_calendar_month:eq:09&${sort}`;

export const preAPIData = [
  {
    "year": "2000",
    "deficit": ""
  },
  {
    "year": "2001",
    "deficit": "-0.13",
    "deficitColor": deficitExplainerPrimary,
  },
  {
    "year": "2002",
    "deficit": "0.16",
    "deficitColor": deficitExplainerPrimary,
  },
  {
    "year": "2003",
    "deficit": "0.37",
    "deficitColor": deficitExplainerPrimary,
  },
  {
    "year": "2004",
    "deficit": "0.41",
    "deficitColor": deficitExplainerPrimary,
  },
  {
    "year": "2005",
    "deficit": "0.32",
    "deficitColor": deficitExplainerPrimary,
  },
  {
    "year": "2006",
    "deficit": "0.25",
    "deficitColor": deficitExplainerPrimary,
  },
  {
    "year": "2007",
    "deficit": "0.16",
    "deficitColor": deficitExplainerPrimary,
  },
  {
    "year": "2008",
    "deficit": "0.45",
    "deficitColor": deficitExplainerPrimary,
  },
  {
    "year": "2009",
    "deficit": "1.42",
    "deficitColor": deficitExplainerPrimary,
  },
  {
    "year": "2010",
    "deficit": "1.29",
    "deficitColor": deficitExplainerPrimary,
  },
  {
    "year": "2011",
    "deficit": "1.30",
    "deficitColor": deficitExplainerPrimary,
  },
  {
    "year": "2012",
    "deficit": "1.09",
    "deficitColor": deficitExplainerPrimary,
  },
  {
    "year": "2013",
    "deficit": "0.68",
    "deficitColor": deficitExplainerPrimary,
  },
  {
    "year": "2014",
    "deficit": "0.48",
    "deficitColor": deficitExplainerPrimary,
  }
];

export const generateTickValues = (chartData) => {
  const xValues = [];
  const yValues = [];
  const tickValues = [];
  const deficitValues = [];
  chartData.forEach((entry) => {
    if(parseInt(entry.year) % 5 === 0) {
      xValues.push(entry.year);
    }
    if(entry.deficit !== '') {
      deficitValues.push(parseFloat(entry.deficit));
    }
  });
  const maxValue = Math.max(...deficitValues);
  const minValue  = Math.min(...deficitValues);
  for(let i = Math.floor(minValue*2)/2; i <= Math.ceil(maxValue*2)/2; i += 0.5) {
    if(i !== 0) {
      yValues.push(i.toFixed(1));
    }
    else {
      yValues.push(i.toFixed());
    }
  }
  const uniqueXValues = [...new Set(xValues)];
  tickValues.push(uniqueXValues);
  tickValues.push(yValues);
  return tickValues;
}
