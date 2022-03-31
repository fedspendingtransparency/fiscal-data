import React from 'react';
import renderer from 'react-test-renderer';
import Parameters from "./parameters";
import SectionContent from "../section-content/section-content";
import Fields from "../fields/fields";
import Filters from "../filters/filters";
import Sorting from './sorting/sorting';
import Format from './format/format';
import Pagination from './pagination/pagination';

describe('Parameters', () => {
  let component = renderer.create();
  renderer.act(() => {
    component = renderer.create(
      <Parameters />
    )
  });
  const instance = component.root;

  it('has SectionContent as a part of its layout', () => {
    expect(instance.findAllByType(SectionContent).length).toBeGreaterThan(0);
  });
  it('expects Fields to be within its layout', () => {
    expect(instance.findByType(Fields)).toBeDefined();
  });
  it('expects Filters to be within its layout', () => {
    expect(instance.findByType(Filters)).toBeDefined();
  });
  it('expects Sorting to be within its layout', () => {
    expect(instance.findByType(Sorting)).toBeDefined();
  });
  it('expects Format to be within its layout', () => {
    expect(instance.findByType(Format)).toBeDefined();
  });
  it('expects Pagination to be within its layout', () => {
    expect(instance.findByType(Pagination)).toBeDefined();
  });

  it('creates the Parameters section with the desired id, heading tag and title', () => {
    const title = 'Parameters';
    const heading = instance.findByProps({'id': 'parameters'}).findByType('h2');
    expect(heading.children[0]).toBe(title);
  });
});
