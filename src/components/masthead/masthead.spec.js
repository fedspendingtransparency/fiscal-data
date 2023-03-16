import React from 'react';
import renderer from 'react-test-renderer';
import Masthead from './masthead';
import DetailPills from '../detail-pills/detail-pills';

describe('Masthead component', () => {
  let instance;

  beforeAll(() => {
    const component = renderer.create(<Masthead title="Debt to the Nickel" techSpecs={{}} tagLine="All the debt, to the nickel." />);
    instance = component.root;
  });

  it('displays the dataset name in an H1 element', () => {
    const titleDisplayed = instance.findByType('h1'); // will fail if not exactly 1 <h1 />
    expect(titleDisplayed.props.children).toEqual('Debt to the Nickel');
  });

  it('has a detail pills component placed within', () => {
    instance.find(obj => obj.type === DetailPills);
  });

  it('displays the tagLine that it is given', () => {
    const tagLineElement = instance.findByProps({'data-test-id': 'tagLine'});
    expect(tagLineElement.children[0]).toBe("All the debt, to the nickel.");
  });
});
