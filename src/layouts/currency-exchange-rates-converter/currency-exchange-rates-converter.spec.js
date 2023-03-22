import {render, cleanup, waitFor, within} from "@testing-library/react";
import React from "react";
import fetchMock from "fetch-mock";
import CurrencyExchangeRatesConverter from "./index";
import {fireEvent} from "@testing-library/dom";



describe('exchange rates converter', () => {

  const mockData = {
    "data": [
      {
        "record_date":"2023-12-31",
        "country":"Euro Zone",
        "currency":"Euro",
        "country_currency_desc":"Euro Zone-Euro",
        "exchange_rate":"43.60",
        "effective_date":"2023-12-31",
        "src_line_nbr":"94",
        "record_fiscal_year":"2023",
        "record_fiscal_quarter":"1",
        "record_calendar_year":"2023",
        "record_calendar_quarter":"2",
        "record_calendar_month":"12",
        "record_calendar_day":"31"
      },
      {
        "record_date":"2022-12-31",
        "country":"Euro Zone",
        "currency":"Euro",
        "country_currency_desc":"Euro Zone-Euro",
        "exchange_rate":"89.11",
        "effective_date":"2022-12-31",
        "src_line_nbr":"1",
        "record_fiscal_year":"2023",
        "record_fiscal_quarter":"1",
        "record_calendar_year":"2022",
        "record_calendar_quarter":"2",
        "record_calendar_month":"12",
        "record_calendar_day":"31"
      },
      {
        "record_date":"2022-01-31",
        "country":"Euro Zone",
        "currency":"Euro",
        "country_currency_desc":"Euro Zone-Euro",
        "exchange_rate":"99.11",
        "effective_date":"2022-01-31",
        "src_line_nbr":"1",
        "record_fiscal_year":"2023",
        "record_fiscal_quarter":"1",
        "record_calendar_year":"2022",
        "record_calendar_quarter":"1",
        "record_calendar_month":"12",
        "record_calendar_day":"31"
      },
      {
        "record_date":"2022-01-31",
        "country":"Other",
        "currency":"OtherDollar",
        "country_currency_desc":"Other OtherDollar",
        "exchange_rate":"200",
        "effective_date":"2022-01-31",
        "src_line_nbr":"1",
        "record_fiscal_year":"2023",
        "record_fiscal_quarter":"1",
        "record_calendar_year":"2022",
        "record_calendar_quarter":"1",
        "record_calendar_month":"12",
        "record_calendar_day":"31"
      },
    ]
  }

  beforeEach(() => {

    fetchMock.get(
      `https://www.transparency.treasury.gov/services/api/fiscal_service/v1/accounting/od/rates_of_exchange?filter=record_date:gte:2022-12-31&sort=currency,-effective_date&page[size]=10000`,
      mockData,
      { overwriteRoutes: true },
      { repeat: 1 }
    );

  });

  afterEach(cleanup);

  it('Renders the exchange rates converter page', async() => {

    const {getAllByText} = render(
      <CurrencyExchangeRatesConverter />
    )

    await waitFor(() => getAllByText('Currency Exchange Rates Converter'));

    expect(getAllByText('Currency Exchange Rates Converter').length).toBeGreaterThan(0);
  });

  it('Selecting year from year dropdown changes available quarters and defaults to correct value', async() => {
    const {getByTestId, getByText} = render(
      <CurrencyExchangeRatesConverter />
    )
    await waitFor(() => getByText('Year'));

    const yearSelector = within(getByTestId('year-selector')).getByTestId('toggle-button');
    expect(yearSelector).toBeDefined();

    // Click on parent selector
    fireEvent.click(yearSelector);

    const yearSelectorOptions = within(getByTestId('year-selector')).getAllByTestId('selector-option');
    expect(yearSelectorOptions[0]).toBeDefined();

    // Click on '2022'
    fireEvent.click(yearSelectorOptions[1]);

    // Make sure that quarters have changed to '4th' and '1st'
    const quarterSelector2022 = within(getByTestId('quarter-selector')).getByTestId('toggle-button');
    expect(quarterSelector2022).toBeDefined();
    // Make sure it defaults to latest quarter '4th'
    expect(quarterSelector2022.innerHTML).toContain('2nd');
    fireEvent.click(quarterSelector2022);
    const quarterSelectorOptions2022 = within(getByTestId('quarter-selector')).getAllByTestId('selector-option');
    expect(quarterSelectorOptions2022.length).toEqual(2);
    // Make sure quarters are in ascending order
    expect(quarterSelectorOptions2022[0].innerHTML).toContain('1st');
    expect(quarterSelectorOptions2022[1].innerHTML).toContain('2nd');

  });

  it('year dropdown selected for year with 1 available quarter', async() => {
    const {getByTestId, getByText} = render(
      <CurrencyExchangeRatesConverter />
    )
    await waitFor(() => getByText('Year'));

    const yearSelector = within(getByTestId('year-selector')).getByTestId('toggle-button');
    expect(yearSelector).toBeDefined();

    fireEvent.click(yearSelector);

    const yearSelectorOptions = within(getByTestId('year-selector')).getAllByTestId('selector-option');
    expect(yearSelectorOptions[0]).toBeDefined();

    // Click on 2023
    fireEvent.click(yearSelectorOptions[0]);

    // Make sure that quarters have changed to '2nd'
    const quarterSelector2023 = within(getByTestId('quarter-selector')).getByTestId('toggle-button');
    expect(quarterSelector2023).toBeDefined();
    // Make sure it defaults to latest quarter '2nd'
    expect(quarterSelector2023.innerHTML).toContain('2nd');
    fireEvent.click(quarterSelector2023);
    const quarterSelectorOptions2023 = within(getByTestId('quarter-selector')).getAllByTestId('selector-option');
    expect(quarterSelectorOptions2023.length).toEqual(1);
    expect(quarterSelectorOptions2023[0].innerHTML).toContain('2nd');

  });

  it('quarter selector changes exchange rate and effective date values, changing year value also updates to latest quarter', async() => {

    const {getByTestId, getByText} = render(
      <CurrencyExchangeRatesConverter />
    )
    await waitFor(() => getByText('Quarter'));

    const yearSelector = within(getByTestId('year-selector')).getByTestId('toggle-button');

    fireEvent.click(yearSelector);

    const yearSelectorOptions = within(getByTestId('year-selector')).getAllByTestId('selector-option');

    // Checking displayed exchange rate
    expect(getByTestId('exchange-values').innerHTML).toContain('1.00 US Dollar = 43.60 Euro Zone-Euro');
    // Checking displayed effective date
    expect(getByText('December 31, 2023')).toBeInTheDocument();

    // Click on 2022
    fireEvent.click(yearSelectorOptions[1]);

    expect(getByTestId('exchange-values').innerHTML).toContain('1.00 US Dollar = 89.11 Euro Zone-Euro');
    expect(getByText('December 31, 2022')).toBeInTheDocument();

    const quarterSelector = within(getByTestId('quarter-selector')).getByTestId('toggle-button');
    expect(quarterSelector).toBeDefined();
    expect(quarterSelector.innerHTML).toContain('2nd');
    fireEvent.click(quarterSelector);
    const quarterSelectorOptions = within(getByTestId('quarter-selector')).getAllByTestId('selector-option');
    fireEvent.click(quarterSelectorOptions[0]);
    expect(getByTestId('exchange-values').innerHTML).toContain('99.11');
    expect(getByText('January 31, 2022')).toBeInTheDocument();

  });

  it('input boxes do not allow letters', async() => {

    const {getByTestId, getByText} = render(
      <CurrencyExchangeRatesConverter />
    )
    await waitFor(() => getByText('US Dollar'));

    const usBox = within(getByTestId('box-container')).getByTestId('input');
    const nonUSBox = within(getByTestId('box-container')).getByTestId('input-dropdown');

    expect(usBox.value).toBe('1.00');
    expect(nonUSBox.value).toBe('43.60');

    fireEvent.change(usBox, {target: { value:'Hi there!'}});

    expect(usBox.value).toBe('');

    fireEvent.change(nonUSBox, {target: { value:'Hi there!'}});

    expect(nonUSBox.value).toBe('');

  });

  it('typing in the US Dollar box changes the non US currency exchange value', async() => {

    const {getByTestId, getByText} = render(
      <CurrencyExchangeRatesConverter />
    )
    await waitFor(() => getByText('US Dollar'));

    const usBox = within(getByTestId('box-container')).getByTestId('input');

    fireEvent.change(usBox, {target: { value:'2.00'}});

    const nonUSBox = within(getByTestId('box-container')).getByTestId('input-dropdown');

    // Prev value was 43.60
    expect(nonUSBox.value).toBe('87.2');

  });


})
