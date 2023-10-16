import React from 'react';
import AfgHero from './afg-hero';
import { render } from '@testing-library/react';

describe('AFG Hero Component', () => {
  it('renders the Component and Social Share', () => {
    const { getByTestId, getByRole } = render(<AfgHero />);
    expect(getByTestId('afg-hero')).toBeInTheDocument();

    const facebook = getByRole('button', { name: 'facebook' });
    const twitter = getByRole('button', { name: 'twitter' });
    const linkedIn = getByRole('button', { name: 'linkedin' });
    const reddit = getByRole('button', { name: 'reddit' });
    const email = getByRole('button', { name: 'email' });

    expect(facebook).toBeInTheDocument();
    expect(twitter).toBeInTheDocument();
    expect(linkedIn).toBeInTheDocument();
    expect(reddit).toBeInTheDocument();
    expect(email).toBeInTheDocument();
  });
});
