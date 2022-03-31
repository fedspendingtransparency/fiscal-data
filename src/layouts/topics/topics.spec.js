import React from 'react';
import renderer from 'react-test-renderer';
import Topics from './topics';
import SiteHeader from '../../components/site-header/site-header';
import SiteFooter from '../../components/site-footer/site-footer';
import MastHead from './masthead/masthead';
import {config} from './test-helpers';
import RelatedDatasets from "../../components/related-datasets/related-datasets";

describe('Topics Layout', () => {

  let component;
  let instance;

  let preProdInd = true;

  beforeEach(() => {
    component = renderer.create(
      <Topics pageContext={{config: config, isPreProd: preProdInd}}/>
    );
    instance = component.root;
  });

  it('includes the site header', () => {
    expect(instance.findByType(SiteHeader)).toBeDefined();
  });

  it('includes the site footer', () => {
    expect(instance.findByType(SiteFooter)).toBeDefined();
  });

  it('contains the Masthead component', () => {
    expect(instance.findByType(MastHead)).toBeDefined();
  });

  it('contains the Highlights section with the title Debt', () => {
    // this test is temporary, while the Debt part is hard-coded for the demo
    expect(instance.findByProps({'id': 'highlights'}).props.title).toBe('Debt Highlights');

  });

  it('contains a Related Datasets component', () => {
    expect(instance.findByType(RelatedDatasets)).toBeDefined();
  });

  it('contains a Related Analyses section', () => {
    expect(instance.findByProps({'id': 'related-analyses'}).props.title).toBe('Related Analyses');
  });

});
