import { render, cleanup, waitFor, within } from '@testing-library/react';
import React from 'react';
import fetchMock from 'fetch-mock';
import CurrencyExchangeRatesConverter from './index';
import { fireEvent } from '@testing-library/dom';
import Analytics from '../../utils/analytics/analytics';
import { XRMockData } from './currency-exchange-rates-converter-test-helper';

jest.useFakeTimers();

describe('exchange rates converter', () => {
  beforeEach(() => {
    fetchMock.get(
      `https://www.transparency.treasury.gov/services/api/fiscal_service/v1/accounting/od/rates_of_exchange?filter=record_date:gte:2022-12-31&sort=currency,-effective_date&page[size]=10000`,
      XRMockData,
      { overwriteRoutes: true },
      { repeat: 1 }
    );
    fetchMock.get(
      `https://www.transparency.treasury.gov/services/api/fiscal_service/v1/accounting/od/rates_of_exchange?filter=record_date:gte:2022-12-31&sort=-effective_date`,
      XRMockData,
      { overwriteRoutes: true },
      { repeat: 1 }
    );
  });

  afterEach(cleanup);

  it('Renders the exchange rates converter page', async () => {
    const { getAllByText } = render(<CurrencyExchangeRatesConverter />);

    await waitFor(() => getAllByText('Currency Exchange Rates Converter'));

    expect(
      getAllByText('Currency Exchange Rates Converter').length
    ).toBeGreaterThan(0);
  });

  it('Selecting year from year dropdown changes available quarters and defaults to correct value', async () => {
    const { getByTestId, getByText } = render(
      <CurrencyExchangeRatesConverter />
    );
    await waitFor(() => getByText('Year'));

    const yearSelector = within(getByTestId('year-selector')).getByTestId(
      'toggle-button'
    );
    expect(yearSelector).toBeDefined();

    // Click on parent selector
    fireEvent.click(yearSelector);

    const yearSelectorOptions = within(
      getByTestId('year-selector')
    ).getAllByTestId('selector-option');
    expect(yearSelectorOptions[0]).toBeDefined();

    // Click on '2022'
    fireEvent.click(yearSelectorOptions[1]);

    // Make sure that quarters have changed to '2nd' and '1st'
    const quarterSelector2022 = within(
      getByTestId('quarter-selector')
    ).getByTestId('toggle-button');
    expect(quarterSelector2022).toBeDefined();
    // Make sure it defaults to latest quarter '2nd'
    expect(quarterSelector2022.innerHTML).toContain('2nd');
    fireEvent.click(quarterSelector2022);
    const quarterSelectorOptions2022 = within(
      getByTestId('quarter-selector')
    ).getAllByTestId('selector-option');
    expect(quarterSelectorOptions2022.length).toEqual(2);
    // Make sure quarters are in ascending order
    expect(quarterSelectorOptions2022[0].innerHTML).toContain('1st');
    expect(quarterSelectorOptions2022[1].innerHTML).toContain('2nd');
  });

  it('year dropdown selected for year with 1 available quarter', async () => {
    const { getByTestId, getByText } = render(
      <CurrencyExchangeRatesConverter />
    );
    await waitFor(() => getByText('Year'));

    const yearSelector = within(getByTestId('year-selector')).getByTestId(
      'toggle-button'
    );
    expect(yearSelector).toBeDefined();

    fireEvent.click(yearSelector);

    const yearSelectorOptions = within(
      getByTestId('year-selector')
    ).getAllByTestId('selector-option');
    expect(yearSelectorOptions[0]).toBeDefined();

    // Click on 2023
    fireEvent.click(yearSelectorOptions[0]);

    // Make sure that quarters have changed to '2nd'
    const quarterSelector2023 = within(
      getByTestId('quarter-selector')
    ).getByTestId('toggle-button');
    expect(quarterSelector2023).toBeDefined();
    // Make sure it defaults to latest quarter '2nd'
    expect(quarterSelector2023.innerHTML).toContain('2nd');
    fireEvent.click(quarterSelector2023);
    const quarterSelectorOptions2023 = within(
      getByTestId('quarter-selector')
    ).getAllByTestId('selector-option');
    expect(quarterSelectorOptions2023.length).toEqual(1);
    expect(quarterSelectorOptions2023[0].innerHTML).toContain('2nd');
  });

  it('quarter selector changes exchange rate and effective date values, changing year value also updates to latest quarter', async () => {
    const { getByTestId, getByText } = render(
      <CurrencyExchangeRatesConverter />
    );
    await waitFor(() => getByText('Quarter'));

    const yearSelector = within(getByTestId('year-selector')).getByTestId(
      'toggle-button'
    );

    fireEvent.click(yearSelector);

    const yearSelectorOptions = within(
      getByTestId('year-selector')
    ).getAllByTestId('selector-option');

    // Checking displayed exchange rate
    expect(getByTestId('exchange-values').innerHTML).toContain(
      '1.00 U.S. Dollar = 43.60 Euro Zone-Euro'
    );
    // Checking displayed effective date
    expect(getByText('December 31, 2023')).toBeInTheDocument();

    // Click on 2022
    fireEvent.click(yearSelectorOptions[1]);

    expect(getByTestId('exchange-values').innerHTML).toContain(
      '1.00 U.S. Dollar = 89.11 Euro Zone-Euro'
    );
    expect(getByText('December 31, 2022')).toBeInTheDocument();

    const quarterSelector = within(getByTestId('quarter-selector')).getByTestId(
      'toggle-button'
    );
    expect(quarterSelector).toBeDefined();
    expect(quarterSelector.innerHTML).toContain('2nd');
    fireEvent.click(quarterSelector);
    const quarterSelectorOptions = within(
      getByTestId('quarter-selector')
    ).getAllByTestId('selector-option');
    fireEvent.click(quarterSelectorOptions[0]);
    expect(getByTestId('exchange-values').innerHTML).toContain('99.11');
    expect(getByText('January 31, 2022')).toBeInTheDocument();
  });

  it('input boxes do not allow letters', async () => {
    const { getByTestId, getByText } = render(
      <CurrencyExchangeRatesConverter />
    );
    await waitFor(() => getByText('U.S. Dollar'));

    const usBox = within(getByTestId('box-container')).getByRole('spinbutton', {
      name: 'Enter U.S. Dollar Amount',
    });
    const nonUSBox = within(getByTestId('box-container')).getByRole(
      'spinbutton',
      {
        name: 'Enter Euro Zone-Euro Amount',
      }
    );

    expect(usBox.value).toBe('1.00');
    expect(nonUSBox.value).toBe('43.60');

    fireEvent.change(usBox, { target: { value: 'Hi there!' } });

    expect(usBox.value).toBe('');

    fireEvent.change(nonUSBox, { target: { value: 'Hi there!' } });

    expect(nonUSBox.value).toBe('');
  });

  it('typing in the US Dollar box changes the non US currency exchange value appropriately', async () => {
    const { getByTestId, getByText } = render(
      <CurrencyExchangeRatesConverter />
    );
    await waitFor(() => getByText('U.S. Dollar'));

    const usBox = within(getByTestId('box-container')).getByRole('spinbutton', {
      name: 'Enter U.S. Dollar Amount',
    });
    fireEvent.change(usBox, { target: { value: '2.00' } });

    const nonUSBox = within(getByTestId('box-container')).getByRole(
      'spinbutton',
      {
        name: 'Enter Euro Zone-Euro Amount',
      }
    );

    // Prev value was 43.60
    expect(nonUSBox.value).toBe('87.2');

    // Expect other box to empty when current one emptied
    fireEvent.change(usBox, { target: { value: '' } });

    expect(nonUSBox.value).toBe('');
  });

  it('typing in the non US currency box changes the US dollar exchange value appropriately', async () => {
    const { getByTestId, getByText } = render(
      <CurrencyExchangeRatesConverter />
    );
    await waitFor(() => getByText('U.S. Dollar'));

    const nonUSBox = within(getByTestId('box-container')).getByRole(
      'spinbutton',
      {
        name: 'Enter Euro Zone-Euro Amount',
      }
    );

    fireEvent.change(nonUSBox, { target: { value: '2' } });

    const usBox = within(getByTestId('box-container')).getByRole('spinbutton', {
      name: 'Enter U.S. Dollar Amount',
    });

    // Prev value was 1.00
    expect(usBox.value).toBe('0.05');

    // Expect other box to empty when current one emptied
    fireEvent.change(nonUSBox, { target: { value: '' } });

    expect(usBox.value).toBe('');
  });

  it('try to select a currency other than euro that is greyed out', async () => {
    const { getByTestId, getByText, getByRole } = render(
      <CurrencyExchangeRatesConverter />
    );
    await waitFor(() => getByText('U.S. Dollar'));

    const nonUSBox = within(getByTestId('box-container')).getByTestId(
      'non-us-box'
    );

    const comboBox = within(nonUSBox).getByRole('button');

    fireEvent.click(comboBox);

    const currencySelector = getByRole('textbox');

    // Search list
    fireEvent.change(currencySelector, { target: { value: 'Other' } });

    const optionList = within(nonUSBox).getByTestId('dropdown-list');

    const option = within(optionList).getByText('Other OtherDollar');

    fireEvent.click(option);

    expect(getByTestId('exchange-values').innerHTML).toContain(
      '1.00 U.S. Dollar = 43.60 Euro Zone-Euro'
    );
  });

  it('select a currency other than euro that is not greyed out', async () => {
    const { getByTestId, getByText, getByRole } = render(
      <CurrencyExchangeRatesConverter />
    );
    await waitFor(() => getByText('U.S. Dollar'));

    const nonUSBox = within(getByTestId('box-container')).getByTestId(
      'non-us-box'
    );

    const comboBox = within(nonUSBox).getByRole('button');

    fireEvent.click(comboBox);

    const currencySelector = getByRole('textbox');

    // Search list
    fireEvent.change(currencySelector, { target: { value: 'Other' } });

    const optionList = within(nonUSBox).getByTestId('dropdown-list');

    const option = within(optionList).getByText('Other OtherDollar2');

    fireEvent.click(option);

    expect(getByTestId('exchange-values').innerHTML).toContain(
      '1.00 U.S. Dollar = 150 Other OtherDollar2'
    );
  });

  it('renders the most recent effective date', async () => {
    const { getByText } = render(<CurrencyExchangeRatesConverter />);
    await waitFor(() => getByText('U.S. Dollar'));

    expect(
      getByText('December 31, 2022 to December 31, 2023', { exact: false })
    ).toBeInTheDocument();
  });

  it('displays an error message when an invalid date is selected for the current currency', async () => {
    const { getByText, queryByText, getByTestId, getByRole } = render(
      <CurrencyExchangeRatesConverter />
    );

    await waitFor(() => getByText('U.S. Dollar'));

    const nonUSBox = within(getByTestId('box-container')).getByTestId(
      'non-us-box'
    );
    const comboBox = within(nonUSBox).getByRole('button');

    fireEvent.click(comboBox);

    const currencySearchBar = getByRole('textbox');

    // Search list and select currency
    fireEvent.change(currencySearchBar, { target: { value: 'OtherDollar2' } });

    const optionList = within(nonUSBox).getByTestId('dropdown-list');
    const option = within(optionList).getByText('Other OtherDollar2');

    fireEvent.click(option);

    expect(getByTestId('exchange-values').innerHTML).toContain(
      '1.00 U.S. Dollar = 150 Other OtherDollar2'
    );

    //Change year to 2022
    let yearSelector = within(getByTestId('year-selector')).getByTestId(
      'toggle-button'
    );

    fireEvent.click(yearSelector);

    let yearSelectorOptions = within(
      getByTestId('year-selector')
    ).getAllByTestId('selector-option');
    fireEvent.click(yearSelectorOptions[1]);

    //Banner should appear
    await waitFor(() => getByTestId('banner'));
    expect(
      within(getByTestId('banner')).getByText(
        'No exchange rate available for this date range.'
      )
    ).toBeInTheDocument();
    expect(queryByText('1.00 U.S. Dollar')).not.toBeInTheDocument();

    // Change selection to a valid option
    yearSelector = within(getByTestId('year-selector')).getByTestId(
      'toggle-button'
    );
    fireEvent.click(yearSelector);

    yearSelectorOptions = within(getByTestId('year-selector')).getAllByTestId(
      'selector-option'
    );
    fireEvent.click(yearSelectorOptions[0]);

    // Banner should be gone
    await waitFor(() => getByText('1.00 U.S. Dollar', { exact: false }));
    expect(
      queryByText('No exchange rate available for this date range.')
    ).not.toBeInTheDocument();
  });
});

it('calls the appropriate analytics event when year selector is set and current quarter is available', async () => {
  const spy = jest.spyOn(Analytics, 'event');
  const { getByTestId } = render(<CurrencyExchangeRatesConverter />);
  await waitFor(() => getByTestId('year-selector'));

  const yearSelector = within(getByTestId('year-selector')).getByTestId(
    'toggle-button'
  );
  fireEvent.click(yearSelector);

  const yearSelectorOptions = within(
    getByTestId('year-selector')
  ).getAllByTestId('selector-option');
  fireEvent.click(yearSelectorOptions[1]);

  expect(spy).toHaveBeenCalledWith({
    category: 'Exchange Rates Converter',
    action: `Year-Quarter Selection`,
    label: '2022-2',
  });
});

it('calls the appropriate analytics event when year selector is set and current quarter is not available', async () => {
  const spy = jest.spyOn(Analytics, 'event');
  const { getByTestId } = render(<CurrencyExchangeRatesConverter />);
  await waitFor(() => getByTestId('year-selector'));

  // set year to 2022
  const yearSelector = within(getByTestId('year-selector')).getByTestId(
    'toggle-button'
  );
  fireEvent.click(yearSelector);
  const yearSelectorOptions = within(
    getByTestId('year-selector')
  ).getAllByTestId('selector-option');
  fireEvent.click(yearSelectorOptions[1]);

  // set quarter to 1st
  const quarterSelector = within(getByTestId('quarter-selector')).getByTestId(
    'toggle-button'
  );
  fireEvent.click(quarterSelector);
  const quarterSelectorOptions = within(
    getByTestId('quarter-selector')
  ).getAllByTestId('selector-option');
  fireEvent.click(quarterSelectorOptions[0]);

  // set year back to 2023
  const yearSelector2 = within(getByTestId('year-selector')).getByTestId(
    'toggle-button'
  );
  fireEvent.click(yearSelector2);
  const yearSelectorOptions2 = within(
    getByTestId('year-selector')
  ).getAllByTestId('selector-option');
  fireEvent.click(yearSelectorOptions2[0]);

  expect(spy).toHaveBeenCalledWith({
    category: 'Exchange Rates Converter',
    action: `Year-Quarter Selection`,
    label: '2023-2',
  });
});

it('calls the appropriate analytics event when quarter selector is set', async () => {
  const spy = jest.spyOn(Analytics, 'event');
  const { getByText, getByTestId } = render(<CurrencyExchangeRatesConverter />);
  await waitFor(() => getByText('U.S. Dollar'));

  const yearSelector = within(getByTestId('year-selector')).getByTestId(
    'toggle-button'
  );
  fireEvent.click(yearSelector);

  const yearSelectorOptions = within(
    getByTestId('year-selector')
  ).getAllByTestId('selector-option');
  fireEvent.click(yearSelectorOptions[1]);

  const quarterSelector = within(getByTestId('quarter-selector')).getByTestId(
    'toggle-button'
  );
  fireEvent.click(quarterSelector);

  const quarterSelectorOptions = within(
    getByTestId('quarter-selector')
  ).getAllByTestId('selector-option');
  fireEvent.click(quarterSelectorOptions[1]);

  expect(spy).toHaveBeenCalledWith({
    category: 'Exchange Rates Converter',
    action: `Year-Quarter Selection`,
    label: '2022-2',
  });
});

it('does not call analytic event when Effective Date info tip is hovered over and left before 3 seconds', async () => {
  const spy = jest.spyOn(Analytics, 'event');
  const { getByTestId } = render(<CurrencyExchangeRatesConverter />);
  await waitFor(() => getByTestId('effective-date-info-tip'));

  const effectiveDateInfo = getByTestId('effective-date-info-tip');
  fireEvent.mouseOver(effectiveDateInfo);
  fireEvent.focusOut(effectiveDateInfo);

  jest.advanceTimersByTime(5000);

  expect(spy).not.toHaveBeenCalledWith({
    category: 'Exchange Rates Converter',
    action: `Additional Info Hover`,
    label: 'Additional Effective Date Info',
  });
  jest.runAllTimers();
});

it('does not call analytic event when Effective Date info tip is hovered over in first 3 seconds', async () => {
  const spy = jest.spyOn(Analytics, 'event');
  const { getByTestId } = render(<CurrencyExchangeRatesConverter />);
  await waitFor(() => getByTestId('effective-date-info-tip'));

  const effectiveDateInfo = getByTestId('effective-date-info-tip');
  fireEvent.mouseOver(effectiveDateInfo);

  jest.advanceTimersByTime(1000);

  expect(spy).not.toHaveBeenCalledWith({
    category: 'Exchange Rates Converter',
    action: `Additional Info Hover`,
    label: 'Additional Effective Date Info',
  });
  jest.runAllTimers();
});

it('calls the appropriate analytics event when Effective Date info tip is hovered over', async () => {
  const spy = jest.spyOn(Analytics, 'event');
  const { getByTestId } = render(<CurrencyExchangeRatesConverter />);
  await waitFor(() => getByTestId('effective-date-info-tip'));

  const effectiveDateInfo = getByTestId('effective-date-info-tip');
  fireEvent.mouseOver(effectiveDateInfo);
  jest.advanceTimersByTime(5000);

  expect(spy).toHaveBeenCalledWith({
    category: 'Exchange Rates Converter',
    action: `Additional Info Hover`,
    label: 'Additional Effective Date Info',
  });
  jest.runAllTimers();
});

it('does not call analytics event when Foreign Currency info tip is hovered over and left before 3 seconds', async () => {
  const spy = jest.spyOn(Analytics, 'event');
  const { getByTestId } = render(<CurrencyExchangeRatesConverter />);
  await waitFor(() => getByTestId('foreign-currency-info-tip'));

  const foreignCurrencyInfo = getByTestId('foreign-currency-info-tip');
  fireEvent.mouseOver(foreignCurrencyInfo);
  fireEvent.focusOut(foreignCurrencyInfo);
  jest.advanceTimersByTime(5000);

  expect(spy).not.toHaveBeenCalledWith({
    category: 'Exchange Rates Converter',
    action: `Additional Info Hover`,
    label: 'Additional Foreign Currency Info',
  });
  jest.runAllTimers();
});

it('does not call analytics event when Foreign Currency info tip is hovered over in first 3 seconds', async () => {
  const spy = jest.spyOn(Analytics, 'event');
  const { getByTestId } = render(<CurrencyExchangeRatesConverter />);
  await waitFor(() => getByTestId('foreign-currency-info-tip'));

  const foreignCurrencyInfo = getByTestId('foreign-currency-info-tip');
  fireEvent.mouseOver(foreignCurrencyInfo);
  jest.advanceTimersByTime(1000);

  expect(spy).not.toHaveBeenCalledWith({
    category: 'Exchange Rates Converter',
    action: `Additional Info Hover`,
    label: 'Additional Foreign Currency Info',
  });
  jest.runAllTimers();
});

it('calls the appropriate analytics event when Foreign Currency info tip is hovered over', async () => {
  const spy = jest.spyOn(Analytics, 'event');
  const { getByTestId } = render(<CurrencyExchangeRatesConverter />);
  await waitFor(() => getByTestId('foreign-currency-info-tip'));

  const foreignCurrencyInfo = getByTestId('foreign-currency-info-tip');
  fireEvent.mouseOver(foreignCurrencyInfo);
  jest.advanceTimersByTime(5000);

  expect(spy).toHaveBeenCalledWith({
    category: 'Exchange Rates Converter',
    action: `Additional Info Hover`,
    label: 'Additional Foreign Currency Info',
  });
  jest.runAllTimers();
});

it('calls the appropriate analytics event when TRRE link is clicked', async () => {
  const spy = jest.spyOn(Analytics, 'event');
  const { getByText } = render(<CurrencyExchangeRatesConverter />);
  await waitFor(() => getByText('U.S. Dollar'));

  const trreLink = getByText('Treasury Reporting Rates of Exchange');
  fireEvent.click(trreLink);

  expect(spy).toHaveBeenCalledWith({
    category: 'Exchange Rates Converter',
    action: `Citation Click`,
    label: 'Treasury Reporting Rates of Exchange Dataset',
  });
});

it('calls the appropriate analytics event when Treasury Financial Manual link is clicked', async () => {
  const spy = jest.spyOn(Analytics, 'event');
  const { getByText } = render(<CurrencyExchangeRatesConverter />);
  await waitFor(() => getByText('U.S. Dollar'));

  const treasuryFinancialManualLink = getByText(
    'Treasury Financial Manual, volume 1, part 2, section 3235'
  );
  fireEvent.click(treasuryFinancialManualLink);

  expect(spy).toHaveBeenCalledWith({
    category: 'Exchange Rates Converter',
    action: `Citation Click`,
    label: 'Treasury Financial Manual',
  });
});

it('calls the appropriate analytics event when new value is entered into non US currency field', async () => {
  const spy = jest.spyOn(Analytics, 'event');
  const { getByText, getByTestId } = render(<CurrencyExchangeRatesConverter />);
  await waitFor(() => getByText('U.S. Dollar'));

  const nonUSBox = within(getByTestId('box-container')).getByRole(
    'spinbutton',
    {
      name: 'Enter Euro Zone-Euro Amount',
    }
  );
  fireEvent.change(nonUSBox, { target: { value: '1.11' } });

  jest.advanceTimersByTime(5000);

  expect(spy).toHaveBeenCalledWith({
    category: 'Exchange Rates Converter',
    action: `Foreign Currency Value Entered`,
    label: '1.11',
  });
  jest.runAllTimers();
});

it('does not call analytic event when new value is entered into non US currency field before 3 seconds pass', async () => {
  const spy = jest.spyOn(Analytics, 'event');
  const { getByTestId } = render(<CurrencyExchangeRatesConverter />);
  await waitFor(() => getByTestId('box-container'));

  const nonUSBox = within(getByTestId('box-container')).getByRole(
    'spinbutton',
    {
      name: 'Enter Euro Zone-Euro Amount',
    }
  );
  fireEvent.change(nonUSBox, { target: { value: '2.22' } });

  jest.advanceTimersByTime(1000);

  expect(spy).not.toHaveBeenCalledWith({
    category: 'Exchange Rates Converter',
    action: `Foreign Currency Value Entered`,
    label: '2.22',
  });
  jest.runAllTimers();
});

it('does not call analytic event when non US currency field is empty', async () => {
  const spy = jest.spyOn(Analytics, 'event');
  const { getByTestId } = render(<CurrencyExchangeRatesConverter />);
  await waitFor(() => getByTestId('box-container'));

  const nonUSBox = within(getByTestId('box-container')).getByRole(
    'spinbutton',
    {
      name: 'Enter Euro Zone-Euro Amount',
    }
  );
  fireEvent.change(nonUSBox, { target: { value: '' } });

  jest.advanceTimersByTime(5000);

  expect(spy).not.toHaveBeenCalledWith({
    category: 'Exchange Rates Converter',
    action: `Foreign Currency Value Entered`,
    label: '',
  });
  jest.runAllTimers();
});

it('calls the appropriate analytics event when new value is entered into US currency field', async () => {
  const spy = jest.spyOn(Analytics, 'event');
  const { getByTestId } = render(<CurrencyExchangeRatesConverter />);
  await waitFor(() => getByTestId('box-container'));

  const usBox = within(getByTestId('box-container')).getByRole('spinbutton', {
    name: 'Enter U.S. Dollar Amount',
  });

  fireEvent.change(usBox, { target: { value: '111.11' } });

  jest.advanceTimersByTime(5000);

  expect(spy).toHaveBeenCalledWith({
    category: 'Exchange Rates Converter',
    action: `USD Value Entered`,
    label: '111.11',
  });
  jest.runAllTimers();
});

it('does not call analytic event when new value is entered into US currency field before 3 seconds pass', async () => {
  const spy = jest.spyOn(Analytics, 'event');
  const { getByTestId } = render(<CurrencyExchangeRatesConverter />);
  await waitFor(() => getByTestId('box-container'));

  const usBox = within(getByTestId('box-container')).getByRole('spinbutton', {
    name: 'Enter U.S. Dollar Amount',
  });

  fireEvent.change(usBox, { target: { value: '222.22' } });
  jest.advanceTimersByTime(1000);

  expect(spy).not.toHaveBeenCalledWith({
    category: 'Exchange Rates Converter',
    action: `USD Value Entered`,
    label: '222.22',
  });
  jest.runAllTimers();
});

it('does not call analytic event when US currency field is empty', async () => {
  const spy = jest.spyOn(Analytics, 'event');
  const { getByTestId } = render(<CurrencyExchangeRatesConverter />);
  await waitFor(() => getByTestId('box-container'));

  const usBox = within(getByTestId('box-container')).getByRole('spinbutton', {
    name: 'Enter U.S. Dollar Amount',
  });

  fireEvent.change(usBox, { target: { value: '' } });
  jest.advanceTimersByTime(5000);

  expect(spy).not.toHaveBeenCalledWith({
    category: 'Exchange Rates Converter',
    action: `USD Value Entered`,
    label: '',
  });
  jest.runAllTimers();
});
