import React from 'react';
import { render, screen } from '@testing-library/react'; 
import ContentUnavailable from './content-unavailable';

describe('ContentUnavailable', () => {

  it('renders the content unavailable message', () => {
    render(<ContentUnavailable />);
    const regex = new RegExp('The Fiscal Data team is working to address the current issue with this page.', 'i')
    expect(screen.getByText(`Content Temporarily Unavailable:`)).toBeInTheDocument();
    expect(screen.getByText(regex)).toBeInTheDocument();
  });

  it('contains an email link with the correct address', () => {
    render(<ContentUnavailable />);

    const mailtoLink = screen.getByRole('link');
    expect(mailtoLink).toHaveAttribute('href', 'mailto:fiscaldata@fiscal.treasury.gov');
  });

  it('does not close when closable is set to false', () => {
    render(<ContentUnavailable />);
    expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument();
  });

});
