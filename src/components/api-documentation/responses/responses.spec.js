import React from 'react';
import renderer from 'react-test-renderer';
import SectionContent from '../section-content/section-content';
import Responses from './responses';
import MetaObject from './meta-object/meta-object';
import LinksObject from './links-object/links-object';
import DataObject from './data-object/data-object';
import ErrorObject from './error-object/error-object';
import PaginationHeader from './pagination-header/pagination-header';

describe('Responses', () => {
  let component = renderer.create();
  renderer.act(() => {
    component = renderer.create(<Responses />);
  });
  const instance = component.root;

  it('has SectionContent as a part of its layout', () => {
    expect(instance.findAllByType(SectionContent).length).toBeGreaterThan(0);
  });

  it('creates the Responses section with the desired id, heading tag and title', () => {
    const title = 'Responses & Response Objects';
    const heading = instance.findByProps({ id: 'responses-response-objects' }).findByType('h2');
    expect(heading.children[0]).toBe(title);
  });

  it('contains an html table element', () => {
    expect(instance.findByType('table')).toBeDefined();
  });

  it('<table> tag has aria-described by set and to reference <p> id', () => {
    const tableDescription = 'The following response codes may be returned:';
    const table = instance.findByType('table');
    const p = instance.findByProps({ children: tableDescription }).findByType('p');
    expect(table.props['aria-describedby']).toBe('response-codes-id');
    expect(p.props['id']).toBe('response-codes-id');
    expect(table.props['aria-describedby']).toEqual(p.props['id']);
  });

  it('includes meta object component in its layout', () => {
    expect(instance.findByType(MetaObject)).toBeDefined();
  });
  it('includes links object component in its layout', () => {
    expect(instance.findByType(LinksObject)).toBeDefined();
  });
  it('includes data object component in its layout', () => {
    expect(instance.findByType(DataObject)).toBeDefined();
  });
  it('includes error object component in its layout', () => {
    expect(instance.findByType(ErrorObject)).toBeDefined();
  });
  it('includes pagination header component in its layout', () => {
    expect(instance.findByType(PaginationHeader)).toBeDefined();
  });
});
