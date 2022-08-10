import React from 'react';
import {render} from '@testing-library/react';
import SurplusIllustration from "./surplus-illustration";

describe('Surplus Illustration', () => {
  const glossary = [];

  it('renders all three tab titles', () => {
    const {getByText} = render(<SurplusIllustration glossary={glossary} />);
    expect(getByText('Surplus')).toBeInTheDocument();
    expect(getByText('Balanced Budget')).toBeInTheDocument();
    expect(getByText('Deficit')).toBeInTheDocument();
  });

  it('renders the surplus image', () => {
    const {getByTestId} = render(<SurplusIllustration glossary={glossary} />);
    expect(getByTestId('surplus-image')).toBeInTheDocument();
  });

  it('renders the balanced budget image', () => {
    global.console = {warn: jest.fn()}
    const {getByTestId, getByText} = render(<SurplusIllustration glossary={glossary} />);
    const tab = getByText('Balanced Budget');
    tab.click();
    expect(getByTestId('balanced-budget-image')).toBeInTheDocument();
  });

  it('renders the deficit image', () => {
    const {getByTestId, getByText} = render(<SurplusIllustration glossary={glossary} />);
    const tab = getByText('Deficit');
    tab.click();
    expect(getByTestId('deficit-image')).toBeInTheDocument();
  });
});
