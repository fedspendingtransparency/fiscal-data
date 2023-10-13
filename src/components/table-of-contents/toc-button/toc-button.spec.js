import React from 'react';
import renderer from 'react-test-renderer';
import TOCButton from './toc-button';

describe('TocButton when tocIsOpen is false', () => {
  const mockHandlerFunction = jest.fn();
  // this must return undefined or a promise, or we get a console warning
  mockHandlerFunction.mockReturnValueOnce(undefined);

  let component = renderer.create();
  renderer.act(() => {
    component = renderer.create(<TOCButton handleToggle={mockHandlerFunction} state={false} />);
  });

  const instance = component.root;

  it('creates a button that displays the text "Table of Contents"', () => {
    const toggleButton = instance.findByType('button');
    expect(toggleButton).toBeDefined();
    expect(toggleButton.props.children).toBe('Table of Contents');
  });

  it('on click, calls the provided handler function', () => {
    renderer.act(() => instance.findByType('button').props.onClick());
    expect(mockHandlerFunction).toHaveBeenCalled();
  });
});

describe('TocButton when tocIsOpen is true', () => {
  let component = renderer.create();
  renderer.act(() => {
    component = renderer.create(<TOCButton state />);
  });

  const instance = component.root;

  it('creates a button with the text "Cancel"', () => {
    const toggleButton = instance.findByType('button');
    expect(toggleButton).toBeDefined();
    expect(toggleButton.props.children).toBe('Cancel');
  });
});
