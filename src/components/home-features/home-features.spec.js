import React from 'react';
import { render } from '@testing-library/react';

import HomeFeatures, { featuresSrc as features } from './home-features';

describe('HomeFeatures component', () => {
  it('includes an h2 header', () => {
    const { getByRole } = render(<HomeFeatures />);
    const heading = getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
  });

  it('shows the same number of images as the setup variable', () => {
    const { getAllByRole } = render(<HomeFeatures />);
    const images = getAllByRole('img', { hidden: true });
    expect(images.length).toBe(features.length);
  });

  it('has aria-hidden=true and alt text on each of those six images', () => {
    const { getAllByRole } = render(<HomeFeatures />);
    const images = getAllByRole('img', { hidden: true });
    const featuresArr = [...features];
    images.forEach(img => {
      expect(img.getAttribute('aria-hidden')).toBe('true');
      const imgAlt = img.getAttribute('alt');
      const featuresIdx = featuresArr.findIndex(d => d.alt === imgAlt);
      expect(featuresIdx).toBeGreaterThanOrEqual(0);
      featuresArr.splice(featuresIdx, 1);
    });
  });
});
