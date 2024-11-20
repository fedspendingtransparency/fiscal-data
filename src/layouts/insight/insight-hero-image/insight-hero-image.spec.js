import React from 'react';
import { render } from '@testing-library/react';
import { InsightHeroImage } from './insight-hero-image';

describe('Insight Hero Image', () => {
  it('renders hero image with heading', () => {
    const { getByText } = render(<InsightHeroImage heading={'This is a heading'} />);
    expect(getByText('This is a heading')).toBeInTheDocument();
  });

  it('renders hero image with a child component', () => {
    const { getByText } = render(
      <InsightHeroImage heading={'This is a heading'}>
        <div> This is an example hero </div>{' '}
      </InsightHeroImage>
    );
    expect(getByText('This is a heading')).toBeInTheDocument();
    expect(getByText('This is an example hero')).toBeInTheDocument();
  });
});
