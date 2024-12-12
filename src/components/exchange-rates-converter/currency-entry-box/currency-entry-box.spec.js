import { render, fireEvent, screen } from '@testing-library/react';
import React from 'react';
import CurrencyEntryBox from './currency-entry-box';

describe('Currency entry box', () => {
  const currencyName = 'U.S. Dollar';
  it('Renders the provided currency name', () => {
    const { getByText } = render(<CurrencyEntryBox defaultCurrency={currencyName} />);
    expect(getByText(currencyName)).toBeInTheDocument();
  });

  it('renders the input box', () => {
    const { getByRole } = render(<CurrencyEntryBox selectedCurrency={{ label: 'Euro Zone-Euro' }} dropdown={true} options={[]} />);

    expect(getByRole('spinbutton', { name: 'Enter Euro Zone-Euro Amount' })).toBeInTheDocument();
  });

  it('Renders the provided currency name', () => {
    const { getByText } = render(<CurrencyEntryBox defaultCurrency={currencyName} currencyValue="0" header="U.S. DOLLAR" onCurrencyValueChange={jest.fn()} />);
    expect(getByText(currencyName)).toBeInTheDocument();
  });

  // it('renders the input box when currencyValue is not "--"', () => {
  //   render(<CurrencyEntryBox defaultCurrency="Euro" currencyValue="10" header="Euro Zone-Euro" onCurrencyValueChange={jest.fn()} />);
  //   expect(screen.getByRole('spinbutton', { name: 'Enter Euro Zone-Euro Amount' })).toBeInTheDocument();
  // });
  
  it('renders "--" instead of input when currencyValue is "--"', () => {
    const { getByText } = render(<CurrencyEntryBox defaultCurrency="Euro" currencyValue="--" header="Some Header" onCurrencyValueChange={jest.fn()} />);
    expect(getByText('--')).toBeInTheDocument();
    expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();
  });

  // it('calls onCurrencyValueChange when user types in the input', () => {
  //   const mockChange = jest.fn();
  //   render(<CurrencyEntryBox defaultCurrency="Euro" currencyValue="10" header="Euro Zone-Euro" onCurrencyValueChange={mockChange} />);
  //   const input = screen.getByRole('spinbutton', { name: 'Enter Euro Zone-Euro Amount' });
  //   fireEvent.change(input, { target: { value: '15' } });
  //   expect(mockChange).toHaveBeenCalled();
  // });
  
  // it('renders ComboCurrencySelect when dropdown is true', () => {
  //   render(
  //     <CurrencyEntryBox
  //       dropdown={true}
  //       defaultCurrency="Euro"
  //       currencyValue="10"
  //       header="Euro Zone-Euro"
  //       onCurrencyValueChange={jest.fn()}
  //       onCurrencyChange={jest.fn()}
  //       options={[{ label: 'Euro Zone-Euro', value: 1 }]}
  //       selectedCurrency={{ label: 'Euro Zone-Euro', value: 1 }}
  //     />
  //   );
  //   expect(screen.getByRole('combobox')).toBeInTheDocument();
  // });

  it('renders default currency span when dropdown is false', () => {
    const { getByText } = render(
      <CurrencyEntryBox
        dropdown={false}
        defaultCurrency="Euro"
        currencyValue="10"
        header="Euro Zone-Euro"
        onCurrencyValueChange={jest.fn()}
      />
    );
    expect(getByText('Euro')).toBeInTheDocument();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  // it('applies active classes on focus and removes on blur', () => {
  //   const { getByRole, container } = render(
  //     <CurrencyEntryBox
  //       dropdown={false}
  //       defaultCurrency="Euro"
  //       currencyValue="10"
  //       header="Euro Zone-Euro"
  //       onCurrencyValueChange={jest.fn()}
  //     />
  //   );
  //   const input = getByRole('spinbutton', { name: 'Enter Euro Zone-Euro Amount' });
  //   fireEvent.focus(input);
  //   expect(container.querySelector('.activeBorder')).toBeInTheDocument();
  //   expect(container.querySelector('.activeLabel')).toBeInTheDocument();
    
  //   fireEvent.blur(input);
  //   expect(container.querySelector('.activeBorder')).not.toBeInTheDocument();
  //   expect(container.querySelector('.activeLabel')).not.toBeInTheDocument();
  // });

  it('shows the correct icon for U.S. DOLLAR vs foreign', () => {
    const { rerender, container } = render(
      <CurrencyEntryBox
        defaultCurrency="U.S. Dollar"
        currencyValue="10"
        header="U.S. DOLLAR"
        onCurrencyValueChange={jest.fn()}
      />
    );
    // faDollarSign icon check
    expect(container.querySelector('svg.fa-dollar-sign')).toBeInTheDocument();

    rerender(
      <CurrencyEntryBox
        defaultCurrency="Euro"
        currencyValue="10"
        header="Euro Zone-Euro"
        onCurrencyValueChange={jest.fn()}
      />
    );
    // faGlobe icon check
    expect(container.querySelector('svg.fa-globe')).toBeInTheDocument();
  });

  it('handles tooltip hover events for analytics', () => {
    jest.useFakeTimers();
    const { getByTestId } = render(
      <CurrencyEntryBox
        defaultCurrency="Euro"
        currencyValue="10"
        header="Euro Zone-Euro"
        tooltip={<div>Tooltip Info</div>}
        onCurrencyValueChange={jest.fn()}
      />
    );

    const tooltipTrigger = getByTestId('foreign-currency-info-tip');
    fireEvent.mouseEnter(tooltipTrigger);
    jest.advanceTimersByTime(3000);
    // Ideally, here you’d assert that handleHoverInfoTipAnalytics was called.
    // Might need a spy or mock if that’s exported or test side effects if any.
  });



});



