import React from 'react';
import renderer from 'react-test-renderer';
import SectionContent from "../section-content/section-content";
import MultiDimensionDatasets from "./multi-dimension-datasets";

describe('Multi-Dimension Datasets', () => {
  let component = renderer.create();
  renderer.act(() => {
    component = renderer.create(
      <MultiDimensionDatasets />
    )
  });
  const instance = component.root;

  it('has SectionContent as a part of its layout', () => {
    expect(instance.findAllByType(SectionContent).length).toBeGreaterThan(0);
  });

  it('creates the Multi-Dimension Datasets section with the desired id, heading tag and title',
    () => {
      const title = 'Multi-Dimension Datasets';
      const heading = instance.findByProps({'id': 'multidimension-datasets'}).findByType('h2');
      expect(heading.children[0]).toBe(title);
    }
  );
});
