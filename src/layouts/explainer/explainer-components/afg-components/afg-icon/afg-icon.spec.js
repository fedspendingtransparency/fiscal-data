import React from 'react';
import AfgIcon from './afg-icon';
import { render } from '@testing-library/react';
import { faHandHoldingDollar } from '@fortawesome/free-solid-svg-icons/faHandHoldingDollar';

describe('Icon Component', () => {
  it('renders the main icon div and icon', () => {
    const { getByTestId } = render(<AfgIcon faIcon={faHandHoldingDollar} backgroundColor="#0a2f5a" />);
    expect(getByTestId('afg-icon')).toBeInTheDocument();
  });
});
