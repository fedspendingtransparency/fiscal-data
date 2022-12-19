import HowMuchDoesTheGovtSpend from "./how-much-does-the-govt-spend";
import { render } from "@testing-library/react";
import React from "react";
import fetchMock from "fetch-mock";
import {fireEvent, waitFor} from "@testing-library/dom";

describe("Federal spending explainer page sections", () => {

  const mockCategoryData = {
    data: [
      {
      record_date:"2022-09-30",
      classification_desc:"Social Security",
      current_month_rcpt_outly_amt:"103522967704.45",
      current_fytd_rcpt_outly_amt:"1218674437413.83",
      prior_fytd_rcpt_outly_amt:"1134592529731.97",
      record_fiscal_year:"2022",
      record_fiscal_quarter:"4",
      record_calendar_year:"2022",
      record_calendar_quarter:"3",
      record_calendar_month:"09",
      record_calendar_day:"30"
      },
    {
      record_date:"2022-09-30",
      classification_desc:"Health",
      current_month_rcpt_outly_amt:"77350813160.23",
      current_fytd_rcpt_outly_amt:"914466284012.76",
      prior_fytd_rcpt_outly_amt:"796762880836.61",
      record_fiscal_year:"2022",
      record_fiscal_quarter:"4",
      record_calendar_year:"2022",
      record_calendar_quarter:"3",
      record_calendar_month:"09",
      record_calendar_day:"30"
    },
    {
      record_date:"2022-09-30",
      classification_desc:"Income Security",
      current_month_rcpt_outly_amt:"58317700145.72",
      current_fytd_rcpt_outly_amt:"865449106216.47",
      prior_fytd_rcpt_outly_amt:"1648844849395.31",
      record_fiscal_year:"2022",
      record_fiscal_quarter:"4",
      record_calendar_year:"2022",
      record_calendar_quarter:"3",
      record_calendar_month:"09",
      record_calendar_day:"30"
    }],
  }

  const mockAgencyData = {
    data: [
      {
        record_date:"2022-09-30",
        classification_desc:"Total--Department of Health and Human Services",
        current_month_gross_outly_amt:"211425005018.79",
        current_month_app_rcpt_amt:"36004920046.49",
        current_month_net_outly_amt:"175420084972.30",
        current_fytd_gross_outly_amt:"1872679625717.31",
        current_fytd_app_rcpt_amt:"229784492160.12",
        current_fytd_net_outly_amt:"1642895133557.19",
        prior_fytd_gross_outly_amt:"1648123109886.83",
        prior_fytd_app_rcpt_amt:"181450014743.21",
        prior_fytd_net_outly_amt:"1466673095143.62",
        record_fiscal_year:"2022",
        record_fiscal_quarter:"4",
        record_calendar_year:"2022",
        record_calendar_quarter:"3",
        record_calendar_month:"09",
        record_calendar_day:"30"
      },
      {
        record_date:"2022-09-30",
        classification_desc:"Total--Social Security Administration",
        current_month_gross_outly_amt:"113495948689.74",
        current_month_app_rcpt_amt:"310189615.13",
        current_month_net_outly_amt:"113185759074.61",
        current_fytd_gross_outly_amt:"1284568137119.34",
        current_fytd_app_rcpt_amt:"2512611220.24",
        current_fytd_net_outly_amt:"1282055525899.10",
        prior_fytd_gross_outly_amt:"1194934627490.41",
        prior_fytd_app_rcpt_amt:"2482060433.42",
        prior_fytd_net_outly_amt:"1192452567056.99",
        record_fiscal_year:"2022",
        record_fiscal_quarter:"4",
        record_calendar_year:"2022",
        record_calendar_quarter:"3",
        record_calendar_month:"09",
        record_calendar_day:"30"
      },
      {
        record_date:"2022-09-30",
        classification_desc:"Total--Department of the Treasury",
        current_month_gross_outly_amt:"72487711777.42",
        current_month_app_rcpt_amt:"49570299032.26",
        current_month_net_outly_amt:"22917412745.16",
        current_fytd_gross_outly_amt:"1228489649994.89",
        current_fytd_app_rcpt_amt:"66267564434.13",
        current_fytd_net_outly_amt:"1162222085560.76",
        prior_fytd_gross_outly_amt:"1720178284909.72",
        prior_fytd_app_rcpt_amt:"86431691665.12",
        prior_fytd_net_outly_amt:"1633746593244.60",
        record_fiscal_year:"2022",
        record_fiscal_quarter:"4",
        record_calendar_year:"2022",
        record_calendar_quarter:"3",
        record_calendar_month:"09",
        record_calendar_day:"30"
      },
    ]
  }

  beforeAll(() => {
    fetchMock.get(
      `https://www.transparency.treasury.gov/services/api/fiscal_service/v1/accounting/mts/mts_table_9?filter=record_type_cd:eq:F,record_calendar_month:eq:09&sort=-record_date,-current_fytd_rcpt_outly_amt&page[size]=19`,
      mockCategoryData,
      { overwriteRoutes: true },
      { repeat: 0 }
    );
    fetchMock.get(
      `https://www.transparency.treasury.gov/services/api/fiscal_service/v1/accounting/mts/mts_table_5?filter=record_calendar_month:eq:09,data_type_cd:eq:T,sequence_level_nbr:eq:2,line_code_nbr:lte:5690&sort=-record_date,-current_fytd_net_outly_amt&page[size]=30`,
      mockAgencyData,
      { overwriteRoutes: true },
      { repeat: 0 }
    );
  })

  it("renders", () => {
    const instance = render(<HowMuchDoesTheGovtSpend />);
    expect(instance).toBeTruthy();
  })
  it("has the right sections", () => {
    const { getByText } = render(<HowMuchDoesTheGovtSpend />);
    expect(getByText("U.S. Government Spending, FY")).toBeDefined();
    expect(getByText("Top 10 Spending by Category and Agency")).toBeDefined();
  })
})
