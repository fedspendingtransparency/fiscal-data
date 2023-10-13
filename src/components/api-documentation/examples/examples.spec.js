import React from 'react';
import renderer from 'react-test-renderer';
import Examples from './examples';
import SectionContent from '../section-content/section-content';

describe('API Documentation Examples', () => {
  let component = renderer.create();
  renderer.act(() => {
    component = renderer.create(<Examples />);
  });
  const instance = component.root;

  it('has SectionContent as a part of its layout', () => {
    expect(instance.findAllByType(SectionContent).length).toBeGreaterThan(0);
  });

  it('creates the Examples section with the desired id, heading tag and title', () => {
    const title = 'Examples and Code Snippets';
    const heading = instance.findByProps({ id: 'examples-code-snippets' }).findByType('h2');
    expect(heading.children[0]).toBe(title);
  });

  it('creates the Fields section with the desired id, heading tag and title', () => {
    const title = 'Fields';
    const heading = instance.findByProps({ id: 'examples-fields' }).findByType('h3');
    expect(heading.children[0]).toBe(title);
  });

  it('creates the Filters section with the desired id, heading tag and title', () => {
    const title = 'Filters';
    const heading = instance.findByProps({ id: 'examples-filters' }).findByType('h3');
    expect(heading.children[0]).toBe(title);
  });

  it('creates the Sorting section with the desired id, heading tag and title', () => {
    const title = 'Sorting';
    const heading = instance.findByProps({ id: 'examples-sorting' }).findByType('h3');
    expect(heading.children[0]).toBe(title);
  });

  it('creates the Format section with the desired id, heading tag and title', () => {
    const title = 'Format';
    const heading = instance.findByProps({ id: 'examples-format' }).findByType('h3');
    expect(heading.children[0]).toBe(title);
  });

  it('creates the Pagination section with the desired id, heading tag and title', () => {
    const title = 'Pagination';
    const heading = instance.findByProps({ id: 'examples-pagination' }).findByType('h3');
    expect(heading.children[0]).toBe(title);
  });

  it('creates the Aggregation section with the desired id, heading tag and title', () => {
    const title = 'Aggregation';
    const heading = instance.findByProps({ id: 'examples-aggregation' }).findByType('h3');
    expect(heading.children[0]).toBe(title);
  });

  it('creates the Pivoting section with the desired id, heading tag and title', () => {
    const title = 'Pivoting';
    const heading = instance.findByProps({ id: 'examples-pivoting' }).findByType('h3');
    expect(heading.children[0]).toBe(title);
  });

  it('creates the Multi-dimension Datasets section with the desired id, heading tag and title', () => {
    const title = 'Multi-dimension Datasets';
    const heading = instance.findByProps({ id: 'examples-multi-dimension-datasets' }).findByType('h3');
    expect(heading.children[0]).toBe(title);
  });
});
