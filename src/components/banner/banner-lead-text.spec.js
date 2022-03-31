import React from 'react';
import renderer from 'react-test-renderer';

import BannerLeadText, { analyticsObject } from './banner-lead-text';
import Analytics from "../../utils/analytics/analytics";

describe('Banner Lead Text', () => {
  let component = renderer.create();
  renderer.act(() => {
      component = renderer.create(
        <BannerLeadText />
      )
    }
  );
  const instance = component.root;

  it('includes an h1 header', () => {
    const header = instance.findByProps({'data-test-id':'site-banner-header'});
    expect(header).toBeDefined();
    expect(header.type).toBe('h1');
  });

  it('includes a button (a tag styled as button) that navigates to the search page', () => {
    const button = instance.findByType('a');
    expect(button).toBeDefined();
    expect(button.props.href).toStrictEqual('/datasets/');
  });

  it('tracks when this link disguised as a button is clicked', () => {
    const spy = jest.spyOn(Analytics, 'event');
    const linkDisguisedAsButton = instance.findByType('a');

    renderer.act(() => linkDisguisedAsButton.props.onClick());
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(analyticsObject);
  });

});
