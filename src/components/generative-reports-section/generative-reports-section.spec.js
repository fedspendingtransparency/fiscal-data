import React from 'react';
import { render } from '@testing-library/react';
import GenerativeReportsSection from './generative-reports-section';

describe('Generative Report Footer', () => {
  it('renders', () => {
    const { getByRole } = render(<GenerativeReportsSection />);

    expect(getByRole('table')).toBeInTheDocument();
  });
});
