import renderer from 'react-test-renderer';
import DownloadItemButton, { downloadFileEventStr } from './download-item-button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTable } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { optionIcon } from './download-item-button.module.scss';
import Analytics from '../../../utils/analytics/analytics';

jest.useFakeTimers();
describe('DownloadItemButton for static file', () => {
  const csvIcon = <FontAwesomeIcon icon={faTable} data-test-id="table-icon" size="1x" />;
  const hrefStr = 'dummyHref';
  const downloadStr = 'dummyDownload';
  let component = {};
  renderer.act(() => {
    component = renderer.create(<DownloadItemButton fileSize="200B" icon={csvIcon} label="CSV" href={hrefStr} download={downloadStr} />);
  });
  const instance = component.root;
  const anchor = instance.findByType('a');

  it('renders an anchor tag', () => {
    expect(anchor).toBeDefined();
  });
  it('sets the href as provided', () => {
    expect(anchor.props.href).toBe(hrefStr);
  });
  it('sets the download prop as provided', () => {
    expect(anchor.props.download).toBe(downloadStr);
  });
  it('sets the icon as provided', () => {
    expect(anchor.findByProps({ className: optionIcon }).findByProps({ 'data-test-id': 'table-icon' })).toBeDefined();
  });
  it('sets the label as provided', () => {
    expect(
      anchor
        .findByProps({ className: 'labelText' })
        .props.children.join('')
        .trim()
    ).toEqual('CSV');
  });
  it('sets the fileSize as provided', () => {
    expect(
      anchor
        .findByProps({ className: 'fileSize' })
        .props.children.join('')
        .trim()
    ).toEqual('(200B)');
  });
});

describe('DownloadItemButton for asyncAction', () => {
  const csvIcon = <FontAwesomeIcon icon={faTable} data-test-id="table-icon" size="1x" />;
  const asyncActionMock = jest.fn();
  let component = {};
  renderer.act(() => {
    component = renderer.create(<DownloadItemButton label="CSV" fileSize="123MB" icon={csvIcon} asyncAction={asyncActionMock} />);
  });
  jest.runAllTimers();
  const instance = component.root;
  const button = instance.findByType('button');
  const asyncActionSpy = jest.spyOn(instance.props, 'asyncAction');

  it('renders a button', () => {
    expect(button).toBeDefined();
  });
  it('sets the label as provided', () => {
    expect(
      button
        .findByProps({ className: 'labelText' })
        .props.children.join('')
        .trim()
    ).toEqual('CSV');
  });
  it('sets the fileSize as provided', () => {
    expect(
      button
        .findByProps({ className: 'fileSize' })
        .props.children.join('')
        .trim()
    ).toEqual('(123MB)');
  });
  it('calls the asyncAction provided when clicked', () => {
    renderer.act(() => {
      button.props.onClick();
    });
    jest.runAllTimers();
    expect(asyncActionSpy).toHaveBeenCalled();
  });
  it('tracks when a published report downloads is clicked', () => {
    let component2 = {};
    renderer.act(() => {
      component2 = renderer.create(<DownloadItemButton download={'fileName'} />);
    });
    const instance2 = component2.root;
    const spy = jest.spyOn(Analytics, 'event');

    const thisLink = instance2.findByType('a');
    renderer.act(() => thisLink.props.onClick());

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ action: 'fileName', category: 'Data Download' });
  });

  it('tracks when a dataset file is downloaded', () => {
    let component2 = {};
    renderer.act(() => {
      component2 = renderer.create(<DownloadItemButton />);
    });
    const instance2 = component2.root;
    const spy = jest.spyOn(Analytics, 'event');
    spy.mockClear();

    const thisLink = instance2.findByType('a');
    renderer.act(() => thisLink.props.onClick());

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ label: downloadFileEventStr }));
  });

  it('shows a disabled button when the disabled prop is passed in and a download link without it', () => {
    renderer.act(() => {
      component = renderer.create(<DownloadItemButton label="CSV" fileSize="123MB" icon={csvIcon} />);
    });
    let instance = component.root;
    expect(instance.findByType('a')).toBeDefined();

    let component3 = {};
    renderer.act(() => {
      component3 = renderer.create(<DownloadItemButton disabled />);
    });
    instance = component3.root;
    expect(instance.findByProps({ disabled: true })).toBeDefined();
  });
});
