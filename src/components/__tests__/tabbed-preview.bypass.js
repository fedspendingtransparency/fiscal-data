import React from 'react';
import Renderer from 'react-test-renderer';
import ReactDom from 'react-dom';
import { act } from 'react-dom/test-utils';
import TabbedPreview from '../tabbed-preview';

describe('TabbedPreview', () => {

  it('selects the table view tab and displays its panel by default', () => {
    let component = Renderer.create();
    Renderer.act(() => {
      component = Renderer.create(
        <TabbedPreview chartContent={<div id={'test-chart-content'}>Table Panel</div>}
                       tableContent={<div id={'test-chart-content'}>Chart Panel</div>}
        />);
    });
    const instance = component.root;
    const firstTab = instance.findByProps({ 'id': 'preview-tab-0' });
    const secondTab = instance.findByProps({ 'id': 'preview-tab-1' });
    expect(firstTab.props.selected).toBeTruthy();
    expect(secondTab.props.selected).toBeFalsy();
    const firstPanel = instance.findByProps({ 'id': 'preview-tabpanel-0' });
    const secondPanel = instance.findByProps({ 'id': 'preview-tabpanel-1' });
    expect(firstPanel.props.className).not.toContain('hidden');
    expect(secondPanel.props.className).toContain('hidden');
  });
  it('marks a given tab as selected when clicked and displays its panel', () => {
    let container = document.createElement("div");
    document.body.appendChild(container);
    act(() => {
      ReactDom.render(
        <TabbedPreview chartContent={<div id={'test-chart-content'}>Table Panel</div>}
                       tableContent={<div id={'test-chart-content'}>Chart Panel</div>}
        />, container);
    });
    const chartTabButton = container.querySelector('#preview-tab-1');
    expect(chartTabButton.className).not.toContain('selected');
    act(() => {
      chartTabButton.dispatchEvent(new MouseEvent('click', {bubbles: true}));
    });
    expect(chartTabButton.className).toContain('selected');
    const tableTabButton = container.querySelector('#preview-tab-0');
    expect(tableTabButton.className).not.toContain('selected');

    const chartTabPanel = container.querySelector('#preview-tabpanel-1');
    expect(chartTabPanel.className).not.toContain('hidden');
    const tableTabPanel = container.querySelector('#preview-tabpanel-0');
    expect(tableTabPanel.className).toContain('hidden');

    act(() => {
      tableTabButton.dispatchEvent(new MouseEvent('click', {bubbles: true}));
    });
    expect(tableTabButton.className).toContain('selected');
    expect(chartTabButton.className).not.toContain('selected');
    expect(tableTabPanel.className).not.toContain('hidden');
    expect(chartTabPanel.className).toContain('hidden');

    document.body.removeChild(container);
    container = null;
  });
});
