import React from 'react';
import renderer from 'react-test-renderer';
import DatasetDetailHeader from '../dataset-detail-header';

describe('DatasetDetailHeader', () => {
  const tree = renderer.create(
    <DatasetDetailHeader
      pageTitle={'My Page Title'}
      summaryText={'This is a sample descriptive summaryText blurb.'}
      techSpecs={{
        lastUpdated: '12/12/2019',
        fileFormat: 'JSON',
        unmapped: 0,
        valueForMeIsNull: null,
        valueForMeIsEmptyString: '',
      }}
    />
  );
  const instance = tree.root;
  let section;

  it('contains its content within a "header" element and applies a reusable sectionclass', () => {
    const header = instance.findByType('header');
    section = header.findByProps({ className: 'sectionContainer' });
    expect(section).toBeDefined();
  });

  it('renders an H1 element containing the title', () => {
    const pageHeader = section.findByType('h1');
    expect(pageHeader.children[0]).toEqual('My Page Title');
  });

  it('renders an the summaryText Content', () => {
    expect(section.children.some(child => child.props.children === 'This is a sample descriptive summaryText blurb.')).toEqual(true);
  });

  it('renders DT and DD elements reflecting valid techSpecs labels and values', () => {
    const labels = section.findAllByType('dt');
    expect(labels[0].children[0]).toEqual('Last updated');
    expect(labels[1].children[0]).toEqual('File format');
    expect(labels[2].children[0]).toEqual('unmapped');
    expect(labels.length).toEqual(3);

    const values = section.findAllByType('dd');
    expect(values[0].children[0]).toEqual('12/12/2019');
    expect(values[1].children[0]).toEqual('JSON');
    expect(values[2].children[0]).toEqual('0');
    expect(values.length).toEqual(3);
  });
});
