import React from 'react';
import renderer from 'react-test-renderer';
import Methods from './methods';
import SectionContent from '../section-content/section-content';

describe('Methods', () => {
  let component = renderer.create();
  renderer.act(() => {
    component = renderer.create(<Methods />);
  });
  const instance = component.root;

  it('has SectionContent as a part of its layout', () => {
    expect(instance.findAllByType(SectionContent).length).toBeGreaterThan(0);
  });

  it('creates the Methods section with the desired id, heading tag and title', () => {
    const title = 'Methods';
    const heading = instance.findByProps({ id: 'methods' }).findByType('h2');
    expect(heading.children[0]).toBe(title);
  });
});
