import {render} from '@testing-library/react';
import React from "react";
import {KeyTakeawaysSection} from "./national-debt-key-takeaways";



describe('National Debt Key Takeaways', () => {

  it('renders key takeaways section and text', () => {
    const { getByText } = render(<KeyTakeawaysSection />);
    expect(getByText('mortgage, car loan, and credit cards.', {exact: false})).toBeInTheDocument();
    expect(getByText('The U.S. has carried debt since its inception.', {exact: false})).toBeInTheDocument();
    expect(getByText('The national debt enables the federal government to pay for '
      + 'important programs and services for the American public.', {exact: false})).toBeInTheDocument();
  });

});
