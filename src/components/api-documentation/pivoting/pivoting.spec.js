import React from 'react';
import renderer from 'react-test-renderer';
import SectionContent from "../section-content/section-content";
import Pivoting from "./pivoting";

describe('Pivoting', () => {
  let component = renderer.create();
  renderer.act(() => {
    component = renderer.create(
      <Pivoting />
    )
  });
  const instance = component.root;

  it('has SectionContent as a part of its layout', () => {
    expect(instance.findAllByType(SectionContent).length).toBeGreaterThan(0);
  });

  it('creates the Pivoting section with the desired id, heading tag and title', () => {
    const title = 'Pivoting';
    const heading = instance.findByProps({'id': 'pivoting'}).findByType('h2');
    expect(heading.children[0]).toBe(title);
  });
});
