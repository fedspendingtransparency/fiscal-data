import React from 'react';
import renderer from 'react-test-renderer';
import Format from './format';
import SectionContent from '../../section-content/section-content';

describe('Parameters Format', () => {
  let component = renderer.create();
  renderer.act(() => {
    component = renderer.create(<Format />);
  });
  const instance = component.root;

  it('expects SectionContent to be a part of its layout', () => {
    expect(instance.findByType(SectionContent)).toBeTruthy();
  });

  it('creates the Format section with the desired id, heading tag and title', () => {
    const title = 'Format';
    const heading = instance.findByProps({ id: 'parameters-format' }).findByType('h3');
    expect(heading.children[0]).toBe(title);
  });
});
