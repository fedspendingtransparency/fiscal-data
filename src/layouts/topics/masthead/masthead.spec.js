import React from 'react';
import renderer from 'react-test-renderer';
import MastHead from './masthead';
import BreadCrumbs from '../../../components/breadcrumbs/breadcrumbs';

describe('Topics Masthead', () => {
  const title = 'Dummy Topic';
  let component;
  let instance;

  beforeEach(() => {
    component = renderer.create(<MastHead title={title} />);
    instance = component.root;
  });

  it('contains the topic title within its breadcrumbs', () => {
    const breadCrumbProps = instance.findByType(BreadCrumbs).props.links;
    expect(breadCrumbProps[0].name).toStrictEqual(title);
  });

  it('displays the topic title within its header element', () => {
    const header = instance.findByProps({ 'data-test-id': 'pageTitle' });
    expect(header.type).toBe('h1');
    expect(header.props.children).toStrictEqual(title);
  });

  it('contains a tagLine', () => {
    expect(instance.findByProps({ 'data-test-id': 'tagLine' }).props.children).toBeDefined();
  });

  it('contains a Related Topics section', () => {
    expect(instance.findByProps({ 'data-test-id': 'relatedTopics' }).props.children).toBeDefined();
  });
});
