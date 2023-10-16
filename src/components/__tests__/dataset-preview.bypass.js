import React from 'react';
import renderer from 'react-test-renderer';
import DatasetPreview, { previewSectionTitleDefault } from '../dataset-preview';

describe('DatasetPreview', () => {
  const tree = renderer.create(
    <DatasetPreview shortDescription={'Short description goes here'} requestUrl={'https://bla.bla.bla/hello/there?fields=blabla'} />
  );
  const instance = tree.root;
  let section;

  it('contains its content within a section element with reusable sectionclass', () => {
    section = instance.findByType('section');
    expect(section.props.className).toContain('sectionContainer');
  });

  it('renders an H2 element containing a default value when no title is supplied through props', () => {
    const sectionHeader = section.findByType('h2');
    expect(sectionHeader.children[0]).toEqual(previewSectionTitleDefault);
  });

  it('renders an H2 element containing a default value when no title is supplied through props', () => {
    const titledInstance = renderer.create(
      <DatasetPreview sectionTitle={'Preview of Awesome Data'} requestUrl={'https://bla.bla.bla/hello/there?fields=blabla'} />
    ).root;
    const sectionHeader = titledInstance.findByType('h2');
    expect(sectionHeader.children[0]).toEqual('Preview of Awesome Data');
  });

  it('renders an the short description Content', () => {
    expect(section.children.some(child => child.props.children === 'Short description goes here')).toEqual(true);
  });

  it('includes a download button', () => {
    const link = section.findAllByProps({ className: 'downloadLink' });
    expect(link.length).toBeTruthy();
  });
});
