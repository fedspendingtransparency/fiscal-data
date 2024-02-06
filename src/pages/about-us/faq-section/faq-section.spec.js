import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import renderer from 'react-test-renderer';
import GLOBALS from '../../../helpers/constants';
import FAQ from './faq-section';

const h3Headers = ['who', 'when', 'why', 'how', 'get-updates', 'new-to-apis', 'taxes-stimulus-inquiries', 'update-frequency'];

describe('FAQ section', () => {
  const shallowRenderer = new ShallowRenderer();
  shallowRenderer.render(<FAQ />);
  const component = shallowRenderer.getRenderOutput();
  const instance = component.props.children;
  const defaultTimeToHighlight = GLOBALS.config.highlight.defaultTimeToHighlight;

  it('renders a SectionContent component with correct title and headingLevel for main title', () => {
    const title = instance.find(e => e.props.id === 'faq');
    expect(title.props.children).toEqual('FAQs');
    expect(title.type).toEqual('h2');
  });

  it('renders the correct number of SectionContent components with headingLevel 3', () => {
    const headers = instance.filter(e => e.props.headingLevel === 3);
    expect(headers.length).toEqual(h3Headers.length);
  });

  it('does not Highlight Who Can I Contact when highlights have not been triggered', async () => {
    let component;
    await renderer.act(async () => {
      component = renderer.create(<FAQ triggerHighlight={0} />);
    });
    const instance = component.root;
    expect(instance.findAllByType('mark').length).toBe(0);
  });

  it('does Highlight Who Can I Contact when triggered and stops highlighting', async () => {
    jest.useFakeTimers();
    let component;
    await renderer.act(async () => {
      component = renderer.create(<FAQ triggerHighlight={1} />);
    });
    const instance = component.root;
    expect(instance.findAllByType('mark').length).toBe(1);
    await renderer.act(async () => {
      jest.advanceTimersByTime(defaultTimeToHighlight);
    });
    expect(instance.findAllByType('mark').length).toBe(0);
  });
});
