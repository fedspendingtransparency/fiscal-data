import React from 'react';
import { render } from '@testing-library/react';
import GenerativeReportsFooter from './generative-reports-footer';

describe('Generative Report Footer', () => {
  it('renders text', () => {
    const testMsg = 'Test Message';
    const { getByText, getAllByRole } = render(<GenerativeReportsFooter message={testMsg} />);

    expect(getByText(testMsg)).toBeInTheDocument();
  });
});
