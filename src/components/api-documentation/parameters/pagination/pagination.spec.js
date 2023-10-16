import React from 'react';
import renderer from 'react-test-renderer';
import Pagination from './pagination';
import SectionContent from '../../section-content/section-content';

describe('Parameters Pagination', () => {
  let component = renderer.create();
  renderer.act(() => {
    component = renderer.create(<Pagination />);
  });
  const instance = component.root;

  it('expects SectionContent to be a part of its layout', () => {
    expect(instance.findByType(SectionContent)).toBeTruthy();
  });

  it('creates the Pagination section with the desired id, heading tag and title', () => {
    const title = 'Pagination';
    const heading = instance.findByProps({ id: 'parameters-pagination' }).findByType('h3');
    expect(heading.children[0]).toBe(title);
  });
});
