import React from 'react';
import renderer from 'react-test-renderer';
import LinksObject from './links-object';
import SectionContent from "../../section-content/section-content";

describe('Links Object', () => {
  let component = renderer.create();
  renderer.act(() => {
    component = renderer.create(
      <LinksObject />
    );
  });
  const instance = component.root;

  it('has SectionContent as a part of its layout', () => {
    expect(instance.findAllByType(SectionContent).length).toBeGreaterThan(0);
  });

  it('has a defined title', () => {
    const titleText = 'Links Object';
    const title = instance.findByProps({'id': 'responses-links-object'}).findByType('h3');
    expect(title.children[0]).toEqual(titleText);
  });
});
