import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react';
import CurrencyEntryBox from './currency-entry-box';

describe('CurrencyEntryBox', () => {
  const defaultProps = {
    defaultCurrency: 'U.S. Dollar',
    currencyValue: '123.45',
    onCurrencyValueChange: jest.fn(),
    testId: 'currency-box',
    header: 'U.S. DOLLAR',
  };

  it('renders the provided currency name', () => {
    render(<CurrencyEntryBox {...defaultProps} />);
    expect(screen.getByText('U.S. Dollar')).toBeInTheDocument();
  });

  it('renders input box with correct aria-label for foreign currency', () => {
    render(
      <CurrencyEntryBox
        {...defaultProps}
        header="FOREIGN CURRENCY"
        selectedCurrency={{ label: 'Euro Zone-Euro', value: 1 }}
        dropdown={true}
        options={[{ label: 'Euro Zone-Euro', value: 1 }]}
      />
    );
    expect(screen.getByRole('spinbutton', { name: 'Enter Euro Zone-Euro Amount' })).toBeInTheDocument();
  });

  it('renders the input box with default U.S. DOLLAR aria-label', () => {
    render(<CurrencyEntryBox {...defaultProps} />);
    expect(screen.getByRole('spinbutton', { name: 'Enter U.S. Dollar Amount' })).toBeInTheDocument();
  });

  it('handles onChange event on input', () => {
    const onCurrencyValueChange = jest.fn();
    render(<CurrencyEntryBox {...defaultProps} onCurrencyValueChange={onCurrencyValueChange} />);
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '200' } });
    expect(onCurrencyValueChange).toHaveBeenCalled();
  });

  it('handles focus and blur events on input', () => {
    render(<CurrencyEntryBox {...defaultProps} />);
    const input = screen.getByRole('spinbutton');
    fireEvent.focus(input);
    fireEvent.blur(input);
  });

  it('handles click event on input to set active state', () => {
    render(<CurrencyEntryBox {...defaultProps} />);
    const input = screen.getByRole('spinbutton');
    fireEvent.click(input);
  });

  it('renders "--" when currencyValue is "--"', () => {
    render(<CurrencyEntryBox {...defaultProps} currencyValue="--" />);
    expect(screen.getByText('--')).toBeInTheDocument();
    expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();
  });

  it('renders currency label tooltip if provided', () => {
    const tooltip = <div>Tooltip Content</div>;
    render(<CurrencyEntryBox {...defaultProps} tooltip={tooltip} />);
    expect(screen.getByText('Country-Currency')).toBeInTheDocument();
  });

  it('fires analytics function after hover on tooltip trigger (foreign currency info)', () => {
    jest.useFakeTimers();
    const { getByTestId } = render(<CurrencyEntryBox {...defaultProps} tooltip="Tooltip Content" />);
    const tooltipTrigger = getByTestId('foreign-currency-info-tip');
    fireEvent.mouseEnter(tooltipTrigger);
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    jest.useRealTimers();
  });

  it('displays ComboCurrencySelect when dropdown=true and options provided', () => {
    const onCurrencyChange = jest.fn();
    render(
      <CurrencyEntryBox
        {...defaultProps}
        dropdown={true}
        onCurrencyChange={onCurrencyChange}
        options={[{ label: 'Euro Zone-Euro', value: 1 }]}
        selectedCurrency={{ label: 'Euro Zone-Euro', value: 1 }}
      />
    );
    expect(screen.getByText('Euro Zone-Euro')).toBeInTheDocument();
  });

  it('renders default currency text if dropdown=false', () => {
    render(<CurrencyEntryBox {...defaultProps} dropdown={false} />);
    expect(screen.getByText('U.S. Dollar')).toBeInTheDocument();
  });

  it('renders globe icon for foreign currency headers', () => {
    render(<CurrencyEntryBox {...defaultProps} header="FOREIGN CURRENCY" />);
    expect(screen.getByText('FOREIGN CURRENCY')).toBeInTheDocument();
  });
})
