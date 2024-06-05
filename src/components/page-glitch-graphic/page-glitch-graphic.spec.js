import React from 'react';
import GlitchGraphic from './page-glitch-graphic';
import renderer from 'react-test-renderer';

describe('Not Found Graphic', () => {
  let instance;
  let component = renderer.create();
  renderer.act(() => {
    component = renderer.create(<GlitchGraphic />);
  });
  instance = component.root;

  it('renders an image', () => {
    expect(instance.findByType('img')).toBeDefined();
  });
});
