import React from 'react';
import renderer from 'react-test-renderer';

import HomeFeatures, { featuresSrc as features } from './home-features';

describe('HomeFeatures component', () => {
  let instance;
  let component = renderer.create();
  renderer.act(() => {
    component = renderer.create(<HomeFeatures />);
  });
  instance = component.root;

  it('includes an h2 header', () => {
    expect(instance.findByType('h2')).toBeDefined();
  });

  it('shows the same number of images as the setup variable', () => {
    expect(instance.findAllByType('img').length).toBe(features.length);
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
