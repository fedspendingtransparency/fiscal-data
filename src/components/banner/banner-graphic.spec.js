import React from 'react';
import renderer from 'react-test-renderer';

import BannerGraphic from './banner-graphic';
import { StaticImage } from 'gatsby-plugin-image';

describe('Banner Graphic', () => {
  let component = renderer.create();
  renderer.act(() => {
      component = renderer.create(
        <BannerGraphic />
      )
    }
  );
  const instance = component.root;

  it('renders an image', () => {
    expect(instance.findByType(StaticImage)).toBeDefined();
  });
});
