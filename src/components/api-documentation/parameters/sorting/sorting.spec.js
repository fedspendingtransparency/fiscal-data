import React from 'react';
import renderer from 'react-test-renderer';
import Sorting from './sorting';
import SectionContent from '../../section-content/section-content';

describe('Parameters Sorting', () => {

  let component = renderer.create();
  renderer.act(() => {
    component = renderer.create(
      <Sorting />
    );
  });
  const instance = component.root;

  it('expects SectionContent to be a part of its layout', () => {
    expect(instance.findByType(SectionContent)).toBeTruthy();
  });

  it('creates the Sorting section with the desired id, heading tag and title', () => {
    const title = 'Sorting';
    const heading = instance.findByProps({'id': 'parameters-sorting'}).findByType('h3');
    expect(heading.children[0]).toBe(title);
  });
});
