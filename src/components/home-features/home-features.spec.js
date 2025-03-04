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
    const imagesArray = instance.findAllByType('img');
    const featuresArr = features.slice();
    // Loops through all of the images found in the virtual dom
    imagesArray.forEach(img => {
      expect(img.props['aria-hidden']).toBe('true');
      const imgAlt = img.props.alt;
      // Compares the alt text on the virtual dom images to the alt text supplied
      // from the features const
      const featuresIdx = featuresArr.map(d => d.alt).indexOf(imgAlt);
      expect(featuresIdx).toBeGreaterThanOrEqual(0);
      // Helps to ensure a 1 to 1 relationship between the dom images and the supplied
      // features const.
      featuresArr.splice(featuresIdx, 1);
    });
  });
});
