import { render } from "@testing-library/react";
import React from "react";
import {fireEvent} from "@testing-library/dom";
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
    const instance = render(<DataTable rawData={mockTableData} defaultSelectedColumns={null} pageSize={10} />);
    expect(instance).toBeTruthy();
  });

  it('renders headers and column checkboxs', () => {
    const instance = render(<DataTable rawData={mockTableData} defaultSelectedColumns={null} pageSize={10} />);
    // Column checkbox
    expect(instance.getAllByText('Record Date')[0]).toBeInTheDocument();
    // Column header
    expect(instance.getAllByText('Record Date')[1]).toBeInTheDocument();
  });

  it('Able to interact with headers for column sort', () => {
    const instance = render(<DataTable rawData={mockTableData} defaultSelectedColumns={null} pageSize={10} />);
    // Column header
    expect(instance.getAllByText('Record Date')[1]).toBeInTheDocument();
    // Rows render
    expect(instance.getAllByTestId('row').length).toEqual(3);
    expect(instance.getByTestId('header-sorter-record_date')).toBeInTheDocument();
    expect(instance.getAllByTestId('row')[0].innerHTML).toContain('2023-07-12');
    fireEvent.click(instance.getByTestId('header-sorter-record_date'));
    // Now sorted in desc order
    expect(instance.getAllByTestId('row')[0].innerHTML).toContain('2023-07-10');
  });

  it('Filter column by text search', () => {
    const instance = render(<DataTable rawData={mockTableData} defaultSelectedColumns={null} pageSize={10} />);
    // Column header
    expect(instance.getAllByText('Record Date')[1]).toBeInTheDocument();
    // Rows render
    expect(instance.getAllByTestId('row').length).toEqual(3);
    const columnFilter = instance.getByTestId('column-search-record_date');
    expect(columnFilter).toBeInTheDocument();
    fireEvent.change(columnFilter, {target: {value: '2023-07-10'}});
    // Rows filtered down to 1
    expect(instance.getAllByTestId('row').length).toEqual(1);
    expect(instance.getAllByTestId('row')[0].innerHTML).toContain('2023-07-10');
  });

  it('pagination', () => {
    const instance = render(<DataTable rawData={mockTableData} defaultSelectedColumns={null} pageSize={2} />);
    // Column header
    expect(instance.getAllByText('Record Date')[1]).toBeInTheDocument();
    // Rows render
    expect(instance.getAllByTestId('row').length).toEqual(2);

    // Forward one page
    const forwardOne = instance.getByText('>');
    expect(forwardOne).toBeInTheDocument();
    fireEvent.click(forwardOne);
    expect(instance.getAllByTestId('row').length).toEqual(1);

    // Back one page
    const backOne = instance.getByText('<');
    expect(backOne).toBeInTheDocument();
    fireEvent.click(backOne);
    expect(instance.getAllByTestId('row').length).toEqual(2);

    // Forward to last page
    const forwardLast = instance.getByText('>>');
    expect(forwardLast).toBeInTheDocument();
    fireEvent.click(forwardLast);
    expect(instance.getAllByTestId('row').length).toEqual(1);

    // Back to first page
    const backFirst = instance.getByText('<<');
    expect(backFirst).toBeInTheDocument();
    fireEvent.click(backFirst);
    expect(instance.getAllByTestId('row').length).toEqual(2);

    // Go to specific page
    const input = instance.getByTestId('pagination-text-input');
    expect(input).toBeInTheDocument();
    fireEvent.change(input, {target: {value: '2'}});
    expect(instance.getAllByTestId('row').length).toEqual(1);
    fireEvent.change(input, {target: {value: '1'}});
    expect(instance.getAllByTestId('row').length).toEqual(2);

  });

});
