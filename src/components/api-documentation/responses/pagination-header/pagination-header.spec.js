import React from 'react';
import renderer from 'react-test-renderer';
import PaginationHeader from './pagination-header';
import SectionContent from '../../section-content/section-content';

describe('Error Object', () => {
  let component = renderer.create();
  renderer.act(() => {
    component = renderer.create(<PaginationHeader />);
  });
  const instance = component.root;

  it('has SectionContent as a part of its layout', () => {
    expect(instance.findAllByType(SectionContent).length).toBeGreaterThan(0);
  });

  it('has a defined title', () => {
    const titleText = 'Pagination Header';
    const title = instance.findByProps({ id: 'responses-pagination-header' }).findByType('h3');
    expect(title.children[0]).toEqual(titleText);
  });
});
