import React from 'react';
import renderer from 'react-test-renderer';
import Masthead from './masthead';

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
});
