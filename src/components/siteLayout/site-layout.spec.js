import React from 'react';
import renderer from 'react-test-renderer';
import SiteLayout, {preProdEnvMsg} from './siteLayout';
import SiteHeader from '../site-header/site-header';
import SiteFooter from '../site-footer/site-footer';

const preprodMsg = preProdEnvMsg;

describe('SiteLayout', () => {
  let instance;
  let component;

  beforeAll(() => {
    component = renderer.create(<SiteLayout />);
    instance = component.root;
  });

  it('displays the SiteHeader', () => {
    expect(instance.findByType(SiteHeader)).toBeDefined();
  });

  it('displays the SiteFooter', () => {
    expect(instance.findByType(SiteFooter)).toBeDefined();
  });

  it('does not set lowerEnvMsg by default', () => {
    const header = instance.findByType(SiteHeader);
    const msg = header.props.lowerEnvMsg;
    expect(msg).toBeUndefined();
  });

  it('sets lowerEnvMsg to appropriate text when isPreProd is true', () => {
    const newInstance = renderer.create(<SiteLayout isPreProd={true}/>).root;
    const header = newInstance.findByType(SiteHeader);
    const msg = header.props.lowerEnvMsg;
    expect(msg).toBe(preprodMsg);
  });
});
