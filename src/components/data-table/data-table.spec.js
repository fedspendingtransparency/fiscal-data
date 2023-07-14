import { render } from "@testing-library/react";
import React from "react";
import fetchMock from "fetch-mock";
import {fireEvent, waitFor} from "@testing-library/dom";
import {DataTable} from "./data-table";

const mockTableData = {
  data: [
    {
      "record_date": "2023-07-12",
      "debt_held_public_amt": "25633821130387.02",
      "intragov_hold_amt": "6884574686385.15",
      "tot_pub_debt_out_amt": "32518395816772.17",
      "src_line_nbr": "1",
      "record_fiscal_year": "2023",
      "record_fiscal_quarter": "4",
      "record_calendar_year": "2023",
      "record_calendar_quarter": "3",
      "record_calendar_month": "07",
      "record_calendar_day": "12"
    },
    {
      "record_date": "2023-07-11",
      "debt_held_public_amt": "25633781683720.91",
      "intragov_hold_amt": "6904685134353.32",
      "tot_pub_debt_out_amt": "32538466818074.23",
      "src_line_nbr": "1",
      "record_fiscal_year": "2023",
      "record_fiscal_quarter": "4",
      "record_calendar_year": "2023",
      "record_calendar_quarter": "3",
      "record_calendar_month": "07",
      "record_calendar_day": "11"
    },
    {
      "record_date": "2023-07-10",
      "debt_held_public_amt": "25588803096223.83",
      "intragov_hold_amt": "6892303235964.87",
      "tot_pub_debt_out_amt": "32481106332188.70",
      "src_line_nbr": "1",
      "record_fiscal_year": "2023",
      "record_fiscal_quarter": "4",
      "record_calendar_year": "2023",
      "record_calendar_quarter": "3",
      "record_calendar_month": "07",
      "record_calendar_day": "10"
    }
  ],
  meta: {
    "count": 2,
    "labels": {
    "record_date": "Record Date",
      "debt_held_public_amt": "Debt Held by the Public",
      "intragov_hold_amt": "Intragovernmental Holdings",
      "tot_pub_debt_out_amt": "Total Public Debt Outstanding",
      "src_line_nbr": "Source Line Number",
      "record_fiscal_year": "Fiscal Year",
      "record_fiscal_quarter": "Fiscal Quarter Number",
      "record_calendar_year": "Calendar Year",
      "record_calendar_quarter": "Calendar Quarter Number",
      "record_calendar_month": "Calendar Month Number",
      "record_calendar_day": "Calendar Day Number"
    },
    "dataTypes": {
    "record_date": "DATE",
      "debt_held_public_amt": "CURRENCY",
      "intragov_hold_amt": "CURRENCY",
      "tot_pub_debt_out_amt": "CURRENCY",
      "src_line_nbr": "NUMBER",
      "record_fiscal_year": "YEAR",
      "record_fiscal_quarter": "QUARTER",
      "record_calendar_year": "YEAR",
      "record_calendar_quarter": "QUARTER",
      "record_calendar_month": "MONTH",
      "record_calendar_day": "DAY"
    },
    "dataFormats": {
    "record_date": "YYYY-MM-DD",
      "debt_held_public_amt": "$10.20",
      "intragov_hold_amt": "$10.20",
      "tot_pub_debt_out_amt": "$10.20",
      "src_line_nbr": "10.2",
      "record_fiscal_year": "YYYY",
      "record_fiscal_quarter": "Q",
      "record_calendar_year": "YYYY",
      "record_calendar_quarter": "Q",
      "record_calendar_month": "MM",
      "record_calendar_day": "DD"
    },
      "total-count": 2,
      "total-pages": 1
    }

};

describe('react-table', () => {

  it('table renders', () => {
    const instance = render(<DataTable rawData={mockTableData} defaultSelectedColumns={null} />);
    expect(instance).toBeTruthy();
  });

  it('renders headers and column checkboxs', () => {
    const instance = render(<DataTable rawData={mockTableData} defaultSelectedColumns={null} />);
    // Column checkbox
    expect(instance.getAllByText('Record Date')[0]).toBeInTheDocument();
    // Column header
    expect(instance.getAllByText('Record Date')[1]).toBeInTheDocument();
  });

  it('Clicking on header sorts column', () => {
    const instance = render(<DataTable rawData={mockTableData} defaultSelectedColumns={null} />);
    // Column header
    expect(instance.getAllByText('Record Date')[1]).toBeInTheDocument();
    expect(instance.getByTestId('header-sorter-record_date')).toBeInTheDocument();
    fireEvent.click(instance.getByTestId('header-sorter-record_date'));

  });

});
