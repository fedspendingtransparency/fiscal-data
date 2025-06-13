import React from 'react';
import { render, screen } from '@testing-library/react';
import SiteLayout, { preProdEnvMsg } from './siteLayout';
import { RecoilRoot } from 'recoil';

// import * as modules so we can spy on their default exports
import * as HeaderModule from '../site-header/site-header';
import * as FooterModule from '../site-footer/site-footer';

describe('SiteLayout', () => {
  const renderLayout = (props = {}) =>
    render(
      <RecoilRoot>
        <SiteLayout {...props}>
          <div>child content</div>
        </SiteLayout>
      </RecoilRoot>
    );

  beforeEach(() => {
    // spy on the export of each module
    jest.spyOn(HeaderModule, 'default');
    jest.spyOn(FooterModule, 'default');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('displays the SiteHeader', () => {
    renderLayout();
    expect(HeaderModule.default).toHaveBeenCalledTimes(1);
  });

  it('displays the SiteFooter', () => {
    renderLayout();
    expect(FooterModule.default).toHaveBeenCalledTimes(1);
  });

  it('does not set lowerEnvMsg by default', () => {
    renderLayout();
    expect(screen.queryByText(preProdEnvMsg)).not.toBeInTheDocument();
  });

  it('sets lowerEnvMsg to appropriate text when isPreProd is true', () => {
    renderLayout({ isPreProd: true });
    expect(screen.getByText(preProdEnvMsg)).toBeInTheDocument();
  });
});
