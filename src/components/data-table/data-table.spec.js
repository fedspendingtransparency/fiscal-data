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

const defaultSelectedColumnsMock = ["record_date", "src_line_nbr", "record_calendar_quarter"];
const defaultColLabels = ["Record Date", "Source Line Number", "Calendar Quarter Number"];
const additionalColLabels = Object.values(mockTableData.meta.labels).filter((label) => !defaultColLabels.includes(label));
const allColLabels = defaultColLabels.concat(additionalColLabels);

describe('react-table', () => {

  const setTableColumnSortData = jest.fn();

  it('table renders', () => {
    const instance = render(<DataTable rawData={mockTableData} defaultSelectedColumns={null} pageSize={10} setTableColumnSortData={setTableColumnSortData} />);
    expect(instance).toBeTruthy();
  });

  it('renders headers and column checkboxs', () => {
    const instance = render(<DataTable rawData={mockTableData} defaultSelectedColumns={null} pageSize={10} setTableColumnSortData={setTableColumnSortData} />);
    // Column checkbox
    expect(instance.getAllByText('Record Date')[0]).toBeInTheDocument();
    // Column header
    expect(instance.getAllByText('Record Date')[1]).toBeInTheDocument();
  });

  it('Able to interact with headers for column sort', () => {
    const instance = render(<DataTable rawData={mockTableData} defaultSelectedColumns={null} pageSize={10} setTableColumnSortData={setTableColumnSortData} />);
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
    const instance = render(<DataTable rawData={mockTableData} defaultSelectedColumns={null} pageSize={10} setTableColumnSortData={setTableColumnSortData} />);
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
    const instance = render(<DataTable rawData={mockTableData} defaultSelectedColumns={null} pageSize={2} setTableColumnSortData={setTableColumnSortData} />);
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

  it('initally renders all columns showing when no defaults specified', () => {
    const instance = render(<DataTable 
                            rawData={mockTableData} 
                            defaultSelectedColumns={null} 
                            pageSize={10} 
                            setTableColumnSortData={setTableColumnSortData} />);
    allColLabels.forEach((index) => {
      expect(instance.getAllByRole('columnheader', {name: allColLabels[index]})[0]).toBeInTheDocument();
    });
  });

  it('initally renders only default columns showing when defaults specified', () => {
    const instance = render(<DataTable 
                            rawData={mockTableData} 
                            defaultSelectedColumns={defaultSelectedColumnsMock} 
                            pageSize={10} 
                            setTableColumnSortData={setTableColumnSortData} />);
    // default col in table
    defaultColLabels.forEach((index) => {
      expect(instance.getAllByRole('columnheader', {name: defaultColLabels[index]})[0]).toBeInTheDocument();
    });

    // FAIL -- Default col not implemented yet
    // additional col not in table
    additionalColLabels.forEach((index) => {
      expect(instance.queryAllByRole('columnheader', {name: additionalColLabels[index]})).not.toBeInTheDocument();
    });
  });

  it('resets columns back to default on reset', () => {
    const instance = render(<DataTable 
                            rawData={mockTableData} 
                            defaultSelectedColumns={defaultSelectedColumnsMock} 
                            pageSize={10} 
                            setTableColumnSortData={setTableColumnSortData} />);

    const firstDefaultHeader = instance.queryAllByRole('columnheader', {name: defaultColLabels[0]})[0];
    const firstDefaultCheckbox = instance.getAllByRole('checkbox', {name: defaultColLabels[0]})[0];

    const firstAdditionalHeader = instance.queryAllByRole('columnheader', {name: additionalColLabels[0]})[0];
    const firstAdditionalCheckbox = instance.getAllByRole('checkbox', {name: additionalColLabels[0]})[0];

    const resetColButton = instance.getByRole('button', {name: 'Reset'})[0]; // FAILS -- no reset button yet


    expect(firstDefaultHeader).toBeInTheDocument();
    expect(firstAdditionalHeader).not.toBeInTheDocument(); // FAILS -- all col selected without default implemented
    fireEvent.click(firstDefaultCheckbox);
    fireEvent.click(firstAdditionalCheckbox);
    expect(firstDefaultHeader).not.toBeInTheDocument();
    expect(firstAdditionalHeader).toBeInTheDocument();

    fireEvent.click(resetColButton); // FAILS -- no reset button yet

    // default state
    // default col in table
    defaultColLabels.forEach((index) => {
      expect(instance.getAllByRole('columnheader', {name: defaultColLabels[index]})[0]).toBeInTheDocument(); // FAILS -- no reset to default functionality
    });

    // additional col not in table
    additionalColLabels.forEach((index) => {
      expect(instance.queryAllByRole('columnheader', {name: additionalColLabels[index]})).not.toBeInTheDocument(); // FAILS -- no reset to default functionality
    });
  });

  it('resets columns back to default on reset from select all', () => {
    const instance = render(<DataTable 
                            rawData={mockTableData} 
                            defaultSelectedColumns={defaultSelectedColumnsMock} 
                            pageSize={10} 
                            setTableColumnSortData={setTableColumnSortData} />);

    const selectAll = instance.getByRole('checkbox', {name: 'Select All'})[0];
    const resetColButton = instance.getByRole('button', {name: 'Reset'})[0]; // FAILS -- no reset button yet


    expect(firstDefaultHeader).toBeInTheDocument();
    expect(firstAdditionalHeader).not.toBeInTheDocument(); // FAILS -- all col selected without default implemented
    fireEvent.click(selectAll);
    expect(firstDefaultHeader).toBeInTheDocument();
    expect(firstAdditionalHeader).toBeInTheDocument();

    fireEvent.click(resetColButton); // FAILS -- no reset button yet

    // default state
    // default col in table
    defaultColLabels.forEach((index) => {
      expect(instance.getAllByRole('columnheader', {name: defaultColLabels[index]})[0]).toBeInTheDocument(); // FAILS -- no reset to default functionality
    });

    // additional col not in table
    additionalColLabels.forEach((index) => {
      expect(instance.queryAllByRole('columnheader', {name: additionalColLabels[index]})).not.toBeInTheDocument(); // FAILS -- no reset to default functionality
    });
  });

  it('resets columns back to default on reset from none selected', () => {
    const instance = render(<DataTable 
                            rawData={mockTableData} 
                            defaultSelectedColumns={defaultSelectedColumnsMock} 
                            pageSize={10} 
                            setTableColumnSortData={setTableColumnSortData} />);

    const selectAll = instance.getByRole('checkbox', {name: 'Select All'})[0];
    const resetColButton = instance.getByRole('button', {name: 'Reset'})[0]; // FAILS -- no reset button yet


    expect(firstDefaultHeader).toBeInTheDocument();
    expect(firstAdditionalHeader).not.toBeInTheDocument(); // FAILS -- all col selected without default implemented
    fireEvent.click(selectAll);
    expect(firstDefaultHeader).toBeInTheDocument();
    expect(firstAdditionalHeader).toBeInTheDocument();
    fireEvent.click(selectAll);
    expect(firstDefaultHeader).not.toBeInTheDocument();
    expect(firstAdditionalHeader).not.toBeInTheDocument();

    fireEvent.click(resetColButton); // FAILS -- no reset button yet

    // default state
    // default col in table
    defaultColLabels.forEach((index) => {
      expect(instance.getAllByRole('columnheader', {name: defaultColLabels[index]})[0]).toBeInTheDocument(); // FAILS -- no reset to default functionality
    });

    // additional col not in table
    additionalColLabels.forEach((index) => {
      expect(instance.queryAllByRole('columnheader', {name: additionalColLabels[index]})).not.toBeInTheDocument(); // FAILS -- no reset to default functionality
    });
  });

});
