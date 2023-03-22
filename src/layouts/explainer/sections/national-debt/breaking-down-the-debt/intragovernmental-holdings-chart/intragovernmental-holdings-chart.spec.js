import {render} from "@testing-library/react";
import React from "react";
import IntragovernmentalHoldingsChart from "./intragovernmental-holdings-chart";
import {nationalDebtSectionIds} from "../../national-debt";

const mockData =
  [
    {
      "Debt Held by the Public": 10.2560154323853,
      "Intragovernmental Holdings": 4.73769361275732,
      "debt_held_public_mil_amt": "10256015.4323853",
      "intragov_hold_mil_amt": "4737693.61275732",
      "record_calendar_year": "2011",
      "record_calendar_month": "10",
      "record_date": "2011-10-31",
      "total": "14.9"
    },
    {
      "Debt Held by the Public": 10.3899577807415,
      "Intragovernmental Holdings": 4.72054076767472,
      "debt_held_public_mil_amt": "10389957.7807415",
      "intragov_hold_mil_amt": "4720540.76767472",
      "record_calendar_year": "2021",
      "record_calendar_month": "10",
      "record_date": "2021-10-31",
      "total": "15.1"
    }
  ];

jest.useFakeTimers();
describe('Intragovernmental Holdings Chart', () => {
  const sectionId = nationalDebtSectionIds[4];

  it('renders the legend', () => {
    const { getByText } = render(
      <IntragovernmentalHoldingsChart sectionId={sectionId} data={mockData} date={new Date()} />
    );

    expect( getByText('Intragovernmental Holdings')).toBeInTheDocument();
    expect( getByText('Debt Held by the Public')).toBeInTheDocument();
  })

  it('renders the markers', () => {
    const { getByText } = render(
      <IntragovernmentalHoldingsChart sectionId={sectionId} data={mockData} date={new Date()} />
    );

    expect(getByText('$10.26 T')).toBeInTheDocument();
    expect(getByText('$4.74 T')).toBeInTheDocument();
    expect(getByText('$10.39 T')).toBeInTheDocument();
    expect(getByText('$4.72 T')).toBeInTheDocument();
  })

  it('markers start with opacity 0', () => {
    const {getByText} = render(
      <IntragovernmentalHoldingsChart sectionId={sectionId} data={mockData} date={new Date()}/>
    );

    expect(getByText('$10.26 T')).toHaveStyle({opacity: 0});
    expect(getByText('$4.74 T')).toHaveStyle({opacity: 0});
    expect(getByText('$10.39 T')).toHaveStyle({opacity: 0});
    expect(getByText('$4.72 T')).toHaveStyle({opacity: 0});
  })

})
