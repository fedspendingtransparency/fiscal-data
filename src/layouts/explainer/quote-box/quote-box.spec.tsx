import { render } from '@testing-library/react';
import QuoteBox from './quote-box';
import { faFlagUsa } from '@fortawesome/free-solid-svg-icons/faFlagUsa';
import React from 'react';

describe('QuoteBox', () => {
  it('renders its child content to the page', () => {
    const { getByTestId, getByText } = render(
      <QuoteBox icon={faFlagUsa} primaryColor={'red'} secondaryColor={'pink'}>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
      </QuoteBox>
    );
    expect(getByTestId('quote-box')).toBeInTheDocument();
    expect(getByText('Lorem ipsum dolor sit amet, consectetur adipiscing elit')).toBeInTheDocument();
  });
});
