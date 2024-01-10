import React from 'react';
import renderer from 'react-test-renderer';
import notFoundGraphic from '../page-error-graphic';
import SiteOutage from './site-outage-text';

describe('Site Outage', () => {
  let instance;
  let component = renderer.create();
  renderer.act(() => {
    component = renderer.create(<SiteOutage />);
  });
  instance = component.root;

  it('includes an h1 header', () => {
    const header = instance.findByType('h1');
    expect(header).toBeDefined();
    expect(header.props.className).toBe('notFoundHeader');
  });

  it('includes site outage header', () => {
    const h2 = instance.findByType('h2');
    expect(h2).toBeDefined();
    expect(h2.props.children.props.children).toBe('We will be back shortly.');
  });

  it('includes the not found graphic', () => {
    const graphic = instance.findByType(notFoundGraphic);
    expect(graphic).toBeDefined();
  });
});

describe('Fallback for Error Boundary', () => {
  let instance;
  let component = renderer.create();
  renderer.act(() => {
    component = renderer.create(<SiteOutage fallback="true" />);
  });
  instance = component.root;

  it('includes an h1 header', () => {
    const header = instance.findByType('h1');
    expect(header).toBeDefined();
    expect(header.props.className).toBe('notFoundHeader');
  });

  it('includes fallback header', () => {
    const h2 = instance.findByType('h2');
    expect(h2).toBeDefined();
    expect(h2.props.children.props.children).toBe('This content is currently unavailable.');
  });

  it('includes the not found graphic', () => {
    const graphic = instance.findByType(notFoundGraphic);
    expect(graphic).toBeDefined();
  });
});
