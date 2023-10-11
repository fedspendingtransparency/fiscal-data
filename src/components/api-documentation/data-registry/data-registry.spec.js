import React from 'react';
import renderer from 'react-test-renderer';
import DataRegistry, { dataRegistryTitle } from './data-registry';
import SectionContent from '../section-content/section-content';

describe('DataRegistry', () => {
  let component = renderer.create();
  renderer.act(() => {
    component = renderer.create(<DataRegistry />);
  });
  const instance = component.root;

  it('has SectionContent as a part of its layout', () => {
    expect(instance.findAllByType(SectionContent).length).toBeGreaterThan(0);
  });

  it('creates the DataRegistry section with the desired id, heading tag and title', () => {
    const heading = instance.findByProps({ id: 'data-registry' }).findByType('h2');
    expect(heading.children[0]).toBe(dataRegistryTitle);
  });
});
