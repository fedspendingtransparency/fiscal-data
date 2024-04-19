import React from 'react';
import { render, screen } from '@testing-library/react';
import BannerContent from './banner-content';

describe('ContentUnavailable', () => {

  it('renders content with link', () => {
    render(<BannerContent content={'We\'re working to correct an issue with this dataset. Please find the static data at https://fiscaldata.treasury.gov/static-data/published-reports/debt_to_penny.pdf'} />);
    expect(screen.getByText(`Please find the static data at`, {exact: false})).toBeInTheDocument();
    expect(screen.getByTestId('external-link')).toBeInTheDocument();
  });

  it('does not close when closable is set to false', () => {
    render(<BannerContent />);
    expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument();
  });

});
