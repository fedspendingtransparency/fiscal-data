import React from 'react';
import renderer from 'react-test-renderer';
import SectionContent from "../section-content/section-content";
import Fields from "./fields";

describe('Fields', () => {
  let component = renderer.create();
  renderer.act(() => {
    component = renderer.create(
      <Fields />
    )
  });
  const instance = component.root;

  it('has SectionContent as a part of its layout', () => {
    expect(instance.findAllByType(SectionContent).length).toBeGreaterThan(0);
  });

  it('creates the Fields section with the desired id, heading tag and title', () => {
    const title = 'Fields';
    const heading = instance.findByProps({'id': 'fields'}).findByType('h3');
    expect(heading.children[0]).toBe(title);
  });

  it('creates the Data Types section with the desired id, heading tag and title', () => {
    const title = 'Data Types';
    const heading = instance.findByProps({'id': 'data-types'}).findByType('h4');
    expect(heading.children[0]).toBe(title);
  });

  it('creates the Fields by Endpoint section with the desired id, heading tag and title', () => {
    const title = 'Fields by Endpoint';
    const heading = instance.findByProps({'id': 'fields-fields-by-endpoint'}).findByType('h4');
    expect(heading.children[0]).toBe(title);
  });
});
