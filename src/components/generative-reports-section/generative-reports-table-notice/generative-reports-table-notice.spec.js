import React from 'react';
import GenerativeReportsTableNotice from './generative-reports-table-notice';
import { render } from '@testing-library/react';

describe('Table Notice', () => {
  it('renders the table notice', () => {
    const heading = 'Mock Heading!';
    const bodyText = 'Mock body text.';
    const { getByText } = render(<GenerativeReportsTableNotice heading={heading} bodyText={bodyText} />);

    expect(getByText(heading)).toBeInTheDocument();
    expect(getByText(bodyText)).toBeInTheDocument();
  });

  it('renders the api error component when error message is set to true', () => {
    const { getByText } = render(<GenerativeReportsTableNotice apiErrorMessage={true} />);
    expect(getByText('Table failed to load.')).toBeInTheDocument();
  });
});
