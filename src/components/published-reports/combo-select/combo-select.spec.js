import renderer from 'react-test-renderer';
import React from 'react';
import ComboSelect from './combo-select';

describe('The ComboSelect Component', () => {
  let component = renderer.create();
  let instance;
  const mockYearOptions = [];
  for (let i = 2020; i > 1995; i--) {
    mockYearOptions.push({label: i, value: i});
  }

  const changeHandlerSpy = jest.fn();

  beforeEach(() => {
    component = renderer.create(
      <ComboSelect changeHandler={changeHandlerSpy}
                   optionLabelKey={'label'}
                   options={mockYearOptions}
                   selectedOption={null}/>
    );
    instance = component.root;
  });

  it('renders an input field that opens a dropdown list of the top 10 options on focus', () => {
    const inputField = instance.findByType('input');

    expect(inputField.props.type).toEqual('number');

    // no option list rendered initially
    expect(instance.findAllByType('button')).toEqual([]);

    // focus
    renderer.act(() => {
      inputField.props.onFocus();
    });
    let optionButtons = instance.findByType('ul').findAllByType('button');
    expect(optionButtons.length).toEqual(10);
    expect(optionButtons[0].children).toEqual(['2020']);
    expect(optionButtons[9].children).toEqual(['2011']);
  });

  it('shows up to ten topmost options in the dropdown list that match input digits', () => {
    const inputField = instance.findByType('input');

    renderer.act(() => {
      inputField.props.onChange({target: {value: '01'}});
    });
    let optionButtons = instance.findByType('ul').findAllByType('button');
    expect(optionButtons.length).toEqual(10);
    expect(optionButtons[0].children).toEqual(['2019']);
    expect(optionButtons[9].children).toEqual(['2010']);
    renderer.act(() => {
      inputField.props.onChange({target: {value: '019'}});
    });
    optionButtons = instance.findByType('ul').findAllByType('button');
    expect(optionButtons.length).toEqual(1);
    expect(optionButtons[0].children).toEqual(['2019']);
  });

  it('only allows numeric entries', () => {
    const mockKeyPresses = ['a','Z','-','1',',','.','2','+','e','3','0'];
    let charsRejected = '';
    let charsAccepted = '';

    const mockUpKeyPressEvent = (press, currenValue) =>{
      return {
        target:
          {
            value: currenValue
          },
        key: press,
        preventDefault: () => { charsRejected += press; }
      }
    };

    const inputField = instance.findByType('input');
    renderer.act(() => {
      mockKeyPresses.forEach((kp) => {
        const rejectedSoFar = charsRejected;
        inputField.props.onKeyPress(mockUpKeyPressEvent(kp, charsAccepted));
        if (rejectedSoFar === charsRejected) {
          charsAccepted += kp;
        }
      });
    });
    expect(charsAccepted).toEqual('1230');
    expect(charsRejected).toEqual('aZ-,.+e');
  });

  it('correctly cleans input when multiple characters are input (pasted in) by the user in a single event', () => {
    const inputField = instance.findByType('input');

    // no option list rendered initially
    const mockInputEvent = {target: {value: '-1.5+e109'}};

    // cleans up numeric entry that is pasted in
    renderer.act(() => {
      inputField.props.onInput(mockInputEvent);
    });

    expect(mockInputEvent.target.value).toEqual('1510');
  });

  it('calls the change handler when a year option is selected', () => {
    const inputField = instance.findByType('input');

    // no option list rendered initially
    expect(instance.findAllByType('button')).toEqual([]);

    // focus
    renderer.act(() => {
      inputField.props.onFocus();
    });
    let optionButtons = instance.findByType('ul').findAllByType('button');
    expect(optionButtons[5].children).toEqual(['2015']);

    renderer.act(() => {
      optionButtons[5].props.onClick();
    });

    expect(changeHandlerSpy).toHaveBeenNthCalledWith(1, {label: 2015, value: 2015});

  });

});
