import React from 'react';
import renderer from 'react-test-renderer';
import SectionContent from "../section-content/section-content";
import Filters from "./filters";

describe('Filters', () => {
  let component = renderer.create();
  renderer.act(() => {
    component = renderer.create(
      <Filters />
    )
  });
  const instance = component.root;

  it('has SectionContent as a part of its layout', () => {
    expect(instance.findAllByType(SectionContent).length).toBeGreaterThan(0);
  });

  it('creates the Filters section with the desired id, heading tag and title', () => {
    const title = 'Filters';
    const heading = instance.findByProps({'id': 'filters'}).findByType('h3');
    expect(heading.children[0]).toBe(title);
  });
});
