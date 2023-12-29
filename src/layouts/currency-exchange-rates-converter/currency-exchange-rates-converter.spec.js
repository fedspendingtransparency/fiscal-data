import { render, cleanup, waitFor, within, getByTestId } from '@testing-library/react';
import React from 'react';
import fetchMock from 'fetch-mock';
import CurrencyExchangeRatesConverter from './index';
import { labelIcon } from './currency-exchange-rates-converter-helper';
import { fireEvent } from '@testing-library/dom';
import Analytics from '../../utils/analytics/analytics';
import { XRMockData } from './currency-exchange-rates-converter-test-helper';

jest.useFakeTimers();

describe('labelIcon', () => {
  it('returns onlyLable when icon is not provided', () => {
    const label = 'Test Label;';
    const {queryByText, container } = render(labelIcon(label, '', '', false));

    expect(queryByText(label)).toBeTruthy();
    expect(container.querySelector('InfoTip')).toBeNull();
  });

  it('returns correct JSX when an icon is provided', () => {
    const label = 'Test Label;';
    const iconName = 'test-icon'
    const { getByTestId } = render(labelIcon(label, iconName, '', true));

    fireEvent.click(getByTestId('infoTipButton'));
    expect(getByTestId('popupContainer')).toBeTruthy();
  });

});


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

    expect(getAllByText('Currency Exchange Rates Converter').length).toBeGreaterThan(0);
  });



  it('input boxes do not allow letters', async () => {
    const { getByTestId, getByText } = render(<CurrencyExchangeRatesConverter />);
    await waitFor(() => getByText('U.S. Dollar'));

    const usBox = within(getByTestId('box-container')).getByRole('spinbutton', {
      name: 'Enter U.S. Dollar Amount',
    });
    const nonUSBox = within(getByTestId('box-container')).getByRole('spinbutton', {
      name: 'Enter Euro Zone-Euro Amount',
    });

    expect(usBox.value).toBe('1.00');
    expect(nonUSBox.value).toBe('43.60');

    fireEvent.change(usBox, { target: { value: 'Hi there!' } });

    expect(usBox.value).toBe('');

    fireEvent.change(nonUSBox, { target: { value: 'Hi there!' } });

    expect(nonUSBox.value).toBe('');
  });

  it('typing in the US Dollar box changes the non US currency exchange value appropriately', async () => {
    const { getByTestId, getByText } = render(<CurrencyExchangeRatesConverter />);
    await waitFor(() => getByText('U.S. Dollar'));

    const usBox = within(getByTestId('box-container')).getByRole('spinbutton', {
      name: 'Enter U.S. Dollar Amount',
    });
    fireEvent.change(usBox, { target: { value: '2.00' } });

    const nonUSBox = within(getByTestId('box-container')).getByRole('spinbutton', {
      name: 'Enter Euro Zone-Euro Amount',
    });

    // Prev value was 43.60
    expect(nonUSBox.value).toBe('87.20');

    // Expect other box to empty when current one emptied
    fireEvent.change(usBox, { target: { value: '' } });

    expect(nonUSBox.value).toBe('');
  });

  it('typing in the non US currency box changes the US dollar exchange value appropriately', async () => {
    const { getByTestId, getByText } = render(<CurrencyExchangeRatesConverter />);
    await waitFor(() => getByText('U.S. Dollar'));

    const nonUSBox = within(getByTestId('box-container')).getByRole('spinbutton', {
      name: 'Enter Euro Zone-Euro Amount',
    });

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

  it('renders the most recent effective date', async () => {
    const { getByText } = render(<CurrencyExchangeRatesConverter />);
    await waitFor(() => getByText('U.S. Dollar'));

    expect(getByText('December 31, 2022 to December 31, 2023', { exact: false })).toBeInTheDocument();
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

  const treasuryFinancialManualLink = getByText('Treasury Financial Manual, volume 1, part 2, section 3235');
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

  const nonUSBox = within(getByTestId('box-container')).getByRole('spinbutton', {
    name: 'Enter Euro Zone-Euro Amount',
  });
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

  const nonUSBox = within(getByTestId('box-container')).getByRole('spinbutton', {
    name: 'Enter Euro Zone-Euro Amount',
  });
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

  const nonUSBox = within(getByTestId('box-container')).getByRole('spinbutton', {
    name: 'Enter Euro Zone-Euro Amount',
  });
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
