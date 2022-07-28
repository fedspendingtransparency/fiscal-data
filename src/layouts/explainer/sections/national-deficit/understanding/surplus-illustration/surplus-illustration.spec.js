import React from 'react';
import {render} from '@testing-library/react';
import SurplusIllustration from "./surplus-illustration";

describe('Surplus Illustration', () => {
  it('renders all three tab titles', () => {
    const {getByText} = render(<SurplusIllustration />);
    expect(getByText('Surplus')).toBeInTheDocument();
    expect(getByText('Balanced Budget')).toBeInTheDocument();
    expect(getByText('Deficit')).toBeInTheDocument();
  });

  it('renders the surplus image', () => {
    const {getByTestId} = render(<SurplusIllustration />);
    expect(getByTestId('surplus-image')).toBeInTheDocument();
  });

  it('renders the balanced budget image', () => {
    const {getByTestId, getByText} = render(<SurplusIllustration />);
    const tab = getByText('Balanced Budget');
    tab.click();
    expect(getByTestId('balanced-budget-image')).toBeInTheDocument();
  });

  it('renders the deficit image', () => {
    const {getByTestId, getByText} = render(<SurplusIllustration />);
    const tab = getByText('Deficit');
    tab.click();
    expect(getByTestId('deficit-image')).toBeInTheDocument();
  });
});
