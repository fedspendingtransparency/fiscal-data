import React from 'react';
import renderer from 'react-test-renderer';
import ReportDataToggle from './report-data-toggle';

describe('Report Data Toggle', () => {
  const toggleFn = jest.fn();
  let component = renderer.create();
  let instance, radioButtons, toggleSpy;
  beforeEach(() => {
    component = renderer.create(
      <ReportDataToggle onChange={toggleFn} reports={['item']}/>
    );
    instance = component.root;
    toggleSpy = jest.spyOn(instance.props, 'onChange');
    radioButtons = instance.findAllByType('input');
  });

  it('contains two radio buttons', () => {
    expect(radioButtons.length).toStrictEqual(2);
  });

  it('defaults to having the first radio button selected', () => {
    expect(radioButtons[0].props.checked).toStrictEqual('checked');
  });

  it('updates the selected button when the radio button is toggled', () => {
    renderer.act(() => {
      radioButtons[1].props.onChange();
    });

    expect(radioButtons[1].props.checked).toStrictEqual('checked');
  });

  it('triggers the onToggle event when a radio button is clicked', () => {
    renderer.act(() => {
      radioButtons[0].props.onChange();
    });

    expect(toggleSpy).toHaveBeenCalledWith(radioButtons[0].props.value);
  });

  it('only appears if there are reports to show', () => {
    expect(instance.children[0].props.style).toStrictEqual({display: 'block'});

    renderer.act(() => {
      component.update(<ReportDataToggle onChange={toggleFn} reports={[]}/>)
    });

    expect(instance.children[0].props.style).toStrictEqual({display: 'none'});
  })
});
