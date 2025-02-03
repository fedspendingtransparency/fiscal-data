import React from 'react';
import TableNotice from './table-notice';
import { render } from '@testing-library/react';

describe('Table Notice', () => {
  it('renders the table notice', () => {
    const heading = 'Mock Heading!';
    const bodyText = 'Mock body text.';
    const { getByText } = render(<TableNotice heading={heading} bodyText={bodyText} />);

    expect(getByText(heading)).toBeInTheDocument();
    expect(getByText(bodyText)).toBeInTheDocument();
  });
});
