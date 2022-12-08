import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { Index } from '../index';
import HomeMainContent from '../../components/home-main-content/home-main-content';
import HomeFeatures from '../../components/home-features/home-features';
import * as Gatsby from "gatsby";

const imageQueryMock = {
  allFile: {
    topicsImages: []
  }
}

const useStaticQueryMock = jest.spyOn(Gatsby, 'useStaticQuery');
useStaticQueryMock.mockImplementation(() => (imageQueryMock));

describe('Site Home Index', () => {
  const renderer = new ShallowRenderer();
  renderer.render(<Index />);
  const component = renderer.getRenderOutput();
  const instance = component.props.children;
  const siteHome = [instance.props.children].find(e => e.props['data-testid'] === 'site-home');

  it('renders the PageHelmet containing metadata', () => {
    const helmet = siteHome.props.children.find(e => e.props['data-testid'] === 'helmet');
    expect(helmet.props.pageTitle).toBe('');
    expect(helmet.props.description).toBeDefined();
    expect(helmet.props.keywords).toBeDefined();
  });

  it('renders the topics section', () => {
    const topicsSection = siteHome.props.children.find(e => e.props['data-testid'] === 'topics-section');
    expect(topicsSection.props.images).toBe(imageQueryMock);
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
