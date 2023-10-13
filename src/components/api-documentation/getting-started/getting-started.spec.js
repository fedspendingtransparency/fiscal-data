import React from 'react';
import renderer from 'react-test-renderer';
import GettingStarted from './getting-started';
import SectionContent from '../section-content/section-content';

describe('Getting Started', () => {
  let component = renderer.create();
  renderer.act(() => {
    component = renderer.create(<GettingStarted />);
  });
  const instance = component.root;

  it('has SectionContent as a part of its layout', () => {
    expect(instance.findAllByType(SectionContent).length).toBeGreaterThan(0);
  });

  it('creates the Getting Started section with the desired id, heading tag and title', () => {
    const title = 'Getting Started';
    const heading = instance.findByProps({ id: 'getting-started' }).findByType('h2');
    expect(heading.children[0]).toBe(title);
  });

  it('creates the "What is an API?" section with the desired id, heading tag and title', () => {
    const title = 'What is an API?';
    const heading = instance.findByProps({ id: 'what-is-an-api' }).findByType('h3');
    expect(heading.children[0]).toBe(title);
  });

  it('creates the "What is a Dataset?" section with the desired id, heading tag and title', () => {
    const title = 'What is a dataset?';
    const heading = instance.findByProps({ id: 'what-is-a-dataset' }).findByType('h3');
    expect(heading.children[0]).toBe(title);
  });

  it('creates the API Endpoint section with the desired id, heading tag and title', () => {
    const title = 'API Endpoint URL structure';
    const heading = instance.findByProps({ id: 'api-endpoint-url-structure' }).findByType('h3');
    expect(heading.children[0]).toBe(title);
  });

  it('creates the How to Access our API section with the desired id, heading tag and title', () => {
    const title = 'How to Access our API';
    const heading = instance.findByProps({ id: 'how-to-access-our-api' }).findByType('h3');
    expect(heading.children[0]).toBe(title);
  });

  it('creates the License & Authorization section with the desired id, heading tag and title', () => {
    const title = 'License & Authorization';
    const heading = instance.findByProps({ id: 'license-and-authorization' }).findByType('h3');
    expect(heading.children[0]).toBe(title);
  });

  it('creates the Change Log section with the desired id, heading tag and title', () => {
    const title = 'Change Log';
    const heading = instance.findByProps({ id: 'change-log' }).findByType('h3');
    expect(heading.children[0]).toBe(title);
  });
});
