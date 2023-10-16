import React from 'react';
import renderer from 'react-test-renderer';
import SectionContent from '../section-content/section-content';
import Aggregation from './aggregation';

describe('Filters', () => {
  let component = renderer.create();
  renderer.act(() => {
    component = renderer.create(<Aggregation />);
  });
  const instance = component.root;

  it('has SectionContent as a part of its layout', () => {
    expect(instance.findAllByType(SectionContent).length).toBeGreaterThan(0);
  });

  it('creates the Aggregation section with the desired id, heading tag and title', () => {
    const title = 'Aggregation & Sums';
    const heading = instance.findByProps({ id: 'aggregation-sums' }).findByType('h2');
    expect(heading.children[0]).toBe(title);
  });
});
