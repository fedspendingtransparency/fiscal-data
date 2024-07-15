import React from 'react';
import ReportsSection from './reports-section';
import { render } from '@testing-library/react';

describe('Reports Section component', () => {
  it('renders a Reports and Files header', () => {
    const { getByText } = render(<ReportsSection />);
    expect(getByText('Reports and Files')).toBeInTheDocument();
  });

  it('renders a date picker', () => {
    const { getByText } = render(<ReportsSection />);
    expect(getByText('Published Date')).toBeInTheDocument();
  });

  it('renders a download table', () => {
    const { getByTestId } = render(<ReportsSection />);
    expect(getByTestId('reportsSectionTable')).toBeInTheDocument();
  });
});
