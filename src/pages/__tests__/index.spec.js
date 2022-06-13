import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { Index } from '../index';
import BannerGraphic from '../../components/banner/banner-graphic';
import BannerLeadText from '../../components/banner/banner-lead-text';
import HomeMainContent from '../../components/home-main-content/home-main-content';
import HomeFeatures from '../../components/home-features/home-features';

describe('Site Home Index', () => {
  const renderer = new ShallowRenderer();
  renderer.render(<Index />);
  const component = renderer.getRenderOutput();
  const instance = component.props.children[1];
  const siteHome = instance.props.children.find(e => e.props['data-testid'] === 'site-home');

  it('renders the watermark', () => {
    expect(instance.props.children.find(e => e.props['data-testid'] === 'site-watermark')).toBeDefined();
  });

  it('renders the PageHelmet containing metadata', () => {
    const helmet = siteHome.props.children.find(e => e.props['data-testid'] === 'helmet');
    expect(helmet.props.pageTitle).toBe('');
    expect(helmet.props.description).toBeDefined();
    expect(helmet.props.keywords).toBeDefined();
  });

  it('renders the banner components', () => {
    expect(siteHome.props.children).toContainEqual(
      <div data-testid='banner' className='bannerWrapper'>
        <BannerLeadText />
        <BannerGraphic />
      </div>
    );
  });

  it('renders the HomeMainContent component', () => {
    expect(siteHome.props.children).toContainEqual(
      <HomeMainContent />
    );
  });

  it('renders the HomeFeatures component', () => {
    expect(siteHome.props.children).toContainEqual(
      <HomeFeatures />
    );
  });
});
