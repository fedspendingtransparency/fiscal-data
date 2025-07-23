import React from 'react';
import { render } from '@testing-library/react';
import globalConstants from '../../../helpers/constants';

import About from './about-section';

const h3Headers = [
  'about-mission',
  'about-Vision',
  'about-values',
  'about-who',
  'about-difference',
  'about-background',
  'about-open-data',
  'about-international',
  'about-sources',
  'about-understanding',
  'about-dev',
  'about-licensing',
  'about-more',
];

describe('About section', () => {
  it('renders a SectionContent component with correct title and headingLevel for main title', () => {
    const { getByRole } = render(<About />);
    const title = getByRole('heading', { level: 2, name: 'About Fiscal Data' });
    expect(title).toBeInTheDocument();
  });

  it('renders the correct number of SectionContent components with headingLevel 3', () => {
    const { getAllByRole } = render(<About />);
    const headers = getAllByRole('heading', { level: 3 });
    expect(headers.length).toEqual(h3Headers.length);
  });

  it('provides a link to Fiscal Service About Us', () => {
    const { getByTestId } = render(<About />);
    expect(getByTestId('fsLink')).toHaveAttribute('href', `${globalConstants.FISCAL_TREASURY_URL}/about.html`);
  });
});
