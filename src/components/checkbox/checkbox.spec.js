import React from 'react';
import renderer from 'react-test-renderer';
import Checkbox from './checkbox';
import * as styles from './checkbox.module.scss';

describe('Checkbox component', () => {
  const mockCheckboxData = [
    { label: 'Mock Option 1', value: 'one', filterCount: 4 },
    { label: 'Mock Option 2', value: 'two', filterCount: 3 },
    { label: 'Mock Option 3', value: 'three', filterCount: 2 },
    { label: 'Mock Option 4', value: 'four', filterCount: 1 },
  ];

  let resultArray;

  function mockChangeHandler(checkedArr) {
    // this is the changeHandler function that the parent component must contain
    resultArray = checkedArr;
  }

  const mockClickEvent = {
    target: {
      checked: true,
      value: 0,
    },
  };

  let component = renderer.create();
  renderer.act(() => {
    component = renderer.create(<Checkbox checkboxData={mockCheckboxData} changeHandler={mockChangeHandler} />);
  });
  const instance = component.root;
  let section;

  it('renders a div element', () => {
    section = instance.findByType('div');
    expect(section).toBeDefined();
  });

  it('contains a checkbox element with a label for each object in the array', () => {
    const checkboxLabelElements = instance.findAllByProps({ 'data-testid': 'checkbox-label-element' });
    const textLabels = checkboxLabelElements.map(elem => elem.findByProps({ 'data-testid': 'optionLabelText' }).children[0]);
    const dataLength = mockCheckboxData.length;
    expect(checkboxLabelElements.length).toEqual(dataLength);
    expect(textLabels).toEqual(['Mock Option 1', 'Mock Option 2', 'Mock Option 3', 'Mock Option 4']);
  });

  it('calls its handleClick function when a checkbox state changes, which sends an array of clicked objects to parent component', () => {
    renderer.act(() => {
      instance.findAllByType('input')[0].props.onChange(mockClickEvent);
    });
    expect(resultArray.length).toEqual(1);
    expect(resultArray[0]).toBe(mockCheckboxData[0]);
  });
});
