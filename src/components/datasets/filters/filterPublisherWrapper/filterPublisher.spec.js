import React from 'react';
import FilterPublisher from './filterPublisher';
import renderer from 'react-test-renderer';
describe('Filter Dataset Publisher', () => {
  let component = renderer.create();
  renderer.act(() => {
    component = renderer.create(
      <FilterPublisher
        filterList={[
          { groupId: 'publisher', id: 'FA' },
          { groupId: 'non-publisher', id: 'NP' },
          { groupId: 'publisher', id: 'RSS' },
        ]}
      >
        Test Filter Publisher Wrapper
      </FilterPublisher>
    );
  });
  const instance = component.root;

  it('renders an element with the test id "publisher-filter-wrapper', () => {
    const publisherFilterWrapper = instance.findByProps({ 'data-testid': 'publisher-filter-wrapper' });
    expect(publisherFilterWrapper).toBeDefined();
  });

  it('contains an outer container that calculates and displays a the number of publishers with the heading "Treasury Department"', () => {
    const outerLabel = instance.findByProps({ 'data-testid': 'publisher-outer-container-label' });
    expect(outerLabel).toBeDefined();
    const publisherCount = outerLabel.findByProps({ 'data-testid': 'publisher-count' });
    expect(publisherCount).toBeDefined();
    expect(publisherCount.children[1]).toEqual('2 Publishers');
    const outerContainer = instance.findByProps({ 'data-testid': 'publisher-outer-container' });
    expect(outerContainer).toBeDefined();
    const treasuryLabel = outerContainer.findByProps({ 'data-testid': 'treasury-label' });
    expect(treasuryLabel.children[0]).toEqual('Treasury Department');
  });

  it('contains an inner container that also calculates and displays a the number of publishers with the heading "Bureau of Fiscal Service"', () => {
    const innerLabel = instance.findByProps({ 'data-testid': 'publisher-inner-container-label' });
    expect(innerLabel).toBeDefined();
    const publisherCount = innerLabel.findByProps({ 'data-testid': 'publisher-count' });
    expect(publisherCount).toBeDefined();
    expect(publisherCount.children[1]).toEqual('2 Publishers');
    const innerContainer = instance.findByProps({ 'data-testid': 'publisher-inner-container' });
    expect(innerContainer).toBeDefined();
    const bfsLabel = innerContainer.findByProps({ 'data-testid': 'fiscal-title' });
    expect(bfsLabel.children[0]).toEqual('Bureau of the Fiscal Service');
  });

  it('contains a child inside wrapper', () => {
    expect(instance.props.children).toEqual('Test Filter Publisher Wrapper');
  });
});
