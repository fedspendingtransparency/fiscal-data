import React from 'react';
import renderer from 'react-test-renderer';
import MetaObject from './meta-object';
import SectionContent from '../../section-content/section-content';

describe('Meta Object', () => {
  let component = renderer.create();
  renderer.act(() => {
    component = renderer.create(<MetaObject />);
  });
  const instance = component.root;

  it('has SectionContent as a part of its layout', () => {
    expect(instance.findAllByType(SectionContent).length).toBeGreaterThan(0);
  });

  it('has a defined title', () => {
    const titleText = 'Meta Object';
    const title = instance.findByProps({ id: 'responses-meta-object' }).findByType('h3');
    expect(title.children[0]).toEqual(titleText);
  });
});
