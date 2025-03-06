import React from 'react';
import renderer from 'react-test-renderer';
import DownloadToggle from './download-toggle';
import { render } from '@testing-library/react';

describe('DownloadToggle', () => {
  const toggleFn = jest.fn();
  let component = renderer.create();
  let instance, radioButtons, toggleSpy;
  beforeEach(() => {
    component = renderer.create(<DownloadToggle onChange={toggleFn} setDisableDownloadBanner={jest.fn()} />);
    instance = component.root;
    toggleSpy = jest.spyOn(instance.props, 'onChange');
    radioButtons = instance.findAllByType('input');
  });

  it('contains three radio buttons', () => {
    expect(radioButtons.length).toStrictEqual(3);
  });

  it('defaults to having the first radio button selected', () => {
    expect(radioButtons[0].props.checked).toStrictEqual('checked');
  });

  it(`when a radio button is clicked, it updates the selected button and calls the onChange function
    with the radio button value`, () => {
    renderer.act(() => {
      radioButtons[1].props.onChange();
    });

    expect(radioButtons[1].props.checked).toStrictEqual('checked');
    expect(toggleSpy).toHaveBeenCalledWith(radioButtons[1].props.value);

    renderer.act(() => {
      radioButtons[2].props.onChange();
    });

    expect(radioButtons[2].props.checked).toStrictEqual('checked');
    expect(toggleSpy).toHaveBeenCalledWith(radioButtons[2].props.value);

    renderer.act(() => {
      radioButtons[0].props.onChange();
    });

    expect(radioButtons[0].props.checked).toStrictEqual('checked');
    expect(toggleSpy).toHaveBeenCalledWith(radioButtons[0].props.value);
  });

  it('disables large XML download', () => {
    const downloadLimit = {
      fileType: 'xml',
      maxYearRange: 5,
    };

    const { getByRole } = render(
      <DownloadToggle
        onChange={toggleFn}
        downloadLimit={downloadLimit}
        setDisableDownloadBanner={jest.fn()}
        dateRange={{ from: new Date('1/1/19'), to: new Date('1/1/25') }}
      />
    );
    const xmlButton = getByRole('radio', { name: 'XML' });
    expect(xmlButton).toBeDisabled();
  });
});
