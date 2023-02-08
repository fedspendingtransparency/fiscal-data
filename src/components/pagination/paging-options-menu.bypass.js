import React from 'react';
import renderer from 'react-test-renderer';
import PagingOptionsMenu from './paging-options-menu';
import { MenuItem } from '@material-ui/core';

describe('Go to Page PagingOptionsMenu component', () => {
  const menuProps = {
    options: [1,2,3,4,5],
    label: 'Go to Page',
    selected: 1,
    hideOnSm: false,
    updateSelected: () => {},
  };

  const { options } = menuProps;

  const component = renderer.create(
    <PagingOptionsMenu menuProps={menuProps} />
  );
  const instance = component.root;

  it('renders visible and with correct label and number of options by default', () => {
    expect(instance.findByType(PagingOptionsMenu)).toBeDefined();
    expect(instance.findAllByType(MenuItem).length).toEqual(options.length);
    expect(instance.findByProps({'className':'perPageLabel'}).text()).toContain(menuProps.label);
  });

  it('renders hidden if hideOnSm', () => {
    menuProps.hideOnSm = true;
    expect(instance.findByType(PagingOptionsMenu).props.className).toContain('hideOnSm');
  });
});


describe('Rows Per Page PagingOptionsMenu component', () => {
  const menuProps = {
    options: [5,10,20,50,100],
    label: 'Rows Per Page',
    selected: 20,
    hideOnSm: false,
    updateSelected: () => {},
  };

  const { options } = menuProps;

  const component = renderer.create(
    <PagingOptionsMenu menuProps={menuProps} />
  );
  const instance = component.root;

  it('renders visible and with correct label and number of options by default', () => {
    expect(instance.findByType(PagingOptionsMenu)).toBeDefined();
    expect(instance.findAllByType(MenuItem).length).toEqual(options.length);
    expect(instance.findByProps({'className':'perPageLabel'}).text()).toContain(menuProps.label);
  });

});
