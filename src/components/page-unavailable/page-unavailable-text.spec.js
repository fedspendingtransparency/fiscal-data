import React from 'react';
import renderer from 'react-test-renderer';
import PageUnavailableText from './page-unavailable-text';
import notFoundGraphic from '../page-glitch-graphic/page-glitch-graphic';

describe('Unavailable Text', () => {
  let component = renderer.create();
  renderer.act(() => {
    component = renderer.create(<PageUnavailableText />);
  });

  let instance = component.root;

  it('includes an h1 header', () => {
    const header = instance.findByType('h1');
    expect(header).toBeDefined();
    expect(header.props.className).toBe('unavailableHeader');
  });

  it('includes an h1 header', () => {
    const header = instance.findByType('h1');
    expect(header).toBeDefined();
    expect(header.props.children.props.children).toBe('Fiscal Data is unavailable right now.');
  });

  it('includes an unavailable header', () => {
    const header = instance.findByType('h2');
    expect(header).toBeDefined();
    expect(header.props.children.props.children).toBe('We will be back shortly.');
  });

  it('includes the not found graphic', () => {
    const graphic = instance.findByType(notFoundGraphic);
    expect(graphic).toBeDefined();
  });
});

describe('Fallback for Error Boundary', () => {
  let component = renderer.create();
  renderer.act(() => {
    component = renderer.create(<PageUnavailableText fallback="true" />);
  });

  let instance = component.root;

  it('includes an h1 header', () => {
    const header = instance.findByType('h1');
    expect(header).toBeDefined();
    expect(header.props.className).toBe('unavailableHeader');
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
